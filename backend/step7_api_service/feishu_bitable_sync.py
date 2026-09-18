#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
飞书多维表客户同步模块
"""
import os
import sys
import json
import logging
import requests
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv('/opt/Weibo-Analyst/.env')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FeishuBitableSync:
    def __init__(self):
        self.app_id = os.getenv('FEISHU_APP_ID', '')
        self.app_secret = os.getenv('FEISHU_APP_SECRET', '')
        self.app_token = os.getenv('FEISHU_BITABLE_APP_TOKEN', '')
        self.table_id = os.getenv('FEISHU_BITABLE_TABLE_ID', '')
        self.base_url = 'https://open.feishu.cn/open-apis'
        self._token = None
        self._token_expire = 0
        self.enabled = bool(self.app_id and self.app_secret and self.app_token and self.table_id)

    def _get_token(self):
        if self._token and datetime.now().timestamp() < self._token_expire:
            return self._token
        url = f'{self.base_url}/auth/v3/tenant_access_token/internal'
        data = {'app_id': self.app_id, 'app_secret': self.app_secret}
        try:
            resp = requests.post(url, json=data, timeout=10)
            result = resp.json()
            if result.get('code') == 0:
                self._token = result['tenant_access_token']
                self._token_expire = datetime.now().timestamp() + result.get('expire', 7200) - 300
                return self._token
        except Exception as e:
            logger.error(f'获取token失败: {e}')
        return None

    def _headers(self):
        return {'Authorization': f'Bearer {self._get_token()}', 'Content-Type': 'application/json'}

    def fetch_records(self, page_size=100):
        if not self.enabled:
            return []
        all_records = []
        page_token = None
        while True:
            url = f'{self.base_url}/bitable/v1/apps/{self.app_token}/tables/{self.table_id}/records'
            params = {'page_size': page_size}
            if page_token:
                params['page_token'] = page_token
            try:
                resp = requests.get(url, headers=self._headers(), params=params, timeout=15)
                result = resp.json()
                if result.get('code') != 0:
                    break
                data = result.get('data', {})
                all_records.extend(data.get('items', []))
                if not data.get('has_more'):
                    break
                page_token = data.get('page_token')
            except Exception as e:
                logger.error(f'拉取记录异常: {e}')
                break
        return all_records

    def _map_record(self, record):
        fields = record.get('fields', {})
        def gf(name, default=None):
            val = fields.get(name, default)
            if isinstance(val, list) and len(val) > 0:
                if isinstance(val[0], dict):
                    return val[0].get('text', val[0].get('name', str(val[0])))
                return str(val[0])
            return val if val is not None else default
        return {
            'feishu_record_id': record.get('record_id'),
            'company_name': gf('客户名称', ''),
            'industry': gf('行业', ''),
            'contact_name': gf('联系人', ''),
            'phone': gf('联系方式', ''),
            'customer_level': gf('客户等级', 'B'),
            'sales_stage': gf('销售阶段', 'new'),
            'amount': float(gf('预计金额', 0) or 0),
            'owner': gf('负责人', ''),
            'last_follow_time': gf('最后跟进时间', None),
        }

    def sync_to_local(self, records):
        import pymysql
        from urllib.parse import urlparse
        parsed = urlparse(os.getenv('DATABASE_URL'))
        conn = pymysql.connect(
            host=parsed.hostname, port=parsed.port or 4000,
            user=parsed.username, password=parsed.password,
            database=parsed.path.lstrip('/'), ssl={'ssl_disabled': False},
            cursorclass=pymysql.cursors.DictCursor
        )
        cursor = conn.cursor()
        inserted = updated = errors = 0
        for record in records:
            try:
                c = self._map_record(record)
                if not c['company_name']:
                    continue
                cursor.execute('SELECT id FROM customers WHERE feishu_record_id=%s OR company_name=%s',
                    (c['feishu_record_id'], c['company_name']))
                existing = cursor.fetchone()
                if existing:
                    cursor.execute('''UPDATE customers SET industry=%s, contact_name=%s, phone=%s,
                        customer_level=%s, sales_stage=%s, amount=%s, owner=%s,
                        last_follow_time=%s, updated_time=NOW() WHERE id=%s''',
                        (c['industry'], c['contact_name'], c['phone'], c['customer_level'],
                         c['sales_stage'], c['amount'], c['owner'], c['last_follow_time'], existing['id']))
                    updated += 1
                else:
                    cursor.execute('''INSERT INTO customers (feishu_record_id, company_name, industry,
                        contact_name, phone, customer_level, sales_stage, amount, owner,
                        last_follow_time, created_time, updated_time)
                        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW(),NOW())''',
                        (c['feishu_record_id'], c['company_name'], c['industry'], c['contact_name'],
                         c['phone'], c['customer_level'], c['sales_stage'], c['amount'], c['owner'], c['last_follow_time']))
                    inserted += 1
                conn.commit()
            except Exception as e:
                logger.error(f'同步失败: {e}')
                errors += 1
                conn.rollback()
        cursor.close()
        conn.close()
        return {'total': len(records), 'inserted': inserted, 'updated': updated, 'errors': errors}

    def _log(self, status, message):
        import pymysql
        from urllib.parse import urlparse
        parsed = urlparse(os.getenv('DATABASE_URL'))
        conn = pymysql.connect(host=parsed.hostname, port=parsed.port or 4000,
            user=parsed.username, password=parsed.password,
            database=parsed.path.lstrip('/'), ssl={'ssl_disabled': False})
        cursor = conn.cursor()
        cursor.execute('INSERT INTO feishu_sync_logs (type, object_id, status, error, created_time) VALUES (%s,%s,%s,%s,NOW())',
            ('bitable', 'customers', status, message))
        conn.commit()
        cursor.close()
        conn.close()

    def sync_all(self):
        if not self.enabled:
            msg = '飞书多维表未配置'
            self._log('skipped', msg)
            return {'status': 'skipped', 'message': msg}
        try:
            records = self.fetch_records()
            result = self.sync_to_local(records)
            msg = f'同步完成: 新增{result["inserted"]}条, 更新{result["updated"]}条, 失败{result["errors"]}条'
            self._log('success', msg)
            return {'status': 'success', 'message': msg, 'details': result}
        except Exception as e:
            msg = f'同步失败: {str(e)}'
            self._log('failed', msg)
            return {'status': 'failed', 'message': msg}

    def test_connection(self):
        if not self.enabled:
            return {'status': 'skipped', 'message': '飞书多维表未配置'}
        try:
            token = self._get_token()
            if not token:
                return {'status': 'failed', 'message': '获取token失败'}
            url = f'{self.base_url}/bitable/v1/apps/{self.app_token}/tables/{self.table_id}'
            resp = requests.get(url, headers=self._headers(), timeout=10)
            result = resp.json()
            if result.get('code') == 0:
                return {'status': 'success', 'message': '连接成功'}
            return {'status': 'failed', 'message': result.get('msg', '连接失败')}
        except Exception as e:
            return {'status': 'failed', 'message': str(e)}


_instance = None
def get_feishu_bitable_sync():
    global _instance
    if _instance is None:
        _instance = FeishuBitableSync()
    return _instance

if __name__ == '__main__':
    sync = get_feishu_bitable_sync()
    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        print(json.dumps(sync.test_connection(), ensure_ascii=False, indent=2))
    else:
        print(json.dumps(sync.sync_all(), ensure_ascii=False, indent=2))
