"""
行业标签库配置
包含各行业的关注技术、适合场景、推荐产品
"""

INDUSTRIES = [
    {
        "name": "制造业",
        "key_technologies": ["AI质检", "知识库", "流程自动化", "Agent", "预测性维护"],
        "scenarios": ["智能质检", "设备维护知识库", "生产流程优化", "供应链管理", "工人培训"],
        "recommended_products": ["飞书", "豆包", "Agent"],
        "customer_type": "100-5000人制造企业",
        "pain_points": ["质检效率低", "知识传承难", "流程不透明", "设备故障停机"]
    },
    {
        "name": "互联网",
        "key_technologies": ["AI编程", "大模型", "Agent", "多模态", "RAG"],
        "scenarios": ["代码辅助开发", "智能客服", "内容生成", "用户分析", "产品迭代"],
        "recommended_products": ["豆包", "飞书", "Copilot"],
        "customer_type": "互联网公司/创业团队",
        "pain_points": ["开发效率", "用户增长", "内容生产", "数据驱动决策"]
    },
    {
        "name": "教育",
        "key_technologies": ["AI教学", "知识库", "多模态", "个性化学习", "智能批改"],
        "scenarios": ["智能备课", "个性化辅导", "作业批改", "教学知识库", "学生评估"],
        "recommended_products": ["豆包", "飞书"],
        "customer_type": "学校/教育机构/培训机构",
        "pain_points": ["师资不足", "个性化难", "批改工作量大", "教学资源分散"]
    },
    {
        "name": "医疗",
        "key_technologies": ["医疗AI", "知识库", "RAG", "多模态", "智能问诊"],
        "scenarios": ["病历分析", "医学知识库", "智能辅助诊断", "患者随访", "医学研究"],
        "recommended_products": ["飞书", "豆包"],
        "customer_type": "医院/医疗机构/医疗科技公司",
        "pain_points": ["病历整理", "知识更新快", "医患沟通", "科研效率"]
    },
    {
        "name": "零售",
        "key_technologies": ["AI客服", "用户分析", "推荐系统", "Agent", "智能营销"],
        "scenarios": ["智能客服", "用户画像", "商品推荐", "营销内容生成", "门店管理"],
        "recommended_products": ["豆包", "飞书"],
        "customer_type": "零售企业/电商/品牌方",
        "pain_points": ["客服成本高", "用户体验", "库存管理", "营销效率"]
    },
    {
        "name": "贸易",
        "key_technologies": ["AI翻译", "知识库", "Agent", "市场分析", "智能文档"],
        "scenarios": ["多语言沟通", "客户管理", "市场调研", "合同文档处理", "供应链协调"],
        "recommended_products": ["飞书", "豆包", "翻译工具"],
        "customer_type": "外贸企业/进出口公司",
        "pain_points": ["语言障碍", "客户分散", "信息不对称", "文档繁琐"]
    },
    {
        "name": "物流",
        "key_technologies": ["路径优化", "预测分析", "Agent", "知识库", "智能调度"],
        "scenarios": ["智能调度", "路径规划", "仓储管理", "客户服务", "异常处理"],
        "recommended_products": ["飞书", "豆包"],
        "customer_type": "物流企业/快递公司/仓储企业",
        "pain_points": ["调度复杂", "成本高", "异常处理慢", "信息不透明"]
    },
    {
        "name": "金融",
        "key_technologies": ["风控AI", "知识库", "RAG", "智能投顾", "合规分析"],
        "scenarios": ["风险控制", "智能客服", "投研分析", "合规审查", "客户管理"],
        "recommended_products": ["飞书", "豆包"],
        "customer_type": "银行/证券/保险/金融科技公司",
        "pain_points": ["风控难度大", "合规要求高", "客户服务", "投研效率"]
    },
    {
        "name": "软件开发",
        "key_technologies": ["AI编程", "Agent", "代码审查", "知识库", "自动化测试"],
        "scenarios": ["代码辅助", "需求分析", "测试自动化", "技术文档", "团队协作"],
        "recommended_products": ["豆包", "飞书", "Copilot"],
        "customer_type": "软件公司/IT部门/开发团队",
        "pain_points": ["开发效率", "代码质量", "文档维护", "知识传承"]
    },
    {
        "name": "建筑",
        "key_technologies": ["AI识图", "知识库", "流程自动化", "安全监控", "项目管理"],
        "scenarios": ["安全检查", "图纸识别", "项目管理", "施工知识库", "材料管理"],
        "recommended_products": ["飞书", "豆包"],
        "customer_type": "建筑公司/工程企业/房地产企业",
        "pain_points": ["安全管理", "项目复杂", "信息分散", "知识传承"]
    }
]


def get_all_industries():
    """获取所有行业列表"""
    return INDUSTRIES


def get_industry_by_name(name):
    """根据名称获取行业信息"""
    for industry in INDUSTRIES:
        if industry["name"] == name:
            return industry
    return None


def get_industry_names():
    """获取所有行业名称"""
    return [industry["name"] for industry in INDUSTRIES]


def match_industry_by_technology(technology):
    """根据技术匹配相关行业"""
    matched = []
    for industry in INDUSTRIES:
        if any(tech in technology or technology in tech for tech in industry["key_technologies"]):
            matched.append(industry["name"])
    return matched


def match_industry_by_scenario(scenario):
    """根据场景匹配相关行业"""
    matched = []
    for industry in INDUSTRIES:
        if any(sc in scenario or scenario in sc for sc in industry["scenarios"]):
            matched.append(industry["name"])
    return matched
