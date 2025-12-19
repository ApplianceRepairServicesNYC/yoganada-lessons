// Focus Mode for Quizzes
var FocusMode = (function() {
    var focusBar = null;
    var exitFocusBtn = null;
    var quizActive = false;
    var quizComplete = false;
    
    function init() {
        focusBar = document.getElementById('focusBar');
        exitFocusBtn = document.getElementById('exitFocus');
        if (exitFocusBtn) {
            exitFocusBtn.onclick = exit;
        }
    }
    
    function enter() {
        document.body.classList.add('focus-mode');
        quizActive = true;
    }
    
    function exit() {
        if (quizActive && !quizComplete) {
            if (!confirm('Exit the quiz? Your progress will be lost.')) return;
        }
        document.body.classList.remove('focus-mode');
        var quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.classList.remove('active');
            quizContainer.style.display = 'none';
        }
        var lessonContent = document.getElementById('lesson-content');
        if (lessonContent) {
            lessonContent.style.display = 'block';
        }
        quizActive = false;
    }
    
    function updateProgress(current, total) {
        var pct = (current / total) * 100;
        var fill = document.getElementById('focusProgressFill');
        var text = document.getElementById('focusProgressText');
        if (fill) fill.style.width = pct + '%';
        if (text) text.textContent = current + '/' + total;
    }
    
    function setComplete() {
        quizComplete = true;
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Public API
    return {
        enter: enter,
        exit: exit,
        updateProgress: updateProgress,
        setComplete: setComplete
    };
})();

// Make available globally
window.focusMode = FocusMode;
