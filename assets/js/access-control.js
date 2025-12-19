(function() {
    var STORAGE_KEY = "yogananda_course_unlocked";

    // Check URL for unlock parameter
    try {
        var params = new URLSearchParams(window.location.search);
        if (params.get("unlocked") === "true") {
            localStorage.setItem(STORAGE_KEY, "true");
            // Clean URL
            params.delete("unlocked");
            var clean = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
            window.history.replaceState({}, "", clean);
        }
    } catch (e) {}

    // Global helper
    window.hasCourseAccess = function() {
        try {
            return localStorage.getItem(STORAGE_KEY) === "true";
        } catch (e) {
            return false;
        }
    };
})();
