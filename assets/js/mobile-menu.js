// Mobile Menu
(function(){
    var btn = document.getElementById('mobileMenuBtn');
    var menu = document.getElementById('mobileMenu');
    var overlay = document.getElementById('mobileMenuOverlay');
    var close = document.getElementById('mobileMenuClose');
    
    if (!btn || !menu) return;
    
    function open() {
        menu.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function shut() {
        menu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    btn.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    if (overlay) overlay.addEventListener('click', shut);
    
    document.querySelectorAll('.mobile-nav-link').forEach(function(l) {
        l.addEventListener('click', shut);
    });
})();
