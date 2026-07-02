function loadConfig() {
    try {
        const el = document.getElementById('overlay-config');
        return el ? JSON.parse(el.textContent) : {};
    } catch {
        return {};
    }
}

const CONFIG = loadConfig();

function applyConfig() {
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    set('streamerName', CONFIG.streamer);
    set('streamerTagline', CONFIG.tagline);
    set('roleBadge', CONFIG.role);
    set('champBadge', CONFIG.mainChamp ? `${CONFIG.mainChamp} Main` : null);
    set('rankBadge', CONFIG.rank);
    if (CONFIG.winRate) set('winRateBadge', `${CONFIG.winRate} WR`);

    const ticker = document.getElementById('tickerContent');
    if (ticker && CONFIG.ticker?.length) {
        const items = CONFIG.ticker.map(t => `<span>${t}</span>`).join('');
        ticker.innerHTML = items + items;
    }
}

applyConfig();

(function () {
    const zone = document.querySelector('.panel.chat');
    const iframe = document.getElementById('ytChat');
    if (!zone || !iframe) return;

    const host = location.hostname || 'localhost';
    const vid = (zone.dataset.videoId || new URLSearchParams(location.search).get('v') || '').trim();

    if (vid) {
        iframe.src = `https://www.youtube.com/live_chat?v=${vid}&embed_domain=${host}&dark_theme=1`;
    } else {
        iframe.removeAttribute('src');
    }
})();

window.initDonateHighlight = function () {
    const items = [...document.querySelectorAll('.donate-item')];
    if (!items.length) return;
    let i = 0;
    if (window._donateHighlightTimer) clearInterval(window._donateHighlightTimer);
    window._donateHighlightTimer = setInterval(() => {
        items.forEach((el, idx) => {
            el.style.borderColor = idx === i ? 'rgba(200, 170, 110, 0.5)' : '';
        });
        i = (i + 1) % items.length;
    }, 3000);
};
