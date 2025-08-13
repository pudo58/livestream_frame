// Dust particles
const dust = document.getElementById('dust'), dtx = dust.getContext('2d');
let W, H, DPR; function fit() { DPR = Math.min(devicePixelRatio || 1, 2); W = dust.width = innerWidth * DPR; H = dust.height = innerHeight * DPR; }
window.addEventListener('resize', fit); fit();
const P = []; for (let i = 0; i < 180; i++) { const s = Math.random(); P.push({ x: Math.random() * W, y: Math.random() * H, r: s * 2 + .4, vx: (Math.random() - .5) * .10, vy: (Math.random() - .5) * .10, z: s < .3 ? .6 : (s < .7 ? 1 : 1.6) }) }
; (function loop() {
    dtx.clearRect(0, 0, W, H); for (const p of P) {
        p.x += p.vx * p.z; p.y += p.vy * p.z; if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const g = dtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 10); g.addColorStop(0, 'rgba(255,211,107,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        dtx.fillStyle = g; dtx.beginPath(); dtx.arc(p.x, p.y, p.r * 10, 0, Math.PI * 2); dtx.fill();
        dtx.fillStyle = 'rgba(255,255,255,.35)'; dtx.beginPath(); dtx.arc(p.x, p.y, p.r, 0, Math.PI * 2); dtx.fill();
    } requestAnimationFrame(loop)
})();

// Bokeh floating
const bokeh = document.getElementById('bokeh'), btx = bokeh.getContext('2d');
function fitB() { bokeh.width = W; bokeh.height = H } window.addEventListener('resize', fitB); fitB();
const B = []; for (let i = 0; i < 40; i++) { B.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 28 + 10, s: Math.random() * .4 + .1 }) }
; (function loopB() {
    btx.clearRect(0, 0, W, H); btx.globalCompositeOperation = 'lighter'; for (const b of B) {
        b.y -= b.s; if (b.y < -b.r) b.y = H + b.r; const grad = btx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, 'rgba(255,232,166,.12)'); grad.addColorStop(1, 'rgba(0,0,0,0)'); btx.fillStyle = grad; btx.beginPath(); btx.arc(b.x, b.y, b.r, 0, Math.PI * 2); btx.fill();
    } requestAnimationFrame(loopB)
})();

// Donate highlight cycle
(function () {
    const items = [...document.querySelectorAll('.donate-item')]; if (!items.length) return;
    let i = 0; setInterval(() => {
        items.forEach((el, idx) => {
            const active = idx === i;
            el.style.outline = active ? '2px solid var(--gold)' : '1px solid #3a4aa0';
            el.style.boxShadow = active ? '0 0 36px #ffd36b66, 0 18px 48px #000a' : '0 18px 48px #000a';
            if (active) { el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 720, easing: 'ease-out' }); }
        }); i = (i + 1) % items.length;
    }, 2400);
})();

(function () {
    const zone = document.querySelector('.zone.chat');
    const iframe = document.getElementById('ytChat');
    if (!zone || !iframe) return;

    const host = location.hostname || 'localhost';
    // Ưu tiên data-video-id; nếu không có, lấy ?v=... trên URL trang
    const vid = (zone.dataset.videoId || new URLSearchParams(location.search).get('v') || '').trim();
    
    if (vid) {
        iframe.src = `https://www.youtube.com/live_chat?v=${vid}&embed_domain=${host}&dark_theme=1`;
    } else {
        // chưa có videoId -> để trống để nhìn thấy nền, không lỗi
        iframe.removeAttribute('src');
    }
})();

// Parallax tilt
const tilts = [...document.querySelectorAll('.tilt')];
document.addEventListener('mousemove', (e) => {
    const cx = innerWidth / 2, cy = innerHeight / 2; const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    tilts.forEach(el => {
        const depth = parseFloat(el.dataset.depth || 1);
        const rot = parseFloat(el.dataset.tiltRot || 3);
        const tx = parseFloat(el.dataset.tiltX || 2);
        const ty = parseFloat(el.dataset.tiltY || 2);
        el.style.transform = `perspective(1200px) rotateY(${dx * rot * depth}deg) rotateX(${-dy * rot * depth}deg) translate3d(${dx * tx * depth}px, ${dy * ty * depth}px, 0)`;
    });
});

