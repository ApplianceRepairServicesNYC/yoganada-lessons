/**
 * Wisdom Path Learning App - Quiz System
 * DMV-style one-question-at-a-time quiz implementation
 */

(function() {
    'use strict';

    // Quiz State
    let quizState = {
        lessonSlug: null,
        questions: [],
        currentIndex: 0,
        answers: [],
        score: 0,
        isComplete: false,
        selectedAnswer: null
    };

    // DOM Elements (cached after init)
    let elements = {};

    // Initialize Quiz
    function initQuiz(lessonSlug, questions) {
        quizState = {
            lessonSlug: lessonSlug,
            questions: questions,
            currentIndex: 0,
            answers: [],
            score: 0,
            isComplete: false,
            selectedAnswer: null
        };

        // Cache DOM elements
        elements = {
            container: document.getElementById('quiz-container'),
            lessonContent: document.getElementById('lesson-content'),
            progressBar: document.getElementById('quiz-progress-fill'),
            progressText: document.getElementById('quiz-progress-text'),
            questionText: document.getElementById('quiz-question'),
            optionsContainer: document.getElementById('quiz-options'),
            feedback: document.getElementById('quiz-feedback'),
            submitBtn: document.getElementById('quiz-submit'),
            nextBtn: document.getElementById('quiz-next'),
            resultsContainer: document.getElementById('quiz-results')
        };

        // Verify all elements exist
        if (!elements.container || !elements.questionText) {
            console.error('Quiz elements not found in DOM');
            return;
        }

        // Set up event listeners
        if (elements.submitBtn) {
            elements.submitBtn.addEventListener('click', submitAnswer);
        }
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', nextQuestion);
        }

        // Show first question
        showQuestion(0);
    }

    // Show Quiz (hide lesson content)
    function showQuiz() {
        if (elements.lessonContent) {
            elements.lessonContent.style.display = 'none';
        }
        if (elements.container) {
            elements.container.classList.add('active');
            elements.container.style.display = 'block';
        }
        if (elements.resultsContainer) {
            elements.resultsContainer.style.display = 'none';
        }
    }

    // Show Question
    function showQuestion(index) {
        if (index >= quizState.questions.length) {
            showResults();
            return;
        }

        showQuiz();
        quizState.currentIndex = index;
        quizState.selectedAnswer = null;

        const question = quizState.questions[index];

        // Update progress
        updateProgress();

        // Update question text
        if (elements.questionText) {
            elements.questionText.textContent = question.question;
        }

        // Generate options
        if (elements.optionsContainer) {
            elements.optionsContainer.innerHTML = '';
            
            const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
            
            question.choices.forEach(function(choice, choiceIndex) {
                const option = document.createElement('div');
                option.className = 'quiz-option';
                option.setAttribute('data-choice', choice);
                option.setAttribute('role', 'button');
                option.setAttribute('tabindex', '0');
                
                option.innerHTML = 
                    '<div class="quiz-option-marker">' + optionLabels[choiceIndex] + '</div>' +
                    '<div class="quiz-option-text">' + escapeHtml(choice) + '</div>';
                
                option.addEventListener('click', function() {
                    selectOption(choice, option);
                });
                
                option.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectOption(choice, option);
                    }
                });
                
                elements.optionsContainer.appendChild(option);
            });
        }

        // Reset UI state
        if (elements.feedback) {
            elements.feedback.style.display = 'none';
            elements.feedback.className = 'quiz-feedback';
        }
        if (elements.submitBtn) {
            elements.submitBtn.style.display = 'inline-flex';
            elements.submitBtn.disabled = true;
        }
        if (elements.nextBtn) {
            elements.nextBtn.style.display = 'none';
        }
    }

    // Update Progress Bar
    function updateProgress() {
        const progress = ((quizState.currentIndex) / quizState.questions.length) * 100;
        
        if (elements.progressBar) {
            elements.progressBar.style.width = progress + '%';
        }
        if (elements.progressText) {
            elements.progressText.textContent = (quizState.currentIndex + 1) + ' / ' + quizState.questions.length;
        }
    }

    // Select Option
    function selectOption(choice, optionElement) {
        // Don't allow selection if already answered
        if (quizState.selectedAnswer !== null && elements.submitBtn && elements.submitBtn.style.display === 'none') {
            return;
        }

        quizState.selectedAnswer = choice;

        // Update visual selection
        const options = elements.optionsContainer.querySelectorAll('.quiz-option');
        options.forEach(function(opt) {
            opt.classList.remove('selected');
        });
        optionElement.classList.add('selected');

        // Enable submit button
        if (elements.submitBtn) {
            elements.submitBtn.disabled = false;
        }
    }

    // Submit Answer
    function submitAnswer() {
        if (quizState.selectedAnswer === null) return;

        const question = quizState.questions[quizState.currentIndex];
        const isCorrect = quizState.selectedAnswer === question.correct;

        // Record answer
        quizState.answers.push({
            question: question.question,
            selected: quizState.selectedAnswer,
            correct: question.correct,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            quizState.score++;
        }

        // Show feedback
        showFeedback(isCorrect, question.correct);

        // Highlight correct/incorrect options
        highlightOptions(question.correct);

        // Hide submit, show next
        if (elements.submitBtn) {
            elements.submitBtn.style.display = 'none';
        }
        if (elements.nextBtn) {
            elements.nextBtn.style.display = 'inline-flex';
            elements.nextBtn.textContent = quizState.currentIndex < quizState.questions.length - 1 
                ? 'Next Question →' 
                : 'See Results →';
        }
    }

    // Show Feedback
    function showFeedback(isCorrect, correctAnswer) {
        if (!elements.feedback) return;

        elements.feedback.style.display = 'block';
        elements.feedback.classList.add('show');
        
        if (isCorrect) {
            elements.feedback.className = 'quiz-feedback show correct';
            elements.feedback.innerHTML = '✓ Correct!';
        } else {
            elements.feedback.className = 'quiz-feedback show incorrect';
            elements.feedback.innerHTML = '✗ Incorrect. The correct answer is: ' + escapeHtml(correctAnswer);
        }
    }

    // Highlight Options
    function highlightOptions(correctAnswer) {
        const options = elements.optionsContainer.querySelectorAll('.quiz-option');
        
        options.forEach(function(option) {
            const choice = option.getAttribute('data-choice');
            option.classList.add('disabled');
            
            if (choice === correctAnswer) {
                option.classList.add('correct');
                option.classList.remove('selected');
            } else if (choice === quizState.selectedAnswer && choice !== correctAnswer) {
                option.classList.add('incorrect');
            }
        });
    }

    // Next Question
    function nextQuestion() {
        if (quizState.currentIndex < quizState.questions.length - 1) {
            showQuestion(quizState.currentIndex + 1);
        } else {
            showResults();
        }
    }

    // Show Results
    function showResults() {
        quizState.isComplete = true;
        
        // Hide quiz content, show results
        if (elements.questionText) elements.questionText.style.display = 'none';
        if (elements.optionsContainer) elements.optionsContainer.style.display = 'none';
        if (elements.feedback) elements.feedback.style.display = 'none';
        if (elements.submitBtn) elements.submitBtn.style.display = 'none';
        if (elements.nextBtn) elements.nextBtn.style.display = 'none';

        // Update progress to 100%
        if (elements.progressBar) {
            elements.progressBar.style.width = '100%';
        }
        if (elements.progressText) {
            elements.progressText.textContent = 'Complete';
        }

        // Calculate percentage
        const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
        const passed = percentage >= 70;

        // Save progress
        if (window.WisdomProgress) {
            window.WisdomProgress.markLessonCompleted(
                quizState.lessonSlug,
                quizState.score,
                quizState.questions.length
            );
        }

        // Generate results HTML
        const resultsHtml = 
            '<div class="quiz-results">' +
                '<div class="quiz-results-icon">' + (passed ? '🎉' : '📚') + '</div>' +
                '<h2 class="quiz-results-title">' + (passed ? 'Great Job!' : 'Keep Learning') + '</h2>' +
                '<div class="quiz-results-score">' +
                    'You scored ' + quizState.score + ' out of ' + quizState.questions.length + ' (' + percentage + '%)' +
                '</div>' +
                '<p class="quiz-results-message">' +
                    (passed 
                        ? 'You\'ve demonstrated understanding of this lesson\'s key concepts.'
                        : 'Review the lesson material and try again. You need 70% to pass.') +
                '</p>' +
                '<div class="quiz-results-actions">' +
                    '<button class="btn btn-primary btn-full" onclick="window.location.reload()">' +
                        (passed ? 'Review Lesson' : 'Try Again') +
                    '</button>' +
                '</div>' +
            '</div>';

        if (elements.resultsContainer) {
            elements.resultsContainer.innerHTML = resultsHtml;
            elements.resultsContainer.style.display = 'block';
        } else {
            // Create results container if it doesn't exist
            const resultsDiv = document.createElement('div');
            resultsDiv.id = 'quiz-results';
            resultsDiv.innerHTML = resultsHtml;
            elements.container.appendChild(resultsDiv);
        }
    }

    // Reset Quiz
    function resetQuiz() {
        if (quizState.questions.length > 0) {
            initQuiz(quizState.lessonSlug, quizState.questions);
        }
    }

    // Utility: Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Start Quiz Button Handler
    function startQuiz(lessonSlug) {
        // Fetch quiz data from API
        fetch('/api/yogananda/lesson/' + lessonSlug)
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to load quiz');
                return response.json();
            })
            .then(function(data) {
                if (data.lesson && data.lesson.quiz && data.lesson.quiz.length > 0) {
                    initQuiz(lessonSlug, data.lesson.quiz);
                } else {
                    alert('No quiz available for this lesson.');
                }
            })
            .catch(function(error) {
                console.error('Error loading quiz:', error);
                alert('Unable to load quiz. Please try again.');
            });
    }

    // Expose public API
    window.WisdomQuiz = {
        init: initQuiz,
        start: startQuiz,
        reset: resetQuiz,
        getState: function() { return quizState; }
    };

})();
