/**
 * WisdomPath Course Access Control
 * Per-course unlock system for Stripe payments
 * 
 * COURSE IDS FOR STRIPE REDIRECT URLS:
 * Format: ?unlocked=true&course=<COURSE_ID>
 * 
 * Active Courses:
 *   autobiography-of-a-yogi          - Autobiography of a Yogi (48 chapters)
 * 
 * Coming Soon:
 *   the-second-coming-of-christ      - The Second Coming of Christ (Two-Volume Edition)
 *   mans-eternal-quest               - Man's Eternal Quest (Collected Talks)
 *   the-divine-romance               - The Divine Romance (Collected Talks)
 *   journey-to-self-realization      - Journey to Self-Realization (Collected Talks)
 *   whispers-from-eternity           - Whispers from Eternity (Prayers & Poetry)
 *   metaphysical-meditations         - Metaphysical Meditations (Meditation Guide)
 *   scientific-healing-affirmations  - Scientific Healing Affirmations (Healing Practice)
 *   how-you-can-talk-with-god        - How You Can Talk with God (Prayer Guide)
 *   where-there-is-light             - Where There Is Light (Guidance Collection)
 *   sayings-of-paramahansa-yogananda - Sayings of Paramahansa Yogananda (Wisdom Quotes)
 *   the-law-of-success               - The Law of Success (Success Principles)
 *   how-to-be-happy-all-the-time     - How to Be Happy All the Time (Happiness Guide)
 *   inner-peace                      - Inner Peace (Peace Teachings)
 *   karma-and-reincarnation          - Karma and Reincarnation (Spiritual Laws)
 *   the-yoga-of-jesus                - The Yoga of Jesus (Christ's Teachings)
 *   the-yoga-of-the-bhagavad-gita    - The Yoga of the Bhagavad Gita
 */
(function() {
    var STORAGE_KEY = "wisdompath_course_access";
    var LEGACY_KEY = "yogananda_course_unlocked";

    function getAccessObject() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) { return {}; }
    }

    function saveAccessObject(obj) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
    }

    // Check URL for unlock parameters
    try {
        var params = new URLSearchParams(window.location.search);
        if (params.get("unlocked") === "true") {
            var courseId = params.get("course");
            if (courseId) {
                var access = getAccessObject();
                access[courseId] = true;
                saveAccessObject(access);
            } else {
                localStorage.setItem(LEGACY_KEY, "true");
            }
            params.delete("unlocked");
            params.delete("course");
            var clean = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
            window.history.replaceState({}, "", clean);
        }
    } catch (e) {}

    // Migrate legacy access
    try {
        if (localStorage.getItem(LEGACY_KEY) === "true") {
            var access = getAccessObject();
            if (!access["autobiography-of-a-yogi"]) {
                access["autobiography-of-a-yogi"] = true;
                saveAccessObject(access);
            }
        }
    } catch (e) {}

    window.hasCourseAccess = function(courseId) {
        try {
            var access = getAccessObject();
            if (access[courseId]) return true;
            if (localStorage.getItem(LEGACY_KEY) === "true") return true;
            return false;
        } catch (e) { return false; }
    };

    window.getUnlockedCourses = function() {
        try { return getAccessObject(); } catch (e) { return {}; }
    };

    window.grantCourseAccess = function(courseId) {
        var access = getAccessObject();
        access[courseId] = true;
        saveAccessObject(access);
    };

    window.revokeCourseAccess = function(courseId) {
        var access = getAccessObject();
        delete access[courseId];
        saveAccessObject(access);
    };
})();
