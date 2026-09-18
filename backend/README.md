# 后端：AI 行业情报与销售智能服务

FastAPI + TiDB/MySQL + DeepSeek（OpenAI 兼容接口）。在「微博数据采集」之上，构建三层 AI 行业情报（事件 / 产品 / 技术趋势）、AI 行业日报、自动化流水线，以及 AI 销售情报助手（客户画像、成交预测、销售漏斗、飞书推送）。

## 目录结构

```
backend/
├── step7_api_service/          # FastAPI 主服务
│   ├── main.py                 # 应用入口（uvicorn step7_api_service.main:app）
│   ├── config.py / database.py # 配置与数据库连接（连接串走 DATABASE_URL）
│   ├── auth.py                 # 多租户 API Key 鉴权（Authorization: Bearer）
│   ├── services.py             # 聚合查询（线程池并行，首页/日报接口）
│   │── 行业情报三层模型
│   ├── event_analyzer.py       # AI 热点事件聚类/抽取（热度+可信度+企业机会）
│   ├── product_analyzer.py     # AI 产品声量（提及量/增长率/关联事件）
│   ├── trend_analyzer.py       # 技术趋势雷达（7 天 vs 30 天）
│   ├── ai_products.py          # AI 产品库（国内/国外、别名）
│   ├── ai_technologies.py      # 技术标签库
│   ├── daily_report_generator.py   # AI 行业日报生成（LLM 汇总，不重算微博）
│   ├── daily_ai_pipeline.py    # 每日流水线编排（锁/重试/日志，默认分析“前一天全天”）
│   ├── pipeline_monitor.py     # 流水线健康检查
│   ├── report_quality_checker.py   # 日报质量评分
│   ├── notification_service.py # 通知抽象（未配置 Webhook 时自动跳过）
│   │── 销售智能
│   ├── sales_opportunity_analyzer.py / industries.py / customer_matcher.py
│   ├── sales_script_generator.py / customer_profile_agent.py / follow_analyzer.py
│   ├── customer_scoring.py / daily_sales_agent.py
│   ├── sales_analysis_agent.py / deal_prediction_agent.py / sales_strategy_agent.py
│   ├── sales_funnel_analyzer.py / sales_review_agent.py
│   ├── feishu_notification.py / daily_sales_push.py / follow_reminder_agent.py
│   ├── daily_sales_review.py / feishu_bitable_sync.py
│   └── routers/                # API 路由（events/products/trends/reports/sales/...）
└── step9_scheduler/            # 每日定时调度（systemd 长驻，北京 08:00）
    ├── scheduler.py            # 采集 + 旧版日报 + AI 情报流水线（分析前一天全天）
    ├── tenant_runner.py        # 多租户采集/日报执行
    ├── report_sender.py        # 报告落盘与飞书发送
    └── config.py               # 调度/飞书开关（环境变量）
```

> 数据采集器（step1 微博爬虫）与 `agent_client`（step8/step10）属于独立的数据采集链路，未包含在本开源精简版中。`step9_scheduler` 在 `ENABLE_CRAWL=false` 时只运行 AI 分析流水线，可对库中已有数据独立工作。

## 快速开始

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env             # 填入 DATABASE_URL 与 LLM_API_KEY
# 在 backend 目录下启动（保证 import 路径 step7_api_service.* 生效）
uvicorn step7_api_service.main:app --host 127.0.0.1 --port 8000
```

## 每日流水线

```bash
# 默认分析“北京时间前一天全天”的完整数据（推荐，由定时任务调用）
python step7_api_service/daily_ai_pipeline.py

# 补跑/重跑指定日期（幂等：先删当日 AI 结果再重算；已结束的锁允许复用）
python step7_api_service/daily_ai_pipeline.py --date 2026-09-18 --skip collect

# 查看状态
python step7_api_service/daily_ai_pipeline.py --status
```

步骤：`collect → events → products → trends → report`，每步独立异常捕获与重试，运行锁防并发，全过程写入 `pipeline_logs` / `pipeline_lock`。

## 核心数据表

`weibo_posts`、`ai_events`、`ai_product_metrics`、`ai_trends`、`ai_daily_reports`、`pipeline_logs`、`pipeline_lock`、`ai_sales_opportunities`、`customers`、`follow_records`、`customer_ai_scores`、`customer_deal_predictions`、`sales_funnel_snapshots`、`sales_reviews` 等。

## 主要 API

| 模块 | 接口 |
| --- | --- |
| 基础数据 | `/api/hot-weibo` `/api/sentiment` `/api/influencers` `/api/keyword-trend` `/api/daily-report` |
| 行业情报 | `/api/events` `/api/products` `/api/trends` `/api/reports` |
| 流水线 | `/api/pipeline/run` `/api/pipeline/status` `/api/pipeline/logs` `/api/pipeline/health` |
| 销售智能 | `/api/sales/opportunities` `/api/sales-dashboard/*` `/api/sales-prediction/*` `/api/workspace/*` |
| 飞书 | `/api/feishu/*` |

## 安全说明

- 所有密钥（数据库、LLM、飞书）只从环境变量读取，代码中无任何硬编码凭证；`.env` 已被 `.gitignore` 排除。
- 生产环境建议由 Nginx 反向代理注入鉴权头、限制 `/docs`、`/openapi.json`，并启用 HTTPS。
