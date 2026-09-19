#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CRM 商机管理 API
数据来源：飞书多维表「商机管理」同步表 customer_opportunities（feishu_crm_detail_sync 同步）
"""
import os
import logging
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

import pymysql
from urllib.parse import urlparse
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query

load_dotenv('/opt/Weibo-Analyst/.env')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix='/api/crm', tags=['CRM商机'])


def get_db():
    db_url = os.getenv('DATABASE_URL')
    parsed = urlparse(db_url)
    return pymysql.connect(
        host=parsed.hostname, port=parsed.port or 4000,
        user=parsed.username, password=parsed.password,
        database=parsed.path.lstrip('/'), ssl={'ssl_disabled': False},
        cursorclass=pymysql.cursors.DictCursor
    )


def _v(value):
    """JSON 安全转换：Decimal -> float，date/datetime -> ISO 字符串"""
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    return value


def _row(row):
    return {k: _v(v) for k, v in row.items()}


@router.get('/opportunities')
async def list_opportunities(
    stage: Optional[str] = None,
    product_line: Optional[str] = None,
    owner: Optional[str] = None,
    keyword: Optional[str] = None,
    customer_id: Optional[int] = None,
    limit: int = Query(200, ge=1, le=500)
):
    """获取商机列表（含分阶段汇总）。stage 取值：进行中 / 已成交 / 已丢单。"""
    try:
        conn = get_db()
        cursor = conn.cursor()

        where = 'WHERE 1=1'
        params = []
        if stage:
            where += ' AND o.stage = %s'
            params.append(stage)
        if product_line:
            where += ' AND o.product_line = %s'
            params.append(product_line)
        if owner:
            where += ' AND o.owner = %s'
            params.append(owner)
        if customer_id:
            where += ' AND o.customer_id = %s'
            params.append(customer_id)
        if keyword:
            where += ' AND (o.opp_name LIKE %s OR cu.company_name LIKE %s)'
            kw = f'%{keyword}%'
            params.extend([kw, kw])

        # 分阶段汇总（不受筛选影响，始终返回全量口径）
        cursor.execute('''
            SELECT stage, COUNT(*) AS cnt, COALESCE(SUM(amount), 0) AS amount
            FROM customer_opportunities GROUP BY stage
        ''')
        stage_rows = cursor.fetchall()
        summary_map = {}
        total_count = 0
        total_amount = 0.0
        for r in stage_rows:
            key = r['stage'] or '未知'
            cnt = int(r['cnt'])
            amt = float(r['amount'] or 0)
            summary_map[key] = {'count': cnt, 'amount': amt}
            total_count += cnt
            total_amount += amt

        # 商机列表（进行中优先，再按金额降序）
        sql = f'''
            SELECT o.id, o.feishu_record_id, o.customer_id, cu.company_name,
                   o.opp_name, o.product_line, o.stage, o.amount, o.win_rate,
                   o.expected_close_date, o.won_date, o.is_won, o.is_lost, o.owner
            FROM customer_opportunities o
            LEFT JOIN customers cu ON cu.id = o.customer_id
            {where}
            ORDER BY FIELD(o.stage, '进行中', '已成交', '已丢单'), o.amount DESC
            LIMIT %s
        '''
        params.append(limit)
        cursor.execute(sql, params)
        opportunities = [_row(r) for r in cursor.fetchall()]

        # 可选筛选项
        cursor.execute('SELECT DISTINCT product_line FROM customer_opportunities WHERE product_line IS NOT NULL')
        product_lines = [r['product_line'] for r in cursor.fetchall()]
        cursor.execute('SELECT DISTINCT owner FROM customer_opportunities WHERE owner IS NOT NULL ORDER BY owner')
        owners = [r['owner'] for r in cursor.fetchall()]

        cursor.close()
        conn.close()

        def _sm(name):
            return summary_map.get(name, {'count': 0, 'amount': 0.0})

        return {
            'status': 'success',
            'count': len(opportunities),
            'summary': {
                'total_count': total_count,
                'total_amount': total_amount,
                'open': _sm('进行中'),
                'won': _sm('已成交'),
                'lost': _sm('已丢单'),
            },
            'filters': {
                'product_lines': product_lines,
                'owners': owners,
            },
            'opportunities': opportunities
        }
    except Exception as e:
        logger.error(f'获取商机列表失败: {e}')
        raise HTTPException(status_code=500, detail=str(e))
