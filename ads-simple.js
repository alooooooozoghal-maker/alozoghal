// سیستم تبلیغات الو ذغال
const defaultAds = {
    ads: [
        {
            id: 1,
            title: "پیتزا ایذه",
            description: "ارسال رایگان پیتزا در ایذه | تخفیف 20% اولین سفارش",
            imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            phone: "09123456789",
            link: "https://example.com"
        }
    ],
    stories: [
        {
            id: 1,
            title: "تخفیف ویژه",
            imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop",
            phone: "09220730628",
            url: "https://aloozoghal-hash.github.io/-Mir-mir-/"
        }
    ],
    tickers: [
        {
            text: "🔥 الو ذغال | سفارش آنلاین ذغال مرغوب | تحویل سریع در ایذه 🔥",
            phone: "09220730628"
        }
    ]
};

function loadAds() {
    loadVIPAds();
    loadStories();
}

function loadVIPAds() {
    const container = document.getElementById('vip-ad-container');
    if (!container) return;
    
    const savedAds = localStorage.getItem('aloozoghal_ads');
    let ads = [];
    
    if (savedAds) {
        try {
            ads = JSON.parse(savedAds);
        } catch (e) {
            ads = defaultAds.ads;
        }
    } else {
        ads = defaultAds.ads;
        localStorage.setItem('aloozoghal_ads', JSON.stringify(ads));
    }
    
    container.innerHTML = '';
    if (ads.length === 0) return;
    
    const ad = ads[ads.length - 1];
    const adHTML = `
        <div class="vip-ad-card">
            <img src="${ad.imageUrl}" alt="${ad.title}" class="vip-img" 
                 onerror="this.src='https://via.placeholder.com/80/333/fff?text=Ad'">
            <div class="vip-info">
                <h3 class="vip-title">${ad.title}</h3>
                <p class="vip-desc">${ad.description}</p>
                <a href="tel:${ad.phone}" class="btn-call-vip">📞 تماس بگیرید</a>
            </div>
        </div>
    `;
    container.innerHTML = adHTML;
}

function loadStories() {
    const container = document.getElementById('stories-container');
    if (!container) return;
    
    const savedStories = localStorage.getItem('aloozoghal_stories');
    let stories = [];
    
    if (savedStories) {
        try {
            stories = JSON.parse(savedStories);
        } catch (e) {
            stories = defaultAds.stories;
        }
    } else {
        stories = defaultAds.stories;
        localStorage.setItem('aloozoghal_stories', JSON.stringify(stories));
    }
    
    window.storiesData = stories;
    container.innerHTML = '';
    
    if (stories.length === 0) {
        container.innerHTML = '<p style="color: #ccc; text-align: center; width: 100%;">هیچ استوری‌ای وجود ندارد</p>';
        return;
    }
    
    stories.forEach((story, index) => {
        const storyHTML = `
            <div class="story-item" onclick="openStory(${index})">
                <div class="story-ring ${index === 0 ? 'active' : ''}">
                    <img src="${story.imageUrl}" alt="${story.title}"
                         onerror="this.src='https://via.placeholder.com/70/333/fff?text=Story'">
                </div>
                <div class="story-title">${story.title}</div>
            </div>
        `;
        container.innerHTML += storyHTML;
    });
}

// برای استفاده در پنل مدیریت
if (typeof window !== 'undefined') {
    window.loadAds = loadAds;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAds);
} else {
    loadAds();
    }
