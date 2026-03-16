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
        window._navConfig = config;
        renderNav(config);
    } catch (e) {
        document.getElementById('navList').innerHTML = '<div style="color:red">配置加载失败：'+e+'</div>';
    }
}

function renderNav(config) {
    // 支持二级分类：config.categories [{ name, subcategories: [{ name, links: [...] }] }]
    let html = '';
    if (config.categories && Array.isArray(config.categories)) {
        html = config.categories.map(cat => {
            return `<div class="category">
                <div class="category-title">${cat.name}</div>
                ${cat.subcategories && Array.isArray(cat.subcategories) ? cat.subcategories.map(sub => {
                    return `<div class="subcategory">
                        <div class="subcategory-title">${sub.name}</div>
                        <div class="nav-grid">
                            ${sub.links.map(item => renderCard(item)).join('')}
                        </div>
                    </div>`;
                }).join('') : ''}
            </div>`;
        }).join('');
    } else if (config.links && Array.isArray(config.links)) {
        // 兼容原有格式
        html = `<div class="nav-grid">${config.links.map(item => renderCard(item)).join('')}</div>`;
    } else {
        html = '<div style="color:red">配置格式错误</div>';
    }
    document.getElementById('navList').innerHTML = html;
}

function renderCard(item) {
    let urlObj;
    try {
        urlObj = new URL(item.url);
    } catch {
        urlObj = null;
    }
    const favicon = urlObj ? `${urlObj.origin}/favicon.ico` : '';
    return `<div class="card">
        <img src="${favicon}" alt="icon" onerror="this.style.display='none'">
        <a href="${item.url}" target="_blank">${item.name}</a>
    </div>`;
}

function filterNav() {
    const keyword = document.getElementById('searchBar').value.trim().toLowerCase();
    const config = window._navConfig;
    if (!config) return;
    if (!keyword) {
        renderNav(config);
        return;
    }
    // 搜索二级分类和网址
    let filtered = {};
    if (config.categories && Array.isArray(config.categories)) {
        filtered.categories = config.categories.map(cat => {
            const subcats = (cat.subcategories || []).map(sub => {
                const links = (sub.links || []).filter(item =>
                    item.name.toLowerCase().includes(keyword) ||
                    item.url.toLowerCase().includes(keyword)
                );
                return links.length > 0 || sub.name.toLowerCase().includes(keyword)
                    ? { name: sub.name, links } : null;
            }).filter(Boolean);
            return subcats.length > 0 || cat.name.toLowerCase().includes(keyword)
                ? { name: cat.name, subcategories: subcats } : null;
        }).filter(Boolean);
    } else if (config.links && Array.isArray(config.links)) {
        filtered.links = config.links.filter(item =>
            item.name.toLowerCase().includes(keyword) ||
            item.url.toLowerCase().includes(keyword)
        );
    }
    renderNav(filtered);
}
}

// 页面加载时自动加载默认配置
window.addEventListener('DOMContentLoaded', () => {
    loadConfig();
});
