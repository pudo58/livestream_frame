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

        if (!response.ok) throw new Error('HTTP ' + response.status);
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

        if (!response.ok) throw new Error('HTTP ' + response.status);
        const json = await response.json();
        renderDonations(json?.data?.items?.[0]?.ranks || []);
    } catch (error) {
        console.error('Lỗi getDonatorRanks:', error);
    }
}

function formatVND(amount) {
    const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return '';
    return Math.round(num).toLocaleString('vi-VN') + 'đ';
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
        donateList.innerHTML = '<div class="donate-empty">Chưa có donate hôm nay</div>';
        return;
    }

    donateList.innerHTML = '';
    ranks.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'donate-item' + (i === 0 ? ' top-1' : '');

        const medal = document.createElement('span');
        medal.className = 'medal ' + medalClass(i);
        medal.textContent = i < 3 ? (i + 1) : (i + 1);

        const donor = document.createElement('span');
        donor.className = 'donor';
        donor.textContent = r.name || 'Ẩn danh';

        const amt = document.createElement('span');
        amt.className = 'amt';
        amt.textContent = formatVND(r.amount);

        div.appendChild(medal);
        div.appendChild(donor);
        div.appendChild(amt);
        donateList.appendChild(div);
    });

    if (window.initDonateHighlight) window.initDonateHighlight();
}

loginAnonymous();
setInterval(getDonatorRanks, getDonateRefreshMs());
