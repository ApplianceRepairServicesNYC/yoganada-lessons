// Course Unlock System
var WisdomUnlock = (function() {
    var STORAGE_KEY = "wisdompath_course_access";
    var LEGACY_KEY = "yogananda_course_unlocked";
    var COURSE_ID = "autobiography-of-a-yogi";
    var STRIPE_URL = "https://buy.stripe.com/fZu7sNboL5kydGlcgu73G01";
    
    function hasCourseAccess(courseId) {
        try {
            var access = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            if (access[courseId || COURSE_ID]) return true;
            if (localStorage.getItem(LEGACY_KEY) === "true") return true;
            return false;
        } catch(e) {
            return false;
        }
    }
    
    function unlockLessons() {
        var isUnlocked = hasCourseAccess(COURSE_ID);
        console.log("Course unlocked:", COURSE_ID, isUnlocked);
        
        if (isUnlocked) {
            document.documentElement.classList.add('course-unlocked');
            document.querySelectorAll(".lesson-item-locked").forEach(function(item) {
                var url = item.getAttribute("data-lesson-url");
                if (url) {
                    item.setAttribute("href", url);
                    item.removeAttribute("onclick");
                    var badge = item.querySelector(".lesson-badge");
                    if (badge) badge.textContent = "Unlocked";
                    var arrow = item.querySelector(".lesson-arrow");
                    if (arrow) arrow.textContent = "→";
                }
            });
        }
    }
    
    function showPaymentModal() {
        var existing = document.getElementById("payment-modal");
        if (existing) existing.remove();
        
        var modal = document.createElement("div");
        modal.id = "payment-modal";
        modal.innerHTML = '<div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;" onclick="this.remove()"><div style="background:#fffcf7;border-radius:20px;padding:2.5rem;max-width:400px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);" onclick="event.stopPropagation()"><div style="font-size:3rem;margin-bottom:1rem;">🔐</div><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;margin-bottom:0.75rem;color:#2d1810;">Unlock Full Course</h3><p style="color:#5c4033;margin-bottom:1.5rem;line-height:1.6;">Get lifetime access to all chapters with quizzes, exercises, and progress tracking.</p><button id="stripe-pay-btn" style="width:100%;padding:1rem;background:linear-gradient(135deg,#e8a946,#c75d24);color:white;border:none;border-radius:12px;font-size:1rem;font-weight:600;cursor:pointer;margin-bottom:0.75rem;">Unlock Now — $19</button><button onclick="this.closest(\'#payment-modal\').remove()" style="width:100%;padding:0.75rem;background:transparent;border:1px solid rgba(139,90,43,0.2);border-radius:12px;font-size:0.875rem;color:#8b7355;cursor:pointer;">Maybe Later</button></div></div>';
        document.body.appendChild(modal);
        
        document.getElementById("stripe-pay-btn").onclick = function() {
            window.location.href = STRIPE_URL;
        };
    }
    
    function handleLockedLesson(el) {
        if (hasCourseAccess(COURSE_ID)) {
            var url = el.getAttribute("data-lesson-url");
            if (url) window.location.href = url;
            return false;
        }
        showPaymentModal();
        return false;
    }
    
    // Public API
    return {
        hasAccess: hasCourseAccess,
        unlock: unlockLessons,
        showModal: showPaymentModal,
        handleLocked: handleLockedLesson
    };
})();

// Make handleLockedLesson available globally
window.handleLockedLesson = WisdomUnlock.handleLocked;
