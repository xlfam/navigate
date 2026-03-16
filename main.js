// main.js
async function loadConfig() {
    const url = document.getElementById('configUrl').value;
    let config;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('加载失败');
        const text = await res.text();
        if (url.endsWith('.yaml') || url.endsWith('.yml')) {
            config = window.jsyaml.load(text);
        } else {
            config = JSON.parse(text);
        }
        renderNav(config);
    } catch (e) {
        document.getElementById('navList').innerHTML = '<div style="color:red">配置加载失败：'+e+'</div>';
    }
}

function renderNav(config) {
    if (!config || !Array.isArray(config.links)) {
        document.getElementById('navList').innerHTML = '<div style="color:red">配置格式错误</div>';
        return;
    }
    const html = config.links.map(item =>
        `<div class="nav-item"><a href="${item.url}" target="_blank">${item.name}</a></div>`
    ).join('');
    document.getElementById('navList').innerHTML = html;
}

// 页面加载时自动加载默认配置
window.addEventListener('DOMContentLoaded', () => {
    loadConfig();
});
