// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});



// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message. I will get back to you soon!');
            this.reset();
        });
    }
    
    // Load recent articles on main page
    loadRecentArticles();
});

// Load recent articles for main page
function loadRecentArticles() {
    const recentContainer = document.getElementById('recentArticles');
    if (!recentContainer) return;
    
    // Load articles from all categories
    Promise.all([
        fetch('data/portfolio.json').then(r => r.json()),
        fetch('data/market-outlook.json').then(r => r.json()),
        fetch('data/insights.json').then(r => r.json())
    ])
    .then(([portfolio, market, insights]) => {
        const allArticles = [
            ...portfolio.articles.slice(0, 2),
            ...market.articles.slice(0, 2),
            ...insights.articles.slice(0, 2)
        ];
        
        recentContainer.innerHTML = '';
        allArticles.forEach(article => {
            const articleElement = createRecentArticle(article);
            recentContainer.appendChild(articleElement);
        });
    })
    .catch(error => console.error('Error loading recent articles:', error));
}

function createRecentArticle(article) {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';
    
    col.innerHTML = `
        <div class="article-card">
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}">
                <div class="article-overlay">
                    <span class="article-category">${article.category || article.series || 'Article'}</span>
                </div>
            </div>
            <div class="article-content">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="article-meta">
                    <span class="article-date">${article.date || article.quarter + ' ' + article.year}</span>
                    <span class="article-read-time">${article.readTime || '5 min read'}</span>
                </div>
                <a href="${article.url}" class="btn btn-primary btn-sm">Read More</a>
            </div>
        </div>
    `;
    
    return col;
}

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '15px 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all article cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.article-card, .category-card, .series-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
