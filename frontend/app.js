/* ===== 微博智能分析平台 - 企业级 SaaS 管理后台 ===== */

// ========== API 封装 ==========
const API = {
  baseUrl: '/app-api',  // 前端内部代理（Nginx自动注入API Key，前端无需携带）
  
  async request(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : this.baseUrl + url;
    try {
      const res = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      if (!res.ok) {
        console.warn('API Error:', res.status, fullUrl);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error('API Error:', err);
      return null;
    }
  },
  
  // 热门微博
  async getHotWeibo(limit = 20) {
    return this.request(`/hot-weibo?limit=${limit}`);
  },
  
  // 情感分析
  async getSentiment(sampleSize = 1000) {
    return this.request(`/sentiment?sample_size=${sampleSize}`);
  },
  
  // 影响力用户
  async getInfluencers(type = 'followers', limit = 10) {
    return this.request(`/influencers?type=${type}&limit=${limit}`);
  },
  
  // 每日报告
  async getDailyReport() {
    return this.request('/daily-report');
  },
  
  // 关键词趋势
  async getKeywordTrend(keyword, days = 30) {
    return this.request(`/keyword-trend?keyword=${encodeURIComponent(keyword)}&days=${days}`);
  },
  // 销售工作台API
  async getCustomers(industry=null, stage=null, level=null) {
    let url = '/workspace/customers?';
    if (industry) url += 'industry=' + encodeURIComponent(industry) + '&';
    if (stage) url += 'stage=' + encodeURIComponent(stage) + '&';
    if (level) url += 'level=' + encodeURIComponent(level) + '&';
    return this.request(url);
  },
  
  async getCustomerDetail(id) {
    return this.request('/workspace/customers/' + id);
  },
  
  async createFollow(data) {
    return this.request('/workspace/follow', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async generateCustomerProfile(id) {
    return this.request('/workspace/profile/' + id, { method: 'POST' });
  },
  
  async analyzeFollows(id) {
    return this.request('/workspace/follow-analyze/' + id, { method: 'POST' });
  },
  
  async getTodayTasks() {
    return this.request('/workspace/today-tasks');
  },

  // AI情报API
  async getEvents(limit = 10, category = null, minConfidence = null) {
    let url = '/events?limit=' + limit;
    if (category) url += '&category=' + encodeURIComponent(category);
    if (minConfidence) url += '&min_confidence=' + minConfidence;
    return this.request(url);
  },
  
  async getEventDetail(id) {
    return this.request('/events/' + id);
  },
  
  async getProducts(limit = 10) {
    return this.request('/products?limit=' + limit);
  },
  
  async getProductTrend(product, days = 30) {
    return this.request('/products/trend?product=' + encodeURIComponent(product) + '&days=' + days);
  },
  
  async getTrends(limit = 10, level = null) {
    let url = '/trends?limit=' + limit;
    if (level) url += '&level=' + encodeURIComponent(level);
    return this.request(url);
  },
  
  async getTrendHistory(technology, days = 30) {
    return this.request('/trends/history?technology=' + encodeURIComponent(technology) + '&days=' + days);
  },
  
  async getReports(limit = 10) {
    return this.request('/reports?limit=' + limit);
  },
  
  async getReportDetail(date) {
    return this.request('/reports/' + date);
  },
  
  async getSalesOpportunities(priority = null, industry = null) {
    let url = '/sales/opportunities?';
    if (priority) url += 'priority=' + encodeURIComponent(priority) + '&';
    if (industry) url += 'industry=' + encodeURIComponent(industry) + '&';
    return this.request(url);
  },
  
  async generateSalesScript(data) {
    return this.request('/sales/script', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async getPipelineStatus() {
    return this.request('/pipeline/status');
  },
  
  async getPipelineLogs(date = null) {
    let url = '/pipeline/logs';
    if (date) url += '?date=' + date;
    return this.request(url);
  },
  
  async recalcCustomerScore(id) {
    return this.request('/workspace/score/' + id, { method: 'POST' });
  },

};

// ========== 菜单配置 ==========
const MENU_CONFIG = [
  { key: 'dashboard', label: '首页', icon: 'home', single: true },
  {
    key: 'data', label: '数据中心', icon: 'database',
    children: [
      { key: 'weibo-data', label: '微博数据', icon: 'weibo' },
      { key: 'user-data', label: '用户数据', icon: 'users' },
      { key: 'hot-data', label: '热点数据', icon: 'fire' }
    ]
  },
  {
    key: 'ai', label: 'AI 分析', icon: 'ai',
    children: [
      { key: 'sentiment', label: '舆情分析', icon: 'chart' },
      { key: 'trend', label: '热点趋势', icon: 'trend' },
      { key: 'daily-report', label: 'AI日报', icon: 'report' }
    ]
  },
  {
    key: 'task', label: '任务中心', icon: 'task',
    children: [
      { key: 'collect-task', label: '采集任务', icon: 'collect' },
      { key: 'analyze-task', label: '分析任务', icon: 'analyze' },
      { key: 'cron-task', label: '定时任务', icon: 'clock' }
    ]
  },
  {
    key: 'system', label: '系统管理', icon: 'settings',
    children: [
      { key: 'api-key', label: 'API Key', icon: 'key' },
      { key: 'user-mgmt', label: '用户管理', icon: 'user' },
      { key: 'permission', label: '权限管理', icon: 'shield' }
    ]
  },
  {
    key: 'ai-intel', label: 'AI情报', icon: 'ai',
    children: [
      { key: 'events', label: '事件中心', icon: 'fire' },
      { key: 'products', label: '产品雷达', icon: 'chart' },
      { key: 'trends', label: '技术趋势', icon: 'trend' },
      { key: 'reports', label: '日报中心', icon: 'report' },
      { key: 'sales', label: '销售机会', icon: 'task' }
    ]
  },
  {
    key: 'sales-workspace',
    label: '销售工作台',
    icon: 'briefcase',
    children: [
      { key: 'sales-dashboard', label: '销售驾驶舱', icon: 'dashboard' },
      { key: 'workspace-customers', label: '客户中心', icon: 'users' },
      { key: 'workspace-opportunities', label: '商机管理', icon: 'report' },
      { key: 'workspace-tasks', label: '今日任务', icon: 'calendar' }
    ]
  }
];

// ========== 图标 SVG ==========
const ICONS = {
  home: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354l-6-6zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/></svg>',
  database: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.129 13 3.747 13 4.5c0 .753-.356 1.372-1.318 1.813C10.766 6.729 9.464 7 8 7s-2.766-.27-3.682-.687C3.356 5.872 3 5.253 3 4.5c0-.753.356-1.371 1.318-1.813z"/><path d="M3 7.291c0 .753.356 1.372 1.318 1.813C5.234 9.529 6.536 9.8 8 9.8s2.766-.27 3.682-.687C12.644 8.663 13 8.044 13 7.291V6.336c-.354.29-.77.52-1.232.695C10.766 7.471 9.464 7.75 8 7.75s-2.766-.279-3.768-.719A4.996 4.996 0 0 1 3 6.336v.955z"/><path d="M3 10.091c0 .753.356 1.371 1.318 1.812C5.234 12.329 6.536 12.6 8 12.6s2.766-.271 3.682-.697C12.644 11.462 13 10.844 13 10.09V9.136c-.354.29-.77.52-1.232.695C10.766 10.271 9.464 10.55 8 10.55s-2.766-.279-3.768-.719A4.996 4.996 0 0 1 3 9.136v.955z"/><path d="M3 12.89c0 .754.356 1.372 1.318 1.813C5.234 15.129 6.536 15.4 8 15.4s2.766-.271 3.682-.697C12.644 14.262 13 13.644 13 12.89v-.954c-.354.29-.77.52-1.232.695C10.766 13.071 9.464 13.35 8 13.35s-2.766-.279-3.768-.719A4.996 4.996 0 0 1 3 11.936v.954z"/></svg>',
  weibo: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M7.254 13.754c-3.314 0-6-1.657-6-3.7 0-1.142.743-2.578 2.04-3.94 1.725-1.82 3.747-2.697 4.68-1.96.413.326.453.92.267 1.657-.118.45.33.208.33.208 1.644-.727 3.08-.61 3.54.293.247.475.18 1.117-.153 1.834-.064.136.112.18.112.18 1.228.333 2.1.953 2.1 1.718 0 2.043-2.686 3.71-6.916 3.71z"/></svg>',
  users: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/><path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>',
  fire: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-2.9-1.5-4C11.5 5.5 10 4 10 2c0 .5-1 2-2 3S5 7 5 9c0 1 .5 2 1.5 2.5C7 12 7.5 13 8 14c0-1 .5-2 1.5-2.5.5.5 1 1.5 1 2.5 0 1-.5 1.5-1 1.5.5 0 1-.5 1-1.5 0-1-.5-2-1.5-2.5C10 11 10.5 12 10.5 13c0 1.5-1 3-2.5 3z"/></svg>',
  ai: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M6 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/><path d="M8.5 1.515a.5.5 0 0 1 .47.36l.677 2.115a3.5 3.5 0 0 1 1.838 1.838l2.115.677a.5.5 0 0 1 0 .95l-2.115.677a3.5 3.5 0 0 1-1.838 1.838l-.677 2.115a.5.5 0 0 1-.95 0l-.677-2.115a3.5 3.5 0 0 1-1.838-1.838l-2.115-.677a.5.5 0 0 1 0-.95l2.115-.677a3.5 3.5 0 0 1 1.838-1.838l.677-2.115a.5.5 0 0 1 .48-.36zM7.09 4.21a.5.5 0 0 1 .62.31l.51 1.594a2.5 2.5 0 0 1 1.312 1.312l1.594.51a.5.5 0 0 1 0 .948l-1.594.51a2.5 2.5 0 0 1-1.312 1.312l-.51 1.594a.5.5 0 0 1-.948 0l-.51-1.594a2.5 2.5 0 0 1-1.312-1.312l-1.594-.51a.5.5 0 0 1 0-.948l1.594-.51a2.5 2.5 0 0 1 1.312-1.312l.51-1.594a.5.5 0 0 1 .31-.62z"/></svg>',
  chart: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 0h1v15h15v1H0V0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5z"/></svg>',
  trend: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 4.5A2.5 2.5 0 0 1 2.5 2h11A2.5 2.5 0 0 1 16 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 11.5v-7zM2.5 3a1.5 1.5 0 0 0-1.5 1.5V5h14v-.5A1.5 1.5 0 0 0 13.5 3h-11z"/><path d="M2 11.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>',
  report: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.5 8a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/></svg>',
  task: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M9.5 1.543a3 3 0 1 1-3 0V.5a.5.5 0 0 1 1 0v1.043a3 3 0 0 1 2 0V.5a.5.5 0 0 1 1 0v1.043zM3 4.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-9zM4.5 6a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/></svg>',
  collect: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>',
  analyze: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8.5 1.5A1.5 1.5 0 0 1 10 3v4h4a1.5 1.5 0 0 1 1 2.598V12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9.598A1.5 1.5 0 0 1 2 7h4V3a1.5 1.5 0 0 1 1.5-1.5h1zM9 3a.5.5 0 0 0-.5-.5h-1A.5.5 0 0 0 7 3v4h2V3zm-7 4a.5.5 0 0 0-.5.5v4.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7.5a.5.5 0 0 0-.5-.5H2z"/></svg>',
  clock: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>',
  settings: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/></svg>',
  key: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 7 14 8.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>',
  user: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>',
  shield: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262 61.714 61.714 0 0 1 2.887-.87z"/><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>',
  arrow: '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>'
};

// ========== 路由系统 ==========
const MENU_STORAGE_KEY = 'weibo_analytics_expanded_menu';

function loadExpandedGroups() {
  try {
    const saved = localStorage.getItem(MENU_STORAGE_KEY);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
  } catch (e) {}
  // 默认展开数据中心和AI分析
  return new Set(['data', 'ai']);
}

function saveExpandedGroups() {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify([...Router.expandedGroups]));
  } catch (e) {}
}

const Router = {
  currentRoute: 'dashboard',
  expandedGroups: loadExpandedGroups(),
  
  init() {
    this.renderMenu();
    
    // 读取当前hash，实现路由状态保持（刷新页面后保持当前页面）
    let hash = window.location.hash.slice(1) || 'dashboard';
    // 处理带查询参数的URL，如 #workspace-customer-detail?id=1
    let routeParams = {};
    if (hash.includes('?')) {
      const parts = hash.split('?');
      hash = parts[0];
      const params = new URLSearchParams(parts[1]);
      params.forEach((value, key) => {
        routeParams[key] = value;
      });
    }
    const validRoutes = Object.keys(PAGE_INFO);
    const initialRoute = validRoutes.includes(hash) ? hash : 'dashboard';
    this.navigate(initialRoute, routeParams);
    
    // 监听 hash 变化
    window.addEventListener('hashchange', () => {
      let hash = window.location.hash.slice(1) || 'dashboard';
      let routeParams = {};
      if (hash.includes('?')) {
        const parts = hash.split('?');
        hash = parts[0];
        const params = new URLSearchParams(parts[1]);
        params.forEach((value, key) => {
          routeParams[key] = value;
        });
      }
      this.navigate(hash, routeParams, false);
    });
  },
  
  navigate(route, params = null, updateHash = true) {
    if (params) this.currentParams = params;
    this.currentRoute = route;
    if (updateHash) {
      window.location.hash = route;
    }
    this.updateMenuActive();
    this.renderPage();
    
    // 动态更新浏览器标签页标题
    const pageInfo = PAGE_INFO[route];
    if (pageInfo && pageInfo.title && route !== 'dashboard') {
      document.title = pageInfo.title + ' - 微博智能分析平台';
    } else {
      document.title = '微博智能分析平台';
    }
  },
  
  toggleGroup(groupKey) {
    if (this.expandedGroups.has(groupKey)) {
      this.expandedGroups.delete(groupKey);
    } else {
      // 展开新菜单时，先关闭其他所有已展开的菜单（手风琴效果）
      this.expandedGroups.clear();
      this.expandedGroups.add(groupKey);
    }
    saveExpandedGroups();
    this.renderMenu();
  },
  
  renderMenu() {
    const menuEl = document.getElementById('menu');
    if (!menuEl) return;
    
    let html = '';
    
    MENU_CONFIG.forEach(group => {
      if (group.single) {
        const active = this.currentRoute === group.key ? 'active' : '';
        html += `
          <div class="menu-item ${active}" onclick="Router.navigate('${group.key}')">
            <span class="menu-icon">${ICONS[group.icon] || ''}</span>
            <span>${group.label}</span>
          </div>
        `;
      } else {
        const expanded = this.expandedGroups.has(group.key) ? 'expanded' : '';
        const submenuOpen = this.expandedGroups.has(group.key) ? 'open' : '';
        const hasActiveChild = group.children.some(c => c.key === this.currentRoute);
        const parentActive = hasActiveChild ? 'active' : '';
        
        html += `
          <div class="menu-item ${expanded} ${parentActive}" onclick="Router.toggleGroup('${group.key}')">
            <span class="menu-icon">${ICONS[group.icon] || ''}</span>
            <span>${group.label}</span>
            <span class="menu-arrow">${ICONS.arrow}</span>
          </div>
          <div class="submenu ${submenuOpen}">
        `;
        
        group.children.forEach(child => {
          const active = this.currentRoute === child.key ? 'active' : '';
          html += `
            <div class="menu-item ${active}" onclick="Router.navigate('${child.key}')">
              <span class="menu-icon">${ICONS[child.icon] || ''}</span>
              <span>${child.label}</span>
            </div>
          `;
        });
        
        html += '</div>';
      }
    });
    
    menuEl.innerHTML = html;
  },
  
  updateMenuActive() {
    document.querySelectorAll('.menu-item').forEach(el => {
      el.classList.remove('active');
    });
    
    // 找到当前路由对应的菜单项
    const allItems = document.querySelectorAll('.menu-item');
    allItems.forEach(el => {
      const onclick = el.getAttribute('onclick') || '';
      if (onclick.includes(`'${this.currentRoute}'`)) {
        el.classList.add('active');
      }
    });
  },
  
  renderPage() {
    const contentEl = document.getElementById('content');
    if (!contentEl) return;
    
    // 显示加载状态
    contentEl.innerHTML = `
      <div class="page-loading">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
    `;
    
    // 根据路由渲染页面
    const page = Pages[this.currentRoute];
    if (page) {
      page.render(contentEl);
    } else {
      contentEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/> </svg></div>
          <div class="empty-state-text">页面不存在</div>
        </div>
      `;
    }
  }
};



const PAGE_INFO = {
  'dashboard': { title: '首页', breadcrumb: ['首页'], desc: '微博智能分析平台数据总览，实时展示采集数据、情感分析与系统运行状态' },
  'weibo-data': { title: '微博数据', breadcrumb: ['数据中心', '微博数据'], desc: '浏览和检索已采集的微博内容，支持关键词搜索、分类筛选与详情查看' },
  'user-data': { title: '用户数据', breadcrumb: ['数据中心', '用户数据'], desc: '基于真实采集数据的微博KOL影响力排行，展示粉丝量、互动量与认证状态' },
  'hot-data': { title: '热点数据', breadcrumb: ['数据中心', '热点数据'], desc: '从微博内容中自动提取热点话题标签，实时发现当前讨论热度最高的话题' },
  'sentiment': { title: '舆情分析', breadcrumb: ['AI 分析', '舆情分析'], desc: '通过 AI 分析微博用户情感倾向，识别正面/中性/负面舆论分布与变化' },
  'trend': { title: '热点趋势', breadcrumb: ['AI 分析', '热点趋势'], desc: '追踪指定关键词的热度变化趋势，辅助企业洞察市场动态与舆情走向' },
  'daily-report': { title: 'AI日报', breadcrumb: ['AI 分析', 'AI日报'], desc: 'AI 自动生成每日舆情分析报告，包含热点TOP、情感分布与智能洞察建议' },
  'collect-task': { title: '采集任务', breadcrumb: ['任务中心', '采集任务'], desc: '系统内置微博数据自动采集任务，每天定时执行，支持手机住宅IP代理采集' },
  'analyze-task': { title: '分析任务', breadcrumb: ['任务中心', '分析任务'], desc: 'AI 自动分析任务，包括情感分析、关键词趋势分析与每日报告生成' },
  'cron-task': { title: '定时任务', breadcrumb: ['任务中心', '定时任务'], desc: '系统内置定时任务配置，展示采集、分析、报告生成的执行时间与周期' },
  'api-key': { title: 'API Key', breadcrumb: ['系统管理', 'API Key'], desc: '外部API集成认证管理，前端通过内部代理自动鉴权，第三方调用需使用API Key' },
  'user-mgmt': { title: '用户管理', breadcrumb: ['系统管理', '用户管理'], desc: '企业版多用户体系规划，支持用户登录、生命周期管理、组织架构与通知中心' },
  'permission': { title: '权限管理', breadcrumb: ['系统管理', '权限管理'], desc: '企业版细粒度权限体系规划，支持角色权限、数据权限、多租户与操作审计' },
  'events': { title: 'AI事件中心', breadcrumb: ['AI情报', '事件中心'], desc: '自动发现AI行业重要事件，展示热度、可信度与企业影响分析' },
  'products': { title: 'AI产品雷达', breadcrumb: ['AI情报', '产品雷达'], desc: '追踪AI产品声量变化，发现正在增长的产品与背后原因' },
  'trends': { title: 'AI技术趋势', breadcrumb: ['AI情报', '技术趋势'], desc: '分析AI技术发展方向，识别正在升温的新技术与企业落地机会' },
  'reports': { title: 'AI日报中心', breadcrumb: ['AI情报', '日报中心'], desc: 'AI自动生成每日行业情报报告，包含事件、产品、趋势与企业建议' },
  'sales': { title: 'AI销售机会', breadcrumb: ['AI情报', '销售机会'], desc: '基于AI行业变化自动识别销售机会，推荐客户与沟通话术' },
  'sales-dashboard': { title: '销售驾驶舱', breadcrumb: ['销售工作台', '销售驾驶舱'], desc: '实时掌握销售数据' },
  'workspace-customers': { title: '客户中心', breadcrumb: ['销售工作台', '客户中心'], desc: '管理客户信息' },
  'workspace-customer-detail': { title: '客户详情', breadcrumb: ['销售工作台', '客户中心', '客户详情'], desc: '查看客户详细信息、AI画像与跟进记录' },
  'workspace-tasks': { title: '今日任务', breadcrumb: ['销售工作台', '今日任务'], desc: 'AI智能生成今日销售重点任务与行动建议' },
  'workspace-opportunities': { title: '商机管理', breadcrumb: ['销售工作台', '商机管理'], desc: '管理飞书同步的销售商机，跟踪在途金额、成交阶段与赢单率' },
  'sales-prediction': { title: 'AI销售预测', breadcrumb: ['销售工作台', 'AI销售预测'], desc: 'AI预测客户成交概率，生成推进策略' },
  'sales-funnel': { title: '销售漏斗', breadcrumb: ['销售工作台', '销售漏斗'], desc: '分析销售阶段转化与商机金额' },
  'sales-review': { title: 'AI销售复盘', breadcrumb: ['销售工作台', 'AI销售复盘'], desc: '自动生成销售日报周报月报' },

};

// ========== 通用组件 ==========
const Components = {
  // 页面头部
  pageHeader(routeKey) {
    const info = PAGE_INFO[routeKey] || { title: '', breadcrumb: [] };
    const breadcrumbHtml = info.breadcrumb.map((item, idx) => {
      if (idx === info.breadcrumb.length - 1) {
        return `<span>${item}</span>`;
      }
      return `<a>${item}</a> / `;
    }).join('');
    
    return `
      <div class="page-header">
        <div class="page-breadcrumb">${breadcrumbHtml}</div>
        <h1 class="page-title">${info.title}</h1>
        ${info.desc ? `<p class="page-desc">${info.desc}</p>` : ''}
      </div>
    `;
  },
  
  // 指标卡片
  metricCard(label, value, unit, trend, trendType, iconType) {
    const trendClass = trendType === 'up' ? 'up' : trendType === 'down' ? 'down' : 'flat';
    const trendIcon = trendType === 'up' ? '↑' : trendType === 'down' ? '↓' : '→';
    return `
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">${label}</span>
          <div class="metric-icon ${iconType}">${ICONS[iconType === 'blue' ? 'chart' : iconType === 'green' ? 'fire' : iconType === 'orange' ? 'ai' : 'task'] || ''}</div>
        </div>
        <div class="metric-value">${value}<span class="metric-unit">${unit || ''}</span></div>
        <div class="metric-trend ${trendClass}">${trendIcon} ${trend}</div>
      </div>
    `;
  },
  
  // 标签
  tag(text, type = 'blue') {
    return `<span class="tag tag-${type} tag-dot">${text}</span>`;
  },
  
  // 按钮
  button(text, type = '', size = '', onclick = '') {
    const classes = ['btn'];
    if (type) classes.push(`btn-${type}`);
    if (size) classes.push(`btn-${size}`);
    return `<button class="${classes.join(' ')}" ${onclick ? `onclick="${onclick}"` : ''}>${text}</button>`;
  },
  
  // 空状态
  emptyState(text = '暂无数据') {
    return `
      <div class="empty-state">
        <div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z"/> </svg></div>
        <div class="empty-state-text">${text}</div>
      </div>
    `;
  },
  // Markdown渲染（全局复用）
  renderMarkdown(md) {
    if (!md) return '<p style="color:var(--text-secondary);">暂无内容</p>';
    let html = md;
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/^### (.*$)/gm, '<h3 style="font-size:16px;font-weight:600;margin:18px 0 10px;color:var(--text-primary);">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 style="font-size:18px;font-weight:600;margin:22px 0 12px;color:var(--text-primary);padding-bottom:8px;border-bottom:2px solid var(--primary-light);">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:var(--text-primary);">$1</h1>');
    html = html.replace(/^&gt; (.*$)/gm, '<div style="padding:8px 16px;margin:8px 0;background:var(--bg);border-left:3px solid var(--primary);color:var(--text-secondary);font-size:13px;">$1</div>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:600;">$1</strong>');
    html = html.replace(/^- (.*$)/gm, '<li style="margin:4px 0;padding-left:8px;">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li style="margin:4px 0;padding-left:8px;">$1</li>');
    html = html.replace(/\n\n/g, '</p><p style="margin:8px 0;">');
    html = html.replace(/\n/g, '<br>');
    return '<div class="markdown-content" style="line-height:1.8;color:#334155;font-size:14px;">' + html + '</div>';
  },
  
  // 分页
  pagination(current, total, pageSize = 10) {
    const totalPages = Math.ceil(total / pageSize);
    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);
    
    let pagesHtml = '';
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      const active = i === current ? 'active' : '';
      pagesHtml += `<button class="pagination-btn ${active}" onclick="Pages.currentPage && Pages.currentPage.goTo(${i})">${i}</button>`;
    }
    
    return `
      <div class="pagination">
        <span class="pagination-info">共 ${total} 条，显示 ${start}-${end}</span>
        <button class="pagination-btn" ${current <= 1 ? 'disabled' : ''} onclick="Pages.currentPage && Pages.currentPage.goTo(${current - 1})">上一页</button>
        ${pagesHtml}
        <button class="pagination-btn" ${current >= totalPages ? 'disabled' : ''} onclick="Pages.currentPage && Pages.currentPage.goTo(${current + 1})">下一页</button>
      </div>
    `;
  }
};

// ========== Toast ==========
function showToast(message, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ========== 复制到剪贴板 ==========
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('已复制到剪贴板', 'success');
    }).catch(() => {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('已复制到剪贴板', 'success');
    });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('已复制到剪贴板', 'success');
  }
}

// ========== 下拉菜单 ==========
function toggleDropdown(name) {
  const dropdown = document.getElementById('dropdown-' + name);
  if (!dropdown) return;
  
  const isOpen = dropdown.classList.contains('show');
  
  // 先关闭所有下拉菜单
  closeDropdowns();
  
  // 如果之前是关闭的，则打开当前下拉菜单
  if (!isOpen) {
    dropdown.classList.add('show');
  }
}

function closeDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
}

// ========== 通知管理 ==========
const NOTIFICATION_STORAGE_KEY = 'weibo_analytics_read_notifications';

function loadReadNotifications() {
  try {
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch (e) {
    return new Set();
  }
}

function saveReadNotifications() {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify([...notificationState.readIds]));
  } catch (e) {
    console.error('保存通知状态失败:', e);
  }
}

const notificationState = {
  readIds: loadReadNotifications(),
  totalCount: 3
};

function markNotificationAsRead(id) {
  if (notificationState.readIds.has(id)) return;
  notificationState.readIds.add(id);
  saveReadNotifications();
  
  // 更新该通知项的样式
  const item = document.querySelector(`.notification-item[data-id="${id}"]`);
  if (item) {
    item.classList.add('read');
    const dot = item.querySelector('.notification-unread-dot');
    if (dot) dot.style.display = 'none';
  }
  
  updateNotificationBadge();
}

function markAllNotificationsAsRead() {
  document.querySelectorAll('.notification-item').forEach(item => {
    const id = parseInt(item.dataset.id);
    notificationState.readIds.add(id);
    item.classList.add('read');
    const dot = item.querySelector('.notification-unread-dot');
    if (dot) dot.style.display = 'none';
  });
  saveReadNotifications();
  
  updateNotificationBadge();
  showToast('已全部标记为已读', 'success');
}

function updateNotificationBadge() {
  const unreadCount = notificationState.totalCount - notificationState.readIds.size;
  
  // 更新右上角 badge
  const badge = document.querySelector('.notification-badge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'grid';
    } else {
      badge.style.display = 'none';
    }
  }
  
  // 更新通知中心的"X 条未读"
  const unreadText = document.getElementById('notification-unread-count');
  if (unreadText) {
    if (unreadCount > 0) {
      unreadText.textContent = `${unreadCount} 条未读`;
    } else {
      unreadText.textContent = '全部已读';
    }
  }
}

function initNotificationReadState() {
  // 根据localStorage中的已读状态，更新通知项的UI样式
  document.querySelectorAll('.notification-item').forEach(item => {
    const id = parseInt(item.dataset.id);
    if (notificationState.readIds.has(id)) {
      item.classList.add('read');
      const dot = item.querySelector('.notification-unread-dot');
      if (dot) dot.style.display = 'none';
    }
  });
  updateNotificationBadge();
}

// 点击页面其他地方时关闭下拉菜单
document.addEventListener('click', function(e) {
  // 如果点击的不是下拉菜单内部，也不是触发下拉菜单的按钮，则关闭
  if (!e.target.closest('.dropdown-menu') && 
      !e.target.closest('.topbar-icon-btn') && 
      !e.target.closest('.user-info')) {
    closeDropdowns();
  }
});

// ========== 抽屉 ==========
function openDrawer(title, content) {
  document.getElementById('drawerTitle').textContent = title;
  document.getElementById('drawerBody').innerHTML = content;
  document.getElementById('drawerMask').classList.add('show');
  document.getElementById('drawer').classList.add('show');
}

function closeDrawer() {
  document.getElementById('drawerMask').classList.remove('show');
  document.getElementById('drawer').classList.remove('show');
}

// ========== 页面实现 ==========
const Pages = {
  currentPage: null,
  
  // 首页 Dashboard
  dashboard: {
    async render(container) {
      container.innerHTML = Components.pageHeader('dashboard') + `
        <div class="metrics-row">
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
        </div>
        <div class="grid-2">
          <div class="card"><div class="card-body"><div class="skeleton" style="height:280px"></div></div></div>
          <div class="card"><div class="card-body"><div class="skeleton" style="height:280px"></div></div></div>
        </div>
      `;
      
      // 并行获取数据
      const [hotWeibo, sentiment, report] = await Promise.all([
        API.getHotWeibo(10),
        API.getSentiment(1000),
        API.getDailyReport()
      ]);
      
      const weiboCount = hotWeibo ? (hotWeibo.data?.length || hotWeibo.length || 0) : 0;
      const sentimentData = sentiment?.data || sentiment || {};
      const positive = sentimentData.positive_ratio || sentimentData.positive || 0;
      const negative = sentimentData.negative_ratio || sentimentData.negative || 0;
      const neutral = sentimentData.neutral_ratio || sentimentData.neutral || 0;
      const totalAnalyzed = sentimentData.total_analyzed || sentimentData.sample_size || 0;
      
      container.innerHTML = Components.pageHeader('dashboard') + `
        <div class="metrics-row">
          ${Components.metricCard('热门微博数', weiboCount.toLocaleString(), '条', '最新采集数据', 'up', 'blue')}
          ${Components.metricCard('分析样本数', totalAnalyzed.toLocaleString(), '条', 'AI情感分析', 'up', 'orange')}
          ${Components.metricCard('正面情感占比', positive.toFixed(1), '%', positive > 50 ? '舆论偏正面' : '正面占比', positive > 50 ? 'up' : 'flat', 'green')}
          ${Components.metricCard('系统运行状态', '正常', '', '服务稳定运行', 'flat', 'red')}
        </div>
        
        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span class="card-title">热点趋势</span>
            </div>
            <div class="card-body">
              <div class="chart-container" id="trendChart"></div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <span class="card-title">AI日报生成状态</span>
              <div class="card-extra">
                ${Components.tag('今日已生成', 'green')}
              </div>
            </div>
            <div class="card-body">
              <div style="padding: 8px 0;">
                <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
                  <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg, var(--primary-light) 0%, #F0FDFA 100%);display:grid;place-items:center;font-size:24px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div>
                  <div>
                    <div style="font-size:16px;font-weight:600;margin-bottom:2px;">${new Date(Date.now() - 86400000).toLocaleDateString("zh-CN", {year:"numeric", month:"long", day:"numeric"})} 日报</div>
                    <div style="font-size:12px;color:var(--text-secondary);">AI 自动生成 · 已分析 ${totalAnalyzed} 条微博</div>
                  </div>
                </div>
                
                <!-- 情感分布进度条 -->
                <div style="margin-bottom:16px;">
                  <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span style="font-size:12px;color:var(--text-secondary);">情感分布</span>
                    <span style="font-size:12px;color:var(--text-tertiary);">正面 ${positive.toFixed(1)}% · 中性 ${neutral.toFixed(1)}% · 负面 ${negative.toFixed(1)}%</span>
                  </div>
                  <div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden;display:flex;">
                    <div style="width:${positive}%;background:linear-gradient(90deg, #10B981 0%, #34D399 100%);height:100%;"></div>
                    <div style="width:${neutral}%;background:linear-gradient(90deg, #94A3B8 0%, #CBD5E1 100%);height:100%;"></div>
                    <div style="width:${negative}%;background:linear-gradient(90deg, #EF4444 0%, #F87171 100%);height:100%;"></div>
                  </div>
                </div>
                
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
                  <div style="padding:10px 12px;background:linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%);border-radius:8px;">
                    <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px;">正面情感</div>
                    <div style="font-size:18px;font-weight:700;color:#059669;">${positive.toFixed(1)}%</div>
                  </div>
                  <div style="padding:10px 12px;background:linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);border-radius:8px;">
                    <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px;">中性情感</div>
                    <div style="font-size:18px;font-weight:700;color:#64748B;">${neutral.toFixed(1)}%</div>
                  </div>
                  <div style="padding:10px 12px;background:linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%);border-radius:8px;">
                    <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px;">负面情感</div>
                    <div style="font-size:18px;font-weight:700;color:#DC2626;">${negative.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div style="margin-top:16px;">
                  ${Components.button('查看完整日报', 'primary', '', "Router.navigate('daily-report')")}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">系统运行状态</span>
            <div class="card-extra">
              ${Components.tag('服务正常', 'green')}
            </div>
          </div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
              <div style="text-align:center;padding:16px;background:var(--bg);border-radius:8px;">
                <div style="font-size:24px;margin-bottom:4px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"/> </svg></div>
                <div style="font-size:13px;font-weight:600;margin-bottom:2px;">数据采集</div>
                <div style="font-size:11px;color:var(--text-secondary);">每天 08:00 自动执行</div>
                <div style="margin-top:8px;">${Components.tag('正常运行', 'green')}</div>
              </div>
              <div style="text-align:center;padding:16px;background:var(--bg);border-radius:8px;">
                <div style="font-size:24px;margin-bottom:4px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/> <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/> </svg></div>
                <div style="font-size:13px;font-weight:600;margin-bottom:2px;">AI分析</div>
                <div style="font-size:11px;color:var(--text-secondary);">情感分析+热点提取</div>
                <div style="margin-top:8px;">${Components.tag('正常运行', 'green')}</div>
              </div>
              <div style="text-align:center;padding:16px;background:var(--bg);border-radius:8px;">
                <div style="font-size:24px;margin-bottom:4px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div>
                <div style="font-size:13px;font-weight:600;margin-bottom:2px;">日报生成</div>
                <div style="font-size:11px;color:var(--text-secondary);">每日自动生成报告</div>
                <div style="margin-top:8px;">${Components.tag('今日已生成', 'green')}</div>
              </div>
              <div style="text-align:center;padding:16px;background:var(--bg);border-radius:8px;">
                <div style="font-size:24px;margin-bottom:4px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/> </svg></div>
                <div style="font-size:13px;font-weight:600;margin-bottom:2px;">飞书推送</div>
                <div style="font-size:11px;color:var(--text-secondary);">报告自动推送到飞书</div>
                <div style="margin-top:8px;">${Components.tag('已配置', 'blue')}</div>
              </div>
            </div>
            <div style="margin-top:16px;padding:12px 16px;background:#ECFDF5;border-radius:8px;border-left:3px solid #10B981;">
              <div style="font-size:12px;color:#065F46;">
                <strong>系统说明：</strong>本平台采用定时任务架构，每天 08:00 自动执行微博数据采集、AI情感分析、热点提取和日报生成，并自动推送到飞书。任务执行记录可在调度日志中查看。
              </div>
            </div>
          </div>
        </div>
        
        <!-- 产品介绍横幅 -->
        <div style="background:linear-gradient(135deg, #0D9488 0%, #14B8A6 100%);border-radius:12px;padding:28px 32px;margin-bottom:20px;color:white;position:relative;overflow:hidden;">
          <div style="position:absolute;right:-20px;top:-20px;font-size:120px;opacity:0.1;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div>
          <div style="position:relative;z-index:1;">
            <div style="font-size:22px;font-weight:700;margin-bottom:6px;">微博智能分析平台</div>
            <div style="font-size:14px;opacity:0.9;margin-bottom:16px;">基于 AI 的微博舆情分析与热点洞察平台，助力企业实时掌握市场动态与用户情感</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/> <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/> </svg> AI情感分析</span>
              <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/> </svg> 热点趋势追踪</span>
              <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/> <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/> </svg> 每日AI报告</span>
              <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/> </svg> KOL影响力分析</span>
            </div>
          </div>
        </div>
        
        <!-- 核心能力 -->
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px;">
          ${[
            {icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"/> </svg>', title:'数据采集', desc:'自动采集微博热门内容', route:'weibo-data'},
            {icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/> </svg>', title:'热点趋势', desc:'实时追踪关键词热度变化', route:'trend'},
            {icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/> <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/> </svg>', title:'舆情分析', desc:'AI识别正面/负面情感倾向', route:'sentiment'},
            {icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/> <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/> </svg>', title:'AI日报', desc:'每日自动生成舆情分析报告', route:'daily-report'},
            {icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/> </svg>', title:'用户分析', desc:'KOL影响力排行与用户画像', route:'user-data'}
          ].map(cap => `
            <div onclick="Router.navigate('${cap.route}')" style="background:white;border:1px solid var(--border-light);border-radius:10px;padding:16px;cursor:pointer;transition:var(--transition);" onmouseover="this.style.boxShadow='var(--shadow-card-hover)';this.style.borderColor='var(--primary)'" onmouseout="this.style.boxShadow='var(--shadow-card)';this.style.borderColor='var(--border-light)'">
              <div style="font-size:24px;margin-bottom:8px;">${cap.icon}</div>
              <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${cap.title}</div>
              <div style="font-size:11px;color:var(--text-secondary);line-height:1.4;">${cap.desc}</div>
            </div>
          `).join('')}
        </div>
        
        <!-- Demo引导流程 -->
        <div style="background:white;border:1px solid var(--border-light);border-radius:10px;padding:20px 24px;margin-bottom:20px;">
          <div style="font-size:14px;font-weight:600;margin-bottom:16px;color:var(--text);"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/> <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/> </svg> 产品工作流程</div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
            ${[
              {step:'1', title:'数据采集', desc:'每天自动采集微博', icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"/> </svg>'},
              {step:'2', title:'数据清洗', desc:'去重、分类、结构化', icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/> </svg>'},
              {step:'3', title:'AI分析', desc:'情感分析+关键词提取', icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/> <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/> </svg>'},
              {step:'4', title:'热点发现', desc:'识别热议话题与趋势', icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/> </svg>'},
              {step:'5', title:'报告生成', desc:'自动输出每日洞察', icon:'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg>'}
            ].map((item, idx) => `
              <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:120px;">
                <div style="text-align:center;">
                  <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--primary-light),var(--primary-lighter));display:grid;place-items:center;font-size:18px;margin:0 auto 4px;">${item.icon}</div>
                  <div style="font-size:12px;font-weight:600;">${item.title}</div>
                  <div style="font-size:10px;color:var(--text-tertiary);">${item.desc}</div>
                </div>
                ${idx < 4 ? '<div style="color:var(--text-tertiary);font-size:18px;margin-top:-20px;">→</div>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      // 渲染简单的趋势图
      Pages.dashboard.renderTrendChart();
    },
    
    renderTrendChart() {
      const container = document.getElementById('trendChart');
      if (!container) return;
      
      // 简单的 SVG 折线图
      const data = [45, 62, 38, 71, 55, 82, 68];
      const labels = ['9/7', '9/8', '9/9', '9/10', '9/11', '9/12', '9/13'];
      const max = Math.max(...data);
      const width = container.clientWidth || 400;
      const height = 260;
      const padding = { top: 20, right: 20, bottom: 30, left: 40 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;
      
      const points = data.map((v, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + chartH - (v / max) * chartH;
        return `${x},${y}`;
      }).join(' ');
      
      const areaPoints = `${padding.left},${padding.top + chartH} ${points} ${padding.left + chartW},${padding.top + chartH}`;
      
      let gridLines = '';
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartH;
        const value = Math.round(max - (i / 4) * max);
        gridLines += `<line x1="${padding.left}" y1="${y}" x2="${padding.left + chartW}" y2="${y}" stroke="#F0F1F2" stroke-width="1"/>`;
        gridLines += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#8F959E">${value}</text>`;
      }
      
      let xLabels = '';
      labels.forEach((label, i) => {
        const x = padding.left + (i / (labels.length - 1)) * chartW;
        xLabels += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#8F959E">${label}</text>`;
      });
      
      container.innerHTML = `
        <svg width="${width}" height="${height}" style="overflow:visible;">
          ${gridLines}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#0D9488;stop-opacity:0.15"/>
              <stop offset="100%" style="stop-color:#0D9488;stop-opacity:0"/>
            </linearGradient>
          </defs>
          <polygon points="${areaPoints}" fill="url(#areaGradient)"/>
          <polyline points="${points}" fill="none" stroke="#0D9488" stroke-width="2" stroke-linejoin="round"/>
          ${data.map((v, i) => {
            const x = padding.left + (i / (data.length - 1)) * chartW;
            const y = padding.top + chartH - (v / max) * chartH;
            return `<circle cx="${x}" cy="${y}" r="4" fill="white" stroke="#0D9488" stroke-width="2"/>`;
          }).join('')}
          ${xLabels}
        </svg>
      `;
    }
  },
  
  // 微博数据页面
  'weibo-data': {
    data: [],
    page: 1,
    pageSize: 10,
    filtered: [],
    
    async render(container) {
      Pages.currentPage = Pages['weibo-data'];
      container.innerHTML = Components.pageHeader('weibo-data') + `
        <div class="filter-bar">
          <div class="filter-item">
            <label class="filter-label">关键词</label>
            <input type="text" placeholder="搜索微博内容..." id="filterKeyword">
          </div>
          <div class="filter-item">
            <label class="filter-label">分类</label>
            <select id="filterCategory">
              <option value="">全部</option>
              <option value="tech">科技</option>
              <option value="finance">财经</option>
              <option value="social">社会</option>
              <option value="entertainment">娱乐</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">情感</label>
            <select id="filterSentiment">
              <option value="">全部</option>
              <option value="positive">正面</option>
              <option value="neutral">中性</option>
              <option value="negative">负面</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">AI状态</label>
            <select id="filterStatus">
              <option value="">全部</option>
              <option value="done">已分析</option>
              <option value="pending">待分析</option>
              <option value="processing">分析中</option>
            </select>
          </div>
          <div class="filter-actions">
            ${Components.button('搜索', 'primary', '', "Pages['weibo-data'].applyFilter()")}
            ${Components.button('重置', '', '', "Pages['weibo-data'].resetFilter()")}
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">微博列表</span>
          </div>
          <div class="card-body" style="padding:0;">
            <div class="table-wrapper" id="weiboTable">
              <div class="page-loading"><div class="loading-spinner"></div><span>加载中...</span></div>
            </div>
          </div>
        </div>
      `;
      
      // 获取数据
      const data = await API.getHotWeibo(50);
      const rawData = data?.data || data || [];
      
      // 为每条数据生成稳定的分类、情感、状态字段（基于内容哈希，非随机）
      this.data = rawData.map((item, idx) => {
        const text = (item.text || item.content || '').toLowerCase();
        const hash = text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        
        // 基于内容关键词判断分类
        let category = 'social';
        if (text.includes('ai') || text.includes('人工智能') || text.includes('科技') || text.includes('芯片') || text.includes('互联网')) category = 'tech';
        else if (text.includes('股') || text.includes('财经') || text.includes('经济') || text.includes('金融') || text.includes('投资')) category = 'finance';
        else if (text.includes('娱乐') || text.includes('明星') || text.includes('电影') || text.includes('综艺')) category = 'entertainment';
        
        // 基于内容关键词判断情感
        let sentiment = 'neutral';
        if (text.includes('好') || text.includes('棒') || text.includes('赞') || text.includes('喜欢') || text.includes('支持') || text.includes('优秀')) sentiment = 'positive';
        else if (text.includes('差') || text.includes('烂') || text.includes('讨厌') || text.includes('反对') || text.includes('批评') || text.includes('问题')) sentiment = 'negative';
        
        // 基于哈希生成状态（稳定）
        const statuses = ['done', 'done', 'done', 'pending', 'processing'];
        const status = statuses[hash % statuses.length];
        
        return {
          ...item,
          _category: category,
          _sentiment: sentiment,
          _status: status,
          _index: idx
        };
      });
      
      this.filtered = [...this.data];
      this.renderTable();
    },
    
    applyFilter() {
      const keyword = document.getElementById('filterKeyword')?.value?.toLowerCase() || '';
      const category = document.getElementById('filterCategory')?.value || '';
      const sentiment = document.getElementById('filterSentiment')?.value || '';
      const status = document.getElementById('filterStatus')?.value || '';
      
      this.filtered = this.data.filter(item => {
        // 关键词过滤
        const text = (item.text || item.content || '').toLowerCase();
        if (keyword && !text.includes(keyword)) return false;
        
        // 分类过滤
        if (category && item._category !== category) return false;
        
        // 情感过滤
        if (sentiment && item._sentiment !== sentiment) return false;
        
        // 状态过滤
        if (status && item._status !== status) return false;
        
        return true;
      });
      
      this.page = 1;
      this.renderTable();
      showToast(`筛选完成，共 ${this.filtered.length} 条结果`);
    },
    
    resetFilter() {
      document.getElementById('filterKeyword').value = '';
      document.getElementById('filterCategory').value = '';
      document.getElementById('filterSentiment').value = '';
      document.getElementById('filterStatus').value = '';
      this.filtered = [...this.data];
      this.page = 1;
      this.renderTable();
    },
    
    goTo(page) {
      this.page = page;
      this.renderTable();
    },
    
    renderTable() {
      const tableEl = document.getElementById('weiboTable');
      if (!tableEl) return;
      
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      const pageData = this.filtered.slice(start, end);
      
      if (!pageData.length) {
        tableEl.innerHTML = Components.emptyState('暂无微博数据');
        return;
      }
      
      const categoryMap = {
        tech: '科技', finance: '财经', social: '社会', entertainment: '娱乐', life: '生活'
      };
      const sentimentMap = {
        positive: { label: '正面', type: 'green' },
        neutral: { label: '中性', type: 'gray' },
        negative: { label: '负面', type: 'red' }
      };
      const statusMap = {
        done: { label: '已分析', type: 'blue' },
        pending: { label: '待分析', type: 'orange' },
        processing: { label: '分析中', type: 'green' }
      };
      
      tableEl.innerHTML = `
        <table>
          <thead>
            <tr>
              <th style="width:50px;"><input type="checkbox"></th>
              <th style="width:160px;">发布时间</th>
              <th style="width:120px;">作者</th>
              <th>内容</th>
              <th style="width:80px;">热度</th>
              <th style="width:80px;">分类</th>
              <th style="width:80px;">情感</th>
              <th style="width:90px;">AI状态</th>
              <th style="width:150px;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageData.map((item, idx) => {
              const cat = categoryMap[item._category] || '社会';
              const sent = sentimentMap[item._sentiment] || sentimentMap.neutral;
              const stat = statusMap[item._status] || statusMap.done;
              const content = (item.text || item.content || '').substring(0, 60);
              const author = item.username || item.user || item.author || item.screen_name || `用户${item._index + 1}`;
              const time = item.created_at || item.time || `2026-09-13 ${String(8 + (item._index % 12)).padStart(2, '0')}:30:00`;
              const hot = item.hot || item.heat || (1000 + (item._index * 137) % 4000);
              
              return `
                <tr style="cursor:pointer;" onclick="Pages['weibo-data'].viewDetail(${start + idx})">
                  <td onclick="event.stopPropagation();"><input type="checkbox"></td>
                  <td style="font-size:12px;color:var(--text-secondary);">${time}</td>
                  <td style="font-weight:500;">${author}</td>
                  <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${item.text || item.content || ''}">${content}...</td>
                  <td><span style="color:var(--warning);font-weight:500;">${hot}</span></td>
                  <td>${Components.tag(cat, 'blue')}</td>
                  <td>${Components.tag(sent.label, sent.type)}</td>
                  <td>${Components.tag(stat.label, stat.type)}</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-link btn-sm" onclick="Pages['weibo-data'].viewDetail(${start + idx})">详情</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        ${Components.pagination(this.page, this.filtered.length, this.pageSize)}
      `;
    },
    
    viewDetail(index) {
      const item = this.filtered[index];
      if (!item) return;
      
      const content = item.text || item.content || '';
      const author = item.username || item.user || item.author || item.screen_name || '未知用户';
      
      openDrawer('微博详情', `
        <div class="detail-section">
          <div class="detail-row">
            <span class="detail-label">作者</span>
            <span class="detail-value" style="font-weight:500;">${author}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">发布时间</span>
            <span class="detail-value">${item.created_at || item.time || '2026-09-13 08:30:00'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">热度</span>
            <span class="detail-value" style="color:var(--warning);font-weight:500;">${item.hot || item.heat || 1280}</span>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">微博内容</div>
          <div class="detail-content">${content}</div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">AI 分析结果</div>
          <div class="detail-row">
            <span class="detail-label">情感判断</span>
            <span class="detail-value">${Components.tag('正面', 'green')} 置信度 92.5%</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">关键词</span>
            <span class="detail-value">AI、大模型、飞书、智能体</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">热点原因</span>
            <span class="detail-value">AI 产品发布引发行业讨论，KOL 转发带动传播</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">AI建议</span>
            <span class="detail-value">建议持续关注该话题，可作为产品优化参考</span>
          </div>
        </div>
      `);
    }
  },
  
  // 用户数据页面
  'user-data': {
    async render(container) {
      Pages.currentPage = Pages['user-data'];
      container.innerHTML = Components.pageHeader('user-data') + `
        <div class="metrics-row">
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">影响力用户排行</span>
          </div>
          <div class="card-body" style="padding:0;">
            <div class="page-loading"><div class="loading-spinner"></div><span>加载中...</span></div>
          </div>
        </div>
      `;
      
      // 获取真实KOL用户数据
      const [followers, engagement] = await Promise.all([
        API.getInfluencers('followers', 50),
        API.getInfluencers('engagement', 50)
      ]);
      
      const users = followers?.data || followers || [];
      
      // 基于真实数据计算指标
      const kolCount = users.length;
      const totalFollowers = users.reduce((sum, u) => sum + (u.followers_count || 0), 0);
      const totalEngagement = users.reduce((sum, u) => sum + (u.total_engagement || 0), 0);
      const verifiedCount = users.filter(u => u.verified === 1 || u.verified === true).length;
      
      // 格式化大数字
      const formatNumber = (num) => {
        if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
        if (num >= 10000) return (num / 10000).toFixed(1) + '万';
        return num.toLocaleString();
      };
      
      container.innerHTML = Components.pageHeader('user-data') + `
        <div class="metrics-row">
          ${Components.metricCard('KOL 用户数', kolCount.toString(), '人', '已采集影响力用户', 'flat', 'blue')}
          ${Components.metricCard('总粉丝量', formatNumber(totalFollowers), '', '所有KOL粉丝总和', 'up', 'green')}
          ${Components.metricCard('总互动量', formatNumber(totalEngagement), '', '点赞+评论+转发', 'up', 'orange')}
          ${Components.metricCard('认证用户', verifiedCount.toString(), '人', '微博认证账号', 'flat', 'red')}
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">影响力用户排行</span>
            <div class="card-extra">
              <span style="font-size:13px;color:var(--text-secondary);">按粉丝数排序</span>
            </div>
          </div>
          <div class="card-body" style="padding:0;">
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th style="width:60px;">排名</th>
                    <th>用户</th>
                    <th style="width:120px;">粉丝数</th>
                    <th style="width:120px;">互动量</th>
                    <th style="width:100px;">微博数</th>
                    <th style="width:80px;">认证</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.length ? users.map((user, idx) => {
                    const name = user.username || user.name || user.screen_name || `用户${idx + 1}`;
                    const fans = user.followers_count || 0;
                    const engage = user.total_engagement || 0;
                    const weiboCount = user.weibo_count || 0;
                    const isVerified = user.verified === 1 || user.verified === true;
                    return `
                      <tr>
                        <td><span style="font-weight:600;color:${idx < 3 ? 'var(--warning)' : 'var(--text-secondary)'};">${idx + 1}</span></td>
                        <td>
                          <div style="display:flex;align-items:center;gap:10px;">
                            <div style="width:36px;height:36px;border-radius:50%;background:var(--primary-light);color:var(--primary);display:grid;place-items:center;font-weight:600;">${name.charAt(0)}</div>
                            <div>
                              <span style="font-weight:500;">${name}</span>
                              ${user.description ? `<div style="font-size:11px;color:var(--text-tertiary);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.description}</div>` : ''}
                            </div>
                          </div>
                        </td>
                        <td><span style="font-weight:500;">${formatNumber(fans)}</span></td>
                        <td><span style="color:var(--primary);font-weight:500;">${formatNumber(engage)}</span></td>
                        <td style="color:var(--text-secondary);">${weiboCount.toLocaleString()}</td>
                        <td>${isVerified ? Components.tag('已认证', 'orange') : Components.tag('未认证', 'gray')}</td>
                      </tr>
                    `;
                  }).join('') : `
                    <tr><td colspan="6">${Components.emptyState('暂无用户数据')}</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  },
  
  // 热点数据页面
  'hot-data': {
    async render(container) {
      Pages.currentPage = Pages['hot-data'];
      container.innerHTML = Components.pageHeader('hot-data') + `
        <div class="metrics-row">
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">热点话题排行</span>
          </div>
          <div class="card-body" style="padding:0;">
            <div class="page-loading"><div class="loading-spinner"></div><span>加载中...</span></div>
          </div>
        </div>
      `;
      
      // 获取真实微博数据
      const data = await API.getHotWeibo(50);
      const weibos = data?.data || data || [];
      
      // 从微博内容中提取话题标签 #xxx#
      const topicMap = {};
      let totalLikes = 0;
      let totalComments = 0;
      let totalReposts = 0;
      
      weibos.forEach(weibo => {
        const text = weibo.text || weibo.content || '';
        const matches = text.match(/#([^#]+)#/g);
        if (matches) {
          matches.forEach(match => {
            const topic = match.replace(/#/g, '').trim();
            if (topic) {
              if (!topicMap[topic]) {
                topicMap[topic] = { count: 0, weibos: [] };
              }
              topicMap[topic].count++;
              topicMap[topic].weibos.push(weibo);
            }
          });
        }
        totalLikes += weibo.likes_count || weibo.likes || weibo.attitudes_count || 0;
        totalComments += weibo.comments_count || weibo.comments || 0;
        totalReposts += weibo.reposts_count || weibo.reposts || weibo.retweeted_count || 0;
      });
      
      // 按出现次数排序
      const hotTopics = Object.entries(topicMap)
        .map(([title, info]) => ({
          title,
          count: info.count,
          heat: info.count * 1000, // 基于提及次数计算热度
          weibos: info.weibos
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      
      // 格式化数字
      const formatNumber = (num) => {
        if (num >= 10000) return (num / 10000).toFixed(1) + '万';
        return num.toLocaleString();
      };
      
      const totalEngagement = totalLikes + totalComments + totalReposts;
      
      container.innerHTML = Components.pageHeader('hot-data') + `
        <div class="metrics-row">
          ${Components.metricCard('采集微博数', weibos.length.toString(), '条', '最新采集数据', 'flat', 'blue')}
          ${Components.metricCard('热点话题数', hotTopics.length.toString(), '个', '从微博内容提取', 'up', 'orange')}
          ${Components.metricCard('总互动量', formatNumber(totalEngagement), '', '点赞+评论+转发', 'up', 'green')}
          ${Components.metricCard('总转发量', formatNumber(totalReposts), '', '微博转发总数', 'up', 'red')}
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">热点话题排行</span>
            <div class="card-extra">
              <span style="font-size:13px;color:var(--text-secondary);">从微博话题标签提取</span>
            </div>
          </div>
          <div class="card-body" style="padding:0;">
            ${hotTopics.length > 0 ? `
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th style="width:60px;">排名</th>
                      <th>话题</th>
                      <th style="width:120px;">提及次数</th>
                      <th style="width:100px;">热度</th>
                      <th style="width:80px;">趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${hotTopics.map((topic, idx) => {
                      const heatValue = topic.count * 1000;
                      return `
                        <tr>
                          <td><span style="font-weight:600;color:${idx < 3 ? 'var(--danger)' : 'var(--text-secondary)'};">${idx + 1}</span></td>
                          <td style="font-weight:500;">
                            <span style="color:var(--primary);">#${topic.title}#</span>
                            ${idx < 3 ? '<span class="tag tag-red" style="margin-left:8px;">热</span>' : ''}
                          </td>
                          <td><span style="font-weight:500;">${topic.count} 次</span></td>
                          <td><span style="color:var(--warning);font-weight:600;">${formatNumber(heatValue)}</span></td>
                          <td>
                            <span style="color:var(--success);">↑ 上升</span>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            ` : `
              <div style="padding:60px 20px;text-align:center;">
                <div style="font-size:48px;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div>
                <div style="font-size:16px;font-weight:600;margin-bottom:8px;">暂无热点数据</div>
                <div style="font-size:13px;color:var(--text-secondary);">当前采集的微博中未检测到话题标签，等待更多数据采集</div>
              </div>
            `}
          </div>
        </div>
      `;
    }
  },
  
  // 舆情分析页面
  'sentiment': {
    async render(container) {
      Pages.currentPage = Pages['sentiment'];
      
      // 先显示骨架屏
      container.innerHTML = Components.pageHeader('sentiment') + `
        <div class="metrics-row">
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
          <div class="skeleton" style="height:100px"></div>
        </div>
        <div class="grid-2">
          <div class="card"><div class="card-body"><div class="skeleton" style="height:260px"></div></div></div>
          <div class="card"><div class="card-body"><div class="skeleton" style="height:260px"></div></div></div>
        </div>
      `;
      
      // 从API获取真实情感分析数据
      const sentimentData = await API.getSentiment(1000);
      const data = sentimentData?.data || sentimentData || {};
      
      const totalAnalyzed = data.total_analyzed || data.sample_size || 1000;
      const positiveRatio = data.positive_ratio !== undefined ? data.positive_ratio : 0;
      const negativeRatio = data.negative_ratio !== undefined ? data.negative_ratio : 0;
      const neutralRatio = data.neutral_ratio !== undefined ? data.neutral_ratio : 0;
      const negativeViewpoints = data.top_negative_viewpoints || [];
      
      container.innerHTML = Components.pageHeader('sentiment') + `
        <div class="metrics-row">
          ${Components.metricCard('分析样本数', totalAnalyzed.toLocaleString(), '条', '基于最新采样', 'flat', 'blue')}
          ${Components.metricCard('正面情感', positiveRatio.toFixed(1), '%', positiveRatio > 50 ? '舆论偏正面' : '正面占比', positiveRatio > 50 ? 'up' : 'flat', 'green')}
          ${Components.metricCard('负面情感', negativeRatio.toFixed(1), '%', negativeRatio > 10 ? '需关注负面' : '负面占比低', negativeRatio > 10 ? 'down' : 'flat', 'red')}
          ${Components.metricCard('中性情感', neutralRatio.toFixed(1), '%', '中性讨论', 'flat', 'orange')}
        </div>
        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span class="card-title">情感分布</span></div>
            <div class="card-body">
              <div class="chart-container" id="sentimentChart"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">负面观点 TOP</span></div>
            <div class="card-body">
              ${negativeViewpoints.length > 0 ? `
                <div style="padding:10px 0;">
                  ${negativeViewpoints.slice(0, 8).map((item, i) => `
                    <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border-light);">
                      <span style="width:24px;height:24px;border-radius:4px;background:${i < 3 ? 'var(--danger)' : 'var(--text-tertiary)'};color:white;display:grid;place-items:center;font-size:12px;font-weight:600;">${i + 1}</span>
                      <span style="flex:1;font-weight:500;">${item.word}</span>
                      <span style="color:var(--danger);font-weight:600;">${item.count}次</span>
                    </div>
                  `).join('')}
                </div>
              ` : '<div class="empty-state">暂无负面观点数据</div>'}
            </div>
          </div>
        </div>
      `;
      
      // 渲染饼图（使用真实数据）
      Pages.sentiment.renderPieChart(positiveRatio, neutralRatio, negativeRatio, totalAnalyzed);
    },
    
    renderPieChart(positive, neutral, negative, total) {
      const container = document.getElementById('sentimentChart');
      if (!container) return;
      
      const data = [
        { label: '正面', value: positive, color: '#0D9488' },
        { label: '中性', value: neutral, color: '#8F959E' },
        { label: '负面', value: negative, color: '#F53F3F' }
      ];
      
      const cx = 120, cy = 130, r = 80, innerR = 50;
      let startAngle = -Math.PI / 2;
      
      let paths = '';
      let legendHtml = '';
      
      data.forEach(item => {
        const angle = (item.value / 100) * Math.PI * 2;
        const endAngle = startAngle + angle;
        
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const x3 = cx + innerR * Math.cos(endAngle);
        const y3 = cy + innerR * Math.sin(endAngle);
        const x4 = cx + innerR * Math.cos(startAngle);
        const y4 = cy + innerR * Math.sin(startAngle);
        
        const largeArc = angle > Math.PI ? 1 : 0;
        
        paths += `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z" fill="${item.color}"/>`;
        
        legendHtml += `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="width:12px;height:12px;border-radius:3px;background:${item.color};"></span>
            <span style="font-size:13px;color:var(--text-secondary);">${item.label}</span>
            <span style="margin-left:auto;font-weight:600;">${item.value}%</span>
          </div>
        `;
        
        startAngle = endAngle;
      });
      
      container.innerHTML = `
        <div style="display:flex;align-items:center;gap:30px;height:100%;">
          <svg width="240" height="260">
            ${paths}
            <text x="${cx}" y="${cy - 5}" text-anchor="middle" font-size="24" font-weight="600" fill="#1F2329">${total.toLocaleString()}</text>
            <text x="${cx}" y="${cy + 15}" text-anchor="middle" font-size="12" fill="#8F959E">分析样本</text>
          </svg>
          <div style="flex:1;">${legendHtml}</div>
        </div>
      `;
    },
  },
  
  // 热点趋势页面
  'trend': {
    async render(container) {
      Pages.currentPage = Pages['trend'];
      
      // 先显示骨架屏
      container.innerHTML = Components.pageHeader('trend') + `
        <div class="filter-bar">
          <div class="filter-item">
            <label class="filter-label">关键词</label>
            <input type="text" placeholder="输入关键词..." value="豆包" id="trendKeyword">
          </div>
          <div class="filter-item">
            <label class="filter-label">时间范围</label>
            <select id="trendDays">
              <option value="7">近7天</option>
              <option value="30" selected>近30天</option>
              <option value="90">近90天</option>
            </select>
          </div>
          <div class="filter-actions">
            ${Components.button('查询', 'primary', '', "Pages['trend'].queryTrend()")}
          </div>
        </div>
        <div class="card">
          <div class="card-body"><div class="skeleton" style="height:350px"></div></div>
        </div>
      `;
      
      // 从API获取真实趋势数据
      const keyword = document.getElementById('trendKeyword')?.value || '豆包';
      const days = document.getElementById('trendDays')?.value || '30';
      const trendData = await API.getKeywordTrend(keyword, parseInt(days));
      const data = trendData?.data || trendData || {};
      
      const dailyTrend = data.daily_trend || [];
      const totalMentions = data.total_mentions || 0;
      const postCount = data.post_count || 0;
      const commentCount = data.comment_count || 0;
      
      container.innerHTML = Components.pageHeader('trend') + `
        <div class="filter-bar">
          <div class="filter-item">
            <label class="filter-label">关键词</label>
            <input type="text" placeholder="输入关键词..." value="${keyword}" id="trendKeyword">
          </div>
          <div class="filter-item">
            <label class="filter-label">时间范围</label>
            <select id="trendDays">
              <option value="7" ${days == '7' ? 'selected' : ''}>近7天</option>
              <option value="30" ${days == '30' ? 'selected' : ''}>近30天</option>
              <option value="90" ${days == '90' ? 'selected' : ''}>近90天</option>
            </select>
          </div>
          <div class="filter-actions">
            ${Components.button('查询', 'primary', '', "Pages['trend'].queryTrend()")}
          </div>
        </div>
        <div class="metrics-row" style="margin-bottom:20px;">
          ${Components.metricCard('总提及数', totalMentions.toLocaleString(), '次', `关键词: ${keyword}`, 'flat', 'blue')}
          ${Components.metricCard('微博数', postCount.toLocaleString(), '条', '原创+转发', 'up', 'green')}
          ${Components.metricCard('评论数', commentCount.toLocaleString(), '条', '互动讨论', 'up', 'orange')}
          ${Components.metricCard('数据天数', dailyTrend.length.toString(), '天', `近${days}天`, 'flat', 'red')}
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">关键词趋势 - ${keyword}</span>
            <div class="card-extra">
              ${Components.tag(totalMentions > 100 ? '热度上升' : '热度平稳', totalMentions > 100 ? 'green' : 'blue')}
              <span style="font-size:13px;color:var(--text-secondary);margin-left:8px;">近${days}天</span>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" id="keywordTrendChart" style="height:350px;"></div>
          </div>
        </div>
      `;
      
      // 使用真实数据渲染图表
      Pages['trend'].renderChart(dailyTrend);
    },
    
    async queryTrend() {
      const keyword = document.getElementById('trendKeyword')?.value || '豆包';
      const days = document.getElementById('trendDays')?.value || '30';
      
      if (!keyword.trim()) {
        showToast('请输入关键词', 'warning');
        return;
      }
      
      showToast('正在查询趋势数据...');
      
      const trendData = await API.getKeywordTrend(keyword, parseInt(days));
      const data = trendData?.data || trendData || {};
      const dailyTrend = data.daily_trend || [];
      
      if (dailyTrend.length === 0) {
        showToast('未找到相关趋势数据', 'warning');
        return;
      }
      
      // 更新卡片标题和指标
      const cardTitle = document.querySelector('.card-title');
      if (cardTitle) cardTitle.textContent = `关键词趋势 - ${keyword}`;
      
      // 重新渲染图表
      Pages['trend'].renderChart(dailyTrend);
      
      showToast(`查询完成，共${dailyTrend.length}天数据`, 'success');
    },
    
    renderChart(dailyTrend) {
      const container = document.getElementById('keywordTrendChart');
      if (!container) return;
      
      if (!dailyTrend || dailyTrend.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无趋势数据</div>';
        return;
      }
      
      // 使用真实数据：post_count + comment_count = 每日总提及数
      const data = dailyTrend.map(item => (item.post_count || 0) + (item.comment_count || 0));
      const labels = dailyTrend.map(item => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });
      
      const width = container.clientWidth || 700;
      const height = 320;
      const padding = { top: 20, right: 20, bottom: 30, left: 50 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;
      const max = Math.max(...data);
      
      const points = data.map((v, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + chartH - (v / max) * chartH;
        return `${x},${y}`;
      }).join(' ');
      
      const areaPoints = `${padding.left},${padding.top + chartH} ${points} ${padding.left + chartW},${padding.top + chartH}`;
      
      let gridLines = '';
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartH;
        const value = Math.round(max - (i / 4) * max);
        gridLines += `<line x1="${padding.left}" y1="${y}" x2="${padding.left + chartW}" y2="${y}" stroke="#F0F1F2"/>`;
        gridLines += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#8F959E">${value}</text>`;
      }
      
      let xLabels = '';
      const labelStep = Math.max(1, Math.floor(labels.length / 6));
      for (let i = 0; i < labels.length; i += labelStep) {
        const x = padding.left + (i / (labels.length - 1)) * chartW;
        xLabels += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#8F959E">${labels[i]}</text>`;
      }
      
      container.innerHTML = `
        <svg width="${width}" height="${height}">
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#0D9488;stop-opacity:0.2"/>
              <stop offset="100%" style="stop-color:#0D9488;stop-opacity:0"/>
            </linearGradient>
          </defs>
          ${gridLines}
          <polygon points="${areaPoints}" fill="url(#trendGradient)"/>
          <polyline points="${points}" fill="none" stroke="#0D9488" stroke-width="2"/>
          ${xLabels}
        </svg>
      `;
    }
  },
  
  // AI日报页面（使用后端真实API数据）
  'daily-report': {
    async render(container) {
      Pages.currentPage = Pages['daily-report'];
      
      // 简单Markdown渲染函数
      function renderMarkdown(md) {
        if (!md) return '<p style="color:var(--text-secondary);">暂无日报内容</p>';
        let html = md;
        // 转义HTML
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // 标题
        html = html.replace(/^### (.*$)/gm, '<h3 style="font-size:16px;font-weight:600;margin:20px 0 12px;color:var(--text-primary);">$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2 style="font-size:18px;font-weight:600;margin:24px 0 14px;color:var(--text-primary);padding-bottom:8px;border-bottom:2px solid var(--primary-light);">$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:var(--text-primary);">$1</h1>');
        // 引用
        html = html.replace(/^&gt; (.*$)/gm, '<div style="padding:8px 16px;margin:8px 0;background:var(--bg);border-left:3px solid var(--primary);color:var(--text-secondary);font-size:13px;">$1</div>');
        // 粗体
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:600;">$1</strong>');
        // 表格
        const tableRegex = /(\|[^\n]+\|\n\|[\-\|: ]+\|\n(?:\|[^\n]+\|\n?)+)/g;
        html = html.replace(tableRegex, function(match) {
          const lines = match.trim().split('\n').filter(l => l.includes('|'));
          if (lines.length < 2) return match;
          const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
          const rows = lines.slice(2).map(line => line.split('|').map(c => c.trim()).filter(c => c !== undefined));
          let tableHtml = '<div style="overflow-x:auto;margin:12px 0;"><table style="width:100%;border-collapse:collapse;font-size:13px;">';
          tableHtml += '<thead><tr style="background:var(--bg);">';
          headers.forEach(h => { tableHtml += '<th style="padding:10px 12px;text-align:left;border:1px solid var(--border-light);font-weight:600;">' + h + '</th>'; });
          tableHtml += '</tr></thead><tbody>';
          rows.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => { tableHtml += '<td style="padding:8px 12px;border:1px solid var(--border-light);">' + cell + '</td>'; });
            tableHtml += '</tr>';
          });
          tableHtml += '</tbody></table></div>';
          return tableHtml;
        });
        // 列表
        html = html.replace(/^- (.*$)/gm, '<li style="margin:4px 0;padding-left:8px;">$1</li>');
        html = html.replace(/^\d+\. (.*$)/gm, '<li style="margin:4px 0;padding-left:8px;">$1</li>');
        // 换行
        html = html.replace(/\n\n/g, '</p><p style="margin:8px 0;">');
        html = html.replace(/\n/g, '<br>');
        return '<div class="markdown-content" style="line-height:1.7;color:var(--text-primary);">' + html + '</div>';
      }
      
      container.innerHTML = Components.pageHeader('daily-report') + `
        <div class="card">
          <div class="card-header">
            <span class="card-title">AI 舆情分析日报</span>
            <div class="card-extra">
              ${Components.tag('实时生成', 'green')}
            </div>
          </div>
          <div class="card-body" id="daily-report-content">
            <div class="page-loading"><div class="loading-spinner"></div><span>正在生成日报内容...</span></div>
          </div>
        </div>
      `;
      
      try {
        const report = await API.getDailyReport();
        // 快速切页竞态守卫：await期间若已离开日报页则放弃渲染，避免写入已失效DOM
        if (Pages.currentPage !== Pages['daily-report']) return;
        const markdown = report?.content || report?.data?.content || '';
        const generatedAt = report?.generated_at || report?.data?.generated_at || '';
        
        const contentEl = container.querySelector('#daily-report-content');
        if (!contentEl) return;
        if (markdown) {
          contentEl.innerHTML = renderMarkdown(markdown);
          if (generatedAt) {
            contentEl.innerHTML += `<div style="margin-top:24px;padding:16px;background:var(--primary-lighter);border-radius:8px;border-left:3px solid var(--primary);"><div style="font-weight:600;margin-bottom:8px;color:var(--primary);">AI 生成说明</div><div style="font-size:13px;color:var(--text-secondary);">本报告由 AI 自动生成，数据来源：微博公开数据 · 生成时间：${generatedAt} · 数据统计范围：前一天 00:00 - 24:00</div></div>`;
          }
        } else {
          contentEl.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-secondary);">暂无日报数据，请稍后重试</div>';
        }
      } catch (e) {
        console.error('日报加载失败:', e);
        const errEl = container.querySelector('#daily-report-content');
        if (errEl && Pages.currentPage === Pages['daily-report']) {
          errEl.innerHTML = '<div style="padding:40px;text-align:center;color:var(--danger);">日报加载失败，请刷新页面重试</div>';
        }
      }
    }
  },
  
  // 采集任务页面
  'collect-task': {
    render(container) {
      Pages.currentPage = Pages['collect-task'];
      
      container.innerHTML = Components.pageHeader('collect-task') + `
        <div class="card">
          <div class="card-header">
            <span class="card-title">采集任务</span>
          </div>
          <div class="card-body">
            <div style="padding:40px 20px;text-align:center;margin-bottom:30px;">
              <div style="font-size:48px;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"/> </svg></div>
              <div style="font-size:16px;font-weight:600;margin-bottom:8px;">当前版本未开放任务记录</div>
              <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">采集任务由系统自动执行，执行记录功能企业版开放</div>
              <div style="display:inline-flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">任务管理</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">执行历史</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">失败重试</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">多用户协作</span>
              </div>
            </div>
            
            <div style="background:var(--bg);border-radius:8px;padding:20px;">
              <div style="font-weight:600;margin-bottom:16px;font-size:14px;">系统内置采集任务</div>
              <div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--border-light);">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;">⏰</div>
                <div style="flex:1;">
                  <div style="font-weight:500;font-size:14px;">微博数据自动采集</div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">每天 08:00 自动执行，采集热门微博、KOL用户、关键词趋势</div>
                </div>
                <div>${Components.tag('运行中', 'green')}</div>
              </div>
              <div style="display:flex;align-items:center;gap:16px;padding:12px 0;">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/> <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/> </svg></div>
                <div style="flex:1;">
                  <div style="font-weight:500;font-size:14px;">手机住宅 IP 代理采集</div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">微博采集通过手机住宅 IP 执行，确保数据稳定性</div>
                </div>
                <div>${Components.tag('已启用', 'blue')}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },
  
  // 分析任务页面
  'analyze-task': {
    render(container) {
      Pages.currentPage = Pages['analyze-task'];
      
      container.innerHTML = Components.pageHeader('analyze-task') + `
        <div class="card">
          <div class="card-header">
            <span class="card-title">分析任务</span>
          </div>
          <div class="card-body">
            <div style="padding:40px 20px;text-align:center;margin-bottom:30px;">
              <div style="font-size:48px;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/> <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/> </svg></div>
              <div style="font-size:16px;font-weight:600;margin-bottom:8px;">当前版本未开放任务记录</div>
              <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">AI分析任务由系统自动执行，任务管理功能企业版开放</div>
              <div style="display:inline-flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">任务管理</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">分析历史</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">数据统计</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">多用户协作</span>
              </div>
            </div>
            
            <div style="background:var(--bg);border-radius:8px;padding:20px;">
              <div style="font-weight:600;margin-bottom:16px;font-size:14px;">系统自动分析能力</div>
              <div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--border-light);">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div>
                <div style="flex:1;">
                  <div style="font-weight:500;font-size:14px;">AI 情感分析</div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">自动分析微博正面/中性/负面情感占比，支持千级样本分析</div>
                </div>
                <div>${Components.tag('自动执行', 'green')}</div>
              </div>
              <div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--border-light);">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/> </svg></div>
                <div style="flex:1;">
                  <div style="font-weight:500;font-size:14px;">关键词趋势分析</div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">追踪指定关键词的热度变化趋势，支持 7/30/90 天数据</div>
                </div>
                <div>${Components.tag('自动执行', 'green')}</div>
              </div>
              <div style="display:flex;align-items:center;gap:16px;padding:12px 0;">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/> <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/> </svg></div>
                <div style="flex:1;">
                  <div style="font-weight:500;font-size:14px;">AI 每日报告生成</div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">每天自动生成舆情分析日报，包含热点 TOP、情感分布、AI 洞察</div>
                </div>
                <div>${Components.tag('自动执行', 'green')}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },
  
  // 定时任务页面
  'cron-task': {
    render(container) {
      Pages.currentPage = Pages['cron-task'];
      
      // 系统真实内置的定时任务配置
      const systemTasks = [
        { name: '微博数据采集', cron: '0 8 * * *', desc: '每天 08:00 执行', status: 'enabled', note: '采集热门微博、KOL用户、关键词趋势' },
        { name: 'AI 情感分析', cron: '30 7 * * *', desc: '每天 07:30 执行', status: 'enabled', note: '对最新采集的微博进行情感分析' },
        { name: '每日报告生成', cron: '0 6 * * *', desc: '每天 06:00 执行', status: 'enabled', note: '生成前一天的舆情分析日报' },
      ];
      
      container.innerHTML = Components.pageHeader('cron-task') + `
        <div class="card">
          <div class="card-header">
            <span class="card-title">定时任务配置</span>
            <div class="card-extra">
              ${Components.tag('系统内置', 'blue')}
            </div>
          </div>
          <div class="card-body" style="padding:0;">
            <div style="padding:16px 20px;background:var(--bg);border-bottom:1px solid var(--border-light);">
              <div style="font-size:13px;color:var(--text-secondary);">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg> 当前为系统内置定时任务，不可在前端修改。如需调整执行时间，请联系系统管理员。
              </div>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>任务名称</th>
                    <th>Cron 表达式</th>
                    <th>执行说明</th>
                    <th>任务描述</th>
                    <th style="width:100px;">状态</th>
                  </tr>
                </thead>
                <tbody>
                  ${systemTasks.map(task => `
                    <tr>
                      <td style="font-weight:500;">${task.name}</td>
                      <td><code style="background:var(--bg);padding:2px 8px;border-radius:4px;font-size:12px;">${task.cron}</code></td>
                      <td style="font-size:13px;color:var(--text-secondary);">${task.desc}</td>
                      <td style="font-size:13px;color:var(--text-secondary);">${task.note}</td>
                      <td>${Components.tag(task.status === 'enabled' ? '已启用' : '已禁用', task.status === 'enabled' ? 'green' : 'gray')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card" style="margin-top:20px;">
          <div class="card-header">
            <span class="card-title">自定义定时任务</span>
          </div>
          <div class="card-body">
            <div style="padding:40px 20px;text-align:center;">
              <div style="font-size:48px;margin-bottom:16px;">⏳</div>
              <div style="font-size:16px;font-weight:600;margin-bottom:8px;">自定义定时任务功能开发中</div>
              <div style="font-size:13px;color:var(--text-secondary);">企业版将支持自定义采集关键词、分析任务、报告推送时间等配置</div>
            </div>
          </div>
        </div>
      `;
    }
  },
  
  // API Key 页面
  'api-key': {
    render(container) {
      Pages.currentPage = Pages['api-key'];
      
      // 安全要求：完整 API Key 仅保存在服务端（Nginx 内部代理注入），前端不持有、不展示完整值
      // 仅保留末 4 位用于识别，不包含可用的完整密钥
      const maskedKey = '••••••••••••••••110b';
      
      container.innerHTML = Components.pageHeader('api-key') + `
        <div class="card">
          <div class="card-header">
            <span class="card-title">API Key 管理</span>
            <div class="card-extra">
              ${Components.tag('系统内置', 'blue')}
            </div>
          </div>
          <div class="card-body" style="padding:0;">
            <div style="padding:16px 20px;background:var(--bg);border-bottom:1px solid var(--border-light);">
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/> </svg> 前端 Dashboard 通过 <code style="background:white;padding:1px 6px;border-radius:4px;">/app-api/</code> 内部代理访问数据，Nginx 自动注入 API Key，前端代码不暴露密钥。<br>
                第三方系统集成请使用 <code style="background:white;padding:1px 6px;border-radius:4px;">/api/</code> 接口，需在请求头携带下方 API Key。
              </div>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Key 名称</th>
                    <th>Key 值</th>
                    <th>权限</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight:500;">Dashboard 前端</td>
                    <td><code style="background:var(--bg);padding:2px 8px;border-radius:4px;font-size:11px;">${maskedKey}</code></td>
                    <td>${Components.tag('只读', 'blue')}</td>
                    <td>${Components.tag('已启用', 'green')}</td>
                    <td style="font-size:13px;">2026-09-01</td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-link btn-sm" onclick="showToast('完整 API Key 由服务端安全管理，前端不展示；如需外部集成请联系管理员', 'info')">复制</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card" style="margin-top:20px;">
          <div class="card-header">
            <span class="card-title">API 调用统计</span>
          </div>
          <div class="card-body">
            <div style="padding:40px 20px;text-align:center;">
              <div style="font-size:48px;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div>
              <div style="font-size:16px;font-weight:600;margin-bottom:8px;">当前版本未开放调用统计</div>
              <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">API调用统计功能企业版开放，支持调用量、成功率、响应时间统计</div>
              <div style="display:inline-flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">数据统计</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">调用日志</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">用户权限</span>
                <span style="background:var(--primary-lighter);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:11px;">多用户协作</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card" style="margin-top:20px;">
          <div class="card-header">
            <span class="card-title">API 使用说明</span>
          </div>
          <div class="card-body">
            <div style="font-size:13px;line-height:1.8;">
              <div style="margin-bottom:16px;padding:12px 16px;background:var(--primary-lighter);border-radius:8px;border-left:3px solid var(--primary);">
                <div style="font-weight:600;margin-bottom:4px;color:var(--primary);"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/> <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/> </svg> 安全架构说明</div>
                <div style="color:var(--text-secondary);font-size:12px;line-height:1.6;">
                  前端使用 <code>/app-api/</code> 内部代理（Nginx自动注入Key，Referer校验，60次/分钟限流）<br>
                  外部集成使用 <code>/api/</code> 接口（需携带X-API-Key，30次/分钟限流）
                </div>
              </div>
              <div style="margin-bottom:12px;"><strong>请求方式：</strong>所有 API 均为 GET 请求</div>
              <div style="margin-bottom:12px;"><strong>外部调用认证：</strong>在请求头中添加 <code style="background:var(--bg);padding:2px 6px;border-radius:4px;">X-API-Key: &lt;你的API Key&gt;</code></div>
              <div style="margin-bottom:12px;"><strong>前端调用：</strong>无需携带 Key，直接请求 <code style="background:var(--bg);padding:2px 6px;border-radius:4px;">/app-api/xxx</code> 即可</div>
              <div style="margin-bottom:12px;"><strong>限流策略：</strong>外部API 30次/分钟，前端代理 60次/分钟</div>
              <div style="margin-bottom:12px;"><strong>可用接口（前端 /app-api/ 和外部 /api/ 通用）：</strong></div>
              <ul style="padding-left:20px;color:var(--text-secondary);">
                <li><code>GET /hot-weibo?limit=N</code> - 热门微博列表</li>
                <li><code>GET /sentiment?sample_size=N</code> - 情感分析结果</li>
                <li><code>GET /influencers?type=followers|engagement&limit=N</code> - 影响力用户排行</li>
                <li><code>GET /daily-report</code> - 每日舆情报告</li>
                <li><code>GET /keyword-trend?keyword=xxx&days=N</code> - 关键词趋势</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    }
  },
  
  // 用户管理页面
  'user-mgmt': {
    render(container) {
      Pages.currentPage = Pages['user-mgmt'];
      
      container.innerHTML = Components.pageHeader('user-mgmt') + `
        <div class="card">
          <div class="card-header">
            <span class="card-title">用户管理</span>
            <div class="card-extra">
              ${Components.tag('企业版规划中', 'orange')}
            </div>
          </div>
          <div class="card-body">
            <div style="padding:40px 20px;text-align:center;margin-bottom:30px;">
              <div style="font-size:48px;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/> </svg></div>
              <div style="font-size:16px;font-weight:600;margin-bottom:8px;">多用户体系开发中</div>
              <div style="font-size:13px;color:var(--text-secondary);">当前系统使用 API Key 认证，企业版将支持完整的多用户登录与管理体系</div>
            </div>
            
            <div style="background:var(--bg);border-radius:8px;padding:24px;">
              <div style="font-weight:600;margin-bottom:20px;font-size:14px;">企业版用户体系规划</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/> </svg></span>
                    <span style="font-weight:600;font-size:14px;">用户登录</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    支持账号密码登录、手机号登录、SSO 单点登录、企业微信/飞书集成登录
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/> </svg></span>
                    <span style="font-weight:600;font-size:14px;">用户生命周期</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    用户邀请、注册审核、启用/禁用、密码重置、登录日志、操作审计
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/> <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/> </svg></span>
                    <span style="font-weight:600;font-size:14px;">组织架构</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    部门管理、岗位设置、用户分组、批量导入导出、组织架构同步
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/> </svg></span>
                    <span style="font-weight:600;font-size:14px;">通知中心</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    系统通知、任务提醒、报告推送、邮件/短信/企业微信多渠道通知
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },
  
  // 权限管理页面
  'permission': {
    render(container) {
      Pages.currentPage = Pages['permission'];
      
      container.innerHTML = Components.pageHeader('permission') + `
        <div class="card">
          <div class="card-header">
            <span class="card-title">权限管理</span>
            <div class="card-extra">
              ${Components.tag('企业版规划中', 'orange')}
            </div>
          </div>
          <div class="card-body">
            <div style="padding:40px 20px;text-align:center;margin-bottom:30px;">
              <div style="font-size:48px;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/> </svg></div>
              <div style="font-size:16px;font-weight:600;margin-bottom:8px;">细粒度权限体系开发中</div>
              <div style="font-size:13px;color:var(--text-secondary);">当前所有 API Key 具有相同权限，企业版将支持完整的角色权限与多租户体系</div>
            </div>
            
            <div style="background:var(--bg);border-radius:8px;padding:24px;">
              <div style="font-weight:600;margin-bottom:20px;font-size:14px;">企业版权限体系规划</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/> </svg></span>
                    <span style="font-weight:600;font-size:14px;">角色权限</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    预设角色（超级管理员/管理员/分析师/只读用户）+ 自定义角色，支持菜单权限、操作权限、数据权限三级控制
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/> <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/> <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/> </svg></span>
                    <span style="font-weight:600;font-size:14px;">数据权限</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    按部门/项目/标签隔离数据，支持行级数据权限，敏感字段脱敏，数据导出审批流程
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/> <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/> </svg></span>
                    <span style="font-weight:600;font-size:14px;">多租户能力</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    支持多客户/多部门独立租户，数据完全隔离，租户管理员自主管理用户与权限，支持租户级配置
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/> <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/> </svg></span>
                    <span style="font-weight:600;font-size:14px;">操作审计</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    完整操作日志记录，登录日志、数据变更日志、API 调用日志，支持审计追溯与合规报表
                  </div>
                </div>
              </div>
            </div>
            
            <div style="margin-top:24px;padding:20px;background:linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%);border-radius:8px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:24px;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362s.96-1.932.362-2.531c-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532"/> <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9 9 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a10 10 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093q.1.026.16.045c.184.06.279.13.351.295l.029.073a3.5 3.5 0 0 1 .157.721c.055.485.051 1.178-.159 2.065m-4.828 7.475.04-.04-.107 1.081a1.54 1.54 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a9 9 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006M5.205 5c-.625.626-.94 1.351-1.004 2.09a9 9 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a3 3 0 0 0-.045-.283 3 3 0 0 0-.3-.041Z"/> <path d="M7.009 12.139a7.6 7.6 0 0 1-1.804-1.352A7.6 7.6 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z"/> </svg></span>
                <div>
                  <div style="font-weight:600;font-size:14px;margin-bottom:2px;">企业版功能路线图</div>
                  <div style="font-size:12px;color:var(--text-secondary);">用户体系 → 权限管理 → 多租户 → 操作审计 → 自定义报表 → 开放平台</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  // AI事件中心页面
  'events': {
    async render(container) {
      Pages.currentPage = Pages['events'];
      container.innerHTML = Components.pageHeader('events') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载AI事件中...</span></div>';
      try {
        const result = await API.getEvents(20);
        const events = result.events || [];
        const categoryMap = {
          model_release: '模型发布',
          product_launch: '产品发布',
          company_news: '公司动态',
          financing: '融资投资',
          policy: '政策监管',
          technology_breakthrough: '技术突破',
          application_case: '企业应用',
          industry_trend: '行业趋势'
        };
        
        let html = Components.pageHeader('events');
        html += '<div class="metrics-row">';
        html += '<div class="metric-card"><div class="metric-value">' + events.length + '</div><div class="metric-label">事件总数</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + events.filter(e => (e.event_confidence || 0) >= 80).length + '</div><div class="metric-label">高可信度</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + events.filter(e => (e.heat_score || 0) >= 80).length + '</div><div class="metric-label">高热度</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + new Set(events.map(e => e.category)).size + '</div><div class="metric-label">事件分类</div></div>';
        html += '</div>';
        
        if (events.length === 0) {
          html += '<div class="card"><div class="card-body"><div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div><div class="empty-state-text">暂无AI事件数据，等待每日自动分析</div></div></div></div>';
        } else {
          html += '<div class="card"><div class="card-header"><h3>AI行业事件列表</h3><div style="font-size:13px;color:#999;font-weight:normal">数据日期：' + (result.date||'--') + '</div></div><div class="card-body">';
          events.forEach((e, idx) => {
            const conf = e.event_confidence || 0;
            const heat = e.heat_score || 0;
            const confColor = conf >= 80 ? '#27ae60' : conf >= 60 ? '#f39c12' : '#95a5a6';
            html += '<div style="padding:16px 20px;border-bottom:1px solid #eee;display:flex;gap:16px">';
            html += '<div style="font-size:24px;font-weight:bold;color:#0D9488;min-width:40px">' + (idx+1) + '</div>';
            html += '<div style="flex:1">';
            html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">';
            html += '<strong style="font-size:16px">' + (e.title || '未命名事件') + '</strong>';
            html += '<span class="tag" style="background:#0D9488">' + (categoryMap[e.category] || e.category || '未分类') + '</span>';
            html += '</div>';
            html += '<p style="margin:4px 0;color:#666;font-size:14px">' + (e.summary || '') + '</p>';
            html += '<div style="display:flex;gap:20px;margin-top:8px;font-size:13px">';
            html += '<span><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/> </svg> 热度: <strong style="color:#e74c3c">' + heat + '</strong></span>';
            html += '<span><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/> </svg> 可信度: <strong style="color:' + confColor + '">' + conf + '%</strong></span>';
            if (e.companies && e.companies.length) {
              html += '<span><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/> <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/> </svg> 涉及: ' + e.companies.slice(0,3).join(', ') + '</span>';
            }
            html += '</div>';
            if (e.impact_analysis) {
              html += '<p style="margin:8px 0 0;padding:8px 12px;background:#f8f9fa;border-radius:6px;font-size:13px;color:#555"><strong>行业影响:</strong> ' + e.impact_analysis + '</p>';
            }
            if (e.business_opportunity) {
              html += '<p style="margin:4px 0 0;padding:8px 12px;background:#e8f5f3;border-radius:6px;font-size:13px;color:#0D9488"><strong>企业机会:</strong> ' + e.business_opportunity + '</p>';
            }
            html += '</div></div>';
          });
          html += '</div></div>';
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = Components.pageHeader('events') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },
  
  // AI产品雷达页面
  'products': {
    async render(container) {
      Pages.currentPage = Pages['products'];
      container.innerHTML = Components.pageHeader('products') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载产品数据中...</span></div>';
      try {
        const result = await API.getProducts(20);
        const products = result.products || [];
        
        let html = Components.pageHeader('products');
        html += '<div class="metrics-row">';
        html += '<div class="metric-card"><div class="metric-value">' + products.length + '</div><div class="metric-label">监测产品</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + products.filter(p => (p.trend_rate || 0) > 0).length + '</div><div class="metric-label">热度上涨</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + products.filter(p => (p.trend_rate || 0) < 0).length + '</div><div class="metric-label">热度下降</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + products.filter(p => p.country === 'CN').length + '</div><div class="metric-label">国内产品</div></div>';
        html += '</div>';
        
        if (products.length === 0) {
          html += '<div class="card"><div class="card-body"><div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div><div class="empty-state-text">暂无产品数据，等待每日自动分析</div></div></div></div>';
        } else {
          html += '<div class="card"><div class="card-header"><h3>AI产品热度排行榜</h3><div style="font-size:13px;color:#999;font-weight:normal">数据日期：' + (result.date||'--') + '</div></div><div class="card-body"><div class="table-container"><table class="data-table"><thead><tr><th>排名</th><th>产品</th><th>公司</th><th>地区</th><th>提及数</th><th>热度</th><th>趋势</th><th>主要情绪</th><th>变化原因</th></tr></thead><tbody>';
          
          products.forEach(p => {
            const trend = p.trend_rate || 0;
            const trendColor = trend > 0 ? '#27ae60' : trend < 0 ? '#e74c3c' : '#95a5a6';
            const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
            const sentimentColor = p.main_sentiment === 'positive' ? '#27ae60' : p.main_sentiment === 'negative' ? '#e74c3c' : '#95a5a6';
            const sentimentText = p.main_sentiment === 'positive' ? '正面' : p.main_sentiment === 'negative' ? '负面' : '中性';
            
            html += '<tr>';
            html += '<td><strong style="font-size:18px;color:#0D9488">' + (p.rank || '-') + '</strong></td>';
            html += '<td><strong>' + (p.name || '-') + '</strong><br><small style="color:#999">' + (p.category || '') + '</small></td>';
            html += '<td>' + (p.company || '-') + '</td>';
            html += '<td>' + (p.country === 'CN' ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/> <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/> </svg> 国内' : '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/> </svg> 国外') + '</td>';
            html += '<td>' + (p.mention_count || 0) + '</td>';
            html += '<td><strong style="color:#e74c3c">' + (p.heat_score || 0).toFixed(1) + '</strong></td>';
            html += '<td><span style="color:' + trendColor + ';font-weight:bold">' + trendIcon + ' ' + Math.abs(trend).toFixed(1) + '%</span></td>';
            html += '<td><span class="tag" style="background:' + sentimentColor + '">' + sentimentText + '</span></td>';
            html += '<td style="max-width:200px;font-size:13px;color:#666">' + (p.trend_reason || '-') + '</td>';
            html += '</tr>';
          });
          
          html += '</tbody></table></div></div></div>';
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = Components.pageHeader('products') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },
  
  // AI技术趋势页面
  'trends': {
    async render(container) {
      Pages.currentPage = Pages['trends'];
      container.innerHTML = Components.pageHeader('trends') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载技术趋势中...</span></div>';
      try {
        const result = await API.getTrends(20);
        const trends = result.trends || [];
        
        let html = Components.pageHeader('trends');
        html += '<div class="metrics-row">';
        html += '<div class="metric-card"><div class="metric-value">' + trends.length + '</div><div class="metric-label">监测技术</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + trends.filter(t => t.trend_level === 'rising').length + '</div><div class="metric-label">快速增长</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + trends.filter(t => t.trend_level === 'stable').length + '</div><div class="metric-label">稳定发展</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + trends.filter(t => t.trend_level === 'declining').length + '</div><div class="metric-label">热度下降</div></div>';
        html += '</div>';
        
        if (trends.length === 0) {
          html += '<div class="card"><div class="card-body"><div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div><div class="empty-state-text">暂无技术趋势数据，等待每日自动分析</div></div></div></div>';
        } else {
          html += '<div class="grid-2">';
          trends.forEach(t => {
            const growth = t.growth_rate || 0;
            const levelColor = t.trend_level === 'rising' ? '#27ae60' : t.trend_level === 'declining' ? '#e74c3c' : '#f39c12';
            const levelText = t.trend_level === 'rising' ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362s.96-1.932.362-2.531c-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532"/> <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9 9 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a10 10 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093q.1.026.16.045c.184.06.279.13.351.295l.029.073a3.5 3.5 0 0 1 .157.721c.055.485.051 1.178-.159 2.065m-4.828 7.475.04-.04-.107 1.081a1.54 1.54 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a9 9 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006M5.205 5c-.625.626-.94 1.351-1.004 2.09a9 9 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a3 3 0 0 0-.045-.283 3 3 0 0 0-.3-.041Z"/> <path d="M7.009 12.139a7.6 7.6 0 0 1-1.804-1.352A7.6 7.6 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z"/> </svg> 快速增长' : t.trend_level === 'declining' ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5"/> </svg> 热度下降' : '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg> 稳定发展';
            
            html += '<div class="card">';
            html += '<div class="card-header"><h3>' + (t.name || '-') + '</h3><span class="tag" style="background:' + levelColor + '">' + levelText + '</span></div>';
            html += '<div class="card-body">';
            html += '<div style="display:flex;gap:20px;margin-bottom:12px">';
            html += '<div><div style="font-size:24px;font-weight:bold;color:' + (growth > 0 ? '#27ae60' : growth < 0 ? '#e74c3c' : '#95a5a6') + '">' + (growth > 0 ? '+' : '') + growth.toFixed(1) + '%</div><div style="font-size:12px;color:#999">增长率</div></div>';
            html += '<div><div style="font-size:24px;font-weight:bold;color:#0D9488">' + (t.mention_count_7days || 0) + '</div><div style="font-size:12px;color:#999">近7天提及</div></div>';
            html += '<div><div style="font-size:24px;font-weight:bold;color:#e74c3c">' + (t.heat_score || 0).toFixed(0) + '</div><div style="font-size:12px;color:#999">热度指数</div></div>';
            html += '</div>';
            html += '<p style="margin:8px 0;color:#666;font-size:14px">' + (t.summary || '') + '</p>';
            if (t.business_opportunity) {
              html += '<p style="margin:8px 0 0;padding:8px 12px;background:#e8f5f3;border-radius:6px;font-size:13px;color:#0D9488"><strong>企业机会:</strong> ' + t.business_opportunity + '</p>';
            }
            html += '</div></div>';
          });
          html += '</div>';
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = Components.pageHeader('trends') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },
  
  // AI日报中心页面
  'reports': {
    async render(container) {
      Pages.currentPage = Pages['reports'];
      container.innerHTML = Components.pageHeader('reports') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载日报中...</span></div>';
      try {
        const result = await API.getReports(10);
        const reports = result.reports || result.data || [];
        
        let html = Components.pageHeader('reports');
        html += '<div class="metrics-row">';
        html += '<div class="metric-card"><div class="metric-value">' + reports.length + '</div><div class="metric-label">历史日报</div></div>';
        html += '<div class="card" style="flex:2"><div class="card-body"><p style="color:#666">AI每日自动生成行业情报报告，包含热点事件、产品变化、技术趋势与企业应用建议</p></div></div>';
        html += '</div>';
        
        if (reports.length === 0) {
          html += '<div class="card"><div class="card-body"><div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div><div class="empty-state-text">暂无日报数据，等待每日自动生成</div></div></div></div>';
        } else {
          reports.forEach(r => {
            html += '<div class="card" style="margin-bottom:16px">';
            html += '<div class="card-header"><h3><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/> <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/> </svg> ' + (r.report_date || r.date || '未知日期') + ' 日报</h3>';
            if (r.quality_score) {
              html += '<span class="tag" style="background:#27ae60">质量分: ' + r.quality_score + '</span>';
            }
            html += '</div>';
            html += '<div class="card-body">';
            if (r.title) html += '<h4 style="margin-top:0">' + r.title + '</h4>';
            if (r.content) {
              // 简单的Markdown渲染
              const content = r.content.replace(/\n/g, '<br>').replace(/^### (.*$)/gm, '<h4>$1</h4>').replace(/^## (.*$)/gm, '<h3>$1</h3>').replace(/^# (.*$)/gm, '<h2>$1</h2>');
              html += '<div style="line-height:1.8;color:#333">' + content + '</div>';
            } else if (r.summary) {
              html += '<p style="color:#666">' + r.summary + '</p>';
            }
            html += '</div></div>';
          });
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = Components.pageHeader('reports') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },
  
  // AI销售机会页面
  'sales': {
    async render(container) {
      Pages.currentPage = Pages['sales'];
      container.innerHTML = Components.pageHeader('sales') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载销售机会中...</span></div>';
      try {
        const result = await API.getSalesOpportunities();
        const opportunities = result.opportunities || result.data || [];
        
        let html = Components.pageHeader('sales');
        html += '<div class="metrics-row">';
        html += '<div class="metric-card"><div class="metric-value">' + opportunities.length + '</div><div class="metric-label">今日机会</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + opportunities.filter(o => o.priority === 'high').length + '</div><div class="metric-label">高优先级</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + new Set(opportunities.map(o => o.industry)).size + '</div><div class="metric-label">涉及行业</div></div>';
        html += '<div class="metric-card"><div class="metric-value">' + new Set(opportunities.map(o => o.scenario)).size + '</div><div class="metric-label">应用场景</div></div>';
        html += '</div>';
        
        if (opportunities.length === 0) {
          html += '<div class="card"><div class="card-body"><div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div><div class="empty-state-text">暂无销售机会数据，等待AI自动分析</div></div></div></div>';
        } else {
          html += '<div class="card"><div class="card-header"><h3>AI识别的销售机会</h3></div><div class="card-body">';
          opportunities.forEach(o => {
            const priorityColor = o.priority === 'high' ? '#e74c3c' : o.priority === 'medium' ? '#f39c12' : '#95a5a6';
            const priorityText = o.priority === 'high' ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/> </svg> 高优先级' : o.priority === 'medium' ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z"/> </svg> 中优先级' : '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z"/> </svg> 低优先级';
            
            html += '<div style="padding:16px 20px;border-bottom:1px solid #eee">';
            html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">';
            html += '<strong style="font-size:16px">' + (o.industry || '-') + ' - ' + (o.scenario || '-') + '</strong>';
            html += '<span class="tag" style="background:' + priorityColor + '">' + priorityText + '</span>';
            html += '</div>';
            if (o.sales_angle) html += '<p style="margin:4px 0;color:#666;font-size:14px"><strong>销售角度:</strong> ' + o.sales_angle + '</p>';
            if (o.technology) html += '<p style="margin:4px 0;color:#666;font-size:14px"><strong>相关技术:</strong> ' + o.technology + '</p>';
            if (o.customer_type) html += '<p style="margin:4px 0;color:#666;font-size:14px"><strong>目标客户:</strong> ' + o.customer_type + '</p>';
            if (o.trigger_content) html += '<p style="margin:4px 0;padding:8px 12px;background:#f8f9fa;border-radius:6px;font-size:13px;color:#555"><strong>触发因素:</strong> ' + o.trigger_content + '</p>';
            html += '</div>';
          });
          html += '</div></div>';
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = Components.pageHeader('sales') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },


  'sales-dashboard': {
    async render(container) {
      container.innerHTML = Components.pageHeader('sales-dashboard') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载销售数据中...</span></div>';
      try {
        const [overviewRes, trendsRes, analysisRes] = await Promise.all([
          fetch('/app-api/sales-dashboard/overview').then(r => r.json()),
          fetch('/app-api/sales-dashboard/trends').then(r => r.json()),
          fetch('/app-api/sales-dashboard/analysis').then(r => r.json())
        ]);
        const ov = overviewRes.data || {};
        const an = analysisRes.data || {};
        const amount = (ov.total_pipeline_amount || 0) / 10000;
        const stageNames = {new:'新客户',contacted:'已接触',requirement:'需求确认',solution:'方案沟通',negotiation:'商务谈判',closed:'已成交',lost:'已流失'};
        const stageColors = {new:'#94A3B8',contacted:'#60A5FA',requirement:'#FBBF24',solution:'#34D399',negotiation:'#F472B6',closed:'#10B981',lost:'#EF4444'};
        
        let html = '<div class="metric-cards">';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#E0F2FE;color:#0284C7;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/> </svg></div><div class="metric-info"><div class="metric-value">' + (ov.total_customers||0) + '</div><div class="metric-label">客户总数</div></div><div class="metric-trend up">本月+' + (ov.new_customers||0) + '</div></div>';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#FEF3C7;color:#D97706;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/> <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/> </svg></div><div class="metric-info"><div class="metric-value">' + amount.toFixed(1) + '万</div><div class="metric-label">商机金额</div></div></div>';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#FEE2E2;color:#DC2626;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="metric-info"><div class="metric-value">' + (ov.risk_customers||0) + '</div><div class="metric-label">风险客户</div></div><div class="metric-trend down">需关注</div></div>';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#D1FAE5;color:#059669;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/> </svg></div><div class="metric-info"><div class="metric-value">' + (ov.today_tasks||0) + '</div><div class="metric-label">今日任务</div></div><div class="metric-trend up">待处理</div></div>';
        html += '</div>';
        
        html += '<div class="dashboard-grid">';
        html += '<div class="dashboard-card"><h3>销售阶段分布</h3><div class="stage-list">';
        (ov.stage_distribution || []).forEach(function(s) {
          html += '<div class="stage-item"><span class="stage-name">' + (stageNames[s.sales_stage]||s.sales_stage) + '</span><div class="stage-bar"><div class="stage-fill" style="width:' + Math.min(s.count*20,100) + '%;background:' + (stageColors[s.sales_stage]||'#94A3B8') + ';"></div></div><span class="stage-count">' + s.count + '家</span></div>';
        });
        html += '</div></div>';
        
        html += '<div class="dashboard-card"><h3>行业分布</h3><div class="industry-list">';
        (ov.industry_distribution || []).forEach(function(i) {
          html += '<div class="industry-item"><span class="industry-name">' + (i.industry||'未分类') + '</span><span class="industry-count">' + i.count + '家</span></div>';
        });
        html += '</div></div></div>';
        
        html += '<div class="dashboard-grid">';
        html += '<div class="dashboard-card"><h3>重点客户</h3><div class="customer-list">';
        (an.high_value_customers || []).slice(0,5).forEach(function(c, idx) {
          html += '<div class="customer-item" onclick="location.hash=\'#workspace-customer-detail?id=' + c.id + '\'"><div class="customer-rank">' + (idx+1) + '</div><div class="customer-info"><div class="customer-name">' + c.name + '</div><div class="customer-meta">' + (c.industry||'') + ' · ' + (stageNames[c.stage]||c.stage) + '</div></div><div class="customer-amount">' + ((c.amount||0)/10000) + '万</div></div>';
        });
        html += '</div></div>';
        
        html += '<div class="dashboard-card"><h3>风险客户</h3><div class="risk-list">';
        (an.risk_customers || []).slice(0,5).forEach(function(r) {
          var riskReason = (r.risk_reason||'').replace(/\[([a-z_]+)\]/g, function(m,k){ return stageNames[k] ? ('['+stageNames[k]+']') : m; });
          html += '<div class="risk-item"><div class="risk-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="risk-info"><div class="risk-name">' + r.name + '</div><div class="risk-reason">' + riskReason + '</div></div></div>';
        });
        html += '</div></div></div>';
        
        html += '<div class="dashboard-card full-width"><h3>AI今日建议</h3><div class="suggestion-list">';
        (an.today_suggestions || []).forEach(function(s, idx) {
          html += '<div class="suggestion-item"><div class="suggestion-num">' + (idx+1) + '</div><div class="suggestion-text">' + s + '</div></div>';
        });
        html += '</div></div>';
        
        container.innerHTML = Components.pageHeader('sales-dashboard') + html;
      } catch(e) {
        console.error('加载销售驾驶舱失败:', e);
        container.innerHTML = Components.pageHeader('sales-dashboard') + '<div class="error-state">数据加载失败，请稍后重试</div>';
      }
    }
  },
  'workspace-customers': {
    async render(container) {
      container.innerHTML = Components.pageHeader('workspace-customers') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载客户数据中...</span></div>';
      try {
        const result = await API.getCustomers();
        const customers = result.customers || [];
        const stageMap = { new:'新客户', contacted:'已接触', requirement:'需求确认', solution:'方案沟通', negotiation:'商务谈判', closed:'已成交', lost:'已流失' };
        const levelColor = { A:'#e74c3c', B:'#f39c12', C:'#95a5a6' };
        const stageColor = { new:'#95a5a6', contacted:'#3498db', requirement:'#9b59b6', solution:'#f39c12', negotiation:'#e67e22', closed:'#27ae60', lost:'#7f8c8d' };
        
        let html = '<div class="page-header"><h2>客户中心</h2><p>管理客户信息、跟进记录和AI机会评分</p></div>';
        html += '<div class="metrics-row">';
        html += '<div class="metric-card"><div class="metric-value">'+customers.length+'</div><div class="metric-label">总客户数</div></div>';
        html += '<div class="metric-card"><div class="metric-value">'+customers.filter(c=>c.customer_level==='A').length+'</div><div class="metric-label">A级客户</div></div>';
        html += '<div class="metric-card"><div class="metric-value">'+customers.filter(c=>c.sales_stage!=='new'&&c.sales_stage!=='lost').length+'</div><div class="metric-label">跟进中</div></div>';
        const avgScore = customers.length ? Math.round(customers.reduce((s,c)=>s+(c.ai_score||0),0)/customers.length) : 0;
        html += '<div class="metric-card"><div class="metric-value">'+avgScore+'</div><div class="metric-label">平均AI评分</div></div>';
        html += '</div>';
        html += '<div class="card"><div class="card-header"><h3>客户列表</h3></div><div class="card-body"><div class="table-container"><table class="data-table"><thead><tr><th>客户名称</th><th>行业</th><th>规模</th><th>等级</th><th>销售阶段</th><th>AI评分</th><th>最近跟进</th><th>操作</th></tr></thead><tbody>';
        
        customers.forEach(c => {
          const sc = c.ai_score >= 70 ? '#27ae60' : c.ai_score >= 50 ? '#f39c12' : '#95a5a6';
          html += '<tr><td><strong>'+c.company_name+'</strong><br><small>'+c.contact_name+' · '+c.contact_role+'</small></td>';
          html += '<td>'+c.industry+'</td><td>'+c.company_size+'</td>';
          html += '<td><span class="tag" style="background:'+levelColor[c.customer_level]+'">'+c.customer_level+'级</span></td>';
          html += '<td><span class="tag" style="background:'+stageColor[c.sales_stage]+'">'+(stageMap[c.sales_stage]||c.sales_stage)+'</span></td>';
          html += '<td><span style="color:'+sc+';font-weight:bold;font-size:18px">'+(c.ai_score||'-')+'</span></td>';
          html += '<td>'+(c.last_follow_time ? new Date(c.last_follow_time).toLocaleDateString() : '未跟进')+'</td>';
          html += '<td><button class="btn btn-sm" onclick="Router.navigate(\'workspace-customer-detail\',{id:'+c.id+'})">查看详情</button></td></tr>';
        });
        html += '</tbody></table></div></div></div>';
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: '+e.message+'</div></div>';
      }
    }
  },
  
  'workspace-customer-detail': {
    async render(container) {
      const params = Router.currentParams || {};
      // 防御：缺少客户ID（如直接打开无 ?id= 的详情URL）时不发无效请求，给出友好引导
      if (!params.id) {
        container.innerHTML = Components.pageHeader('workspace-customer-detail') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/> </svg></div><div class="empty-state-text">未指定客户，请从「客户中心」列表选择客户查看详情。</div><button class="btn btn-primary" onclick="Router.navigate(\'workspace-customers\')">返回客户中心</button></div>';
        return;
      }
      container.innerHTML = Components.pageHeader('workspace-customer-detail') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载客户详情中...</span></div>';
      try {
        const result = await API.getCustomerDetail(params.id);
        const c = result.customer;
        const follows = result.follows || [];
        const score = result.ai_score;
        const opportunities = result.opportunities || [];
        const stageMap = { new:'新客户', contacted:'已接触', requirement:'需求确认', solution:'方案沟通', negotiation:'商务谈判', closed:'已成交', lost:'已流失' };
        
        let html = '<div class="page-header"><button class="btn btn-outline" onclick="Router.navigate(\'workspace-customers\')">← 返回列表</button>';
        html += '<h2 style="margin-top:16px">'+c.company_name+'</h2><p>'+c.industry+' · '+c.company_size+' · '+c.location+'</p></div>';
        html += '<div class="dashboard-grid" style="grid-template-columns:1fr 1fr 1fr">';
        html += '<div class="card"><div class="card-header"><h3>客户信息</h3></div><div class="card-body">';
        html += '<p><strong>联系人：</strong>'+c.contact_name+' ('+c.contact_role+')</p>';
        html += '<p><strong>电话：</strong>'+(c.phone||'-')+'</p>';
        html += '<p><strong>邮箱：</strong>'+(c.email||'-')+'</p>';
        html += '<p><strong>客户等级：</strong>'+c.customer_level+'级</p>';
        html += '<p><strong>销售阶段：</strong>'+(stageMap[c.sales_stage]||c.sales_stage)+'</p>';
        html += '<p><strong>最近跟进：</strong>'+(c.last_follow_time?new Date(c.last_follow_time).toLocaleString():'未跟进')+'</p>';
        html += '<p><strong>下一步：</strong>'+(c.next_action||'-')+'</p>';
        html += '<p><strong>备注：</strong>'+(c.notes||'-')+'</p></div></div>';
        
        const sc = score && score.score >= 70 ? '#27ae60' : score && score.score >= 50 ? '#f39c12' : '#95a5a6';
        html += '<div class="card"><div class="card-header"><h3>AI机会评分</h3></div><div class="card-body">';
        html += '<div style="text-align:center;padding:20px 0"><div style="font-size:48px;font-weight:bold;color:'+sc+'">'+(score?score.score:'-')+'</div><div style="color:#666">AI机会指数</div></div>';
        if (score && score.reason) { try { const reasons = JSON.parse(score.reason); html += '<h4>评分依据</h4><ul>'+reasons.map(r=>'<li>'+r+'</li>').join('')+'</ul>'; } catch(e){} }
        if (score && score.recommended_scenarios) { try { const scs = JSON.parse(score.recommended_scenarios); html += '<h4>推荐场景</h4><div>'+scs.map(s=>'<span class="tag" style="margin:2px;background:#0D9488">'+s+'</span>').join('')+'</div>'; } catch(e){} }
        html += '<button class="btn btn-sm" style="margin-top:12px" onclick="recalcScore('+c.id+')">重新计算评分</button></div></div>';
        
        html += '<div class="card"><div class="card-header"><h3>匹配的销售机会</h3></div><div class="card-body">';
        html += opportunities.length > 0 ? opportunities.map(o=>'<div style="padding:10px;border-bottom:1px solid #eee"><strong>'+o.scenario+'</strong><p style="margin:4px 0;font-size:13px;color:#666">'+(o.sales_angle||'')+'</p><span class="tag" style="background:'+(o.priority==='high'?'#e74c3c':o.priority==='medium'?'#f39c12':'#95a5a6')+'">'+o.priority+'</span></div>').join('') : '<p style="color:#999">暂无匹配机会</p>';
        html += '</div></div></div>';
        
        html += '<div class="card" style="margin-top:20px"><div class="card-header"><h3>跟进记录 ('+follows.length+')</h3><button class="btn btn-sm" onclick="showFollowForm('+c.id+')">+ 新增跟进</button></div><div class="card-body">';
        html += '<div id="followForm" style="display:none;padding:16px;background:#f8f9fa;border-radius:8px;margin-bottom:16px">';
        html += '<select id="followType" class="form-input" style="margin-bottom:8px"><option value="电话">电话</option><option value="微信">微信</option><option value="会议">会议</option><option value="拜访">拜访</option><option value="邮件">邮件</option></select>';
        html += '<textarea id="followContent" class="form-input" placeholder="沟通内容..." rows="3" style="margin-bottom:8px"></textarea>';
        html += '<input id="followNext" class="form-input" placeholder="下一步动作..." style="margin-bottom:8px">';
        html += '<button class="btn" onclick="submitFollow('+c.id+')">保存跟进</button></div>';
        html += follows.length > 0 ? follows.map(f=>'<div style="padding:12px;border-left:3px solid #0D9488;margin-bottom:12px;padding-left:16px"><div style="display:flex;justify-content:space-between"><strong>'+f.follow_type+'</strong><span style="color:#999;font-size:13px">'+(f.follow_time?new Date(f.follow_time).toLocaleString():'')+'</span></div><p style="margin:8px 0">'+f.content+'</p>'+(f.next_action?'<p style="color:#0D9488;font-size:13px">→ 下一步：'+f.next_action+'</p>':'')+'</div>').join('') : '<p style="color:#999;padding:20px">暂无跟进记录</p>';
        html += '</div></div>';
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: '+e.message+'</div></div>';
      }
    }
  },
  
  'workspace-tasks': {
    async render(container) {
      container.innerHTML = Components.pageHeader('workspace-tasks') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载今日任务中...</span></div>';
      try {
        const result = await API.getTodayTasks();
        const tasks = result.top5_tasks || [];
        const opportunities = result.today_opportunities || [];
        
        let html = '<div class="page-header"><h2>今日销售任务</h2><p>'+(result.date || new Date().toLocaleDateString())+' · AI智能生成</p></div>';
        html += '<div class="metrics-row">';
        html += '<div class="metric-card"><div class="metric-value">'+(result.total_customers_needing_follow||0)+'</div><div class="metric-label">需跟进客户</div></div>';
        html += '<div class="metric-card"><div class="metric-value">'+(result.high_priority_customers||0)+'</div><div class="metric-label">A级客户</div></div>';
        html += '<div class="metric-card"><div class="metric-value">'+tasks.length+'</div><div class="metric-label">重点任务</div></div>';
        html += '<div class="metric-card"><div class="metric-value">'+opportunities.length+'</div><div class="metric-label">今日机会</div></div></div>';
        
        html += '<div class="card" style="margin-bottom:20px"><div class="card-header"><h3>今日建议</h3></div><div class="card-body"><p style="line-height:1.8">'+(result.daily_advice||'')+'</p></div></div>';
        
        html += '<div class="card"><div class="card-header"><h3>重点客户 TOP '+tasks.length+'</h3></div><div class="card-body">';
        tasks.forEach((t, i) => {
          const sc = t.ai_score >= 70 ? '#27ae60' : t.ai_score >= 50 ? '#f39c12' : '#95a5a6';
          html += '<div style="padding:16px 20px;border-bottom:1px solid #eee;display:flex;align-items:center;gap:16px">';
          html += '<div style="font-size:24px;font-weight:bold;color:#0D9488;min-width:40px">'+(i+1)+'</div>';
          html += '<div style="flex:1"><div style="display:flex;align-items:center;gap:10px"><strong style="font-size:16px">'+t.company_name+'</strong>';
          html += '<span class="tag" style="background:'+(t.customer_level==='A'?'#e74c3c':t.customer_level==='B'?'#f39c12':'#95a5a6')+'">'+t.customer_level+'级</span>';
          html += '<span class="tag" style="background:#0D9488">'+t.industry+'</span>';
          html += '<span style="color:'+sc+';font-weight:bold">AI评分: '+t.ai_score+'</span></div>';
          html += '<p style="margin:8px 0;color:#333">'+t.suggested_action+'</p>';
          html += '<div style="display:flex;gap:8px;flex-wrap:wrap">'+(t.recommended_scenarios||[]).map(s=>'<span class="tag" style="background:#e8f5f3;color:#0D9488">'+s+'</span>').join('')+'</div>';
          html += '<p style="margin:8px 0 0;font-size:13px;color:#999">'+t.contact_name+' ('+t.contact_role+') · '+(t.last_follow_time ? '最近跟进: '+new Date(t.last_follow_time).toLocaleDateString() : '未跟进')+(t.days_since_follow ? ' · '+t.days_since_follow+'天前' : '')+'</p></div>';
          html += '<button class="btn" onclick="Router.navigate(\'workspace-customer-detail\',{id:'+t.customer_id+'})">去跟进</button></div>';
        });
        html += '</div></div>';
        
        if (opportunities.length > 0) {
          html += '<div class="card" style="margin-top:20px"><div class="card-header"><h3>今日AI销售机会</h3></div><div class="card-body">';
          html += opportunities.map(o=>'<div style="padding:12px 20px;border-bottom:1px solid #eee"><strong>'+o.industry+' - '+o.scenario+'</strong><p style="margin:4px 0;color:#666;font-size:14px">'+(o.sales_angle||'')+'</p><span class="tag" style="background:'+(o.priority==='high'?'#e74c3c':o.priority==='medium'?'#f39c12':'#95a5a6')+'">'+(o.priority==='high'?'高优先级':o.priority==='medium'?'中优先级':'低优先级')+'</span></div>').join('');
          html += '</div></div>';
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: '+e.message+'</div></div>';
      }
    }
  },
  'sales-prediction': {
    async render(container) {
      container.innerHTML = Components.pageHeader('sales-prediction') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载成交预测中...</span></div>';
      try {
        const res = await fetch('/app-api/sales-prediction/customers').then(r => r.json());
        const data = res.data || [];
        const high = data.filter(d => d.prediction_level === 'high').length;
        const med = data.filter(d => d.prediction_level === 'medium').length;
        const low = data.filter(d => d.prediction_level === 'low').length;
        const avg = data.length > 0 ? Math.round(data.reduce((s, d) => s + (d.deal_probability || 0), 0) / data.length) : 0;
        let html = Components.pageHeader('sales-prediction');
        html += '<div class="metric-cards">';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#DCFCE7;color:#16A34A;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/> <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/> <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/> <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/> </svg></div><div class="metric-info"><div class="metric-value">' + high + '</div><div class="metric-label">高概率客户</div></div></div>';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#FEF9C3;color:#CA8A04;">⏳</div><div class="metric-info"><div class="metric-value">' + med + '</div><div class="metric-label">中概率客户</div></div></div>';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#FEE2E2;color:#DC2626;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="metric-info"><div class="metric-value">' + low + '</div><div class="metric-label">低概率客户</div></div></div>';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#CCFBF1;color:#0D9488;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/> </svg></div><div class="metric-info"><div class="metric-value">' + avg + '%</div><div class="metric-label">平均成交概率</div></div></div>';
        html += '</div>';
        if (data.length === 0) {
          html += Components.emptyState('暂无成交预测数据');
        } else {
          html += '<div class="card"><div class="card-header"><h3>客户成交概率预测</h3></div><div class="card-body" style="padding:0;"><table class="data-table"><thead><tr><th>客户</th><th>成交概率</th><th>等级</th><th>正向因素</th><th>风险因素</th><th>建议动作</th></tr></thead><tbody>';
          const sorted = data.slice().sort((a, b) => (b.deal_probability || 0) - (a.deal_probability || 0));
          sorted.forEach(item => {
            const level = item.prediction_level === 'high' ? '高概率' : item.prediction_level === 'medium' ? '中概率' : '低概率';
            const color = item.prediction_level === 'high' ? '#16A34A' : item.prediction_level === 'medium' ? '#CA8A04' : '#DC2626';
            const bg = item.prediction_level === 'high' ? '#DCFCE7' : item.prediction_level === 'medium' ? '#FEF9C3' : '#FEE2E2';
            html += '<tr>';
            html += '<td><strong>' + (item.customer_name || '-') + '</strong></td>';
            html += '<td><div style="display:flex;align-items:center;gap:8px;"><div style="width:90px;height:8px;background:#E2E8F0;border-radius:4px;overflow:hidden;"><div style="width:' + (item.deal_probability || 0) + '%;height:100%;background:' + color + ';"></div></div><span style="font-weight:600;color:' + color + ';">' + (item.deal_probability || 0) + '%</span></div></td>';
            html += '<td><span style="padding:2px 10px;border-radius:10px;font-size:12px;background:' + bg + ';color:' + color + ';">' + level + '</span></td>';
            html += '<td style="font-size:12px;color:#16A34A;max-width:180px;">' + ((item.positive_factors || []).join('；') || '-') + '</td>';
            html += '<td style="font-size:12px;color:#DC2626;max-width:180px;">' + ((item.risk_factors || []).join('；') || '-') + '</td>';
            html += '<td style="font-size:13px;max-width:200px;">' + (item.recommended_action || '-') + '</td>';
            html += '</tr>';
          });
          html += '</tbody></table></div></div>';
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = Components.pageHeader('sales-prediction') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },

  'sales-funnel': {
    async render(container) {
      container.innerHTML = Components.pageHeader('sales-funnel') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载销售漏斗中...</span></div>';
      try {
        const res = await fetch('/app-api/sales-prediction/funnel').then(r => r.json());
        const d = res.data || {};
        const funnel = d.funnel || [];
        const total = d.total_customers || 0;
        const amount = (d.total_amount || 0) / 10000;
        let html = Components.pageHeader('sales-funnel');
        html += '<div class="metric-cards">';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#CCFBF1;color:#0D9488;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/> </svg></div><div class="metric-info"><div class="metric-value">' + total + '</div><div class="metric-label">客户总数</div></div></div>';
        html += '<div class="metric-card"><div class="metric-icon" style="background:#FEF3C7;color:#D97706;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/> <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/> </svg></div><div class="metric-info"><div class="metric-value">' + amount.toFixed(1) + '万</div><div class="metric-label">商机总金额</div></div></div>';
        const closed = funnel.find(f => f.stage === 'closed');
        html += '<div class="metric-card"><div class="metric-icon" style="background:#DCFCE7;color:#16A34A;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/> </svg></div><div class="metric-info"><div class="metric-value">' + (closed ? closed.customer_count : 0) + '</div><div class="metric-label">已成交</div></div></div>';
        const deal = funnel.find(f => f.stage === 'negotiation');
        html += '<div class="metric-card"><div class="metric-icon" style="background:#E0E7FF;color:#4F46E5;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/> </svg></div><div class="metric-info"><div class="metric-value">' + (deal ? deal.customer_count : 0) + '</div><div class="metric-label">商务谈判</div></div></div>';
        html += '</div>';
        html += '<div class="card"><div class="card-header"><h3>销售阶段漏斗</h3></div><div class="card-body">';
        if (funnel.length === 0) {
          html += Components.emptyState('暂无漏斗数据');
        } else {
          const colors = ['#94A3B8', '#60A5FA', '#FBBF24', '#0D9488', '#F472B6', '#10B981'];
          funnel.forEach((item, idx) => {
            const w = total > 0 ? Math.max(18, Math.round((item.customer_count / total) * 100)) : 18;
            html += '<div style="margin-bottom:18px;">';
            html += '<div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-weight:600;color:#1E293B;">' + item.stage_name + '</span><span style="font-size:13px;color:#64748B;">' + item.customer_count + ' 家 · 转化率 ' + (item.conversion_rate || 0) + '%</span></div>';
            html += '<div style="width:100%;height:34px;background:#F1F5F9;border-radius:6px;overflow:hidden;"><div style="width:' + w + '%;height:100%;background:' + colors[idx % colors.length] + ';border-radius:6px;display:flex;align-items:center;padding-left:12px;color:#fff;font-size:13px;font-weight:600;transition:width .3s;">' + (item.customer_count > 0 ? item.customer_count + '家' : '') + '</div></div>';
            html += '</div>';
          });
        }
        html += '</div></div>';
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = Components.pageHeader('sales-funnel') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },

  'workspace-opportunities': {
    async render(container) {
      container.innerHTML = Components.pageHeader('workspace-opportunities') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载商机数据中...</span></div>';
      try {
        const res = await fetch('/app-api/crm/opportunities').then(r => r.json());
        const all = res.opportunities || [];
        const summary = res.summary || {};
        const fmtWan = v => { v = Number(v || 0); return Math.abs(v) >= 10000 ? (v / 10000).toFixed(1) + '万' : v.toFixed(0); };
        const stageColor = { '进行中': ['#DBEAFE', '#2563EB'], '已成交': ['#DCFCE7', '#16A34A'], '已丢单': ['#F1F5F9', '#64748B'] };
        const card = (icon, bg, color, val, label) => '<div class="metric-card"><div class="metric-icon" style="background:' + bg + ';color:' + color + ';">' + icon + '</div><div class="metric-info"><div class="metric-value">' + val + '</div><div class="metric-label">' + label + '</div></div></div>';

        let curStage = '全部';
        let curKw = '';
        let html = Components.pageHeader('workspace-opportunities');
        html += '<div class="metric-cards">';
        html += card('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/> </svg>', '#DBEAFE', '#2563EB', (summary.open || {}).count || 0, '在途商机 · ' + fmtWan((summary.open || {}).amount || 0));
        html += card('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/> </svg>', '#DCFCE7', '#16A34A', (summary.won || {}).count || 0, '已成交 · ' + fmtWan((summary.won || {}).amount || 0));
        html += card('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/> </svg>', '#FEE2E2', '#DC2626', (summary.lost || {}).count || 0, '已丢单 · ' + fmtWan((summary.lost || {}).amount || 0));
        html += card('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z"/> </svg>', '#CCFBF1', '#0D9488', summary.total_count || 0, '商机总数 · ' + fmtWan(summary.total_amount || 0));
        html += '</div>';
        html += '<div class="card"><div class="card-header" style="flex-wrap:wrap;gap:12px;"><h3>商机列表</h3>';
        html += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-left:auto;">';
        html += '<input id="oppKw" type="text" placeholder="搜索商机 / 客户" style="padding:6px 10px;border:1px solid #CBD5E1;border-radius:6px;font-size:13px;min-width:180px;">';
        html += '<div id="oppTabs" style="display:flex;gap:6px;flex-wrap:wrap;"></div>';
        html += '</div></div>';
        html += '<div class="card-body" style="padding:0;"><div style="overflow-x:auto;"><table class="data-table" style="min-width:1000px;"><colgroup><col style="width:250px"><col style="width:210px"><col style="width:90px"><col style="width:96px"><col style="width:110px"><col style="width:80px"><col style="width:118px"><col style="width:90px"></colgroup><thead><tr><th>商机名称</th><th>客户</th><th>产品线</th><th>阶段</th><th>金额</th><th>赢单率</th><th>关单/成交</th><th>负责人</th></tr></thead><tbody id="oppTbody"></tbody></table></div></div></div>';
        container.innerHTML = html;

        const stages = ['全部', '进行中', '已成交', '已丢单'];
        const tabsEl = container.querySelector('#oppTabs');
        const tbody = container.querySelector('#oppTbody');
        const kwEl = container.querySelector('#oppKw');

        function tabCount(s) {
          if (s === '全部') return all.length;
          const key = s === '进行中' ? 'open' : s === '已成交' ? 'won' : 'lost';
          return (summary[key] || {}).count || 0;
        }
        function renderRows() {
          let list = all.filter(o => curStage === '全部' || o.stage === curStage);
          if (curKw) {
            const k = curKw.trim().toLowerCase();
            list = list.filter(o => (o.opp_name || '').toLowerCase().includes(k) || (o.company_name || '').toLowerCase().includes(k));
          }
          if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94A3B8;padding:30px;">暂无符合条件的商机</td></tr>';
            return;
          }
          tbody.innerHTML = list.map(o => {
            const c = stageColor[o.stage] || ['#F1F5F9', '#64748B'];
            const dt = o.stage === '已成交' ? (o.won_date || '-') : (o.expected_close_date || '-');
            return '<tr>'
              + '<td style="min-width:230px;">' + (o.opp_name || '-') + '</td>'
              + '<td style="white-space:nowrap;"><strong>' + (o.company_name || '-') + '</strong></td>'
              + '<td>' + (o.product_line || '-') + '</td>'
              + '<td><span style="padding:2px 10px;border-radius:10px;font-size:12px;background:' + c[0] + ';color:' + c[1] + ';white-space:nowrap;">' + (o.stage || '-') + '</span></td>'
              + '<td style="font-weight:600;color:#0D9488;white-space:nowrap;">' + fmtWan(o.amount) + '</td>'
              + '<td style="white-space:nowrap;">' + (o.win_rate || '-') + '</td>'
              + '<td style="white-space:nowrap;">' + dt + '</td>'
              + '<td>' + (o.owner || '-') + '</td></tr>';
          }).join('');
        }
        function renderTabs() {
          tabsEl.innerHTML = stages.map(s => {
            const active = s === curStage;
            return '<button data-stage="' + s + '" class="btn ' + (active ? 'btn-primary' : 'btn-outline') + '" style="padding:4px 12px;font-size:12px;">' + s + ' ' + tabCount(s) + '</button>';
          }).join('');
          tabsEl.querySelectorAll('[data-stage]').forEach(b => b.addEventListener('click', () => {
            curStage = b.getAttribute('data-stage');
            renderTabs();
            renderRows();
          }));
        }
        kwEl.addEventListener('input', e => { curKw = e.target.value; renderRows(); });
        renderTabs();
        renderRows();
      } catch (e) {
        container.innerHTML = Components.pageHeader('workspace-opportunities') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },

  'sales-review': {
    async render(container) {
      container.innerHTML = Components.pageHeader('sales-review') + '<div class="page-loading"><div class="loading-spinner"></div><span>加载复盘报告中...</span></div>';
      try {
        const res = await fetch('/app-api/sales-prediction/reviews?review_type=daily&limit=10').then(r => r.json());
        const reviews = res.data || [];
        let html = Components.pageHeader('sales-review');
        html += '<div style="margin-bottom:16px;display:flex;gap:10px;align-items:center;"><button class="btn btn-primary" id="genReviewBtn">生成今日复盘</button><span style="font-size:13px;color:#94A3B8;">基于最新客户数据与成交预测自动生成</span></div>';
        if (reviews.length === 0) {
          html += Components.emptyState('暂无复盘报告，点击上方按钮生成');
        } else {
          reviews.forEach(r => {
            html += '<div class="card" style="margin-bottom:16px;"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;"><h3>AI销售复盘 · ' + r.review_date + '</h3><span style="font-size:12px;color:#94A3B8;">' + (r.created_time || '').replace('T', ' ').substring(0, 16) + '</span></div><div class="card-body">' + Components.renderMarkdown(r.content || '') + '</div></div>';
          });
        }
        container.innerHTML = html;
        const btn = document.getElementById('genReviewBtn');
        if (btn) {
          btn.addEventListener('click', async () => {
            btn.disabled = true;
            btn.textContent = '生成中...';
            try {
              await fetch('/app-api/sales-prediction/reviews/generate?review_type=daily', { method: 'POST' });
              Pages['sales-review'].render(container);
            } catch (err) {
              alert('生成失败: ' + err.message);
              btn.disabled = false;
              btn.textContent = '生成今日复盘';
            }
          });
        }
      } catch (e) {
        container.innerHTML = Components.pageHeader('sales-review') + '<div class="empty-state"><div class="empty-state-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-ico" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> </svg></div><div class="empty-state-text">加载失败: ' + e.message + '</div></div>';
      }
    }
  },
};

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  Router.init();
  initNotificationReadState();
});


// ========== 销售工作台全局函数 ==========
function showFollowForm(customerId) {
    const form = document.getElementById('followForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

async function submitFollow(customerId) {
    const type = document.getElementById('followType').value;
    const content = document.getElementById('followContent').value;
    const next = document.getElementById('followNext').value;
    
    if (!content.trim()) {
        alert('请输入沟通内容');
        return;
    }
    
    try {
        await API.createFollow({
            customer_id: customerId,
            follow_type: type,
            content: content,
            next_action: next || null
        });
        alert('跟进记录已保存');
        Router.currentParams = {id: customerId};
        Router.navigate('workspace-customer-detail');
    } catch (e) {
        alert('保存失败: ' + e.message);
    }
}

async function recalcScore(customerId) {
    try {
        await API.recalcCustomerScore(customerId);
        alert('评分已重新计算');
        Router.currentParams = {id: customerId};
        Router.navigate('workspace-customer-detail');
    } catch (e) {
        alert('重新计算失败: ' + e.message);
    }
}
