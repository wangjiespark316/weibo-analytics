const $ = (id) => document.getElementById(id);
const state = { period: 'today', hot: { today: null, yesterday: null }, sentiment: null, trend: null };
const bj = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
const integer = (value) => new Intl.NumberFormat('zh-CN').format(Number(value) || 0);
const percentage = (value) => `${Math.max(0, Math.min(100, Number(value) || 0)).toFixed(1).replace(/\.0$/, '')}%`;

async function getData(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

function setStatus(message, online) {
  $('status').textContent = message;
  document.querySelector('.live-dot').style.background = online ? '#15a580' : '#e5a064';
}

function postCard(post) {
  const link = document.createElement('a');
  link.className = 'post';
  const url = typeof post.url === 'string' && /^https:\/\/m\.weibo\.cn\/detail\/\d+$/.test(post.url) ? post.url : null;
  if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  const top = document.createElement('div'); top.className = 'post-top';
  const author = document.createElement('span'); author.className = 'post-author'; author.textContent = post.username || '微博用户';
  const category = document.createElement('span'); category.className = 'post-category'; category.textContent = post.category || 'AI 行业';
  top.append(author, category);
  const content = document.createElement('p'); content.className = 'post-content'; content.textContent = post.content || '暂无正文';
  const meta = document.createElement('div'); meta.className = 'post-meta';
  const time = document.createElement('span'); time.textContent = post.publish_time ? String(post.publish_time).replace('T', ' ').slice(0, 16) : '发布时间未知';
  const score = document.createElement('span'); score.className = 'post-score'; score.textContent = `热度 ${Math.round(Number(post.hotspot_score) || 0)}`;
  meta.append(time, score); link.append(top, content, meta);
  return link;
}

function renderHot() {
  const yesterday = state.period === 'yesterday';
  $('tab-today').classList.toggle('active', !yesterday);
  $('tab-yesterday').classList.toggle('active', yesterday);
  $('count-label').textContent = yesterday ? '昨日相关微博' : '今日相关微博';
  $('posts-label').textContent = yesterday ? '昨日 · 热度排序' : '今日 · 热度排序';
  const result = state.hot[state.period];
  const list = $('posts'); list.replaceChildren();
  if (!result) {
    $('post-count').textContent = '—';
    $('date-range').textContent = yesterday ? '昨日榜单尚未完成补采' : '今日数据暂不可用';
    const empty = document.createElement('div'); empty.className = 'empty-state';
    empty.textContent = yesterday ? '昨日补采完成后，这里会自动展示完整榜单。' : '暂时无法读取今日数据，请稍后刷新。';
    list.append(empty); return;
  }
  $('post-count').textContent = integer(result.total_count);
  $('date-range').textContent = yesterday ? '昨日 00:00–24:00 · 北京时间' : '今日 00:00 起 · 持续更新';
  const posts = Array.isArray(result.data) ? result.data : [];
  if (!posts.length) {
    const empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = '当前时段尚无符合条件的 AI 行业微博。'; list.append(empty);
  } else posts.forEach((post) => list.append(postCard(post)));
}

function renderSentiment() {
  const result = state.sentiment;
  if (!result) return;
  $('positive-ratio').textContent = percentage(result.positive_ratio);
  $('sample-size').textContent = integer(result.sample_size || result.total_analyzed);
  for (const [name, value] of [['positive', result.positive_ratio], ['neutral', result.neutral_ratio], ['negative', result.negative_ratio]]) {
    $('sent-' + name).textContent = percentage(value);
    $('bar-' + name).style.width = percentage(value);
  }
}

function renderTrend() {
  const daily = Array.isArray(state.trend?.daily_trend) ? state.trend.daily_trend.slice(-7) : [];
  const target = $('trend-chart'); target.replaceChildren();
  if (!daily.length) { $('trend-caption').textContent = '暂无趋势数据'; return; }
  const values = daily.map((day) => Number(day.post_count) || 0);
  const max = Math.max(1, ...values);
  const points = values.map((v, i) => `${28 + i * (544 / Math.max(1, values.length - 1))},${126 - (v / max) * 108}`).join(' ');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 600 145'); svg.setAttribute('preserveAspectRatio', 'none');
  for (const y of [18, 72, 126]) { const line = document.createElementNS(svg.namespaceURI, 'line'); for (const [k, v] of Object.entries({x1: '20', x2: '580', y1: String(y), y2: String(y), stroke: '#e5eee9', 'stroke-dasharray': '4 6'})) line.setAttribute(k, v); svg.append(line); }
  const area = document.createElementNS(svg.namespaceURI, 'polygon'); area.setAttribute('points', `28,126 ${points} 572,126`); area.setAttribute('fill', '#d8f2e9'); svg.append(area);
  const poly = document.createElementNS(svg.namespaceURI, 'polyline'); poly.setAttribute('points', points); poly.setAttribute('fill', 'none'); poly.setAttribute('stroke', '#087c6b'); poly.setAttribute('stroke-width', '3'); poly.setAttribute('stroke-linecap', 'round'); poly.setAttribute('stroke-linejoin', 'round'); svg.append(poly);
  values.forEach((v, i) => { const circle = document.createElementNS(svg.namespaceURI, 'circle'); circle.setAttribute('cx', String(28 + i * (544 / Math.max(1, values.length - 1)))); circle.setAttribute('cy', String(126 - (v / max) * 108)); circle.setAttribute('r', '4'); circle.setAttribute('fill', '#087c6b'); svg.append(circle); });
  target.append(svg);
  $('trend-caption').replaceChildren();
  for (const day of daily) { const item = document.createElement('span'); item.textContent = `${String(day.date).slice(5)} · ${integer(day.post_count)}`; $('trend-caption').append(item); }
}

async function refresh() {
  $('refresh').disabled = true;
  setStatus('正在更新数据', false);
  const paths = ['/data/hot-today', '/data/hot-yesterday', '/data/sentiment', '/data/trend-ai'];
  const results = await Promise.allSettled(paths.map(getData));
  state.hot.today = results[0].status === 'fulfilled' ? results[0].value : null;
  state.hot.yesterday = results[1].status === 'fulfilled' ? results[1].value : null;
  state.sentiment = results[2].status === 'fulfilled' ? results[2].value : null;
  state.trend = results[3].status === 'fulfilled' ? results[3].value : null;
  renderHot(); renderSentiment(); renderTrend();
  $('clock').textContent = bj.format(new Date());
  setStatus(results.some((r) => r.status === 'fulfilled') ? '数据已更新' : '数据暂不可用', results.some((r) => r.status === 'fulfilled'));
  $('refresh').disabled = false;
}

$('tab-today').addEventListener('click', () => { state.period = 'today'; renderHot(); });
$('tab-yesterday').addEventListener('click', () => { state.period = 'yesterday'; renderHot(); });
$('refresh').addEventListener('click', refresh);
refresh();

// 自动定时刷新（15分钟）；页面卸载时清理，避免泄漏
const autoRefreshTimer = setInterval(refresh, 15 * 60 * 1000);
window.addEventListener('beforeunload', () => clearInterval(autoRefreshTimer));
