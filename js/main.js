const apiAuthUrl = 'https://api.wescan.vn/api/v1/users/login/anonymous'
let data = {}
async function loginAnonymous() {
    try {
        const response = await fetch(apiAuthUrl, {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                'origin': 'https://stream.wescan.vn',
                'referer': 'https://stream.wescan.vn/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            },
            body: null // Không gửi dữ liệu
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }

        data = await response.json();
        console.log('Kết quả:', data);
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

loginAnonymous();

async function getDonatorRanks() {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day}`;
        const url = `https://api.wescan.vn/api/v1/donator_ranks?user_id=ce760a6986b0449fa321c1df6400fd5a&sort_by=base_price&sort_type=desc&limit=100&min_donate=4900&to_date=${encodeURIComponent(formattedDate)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                'authorization': data?.data.token,
                'origin': 'https://stream.wescan.vn',
                'referer': 'https://stream.wescan.vn/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }

        const json = await res.json();
        const ranks = json?.data?.items?.[0]?.ranks || [];
        renderDonations(ranks);
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

getDonatorRanks();



function formatK(amount) {
    if (typeof amount !== 'number') return '';
    return Math.round(amount / 1000) + 'k';
}

function renderDonations(ranks) {
    const donateList = document.getElementById('donateList');
    donateList.innerHTML = ''; // clear cũ

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