// سیستم بارگذاری تبلیغات برای الو ذغال
// نسخه 1.3 - بدون هیچ تبلیغ پیشفرض

const ADS_DATA_URL = 'ads-data.json';

// بارگذاری تبلیغات VIP
async function loadAds() {
    try {
        const response = await fetch(ADS_DATA_URL);
        if (!response.ok) {
            throw new Error(`خطا در دریافت تبلیغات: ${response.status}`);
        }
        
        const data = await response.json();
        
        // اگر داده‌ای در فایل json نبود، از localStorage بارگذاری کن
        if (!data.ads || data.ads.length === 0) {
            const savedAds = localStorage.getItem('aloozoghal_ads');
            if (savedAds) {
                data.ads = JSON.parse(savedAds);
            }
        }
        
        if (!data.stories || data.stories.length === 0) {
            const savedStories = localStorage.getItem('aloozoghal_stories');
            if (savedStories) {
                data.stories = JSON.parse(savedStories);
            }
        }
        
        if (!data.tickers || data.tickers.length === 0) {
            const savedTickers = localStorage.getItem('aloozoghal_tickers');
            if (savedTickers) {
                data.tickers = JSON.parse(savedTickers);
            }
        }
        
        displayAds(data.ads || []);
        displayStories(data.stories || []);
        
        // ذخیره تیکرها در localStorage (برای استفاده در تیکر)
        if (data.tickers && data.tickers.length > 0) {
            localStorage.setItem('aloozoghal_tickers', JSON.stringify(data.tickers));
        }
        
        console.log('تبلیغات با موفقیت بارگذاری شدند');
        
    } catch (error) {
        console.error('خطا در بارگذاری تبلیغات:', error);
        // اگر فایل ads-data.json وجود نداشت، از localStorage بارگذاری کن
        loadFromLocalStorage();
    }
}

function loadFromLocalStorage() {
    const ads = JSON.parse(localStorage.getItem('aloozoghal_ads') || '[]');
    const stories = JSON.parse(localStorage.getItem('aloozoghal_stories') || '[]');
    const tickers = JSON.parse(localStorage.getItem('aloozoghal_tickers') || '[]');
    
    displayAds(ads);
    displayStories(stories);
    
    // تیکرها در initTicker در index.html مدیریت می‌شوند
}

// نمایش تبلیغات VIP - با چرخش 5 ثانیه‌ای
function displayAds(ads) {
    const container = document.getElementById('vip-ad-container');
    if (!container) return;
    
    if (!ads || ads.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    // انتخاب تبلیغ تصادفی
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    
    const adHtml = `
        <div class="vip-ad-card fade-anim">
            <img src="${randomAd.imageUrl}" alt="${randomAd.title}" class="vip-img" onerror="this.src='https://via.placeholder.com/300x300/333/fff?text=Ad'">
            <div class="vip-info">
                <div class="vip-title">${randomAd.title}</div>
                <div class="vip-desc">${randomAd.description}</div>
                ${randomAd.phone ? `<a href="tel:${randomAd.phone}" class="btn-call-vip">📞 تماس بگیرید</a>` : ''}
            </div>
        </div>
    `;
    
    container.innerHTML = adHtml;
    
    // تغییر خودکار تبلیغ هر 5 ثانیه (اگر بیش از یک تبلیغ وجود داشته باشد)
    if (ads.length > 1) {
        setTimeout(() => {
            displayAds(ads);
        }, 5000);
    }
}

// نمایش استوری‌ها - کاملاً خالی، هیچ استوری ثابتی وجود ندارد
function displayStories(stories) {
    const container = document.getElementById('stories-container');
    if (!container) return;
    
    if (!stories || stories.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    container.innerHTML = '';
    
    // فقط استوری‌های بارگذاری شده نمایش داده می‌شوند
    // هیچ استوری ثابت "تبلیغ شما" وجود ندارد
    
    stories.forEach((story, index) => {
        const storyHtml = `
            <div class="story-item" onclick="openStory(${index})">
                <div class="story-ring ${index === 0 ? 'active' : ''}">
                    <img src="${story.imageUrl}" alt="${story.title}" onerror="this.src='https://via.placeholder.com/100/333/fff?text=Story'">
                </div>
                <span class="story-title">${story.title}</span>
            </div>
        `;
        container.innerHTML += storyHtml;
    });
    
    // ذخیره استوری‌ها در window برای دسترسی در مودال
    window.storiesData = stories;
}

// بارگذاری خودکار تبلیغات
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAds);
} else {
    loadAds();
}
