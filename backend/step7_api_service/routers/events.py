#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI热点事件API路由（增强版）
- 支持事件可信度评分
- 支持企业应用机会分析
- 支持分类筛选和可信度筛选
- 支持综合排名排序
"""
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import sys
import os
import json
import re

sys.path.insert(0, "/opt/Weibo-Analyst")
from step7_api_service.event_analyzer import get_events, analyze_and_save, get_latest_event_date

router = APIRouter(prefix="/api/events", tags=["AI热点事件"])


_LIST_FIELDS = ("companies", "technologies", "related_posts", "related_keywords")


def _as_list(value):
    """将逗号分隔字符串 / JSON 数组字符串 / 空值统一归一化为 list，避免响应模型校验返回 500。"""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return []
        try:
            parsed = json.loads(text)
            if isinstance(parsed, list):
                return [str(item).strip() for item in parsed if str(item).strip()]
        except (ValueError, TypeError):
            pass
        # 兼容库中历史数据的中英文逗号/顿号/分号分隔
        return [item.strip() for item in re.split(r'[,，、;；\n]+', text) if item.strip()]
    return []


class EventItem(BaseModel):
    id: Optional[int] = None
    event_date: Optional[str] = None
    title: str
    summary: Optional[str] = None
    category: Optional[str] = None
    companies: Optional[list] = None
    technologies: Optional[list] = None
    heat_score: Optional[int] = None
    event_confidence: Optional[int] = None
    event_rank_score: Optional[float] = None
    sentiment: Optional[str] = None
    related_posts: Optional[list] = None
    related_keywords: Optional[list] = None
    impact_analysis: Optional[str] = None
    business_opportunity: Optional[str] = None
    source: Optional[str] = None
    created_time: Optional[str] = None


class EventsResponse(BaseModel):
    date: str
    count: int
    events: List[EventItem]


@router.get("", response_model=EventsResponse, summary="获取AI热点事件列表")
async def get_events_list(
    date: Optional[str] = Query(None, description="日期，格式YYYY-MM-DD，默认今天"),
    limit: int = Query(10, ge=1, le=50, description="返回数量"),
    refresh: bool = Query(False, description="是否强制刷新（重新调用LLM分析）"),
    category: Optional[str] = Query(None, description="按分类筛选：model_release/product_launch/company_news/financing/policy/technology_breakthrough/application_case/industry_trend"),
    min_confidence: int = Query(0, ge=0, le=100, description="最低可信度筛选（0-100）")
):
    """获取指定日期的AI热点事件，支持分类和可信度筛选"""
    explicit_date = date
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")

    # 如果要求刷新，重新分析
    if refresh:
        events = analyze_and_save(date, force=True)
    else:
        events = get_events(date, limit=50)  # 获取更多以便筛选
        # 默认未指定日期且当天无事件：回退到最近有数据的日期，保证打开即可见最新真实情报
        if not events and not explicit_date:
            latest = get_latest_event_date()
            if latest and latest != date:
                date = latest
                events = get_events(date, limit=50)
    
    # 按分类筛选
    if category:
        events = [e for e in events if e.get("category") == category]
    
    # 按最低可信度筛选
    if min_confidence > 0:
        events = [e for e in events if (e.get("event_confidence") or 0) >= min_confidence]
    
    # 限制返回数量
    events = events[:limit]

    # 列表字段归一化（库中 companies/technologies/related_keywords 可能为逗号分隔字符串或空串）
    for e in events:
        for field in _LIST_FIELDS:
            e[field] = _as_list(e.get(field))

    return {
        "date": date,
        "count": len(events),
        "events": events
    }


@router.post("/analyze", summary="触发事件分析")
async def trigger_analysis(
    date: Optional[str] = Query(None, description="日期，格式YYYY-MM-DD")
):
    """手动触发指定日期的事件分析"""
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    
    events = analyze_and_save(date, force=True)
    
    return {
        "status": "success",
        "date": date,
        "events_count": len(events),
        "message": f"成功分析{len(events)}个热点事件"
    }


@router.get("/categories", summary="获取事件分类列表")
async def get_categories():
    """获取支持的事件分类枚举"""
    return {
        "categories": [
            {"key": "model_release", "name": "模型发布"},
            {"key": "product_launch", "name": "产品发布"},
            {"key": "company_news", "name": "公司动态"},
            {"key": "financing", "name": "融资投资"},
            {"key": "policy", "name": "政策监管"},
            {"key": "technology_breakthrough", "name": "技术突破"},
            {"key": "application_case", "name": "企业应用案例"},
            {"key": "industry_trend", "name": "行业趋势"}
        ]
    }
