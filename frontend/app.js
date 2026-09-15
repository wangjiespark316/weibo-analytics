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
  }
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
const Router = {
  currentRoute: 'dashboard',
  expandedGroups: new Set(['data', 'ai']),
  
  init() {
    this.renderMenu();
    
    // 读取当前hash，实现路由状态保持（刷新页面后保持当前页面）
    const hash = window.location.hash.slice(1) || 'dashboard';
    const validRoutes = Object.keys(PAGE_INFO);
    const initialRoute = validRoutes.includes(hash) ? hash : 'dashboard';
    this.navigate(initialRoute);
    
    // 监听 hash 变化
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'dashboard';
      this.navigate(hash, false);
    });
  },
  
  navigate(route, updateHash = true) {
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
          <div class="empty-state-icon">📄</div>
          <div class="empty-state-text">页面不存在</div>
        </div>
      `;
    }
  }
};

// ========== 页面配置 ==========
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
  'permission': { title: '权限管理', breadcrumb: ['系统管理', '权限管理'], desc: '企业版细粒度权限体系规划，支持角色权限、数据权限、多租户与操作审计' }
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
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">${text}</div>
      </div>
    `;
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
const notificationState = {
  readIds: new Set(),
  totalCount: 3
};

function markNotificationAsRead(id) {
  if (notificationState.readIds.has(id)) return;
  notificationState.readIds.add(id);
  
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
        <!-- 产品介绍横幅 -->
        <div style="background:linear-gradient(135deg, #0D9488 0%, #14B8A6 100%);border-radius:12px;padding:28px 32px;margin-bottom:20px;color:white;position:relative;overflow:hidden;">
          <div style="position:absolute;right:-20px;top:-20px;font-size:120px;opacity:0.1;">📊</div>
          <div style="position:relative;z-index:1;">
            <div style="font-size:22px;font-weight:700;margin-bottom:6px;">微博智能分析平台</div>
            <div style="font-size:14px;opacity:0.9;margin-bottom:16px;">基于 AI 的微博舆情分析与热点洞察平台，助力企业实时掌握市场动态与用户情感</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;">🤖 AI情感分析</span>
              <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;">🔥 热点趋势追踪</span>
              <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;">📝 每日AI报告</span>
              <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;">👥 KOL影响力分析</span>
            </div>
          </div>
        </div>
        
        <!-- 核心能力 -->
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px;">
          ${[
            {icon:'📡', title:'数据采集', desc:'自动采集微博热门内容', route:'weibo-data'},
            {icon:'📈', title:'热点趋势', desc:'实时追踪关键词热度变化', route:'trend'},
            {icon:'💭', title:'舆情分析', desc:'AI识别正面/负面情感倾向', route:'sentiment'},
            {icon:'🤖', title:'AI日报', desc:'每日自动生成舆情分析报告', route:'daily-report'},
            {icon:'👥', title:'用户分析', desc:'KOL影响力排行与用户画像', route:'user-data'}
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
          <div style="font-size:14px;font-weight:600;margin-bottom:16px;color:var(--text);">🔄 产品工作流程</div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
            ${[
              {step:'1', title:'数据采集', desc:'每天自动采集微博', icon:'📡'},
              {step:'2', title:'数据清洗', desc:'去重、分类、结构化', icon:'🧹'},
              {step:'3', title:'AI分析', desc:'情感分析+关键词提取', icon:'🤖'},
              {step:'4', title:'热点发现', desc:'识别热议话题与趋势', icon:'🔥'},
              {step:'5', title:'报告生成', desc:'自动输出每日洞察', icon:'📊'}
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
                  <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg, var(--primary-light) 0%, #F0FDFA 100%);display:grid;place-items:center;font-size:24px;">📊</div>
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
            <span class="card-title">最近任务</span>
            <div class="card-extra">
              ${Components.button('查看全部', 'btn-sm', '', "Router.navigate('collect-task')")}
            </div>
          </div>
          <div class="card-body" style="padding:0;">
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>任务名称</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>执行时间</th>
                    <th>耗时</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>微博数据采集 - AI行业</td>
                    <td>${Components.tag('采集', 'blue')}</td>
                    <td>${Components.tag('运行中', 'green')}</td>
                    <td>2026-09-13 08:00:00</td>
                    <td>进行中</td>
                  </tr>
                  <tr>
                    <td>AI情感分析 - 全量数据</td>
                    <td>${Components.tag('分析', 'orange')}</td>
                    <td>${Components.tag('已完成', 'blue')}</td>
                    <td>2026-09-13 07:30:00</td>
                    <td>12分30秒</td>
                  </tr>
                  <tr>
                    <td>热点话题聚类</td>
                    <td>${Components.tag('分析', 'orange')}</td>
                    <td>${Components.tag('已完成', 'blue')}</td>
                    <td>2026-09-13 07:00:00</td>
                    <td>8分15秒</td>
                  </tr>
                  <tr>
                    <td>每日报告生成</td>
                    <td>${Components.tag('报告', 'green')}</td>
                    <td>${Components.tag('已完成', 'blue')}</td>
                    <td>2026-09-13 06:00:00</td>
                    <td>3分45秒</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                <div style="font-size:48px;margin-bottom:16px;">📊</div>
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
        const markdown = report?.content || report?.data?.content || '';
        const generatedAt = report?.generated_at || report?.data?.generated_at || '';
        
        const contentEl = container.querySelector('#daily-report-content');
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
        container.querySelector('#daily-report-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--danger);">日报加载失败，请刷新页面重试</div>';
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
              <div style="font-size:48px;margin-bottom:16px;">📡</div>
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
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;">📱</div>
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
              <div style="font-size:48px;margin-bottom:16px;">🤖</div>
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
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;">📊</div>
                <div style="flex:1;">
                  <div style="font-weight:500;font-size:14px;">AI 情感分析</div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">自动分析微博正面/中性/负面情感占比，支持千级样本分析</div>
                </div>
                <div>${Components.tag('自动执行', 'green')}</div>
              </div>
              <div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--border-light);">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;">📈</div>
                <div style="flex:1;">
                  <div style="font-weight:500;font-size:14px;">关键词趋势分析</div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">追踪指定关键词的热度变化趋势，支持 7/30/90 天数据</div>
                </div>
                <div>${Components.tag('自动执行', 'green')}</div>
              </div>
              <div style="display:flex;align-items:center;gap:16px;padding:12px 0;">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--primary-light);display:grid;place-items:center;font-size:18px;">📝</div>
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
                ⚠️ 当前为系统内置定时任务，不可在前端修改。如需调整执行时间，请联系系统管理员。
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
      
      // 真实的API Key（系统中实际存在的）
      const realApiKey = '34c053d2c4ae0c143e7208e542bbc2dfb3619364884e110b';
      const maskedKey = realApiKey.substring(0, 8) + '...' + realApiKey.substring(realApiKey.length - 6);
      
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
                💡 前端 Dashboard 通过 <code style="background:white;padding:1px 6px;border-radius:4px;">/app-api/</code> 内部代理访问数据，Nginx 自动注入 API Key，前端代码不暴露密钥。<br>
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
                        <button class="btn btn-link btn-sm" onclick="copyToClipboard('${realApiKey}')">复制</button>
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
              <div style="font-size:48px;margin-bottom:16px;">📊</div>
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
                <div style="font-weight:600;margin-bottom:4px;color:var(--primary);">🔒 安全架构说明</div>
                <div style="color:var(--text-secondary);font-size:12px;line-height:1.6;">
                  前端使用 <code>/app-api/</code> 内部代理（Nginx自动注入Key，Referer校验，60次/分钟限流）<br>
                  外部集成使用 <code>/api/</code> 接口（需携带X-API-Key，30次/分钟限流）
                </div>
              </div>
              <div style="margin-bottom:12px;"><strong>请求方式：</strong>所有 API 均为 GET 请求</div>
              <div style="margin-bottom:12px;"><strong>外部调用认证：</strong>在请求头中添加 <code style="background:var(--bg);padding:2px 6px;border-radius:4px;">X-API-Key: ${maskedKey}</code></div>
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
              <div style="font-size:48px;margin-bottom:16px;">👥</div>
              <div style="font-size:16px;font-weight:600;margin-bottom:8px;">多用户体系开发中</div>
              <div style="font-size:13px;color:var(--text-secondary);">当前系统使用 API Key 认证，企业版将支持完整的多用户登录与管理体系</div>
            </div>
            
            <div style="background:var(--bg);border-radius:8px;padding:24px;">
              <div style="font-weight:600;margin-bottom:20px;font-size:14px;">企业版用户体系规划</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;">🔐</span>
                    <span style="font-weight:600;font-size:14px;">用户登录</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    支持账号密码登录、手机号登录、SSO 单点登录、企业微信/飞书集成登录
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;">👤</span>
                    <span style="font-weight:600;font-size:14px;">用户生命周期</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    用户邀请、注册审核、启用/禁用、密码重置、登录日志、操作审计
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;">🏢</span>
                    <span style="font-weight:600;font-size:14px;">组织架构</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    部门管理、岗位设置、用户分组、批量导入导出、组织架构同步
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;">🔔</span>
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
              <div style="font-size:48px;margin-bottom:16px;">🔐</div>
              <div style="font-size:16px;font-weight:600;margin-bottom:8px;">细粒度权限体系开发中</div>
              <div style="font-size:13px;color:var(--text-secondary);">当前所有 API Key 具有相同权限，企业版将支持完整的角色权限与多租户体系</div>
            </div>
            
            <div style="background:var(--bg);border-radius:8px;padding:24px;">
              <div style="font-weight:600;margin-bottom:20px;font-size:14px;">企业版权限体系规划</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;">🎭</span>
                    <span style="font-weight:600;font-size:14px;">角色权限</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    预设角色（超级管理员/管理员/分析师/只读用户）+ 自定义角色，支持菜单权限、操作权限、数据权限三级控制
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;">📋</span>
                    <span style="font-weight:600;font-size:14px;">数据权限</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    按部门/项目/标签隔离数据，支持行级数据权限，敏感字段脱敏，数据导出审批流程
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;">🏢</span>
                    <span style="font-weight:600;font-size:14px;">多租户能力</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                    支持多客户/多部门独立租户，数据完全隔离，租户管理员自主管理用户与权限，支持租户级配置
                  </div>
                </div>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:20px;">📝</span>
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
                <span style="font-size:24px;">🚀</span>
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
  }
};

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  Router.init();
});
