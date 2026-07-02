const apiAuthUrl = 'https://api.wescan.vn/api/v1/users/login/anonymous';
let data = {};

function getDonateRefreshMs() {
    try {
        const cfg = JSON.parse(document.getElementById('overlay-config')?.textContent || '{}');
        return cfg.donateRefreshMs || 300000;
    } catch {
        return 300000;
    }
}

async function loginAnonymous() {
    try {
        const response = await fetch(apiAuthUrl, {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                'origin': 'https://stream.wescan.vn',
                'referer': 'https://stream.wescan.vn/'
            },
            body: null
        });

        if (!response.ok) throw new Error(`HTTP Error! status: ${response.status}`);

        data = await response.json();
        await getDonatorRanks();
    } catch (error) {
        console.error('Lỗi login:', error);
    }
}

async function getDonatorRanks() {
    try {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
        const url = `https://api.wescan.vn/api/v1/donator_ranks?user_id=ce760a6986b0449fa321c1df6400fd5a&sort_by=base_price&sort_type=desc&limit=100&min_donate=4900&to_date=${encodeURIComponent(formattedDate)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'authorization': data?.data?.token,
                'origin': 'https://stream.wescan.vn',
                'referer': 'https://stream.wescan.vn/'
            }
        });

        if (!response.ok) throw new Error(`HTTP Error! status: ${response.status}`);

        const json = await response.json();
        const ranks = json?.data?.items?.[0]?.ranks || [];
        renderDonations(ranks);
    } catch (error) {
        console.error('Lỗi getDonatorRanks:', error);
    }
}

function formatK(amount) {
    const num = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(num)) return '';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return Math.round(num / 1000) + 'k';
    return num.toLocaleString('vi-VN') + 'đ';
}

function medalClass(index) {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return 'normal';
}

function renderDonations(ranks) {
    const donateList = document.getElementById('donateList');

    if (!ranks.length) {
        donateList.innerHTML = `
            <div class="donate-empty" id="donateEmpty">
                <svg viewBox="0 0 48 48" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M24 4l4 8h8l-6 6 2 8-8-5-8 5 2-8-6-6h8z"/>
                </svg>
                <span>Chưa có donate hôm nay</span>
            </div>`;
        return;
    }

    donateList.innerHTML = '';

    ranks.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'donate-item' + (i === 0 ? ' top-1' : '');

        const medal = document.createElement('span');
        medal.className = `rank-medal ${medalClass(i)}`;
        medal.textContent = i + 1;

        const donor = document.createElement('span');
        donor.className = 'donor';
        donor.textContent = r.name || 'Ẩn danh';

        const amt = document.createElement('span');
        amt.className = 'amt';
        amt.textContent = formatK(r.amount);

        div.appendChild(medal);
        div.appendChild(donor);
        div.appendChild(amt);

        donateList.appendChild(div);
    });

    if (window.initDonateHighlight) window.initDonateHighlight();
}

loginAnonymous();
setInterval(getDonatorRanks, getDonateRefreshMs());
