/**
 * 高中物理知识体系 - 交互脚本
 * 提供章节导航、内容切换、动画效果等功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化
    initChapterNavigation();
    initScrollEffects();
    initKeyframes();
});

/**
 * 章节导航功能
 */
function initChapterNavigation() {
    const chapterItems = document.querySelectorAll('.chapter-item');
    const chapterContents = document.querySelectorAll('.chapter-content');

    chapterItems.forEach(item => {
        item.addEventListener('click', function() {
            const chapterNum = this.getAttribute('data-chapter');

            // 移除所有 active 状态
            chapterItems.forEach(i => i.classList.remove('active'));
            chapterContents.forEach(c => c.classList.remove('active'));

            // 添加 active 状态到当前章节
            this.classList.add('active');
            const targetContent = document.getElementById(`chapter-${chapterNum}`);
            if (targetContent) {
                targetContent.classList.add('active');
                // 平滑滚动到内容区域
                targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // 更新 URL hash
            history.pushState(null, null, `#chapter-${chapterNum}`);
        });
    });

    // 处理页面加载时的 hash
    if (window.location.hash) {
        const chapterNum = window.location.hash.replace('#chapter-', '');
        const targetItem = document.querySelector(`[data-chapter="${chapterNum}"]`);
        if (targetItem) {
            targetItem.click();
        }
    }

    // 监听浏览器前进后退按钮
    window.addEventListener('popstate', function() {
        if (window.location.hash) {
            const chapterNum = window.location.hash.replace('#chapter-', '');
            const targetItem = document.querySelector(`[data-chapter="${chapterNum}"]`);
            if (targetItem) {
                targetItem.click();
            }
        }
    });
}

/**
 * 滚动效果
 */
function initScrollEffects() {
    // 监听滚动事件，添加元素进场动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 观察所有章节内容
    document.querySelectorAll('.chapter-content').forEach(section => {
        observer.observe(section);
    });

    // 滚动时更新侧边栏导航状态
    window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
}

/**
 * 根据滚动位置更新侧边栏导航
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('.chapter-content');
    const navItems = document.querySelectorAll('.chapter-item');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id').replace('chapter-', '');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-chapter') === currentSection) {
            item.classList.add('active');
        }
    });
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 初始化关键帧动画
 */
function initKeyframes() {
    // 不再使用内联样式，而是通过 CSS 类来处理动画
    // 这样可以避免与 display: none 冲突
}

/**
 * 显示通知消息
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const colors = {
        info: '#00f0ff',
        success: '#00ff88',
        warning: '#ffaa00',
        error: '#ff006e'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: rgba(10, 10, 30, 0.95);
        border: 1px solid ${colors[type]};
        border-radius: 10px;
        color: ${colors[type]};
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 0 20px ${colors[type]}40;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * 键盘导航支持
 */
document.addEventListener('keydown', function(e) {
    const activeItem = document.querySelector('.chapter-item.active');
    const allItems = Array.from(document.querySelectorAll('.chapter-item'));
    const currentIndex = allItems.indexOf(activeItem);

    if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, allItems.length - 1);
        allItems[nextIndex].click();
        allItems[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        allItems[prevIndex].click();
        allItems[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (e.key === 'Home') {
        e.preventDefault();
        allItems[0].click();
    }

    if (e.key === 'End') {
        e.preventDefault();
        allItems[allItems.length - 1].click();
    }
});

// 添加键盘导航样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 打印友好提示
console.log('%c🚀 高中物理知识体系', 'font-size: 20px; color: #00f0ff; font-weight: bold;');
console.log('%c使用方向键 ↑↓ 或 j/k 导航章节', 'color: #a0a0c0;');
console.log('%c使用 Home/End 跳转到首尾章节', 'color: #a0a0c0;');
