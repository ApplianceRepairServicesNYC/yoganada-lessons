/**
 * Wisdom Path Learning App - Progress Tracking
 * Handles localStorage-based progress for lessons and quizzes
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'wisdompath_progress';
    const VERSION_KEY = 'wisdompath_version';
    const CURRENT_VERSION = '1.0';

    // Initialize progress data structure
    function initProgress() {
        const version = localStorage.getItem(VERSION_KEY);
        
        // Check if we need to migrate or initialize
        if (!version || version !== CURRENT_VERSION) {
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        }
        
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            const initialData = {
                lessons: {},
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
        
        return getProgress();
    }

    // Get all progress data
    function getProgress() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : initProgress();
        } catch (e) {
            console.error('Error reading progress:', e);
            return { lessons: {}, lastUpdated: null };
        }
    }

    // Save progress data
    function saveProgress(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving progress:', e);
            return false;
        }
    }

    // Get progress for a specific lesson
    function getLessonProgress(slug) {
        const progress = getProgress();
        return progress.lessons[slug] || null;
    }

    // Mark lesson as viewed
    function markLessonViewed(slug) {
        const progress = getProgress();
        
        if (!progress.lessons[slug]) {
            progress.lessons[slug] = {
                slug: slug,
                viewed: false,
                viewedAt: null,
                completed: false,
                completedAt: null,
                quizScore: null,
                quizAttempts: 0
            };
        }
        
        if (!progress.lessons[slug].viewed) {
            progress.lessons[slug].viewed = true;
            progress.lessons[slug].viewedAt = new Date().toISOString();
        }
        
        return saveProgress(progress);
    }

    // Mark lesson as completed (quiz passed)
    function markLessonCompleted(slug, score, totalQuestions) {
        const progress = getProgress();
        
        if (!progress.lessons[slug]) {
            markLessonViewed(slug);
        }
        
        const lessonProgress = progress.lessons[slug];
        lessonProgress.quizAttempts = (lessonProgress.quizAttempts || 0) + 1;
        lessonProgress.quizScore = score;
        lessonProgress.quizTotal = totalQuestions;
        
        // Consider completed if score is 70% or higher
        if (score >= totalQuestions * 0.7) {
            lessonProgress.completed = true;
            lessonProgress.completedAt = new Date().toISOString();
        }
        
        progress.lessons[slug] = lessonProgress;
        return saveProgress(progress);
    }

    // Get overall learning path progress
    function getPathProgress(lessonSlugs) {
        const progress = getProgress();
        let viewed = 0;
        let completed = 0;
        
        lessonSlugs.forEach(function(slug) {
            const lessonProgress = progress.lessons[slug];
            if (lessonProgress) {
                if (lessonProgress.viewed) viewed++;
                if (lessonProgress.completed) completed++;
            }
        });
        
        return {
            total: lessonSlugs.length,
            viewed: viewed,
            completed: completed,
            percentViewed: Math.round((viewed / lessonSlugs.length) * 100),
            percentCompleted: Math.round((completed / lessonSlugs.length) * 100)
        };
    }

    // Reset all progress
    function resetProgress() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEY);
            initProgress();
            return true;
        }
        return false;
    }

    // Reset progress for a specific lesson
    function resetLessonProgress(slug) {
        const progress = getProgress();
        if (progress.lessons[slug]) {
            delete progress.lessons[slug];
            return saveProgress(progress);
        }
        return true;
    }

    // Get statistics
    function getStats() {
        const progress = getProgress();
        const lessons = Object.values(progress.lessons);
        
        let totalViewed = 0;
        let totalCompleted = 0;
        let totalQuizAttempts = 0;
        let totalScore = 0;
        let completedQuizzes = 0;
        
        lessons.forEach(function(lesson) {
            if (lesson.viewed) totalViewed++;
            if (lesson.completed) totalCompleted++;
            totalQuizAttempts += lesson.quizAttempts || 0;
            
            if (lesson.quizScore !== null && lesson.quizTotal) {
                totalScore += (lesson.quizScore / lesson.quizTotal) * 100;
                completedQuizzes++;
            }
        });
        
        return {
            totalLessonsViewed: totalViewed,
            totalLessonsCompleted: totalCompleted,
            totalQuizAttempts: totalQuizAttempts,
            averageQuizScore: completedQuizzes > 0 ? Math.round(totalScore / completedQuizzes) : 0,
            lastUpdated: progress.lastUpdated
        };
    }

    // Export progress data (for backup)
    function exportProgress() {
        const progress = getProgress();
        const dataStr = JSON.stringify(progress, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'wisdompath_progress_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import progress data (for restore)
    function importProgress(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.lessons && typeof data.lessons === 'object') {
                saveProgress(data);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error importing progress:', e);
            return false;
        }
    }

    // Initialize on load
    initProgress();

    // Expose public API
    window.WisdomProgress = {
        getProgress: getProgress,
        getLessonProgress: getLessonProgress,
        markLessonViewed: markLessonViewed,
        markLessonCompleted: markLessonCompleted,
        getPathProgress: getPathProgress,
        resetProgress: resetProgress,
        resetLessonProgress: resetLessonProgress,
        getStats: getStats,
        exportProgress: exportProgress,
        importProgress: importProgress
    };

})();
