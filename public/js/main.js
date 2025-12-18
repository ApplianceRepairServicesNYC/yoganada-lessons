/**
 * Wisdom Path Learning App - Main JavaScript
 * Core functionality for navigation and UI
 */

(function() {
    'use strict';

    // App Configuration
    const CONFIG = {
        apiBase: '/api',
        storagePrefix: 'wisdompath_'
    };

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initApp();
    });

    // Initialize Application
    function initApp() {
        // Add fade-in animation to main content
        const mainContent = document.querySelector('.app-main');
        if (mainContent) {
            mainContent.classList.add('fade-in');
        }

        // Initialize any interactive elements
        initInteractiveCards();
        
        // Check for progress updates on lesson pages
        checkAndUpdateProgress();
    }

    // Interactive Cards
    function initInteractiveCards() {
        const cards = document.querySelectorAll('.card-interactive');
        
        cards.forEach(function(card) {
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    // Check and update progress indicators
    function checkAndUpdateProgress() {
        // Get all lesson items
        const lessonItems = document.querySelectorAll('.lesson-item');
        
        lessonItems.forEach(function(item) {
            const slug = item.getAttribute('data-lesson-slug');
            if (slug) {
                updateLessonItemProgress(item, slug);
            }
        });
    }

    // Update lesson item visual based on progress
    function updateLessonItemProgress(item, slug) {
        const progress = window.WisdomProgress ? window.WisdomProgress.getLessonProgress(slug) : null;
        
        if (progress) {
            const badge = item.querySelector('.lesson-item-badge');
            const icon = item.querySelector('.lesson-item-icon');
            
            if (progress.completed) {
                item.classList.add('lesson-item-completed');
                if (badge) {
                    badge.textContent = 'Completed';
                    badge.className = 'lesson-item-badge badge-completed';
                }
                if (icon) {
                    icon.textContent = '✓';
                }
            } else if (progress.viewed) {
                if (badge && !badge.classList.contains('badge-free')) {
                    badge.textContent = 'In Progress';
                    badge.className = 'lesson-item-badge badge-progress';
                }
            }
        }
    }

    // Utility: Format date
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Utility: Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility: Fetch JSON helper
    async function fetchJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // Expose global utilities
    window.WisdomApp = {
        CONFIG: CONFIG,
        fetchJSON: fetchJSON,
        formatDate: formatDate,
        debounce: debounce,
        checkAndUpdateProgress: checkAndUpdateProgress
    };

})();
