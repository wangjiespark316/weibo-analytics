#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""热点微博接口"""
from typing import Optional
from fastapi import APIRouter, Query, Depends
from .. import services
from ..auth import verify_api_key, resolve_dataset_type
from ..models import HotWeiboResponse

router = APIRouter(prefix="/api/hot-weibo", tags=["热点微博"])


@router.get("", response_model=HotWeiboResponse, summary="热点微博排行")
def hot_weibo(
    limit: int = Query(20, ge=1, le=100, description="返回条数"),
    keyword: Optional[str] = Query(None, description="关键词过滤，多个用逗号分隔，如 AI,大模型,飞书"),
    days: Optional[int] = Query(None, ge=1, le=30, description="只返回最近N天发布的数据"),
    fresh_hours: Optional[int] = Query(None, ge=1, le=72,
                                       description="只返回最近N小时新入库的数据（按首次入库时间，用于每日去重）"),
    dataset_type: Optional[str] = Query(None, pattern="^(ai_industry|brand_monitor|general_hotspot)$",
                                         description="数据集过滤（未鉴权时生效；鉴权后由租户强制指定）"),
    tenant: Optional[dict] = Depends(verify_api_key),
):
    effective_dataset = resolve_dataset_type(tenant, dataset_type)
    return services.get_hot_weibo(
        limit=limit,
        dataset_type=effective_dataset,
        keyword=keyword,
        days=days,
        fresh_hours=fresh_hours,
    )
