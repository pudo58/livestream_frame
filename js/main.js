const apiAuthUrl = 'https://api.wescan.vn/api/v1/users/login/anonymous';
let data = {};

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
        console.log('Token:', data?.data?.token);

        // Chỉ gọi khi login xong
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
                'authorization': data?.data?.token, // lấy token sau khi login
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
    // API có thể trả về chuỗi; cố gắng chuyển sang số trước khi xử lý
    const num = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(num)) return '';
    return Math.round(num / 1000) + 'k';
}

function renderDonations(ranks) {
    const donateList = document.getElementById('donateList');
    donateList.innerHTML = '';

    ranks.forEach(r => {
        const div = document.createElement('div');
        div.className = 'donate-item';

        const donor = document.createElement('span');
        donor.className = 'donor';
        donor.textContent = r.name || 'Ẩn danh';

        const amt = document.createElement('span');
        amt.className = 'amt';
        amt.textContent = formatK(r.amount);

        const glint = document.createElement('span');
        glint.className = 'glint';

        div.appendChild(donor);
        div.appendChild(amt);
        div.appendChild(glint);

        donateList.appendChild(div);
    });
}

// Chạy
loginAnonymous();
