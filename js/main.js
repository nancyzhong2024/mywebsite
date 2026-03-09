document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    // 点击导航切换内容
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有 active 类
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // 添加 active 类到当前点击项
            this.classList.add('active');
            
            // 显示对应的内容区
            const target = this.getAttribute('data-target');
            const targetPage = document.getElementById(target);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // 滚动到顶部
            document.querySelector('.content').scrollTop = 0;
        });
    });
    
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        const activeIndex = Array.from(navItems).findIndex(item => item.classList.contains('active'));
        
        if (e.key === 'ArrowDown' || e.key === 'j') {
            e.preventDefault();
            const nextIndex = (activeIndex + 1) % navItems.length;
            navItems[nextIndex].click();
        } else if (e.key === 'ArrowUp' || e.key === 'k') {
            e.preventDefault();
            const prevIndex = (activeIndex - 1 + navItems.length) % navItems.length;
            navItems[prevIndex].click();
        }
    });
});
