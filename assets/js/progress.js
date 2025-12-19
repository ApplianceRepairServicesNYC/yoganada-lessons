// Progress Tracking System
var WisdomProgress = (function() {
    var STORAGE_KEY = 'wisdompath_progress';
    var CHAPTER_SLUGS = ['ch1','ch2','ch3','ch4','ch5','ch6','ch7','ch8','ch9','ch10','ch11','ch12','ch13','ch14','ch15','ch16','ch17','ch18','ch19','ch20','ch21','ch22','ch23','ch24','ch25','ch26','ch27','ch28','ch29','ch30','ch31','ch32','ch33','ch34','ch35','ch36','ch37','ch38','ch39','ch40','ch41','ch42','ch43','ch44','ch45','ch46','ch47','ch48'];
    
    function getProgress() {
        try {
            var d = localStorage.getItem(STORAGE_KEY);
            return d ? JSON.parse(d) : { lessons: {} };
        } catch(e) {
            return { lessons: {} };
        }
    }
    
    function saveProgress(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch(e) {
            return false;
        }
    }
    
    function getLessonProgress(slug) {
        var p = getProgress();
        return p.lessons[slug] || null;
    }
    
    function getPathProgress() {
        var p = getProgress();
        var completed = 0;
        CHAPTER_SLUGS.forEach(function(s) {
            if (p.lessons[s] && p.lessons[s].completed) completed++;
        });
        return {
            total: CHAPTER_SLUGS.length,
            completed: completed,
            percent: Math.round((completed / CHAPTER_SLUGS.length) * 100)
        };
    }
    
    function markLessonViewed(slug) {
        var p = getProgress();
        if (!p.lessons[slug]) {
            p.lessons[slug] = {
                slug: slug,
                viewed: false,
                completed: false,
                quizScore: null,
                quizAttempts: 0
            };
        }
        if (!p.lessons[slug].viewed) {
            p.lessons[slug].viewed = true;
            p.lessons[slug].viewedAt = new Date().toISOString();
        }
        saveProgress(p);
    }
    
    function markLessonCompleted(slug, score, total) {
        var p = getProgress();
        if (!p.lessons[slug]) markLessonViewed(slug);
        p = getProgress();
        var lp = p.lessons[slug];
        lp.quizAttempts = (lp.quizAttempts || 0) + 1;
        lp.quizScore = score;
        lp.quizTotal = total;
        if (score >= total * 0.7) {
            lp.completed = true;
            lp.completedAt = new Date().toISOString();
        }
        p.lessons[slug] = lp;
        saveProgress(p);
    }
    
    function resetProgress() {
        if (confirm('Reset all progress? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    }
    
    // Update mini progress bar on chapter pages
    function updateMiniProgress() {
        var pp = getPathProgress();
        var miniBar = document.getElementById('progressMiniFill');
        var miniText = document.getElementById('progressMiniText');
        var miniContainer = document.getElementById('courseProgressMini');
        
        if (miniBar) miniBar.style.width = pp.percent + '%';
        if (miniText) {
            if (pp.percent === 100) {
                miniText.textContent = '🎉 100% Complete!';
                if (miniContainer) miniContainer.classList.add('complete');
            } else {
                miniText.textContent = pp.completed + ' of 48 complete (' + pp.percent + '%)';
            }
        }
    }
    
    // Update course index page progress display
    function updateCourseProgress() {
        var pp = getPathProgress();
        var p = getProgress();
        
        var completedEl = document.getElementById('completed-count');
        var percentEl = document.getElementById('progress-percent');
        var fillEl = document.getElementById('progress-fill');
        var textEl = document.getElementById('progress-text');
        var progressCard = document.getElementById('progress-card');
        var progressStatCard = document.getElementById('progress-stat-card');
        var continueBtn = document.getElementById('continue-btn');
        var headerText = document.getElementById('progress-header-text');
        
        if (completedEl) completedEl.textContent = pp.completed;
        if (percentEl) percentEl.textContent = pp.percent + '%';
        if (fillEl) fillEl.style.width = pp.percent + '%';
        
        // Find next incomplete lesson
        var nextSlug = null;
        for (var i = 0; i < CHAPTER_SLUGS.length; i++) {
            var lp = p.lessons[CHAPTER_SLUGS[i]];
            if (!lp || !lp.completed) {
                nextSlug = CHAPTER_SLUGS[i];
                break;
            }
        }
        
        // Handle completion states
        if (pp.percent === 100) {
            if (textEl) textEl.textContent = '🎉 Congratulations! You\'ve completed all 48 chapters!';
            if (headerText) headerText.textContent = '✨ Course Complete!';
            if (progressCard) progressCard.classList.add('complete');
            if (progressStatCard) progressStatCard.classList.add('complete');
        } else if (pp.completed > 0) {
            if (textEl) textEl.textContent = pp.completed + ' of ' + pp.total + ' chapters completed — Keep going!';
            
            // Show continue button
            if (nextSlug && continueBtn) {
                var nextLesson = document.querySelector('[data-lesson-slug="' + nextSlug + '"]');
                if (nextLesson) {
                    var nextUrl = nextLesson.getAttribute('data-lesson-url') || nextLesson.getAttribute('href');
                    if (nextUrl && nextUrl !== '#') {
                        continueBtn.href = nextUrl;
                        continueBtn.style.display = 'inline-flex';
                    }
                    // Highlight next lesson
                    if (!nextLesson.classList.contains('lesson-item-locked') || document.documentElement.classList.contains('course-unlocked')) {
                        nextLesson.classList.add('lesson-item-next');
                    }
                }
            }
        }
        
        // Update lesson badges
        document.querySelectorAll('.lesson-item').forEach(function(item) {
            var slug = item.getAttribute('data-lesson-slug');
            var progress = getLessonProgress(slug);
            if (progress) {
                var badge = item.querySelector('.lesson-badge');
                var arrow = item.querySelector('.lesson-arrow');
                if (progress.completed) {
                    item.classList.add('lesson-item-completed');
                    if (badge && !badge.classList.contains('badge-locked')) {
                        badge.textContent = '✓ Done';
                        badge.className = 'lesson-badge badge-completed';
                    }
                    if (arrow && arrow.textContent === '→') arrow.textContent = '✓';
                } else if (progress.viewed && badge && (badge.classList.contains('badge-free') || badge.textContent === 'Unlocked')) {
                    badge.textContent = 'In Progress';
                    badge.className = 'lesson-badge badge-progress';
                }
            }
        });
    }
    
    // Public API
    return {
        get: getProgress,
        save: saveProgress,
        getLesson: getLessonProgress,
        getPath: getPathProgress,
        markViewed: markLessonViewed,
        markCompleted: markLessonCompleted,
        reset: resetProgress,
        updateMini: updateMiniProgress,
        updateCourse: updateCourseProgress,
        slugs: CHAPTER_SLUGS
    };
})();

// Make resetProgress available globally
window.resetProgress = WisdomProgress.reset;
