// Quiz Engine
var QuizEngine = (function() {
    var quizData = [];
    var lessonSlug = '';
    var quizState = { currentIndex: 0, answers: [], score: 0, selectedAnswer: null };
    var els = {};
    
    function init(data, slug) {
        quizData = data;
        lessonSlug = slug;
        
        els = {
            container: document.getElementById('quiz-container'),
            progressFill: document.getElementById('quiz-progress-fill'),
            progressText: document.getElementById('quiz-progress-text'),
            question: document.getElementById('quiz-question'),
            options: document.getElementById('quiz-options'),
            feedback: document.getElementById('quiz-feedback'),
            submit: document.getElementById('quiz-submit'),
            next: document.getElementById('quiz-next'),
            results: document.getElementById('quiz-results')
        };
        
        var startBtn = document.getElementById('start-quiz-btn');
        if (startBtn) {
            startBtn.onclick = function() {
                quizState = { currentIndex: 0, answers: [], score: 0, selectedAnswer: null };
                showQuestion(0);
            };
        }
        
        if (els.submit) els.submit.onclick = submitAnswer;
        if (els.next) els.next.onclick = nextQuestion;
        
        // Mark lesson as viewed
        if (typeof WisdomProgress !== 'undefined') {
            WisdomProgress.markViewed(lessonSlug);
            WisdomProgress.updateMini();
        }
    }
    
    function escapeHtml(t) {
        var d = document.createElement('div');
        d.textContent = t;
        return d.innerHTML;
    }
    
    function showQuiz() {
        var lessonContent = document.getElementById('lesson-content');
        if (lessonContent) lessonContent.style.display = 'none';
        els.container.classList.add('active');
        els.container.style.display = 'block';
        if (els.results) els.results.style.display = 'none';
        if (window.focusMode) window.focusMode.enter();
    }
    
    function updateProgress() {
        var pct = (quizState.currentIndex / quizData.length) * 100;
        if (els.progressFill) els.progressFill.style.width = pct + '%';
        if (els.progressText) els.progressText.textContent = (quizState.currentIndex + 1) + '/' + quizData.length;
        if (window.focusMode) window.focusMode.updateProgress(quizState.currentIndex, quizData.length);
    }
    
    function showQuestion(idx) {
        if (idx >= quizData.length) {
            showResults();
            return;
        }
        showQuiz();
        quizState.currentIndex = idx;
        quizState.selectedAnswer = null;
        var q = quizData[idx];
        updateProgress();
        
        if (els.question) els.question.textContent = q.question;
        if (els.options) els.options.innerHTML = '';
        
        var labels = ['A', 'B', 'C', 'D'];
        q.choices.forEach(function(c, i) {
            var opt = document.createElement('div');
            opt.className = 'quiz-option';
            opt.setAttribute('data-choice', c);
            opt.setAttribute('role', 'button');
            opt.tabIndex = 0;
            opt.innerHTML = '<div class="quiz-option-marker">' + labels[i] + '</div><div class="quiz-option-text">' + escapeHtml(c) + '</div>';
            opt.onclick = function() { selectOption(c, opt); };
            opt.onkeydown = function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectOption(c, opt);
                }
            };
            els.options.appendChild(opt);
        });
        
        if (els.feedback) {
            els.feedback.style.display = 'none';
            els.feedback.className = 'quiz-feedback';
        }
        if (els.submit) {
            els.submit.style.display = 'inline-flex';
            els.submit.disabled = true;
        }
        if (els.next) els.next.style.display = 'none';
    }
    
    function selectOption(choice, optEl) {
        if (quizState.selectedAnswer !== null && els.submit.style.display === 'none') return;
        quizState.selectedAnswer = choice;
        els.options.querySelectorAll('.quiz-option').forEach(function(o) {
            o.classList.remove('selected');
        });
        optEl.classList.add('selected');
        if (els.submit) els.submit.disabled = false;
    }
    
    function submitAnswer() {
        if (quizState.selectedAnswer === null) return;
        var q = quizData[quizState.currentIndex];
        var correct = quizState.selectedAnswer === q.correct;
        quizState.answers.push({
            question: q.question,
            selected: quizState.selectedAnswer,
            correct: q.correct,
            isCorrect: correct
        });
        if (correct) quizState.score++;
        showFeedback(correct, q.correct);
        highlightOptions(q.correct);
        if (els.submit) els.submit.style.display = 'none';
        if (els.next) {
            els.next.style.display = 'inline-flex';
            els.next.textContent = quizState.currentIndex < quizData.length - 1 ? 'Continue →' : 'See Results →';
        }
    }
    
    function showFeedback(correct, ans) {
        if (els.feedback) {
            els.feedback.style.display = 'flex';
            els.feedback.classList.add('show');
            els.feedback.className = correct ? 'quiz-feedback show correct' : 'quiz-feedback show incorrect';
            els.feedback.innerHTML = correct ? '✓ Correct!' : '✗ The answer is: ' + escapeHtml(ans);
        }
    }
    
    function highlightOptions(correctAns) {
        els.options.querySelectorAll('.quiz-option').forEach(function(opt) {
            var c = opt.getAttribute('data-choice');
            opt.classList.add('disabled');
            if (c === correctAns) {
                opt.classList.add('correct');
                opt.classList.remove('selected');
            } else if (c === quizState.selectedAnswer && c !== correctAns) {
                opt.classList.add('incorrect');
            }
        });
    }
    
    function nextQuestion() {
        if (quizState.currentIndex < quizData.length - 1) {
            showQuestion(quizState.currentIndex + 1);
        } else {
            showResults();
        }
    }
    
    function showResults() {
        var pct = Math.round((quizState.score / quizData.length) * 100);
        var passed = pct >= 70;
        
        // Mark lesson completed
        if (typeof WisdomProgress !== 'undefined') {
            WisdomProgress.markCompleted(lessonSlug, quizState.score, quizData.length);
        }
        
        if (window.focusMode) window.focusMode.setComplete();
        
        if (els.question) els.question.style.display = 'none';
        if (els.options) els.options.style.display = 'none';
        if (els.feedback) els.feedback.style.display = 'none';
        if (els.submit) els.submit.style.display = 'none';
        if (els.next) els.next.style.display = 'none';
        if (els.progressFill) els.progressFill.style.width = '100%';
        if (els.progressText) els.progressText.textContent = 'Done';
        
        var focusFill = document.getElementById('focusProgressFill');
        var focusText = document.getElementById('focusProgressText');
        var exitBtn = document.getElementById('exitFocus');
        if (focusFill) focusFill.style.width = '100%';
        if (focusText) focusText.textContent = 'Complete';
        if (exitBtn) {
            exitBtn.textContent = '← Done';
            exitBtn.onclick = function() { if (window.focusMode) window.focusMode.exit(); };
        }
        
        if (els.results) {
            els.results.innerHTML = '<div class="quiz-results"><div class="quiz-results-icon">' + (passed ? '🎉' : '📚') + '</div><h2 class="quiz-results-title">' + (passed ? 'Excellent Work!' : 'Keep Learning') + '</h2><div class="quiz-results-score">' + quizState.score + '/' + quizData.length + ' correct (' + pct + '%)</div><p class="quiz-results-message">' + (passed ? 'You\'ve completed this chapter. Continue to explore the next chapter.' : 'Review the material and try again. 70% needed to pass.') + '</p><button class="btn btn-primary btn-full" onclick="window.focusMode.exit()">' + (passed ? 'Continue to Lesson' : 'Review & Try Again') + '</button></div>';
            els.results.style.display = 'block';
        }
    }
    
    // Public API
    return {
        init: init
    };
})();
