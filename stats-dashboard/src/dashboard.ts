export const DASHBOARD_HTML = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>沈哲的博客 · 访问统计</title>
  <style>
    :root{color-scheme:light;--ink:#17202a;--muted:#68717d;--line:#e6e0d6;--paper:#f6f2ea;--card:#fffdf8;--gold:#a5742c;--red:#9b3e33;--green:#3a6b55}
    *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,"Noto Sans SC",system-ui,sans-serif}.shell{max-width:1240px;margin:auto;padding:28px}.masthead{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:24px}.eyebrow{font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.16em;color:var(--gold);text-transform:uppercase}.masthead h1{margin:5px 0 0;font:600 clamp(28px,4vw,44px)/1.05 Georgia,"Noto Serif SC",serif}.subtle{color:var(--muted);font-size:13px}.toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.control,button,input{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:8px;padding:9px 12px;font:inherit}button{cursor:pointer}button.primary{background:var(--ink);color:white;border-color:var(--ink)}button.danger{color:var(--red)}.login{max-width:420px;margin:12vh auto;background:var(--card);padding:32px;border:1px solid var(--line);box-shadow:0 18px 60px #48351c18}.login h1{font-family:Georgia,"Noto Serif SC",serif}.login form{display:grid;gap:12px}.error{color:var(--red);min-height:20px}.hidden{display:none!important}.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.card,.panel{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px}.metric-label{color:var(--muted);font-size:13px}.metric{font:600 34px/1.1 Georgia,serif;margin-top:8px}.grid{display:grid;grid-template-columns:1.5fr 1fr;gap:14px;margin-top:14px}.panel h2{font:600 18px/1.2 Georgia,"Noto Serif SC",serif;margin:0 0 14px}.panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.chart{height:240px}.chart svg{width:100%;height:100%;overflow:visible}.bars{display:grid;gap:10px}.bar-row{display:grid;grid-template-columns:minmax(120px,1fr) 3fr 48px;gap:10px;align-items:center;font-size:13px}.bar-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bar-track{height:9px;background:#eee8dd;border-radius:999px;overflow:hidden}.bar-fill{height:100%;background:var(--gold);border-radius:999px}.location-list{display:grid;gap:8px}.location{display:grid;grid-template-columns:1fr auto;gap:10px;padding:8px 0;border-bottom:1px dashed var(--line)}.wide{grid-column:1/-1}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;min-width:980px;font-size:12px}th,td{padding:10px 8px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--muted);font-weight:600;position:sticky;top:0;background:var(--card)}.owner{color:var(--green);font-weight:700}.ip{font-family:ui-monospace,SFMono-Regular,monospace}.path{max-width:320px;word-break:break-all}.notice{margin-top:14px;padding:12px;border-left:3px solid var(--gold);background:#fff8e7;color:#5b4933;font-size:13px}.footer{margin:20px 0;color:var(--muted);font-size:12px}.owner-box{display:flex;gap:8px;flex-wrap:wrap}.owner-box input{min-width:220px}@media(max-width:850px){.shell{padding:18px}.masthead{align-items:start;flex-direction:column}.cards{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.wide{grid-column:auto}.bar-row{grid-template-columns:minmax(100px,1fr) 2fr 40px}}@media(max-width:460px){.cards{grid-template-columns:1fr 1fr}.metric{font-size:28px}}
  </style>
</head>
<body>
  <section id="login" class="login hidden">
    <div class="eyebrow">Private analytics</div>
    <h1>访问统计后台</h1>
    <p class="subtle">数据包含加密保存的 IP 与访问路径，仅供站长使用。</p>
    <form id="login-form">
      <input id="password" type="password" autocomplete="current-password" placeholder="管理密码" required>
      <button class="primary" type="submit">登录</button>
      <div id="login-error" class="error"></div>
    </form>
  </section>

  <main id="app" class="shell hidden">
    <header class="masthead">
      <div><div class="eyebrow">stats.shenzhe.org</div><h1>博客访问观察室</h1><div id="updated" class="subtle"></div></div>
      <div class="toolbar">
        <select id="days" class="control"><option value="1">24 小时</option><option value="7">7 天</option><option value="30" selected>30 天</option></select>
        <label class="control"><input id="exclude-owner" type="checkbox" checked> 排除我的访问</label>
        <button id="refresh">刷新</button><button id="logout" class="danger">退出</button>
      </div>
    </header>

    <section class="cards">
      <article class="card"><div class="metric-label">页面浏览</div><div id="pageviews" class="metric">—</div></article>
      <article class="card"><div class="metric-label">访问会话</div><div id="visits" class="metric">—</div></article>
      <article class="card"><div class="metric-label">独立访客</div><div id="visitors" class="metric">—</div></article>
      <article class="card"><div class="metric-label">文章阅读</div><div id="article-views" class="metric">—</div></article>
    </section>

    <section class="grid">
      <article class="panel"><div class="panel-head"><h2>访问趋势</h2><span class="subtle">pageviews / day</span></div><div id="trend" class="chart"></div></article>
      <article class="panel"><h2>读者地区</h2><div id="locations" class="location-list"></div></article>
      <article class="panel"><h2>热门文章</h2><div id="articles" class="bars"></div></article>
      <article class="panel"><h2>设备与来源</h2><div id="devices" class="bars"></div><h2 style="margin-top:20px">引荐来源</h2><div id="referrers" class="bars"></div></article>
      <article class="panel wide">
        <div class="panel-head"><h2>最近访问</h2><span class="subtle">IP 为解密后的原始地址；“主机/标签”不是浏览器设备主机名</span></div>
        <div class="table-wrap"><table><thead><tr><th>时间</th><th>IP</th><th>主机/标签</th><th>地区</th><th>页面/文章</th><th>来源</th><th>设备</th><th>网络</th></tr></thead><tbody id="recent"></tbody></table></div>
      </article>
      <article class="panel wide">
        <h2>站长设备过滤</h2>
        <div class="owner-box"><input id="owner-label" maxlength="40" placeholder="例如：我的 MacBook"><button id="mark-owner" class="primary">标记当前设备并回溯 30 天</button></div>
        <div class="notice">浏览器不会向网站暴露电脑的本地主机名。这里用你设置的设备标签识别自己的访问；标记后会写入仅限 <code>.shenzhe.org</code> 的安全 Cookie，并将同一 IP 最近 30 天记录标为站长访问。</div>
      </article>
    </section>
    <footer class="footer">完整 IP 默认加密保存 30 天；地理位置来自 IP 推断，省/州和城市均可能存在误差。</footer>
  </main>

  <script>
    const $ = id => document.getElementById(id);
    const api = async (path, options = {}) => {
      const response = await fetch(path, {credentials:'same-origin', ...options, headers:{'Content-Type':'application/json', ...(options.headers||{})}});
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw Object.assign(new Error(body.error || '请求失败'), {status:response.status});
      return body;
    };
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const showLogin = () => {$('login').classList.remove('hidden');$('app').classList.add('hidden')};
    const showApp = () => {$('login').classList.add('hidden');$('app').classList.remove('hidden')};
    const bars = (id, rows, label, value='pageviews') => {
      const max = Math.max(1, ...rows.map(row => Number(row[value] || 0)));
      $(id).innerHTML = rows.length ? rows.map(row => '<div class="bar-row"><div class="bar-label" title="'+escapeHtml(row[label])+'">'+escapeHtml(row[label] || '直接访问')+'</div><div class="bar-track"><div class="bar-fill" style="width:'+Math.max(2,Number(row[value]||0)/max*100)+'%"></div></div><b>'+Number(row[value]||0)+'</b></div>').join('') : '<div class="subtle">暂无数据</div>';
    };
    const trend = rows => {
      if (!rows.length) {$('trend').innerHTML='<div class="subtle">暂无数据</div>';return}
      const width=760,height=220,pad=26,max=Math.max(1,...rows.map(r=>Number(r.pageviews||0)));
      const points=rows.map((r,i)=>{const x=pad+(width-pad*2)*(rows.length===1?.5:i/(rows.length-1));const y=height-pad-(height-pad*2)*Number(r.pageviews||0)/max;return {x,y,r}});
      const path=points.map((p,i)=>(i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1)).join(' ');
      const dots=points.map(p=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="3"><title>'+escapeHtml(p.r.date)+': '+p.r.pageviews+'</title></circle>').join('');
      $('trend').innerHTML='<svg viewBox="0 0 '+width+' '+height+'" role="img"><path d="M'+pad+' '+(height-pad)+'H'+(width-pad)+'" stroke="#d8d0c3" fill="none"/><path d="'+path+'" stroke="#a5742c" stroke-width="3" fill="none"/>'+dots+'</svg>';
    };
    const locationLabel = row => [row.country,row.region,row.city].filter(Boolean).join(' · ') || '未知地区';
    async function load(){
      const days=$('days').value,exclude=$('exclude-owner').checked?'1':'0';
      try{
        const data=await api('/api/dashboard?days='+days+'&excludeOwner='+exclude);
        showApp();$('pageviews').textContent=data.totals.pageviews;$('visits').textContent=data.totals.visits;$('visitors').textContent=data.totals.visitors;$('article-views').textContent=data.totals.articleViews;
        $('updated').textContent='更新于 '+new Date(data.generatedAt).toLocaleString();trend(data.trend);bars('articles',data.articles,'label');bars('devices',data.devices,'label');bars('referrers',data.referrers,'label');
        $('locations').innerHTML=data.locations.length?data.locations.map(row=>'<div class="location"><span>'+escapeHtml(locationLabel(row))+'</span><b>'+row.pageviews+'</b></div>').join(''):'<div class="subtle">暂无数据</div>';
        $('recent').innerHTML=data.recent.length?data.recent.map(row=>'<tr><td>'+escapeHtml(new Date(row.occurred_at).toLocaleString())+'</td><td class="ip">'+escapeHtml(row.ip)+'</td><td class="'+(row.is_owner?'owner':'')+'">'+escapeHtml(row.owner_label||row.visitor_label)+'</td><td>'+escapeHtml(locationLabel(row))+'</td><td class="path"><b>'+escapeHtml(row.title||'')+'</b><br>'+escapeHtml(row.path)+'</td><td>'+escapeHtml(row.referrer_host||'直接/应用内')+'</td><td>'+escapeHtml(row.device_type+' · '+row.browser+' · '+row.operating_system)+'</td><td>'+escapeHtml(row.as_organization||('AS'+(row.asn||'')))+'</td></tr>').join(''):'<tr><td colspan="8" class="subtle">暂无数据</td></tr>';
      }catch(error){if(error.status===401)showLogin();else alert(error.message)}
    }
    $('login-form').addEventListener('submit',async event=>{event.preventDefault();$('login-error').textContent='';try{await api('/api/login',{method:'POST',body:JSON.stringify({password:$('password').value})});$('password').value='';await load()}catch(error){$('login-error').textContent=error.message}});
    $('logout').addEventListener('click',async()=>{await api('/api/logout',{method:'POST',body:'{}'});showLogin()});
    $('refresh').addEventListener('click',load);$('days').addEventListener('change',load);$('exclude-owner').addEventListener('change',load);
    $('mark-owner').addEventListener('click',async()=>{const label=$('owner-label').value.trim();if(label.length<2){alert('请输入至少 2 个字符的设备标签');return}const result=await api('/api/owner-device',{method:'POST',body:JSON.stringify({label})});alert('已标记当前设备，并回溯标记 '+result.updated+' 条记录');await load()});
    load();setInterval(load,60000);
  </script>
</body>
</html>`

export const PRIVACY_HTML = String.raw`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>访问统计说明</title><style>body{max-width:720px;margin:60px auto;padding:0 22px;font:16px/1.8 system-ui;color:#222}h1,h2{font-family:serif}</style></head><body><h1>访问统计说明</h1><p>本站为了了解文章阅读情况和防止滥用，记录访问时间、页面路径、引荐来源、设备/浏览器类型、IP 地址及基于 IP 的近似地区。</p><h2>保护措施</h2><p>完整 IP 在服务端加密保存，看板不对公众开放，默认保留 30 天后删除。地区信息只是估算，不用于确定现实身份。</p><h2>选择与联系</h2><p>浏览器启用 Do Not Track 时，前端采集脚本会停止发送事件。如需查询或删除相关数据，请通过博客公开联系方式与站长联系。</p></body></html>`
