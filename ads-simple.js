// سیستم بارگذاری تبلیغات برای الو ذغال
// نسخه 1.1 - با پشتیبانی از شماره تماس در استوری‌ها

const ADS_DATA_URL = 'ads-data.json';

// بارگذاری تبلیغات VIP
async function loadAds() {
    try {
        const response = await fetch(ADS_DATA_URL);
        if (!response.ok) {
            throw new Error(`خطا در دریافت تبلیغات: ${response.status}`);
        }
        
        const data = await response.json();
        displayAds(data.ads || []);
        displayStories(data.stories || []);
        
        // ذخیره تیکرها در localStorage
        if(data.tickers && data.tickers.length > 0) {
            localStorage.setItem('aloozoghal_tickers', JSON.stringify(data.tickers));
        }
        
        console.log('تبلیغات با موفقیت بارگذاری شدند');
        
    } catch (error) {
        console.error('خطا در بارگذاری تبلیغات:', error);
        // استفاده از تبلیغات پیش‌فرض
        loadDefaultAds();
    }
}

// نمایش تبلیغات VIP
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
    
    // تغییر خودکار تبلیغ هر 30 ثانیه
    setTimeout(() => {
        if(ads.length > 1) {
            displayAds(ads);
        }
    }, 30000);
}

// نمایش استوری‌ها
function displayStories(stories) {
    const container = document.getElementById('stories-container');
    if (!container) return;
    
    if (!stories || stories.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    container.innerHTML = '';
    
    // اضافه کردن دکمه افزودن استوری (فقط برای مدیر)
    const addStoryHtml = `
        <div class="story-item">
            <div class="story-ring add-btn" onclick="window.open('admin-panel.html', '_blank')" style="cursor: pointer; border: 2px dashed var(--gold);">
                <span style="font-size: 24px; color: var(--gold);">+</span>
            </div>
            <span class="story-title">تبلیغ شما</span>
        </div>
    `;
    
    container.innerHTML = addStoryHtml;
    
    // اضافه کردن استوری‌ها
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

// تبلیغات پیش‌فرض
function loadDefaultAds() {
    const defaultAds = [
        {
            id: 1,
            title: "پیتزا ایذه",
            description: "پیتزای داغ با بهترین مواد اولیه. تحویل رایگان در ایذه",
            imageUrl: "https://via.placeholder.com/300x300/333/fff?text=Pizza+Ad",
            phone: "09123456789",
            link: null
        },
        {
            id: 2,
            title: "قهوه‌خانه سنتی",
            description: "محلی دنج برای استراحت و نوشیدن چای و قهوه",
            imageUrl: "https://via.placeholder.com/300x300/333/fff?text=Coffee+Shop",
            phone: "09129876543",
            link: "https://example.com"
        }
    ];
    
    const defaultStories = [
        {
            id: 1,
            title: "تخفیف ویژه",
            imageUrl: "https://via.placeholder.com/300x300/333/fff?text=Discount+50%",
            phone: "09123456789",
            url: "#"
        },
        {
            id: 2,
            title: "محصول جدید",
            imageUrl: "https://via.placeholder.com/300x300/333/fff?text=New+Product",
            phone: "09129876543",
            url: "#"
        }
    ];
    
    displayAds(defaultAds);
    displayStories(defaultStories);
}

// بارگذاری استوری‌ها از localStorage (برای backup)
function loadStories() {
    try {
        const savedStories = localStorage.getItem('aloozoghal_stories');
        if(savedStories) {
            const stories = JSON.parse(savedStories);
            if(stories.length > 0) {
                displayStories(stories);
            }
        }
    } catch(e) {
        console.error('خطا در بارگیری استوری‌ها از localStorage:', e);
    }
}

// بارگذاری خودکار تبلیغات
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAds);
} else {
    loadAds();
}
