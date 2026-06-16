// AOS
AOS.init({
    once: true,
    offset: 100,
    duration: 800
});

document.addEventListener('DOMContentLoaded', () => {
    initFAQAccordion();
    initQuizEngine();
    initSmoothNavigation();
});


function initFAQAccordion() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const activeItem = trigger.parentElement;
            const contentPanel = activeItem.querySelector('.faq-content');
            const isAlreadyActive = activeItem.classList.contains('active');
                    
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = null;
            });
                    
            if (!isAlreadyActive) {
                activeItem.classList.add('active');
                contentPanel.style.maxHeight = contentPanel.scrollHeight + "px";
            }
        });
    });
}

const QUIZ_DATA = [
    {
        question: "What percentage of marine debris and pollution originates directly from inland, terrestrial sources?",
        options: [
            { text: "Approximately 20%", correct: false },
            { text: "Approximately 45%", correct: false },
            { text: "Over 80% of total volume", correct: true },
            { text: "Less than 5% global margin", correct: false }
        ],
        feedback: "Correct! Most pollution enters our marine grids directly via rivers, agricultural channels, and untreated municipal wastewater infrastructure."
    },
    {
        question: "Which ecosystem is optimized to secure shoreline stabilization and capture atmospheric carbon at rates up to 4x faster than terrestrial rainforests?",
        options: [
            { text: "Abyssal Pelagic zones", correct: false },
            { text: "Mangrove Coastal Forest systems", correct: true },
            { text: "Open Ocean Sandy Plains", correct: false },
            { text: "Sub-polar Glacial ledges", correct: false }
        ],
        feedback: "Correct! Mangrove roots function as highly effective carbon sequestration sinks and serve as physical bio-shields to deflect oceanic wave action."
    },
    {
        question: "What is the primary factor driving the ongoing structural phenomenon of ocean acidification?",
        options: [
            { text: "Excessive industrial synthetic plastic breakdown", correct: false },
            { text: "Thermal expansion triggered by warming trends", correct: false },
            { text: "Elevated absorption of atmospheric carbon dioxide (CO2)", correct: true },
            { text: "Localized industrial thermal discharge pollution", correct: false }
        ],
        feedback: "Correct! The ocean acts as a massive planetary heat sink, absorbing over 25% of human-emitted carbon dioxide. This process alters the baseline pH balance of marine water chemistry."
    }
];

let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let evaluationState = false; 
let totalCorrectAnswers = 0;

function initQuizEngine() {
    renderQuizSlide();
    const controlButton = document.getElementById('quiz-next-btn');
    controlButton.addEventListener('click', handleQuizControlAction);
}

function renderQuizSlide() {
    evaluationState = false;
    selectedOptionIndex = null;
            
    const renderBox = document.getElementById('quiz-render-box');
    const controlButton = document.getElementById('quiz-next-btn');
    const currentData = QUIZ_DATA[currentQuestionIndex];
            
    document.getElementById('quiz-tracker-text').textContent = `Question ${currentQuestionIndex + 1} of ${QUIZ_DATA.length}`;
    document.getElementById('quiz-progress-fill').style.width = `${((currentQuestionIndex + 1) / QUIZ_DATA.length) * 100}%`;
            
    controlButton.textContent = "Check";
    controlButton.disabled = true;

    let optionsHTML = currentData.options.map((opt, idx) => `
    <div class="quiz-option-card" data-index="${idx}">
    <span class="option-custom-check"></span>
    <span class="option-text">${opt.text}</span>
    </div>
    `).join('');

    renderBox.innerHTML = `
    <h3>${currentData.question}</h3>
    <div class="quiz-options-grid">
    ${optionsHTML}
    </div>
    <div id="feedback-anchor"></div>
    `;

    const optionCards = renderBox.querySelectorAll('.quiz-option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            if (evaluationState) return; 
                    
            optionCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
                    
            selectedOptionIndex = parseInt(card.getAttribute('data-index'));
            controlButton.disabled = false;
        });
    });
}

function handleQuizControlAction() {
    const controlButton = document.getElementById('quiz-next-btn');
            
    if (!evaluationState) {
        evaluationState = true;
        const currentData = QUIZ_DATA[currentQuestionIndex];
        const optionCards = document.querySelectorAll('.quiz-option-card');
        const feedbackAnchor = document.getElementById('feedback-anchor');
                
        const isCorrect = currentData.options[selectedOptionIndex].correct;
                
        optionCards.forEach((card, idx) => {
            card.classList.remove('selected');
            if (currentData.options[idx].correct) {
                card.classList.add('reveal-correct');
            } else if (idx === selectedOptionIndex) {
                card.classList.add('reveal-wrong');
            }
        });
    
        if (isCorrect) {
            totalCorrectAnswers++;
            feedbackAnchor.innerHTML = `
            <div class="quiz-feedback-panel correct-style">
            <i class='bx bx-check-circle' style="color: var(--system-green); font-size: 1.3rem;"></i>
            <p><strong>Excellent!</strong> ${currentData.feedback}</p>
            </div>`;
        } else {
            feedbackAnchor.innerHTML = `
            <div class="quiz-feedback-panel wrong-style">
            <i class='bx bx-x-circle' style="color: var(--system-red); font-size: 1.3rem;"></i>
            <p><strong>Inaccurate.</strong> ${currentData.feedback}</p>
            </div>`;
        }

        if (currentQuestionIndex < QUIZ_DATA.length - 1) {
            controlButton.textContent = "Next";
        } else {
            controlButton.textContent = "Finish";
        }
            
    } else {
        if (currentQuestionIndex < QUIZ_DATA.length - 1) {
            currentQuestionIndex++;
            renderQuizSlide();
        } else {
            renderFinalScorecard();
        }
    }
}

function renderFinalScorecard() {
    const renderBox = document.getElementById('quiz-render-box');
    const controlButton = document.getElementById('quiz-next-btn');
            
    document.getElementById('quiz-tracker-text').textContent = "Evaluation Finished";
    controlButton.style.display = 'none'; 

    renderBox.innerHTML = `
    <div style="text-align: center; padding: 20px 0;">
    <i class='bx bx-trophy' style="font-size: 4.5rem; color: var(--cyan-primary); margin-bottom: 20px; display: block;"></i>
    <h3>Your Performance Assessment is Complete!</h3>
    <p style="color: var(--text-slate); margin: 15px 0 25px 0; font-size: 1.1rem;">
    You correctly evaluated <strong>${totalCorrectAnswers}</strong> out of <strong>${QUIZ_DATA.length}</strong> critical ecosystem indicators.
    </p>
    <button id="quiz-restart-btn" class="hero-primary-btn" style="border: none; cursor: pointer; font-family: var(--font-base);">Restart</button>
    </div>
`;
            
document.getElementById('quiz-restart-btn').addEventListener('click', resetQuizSequence);
}

function resetQuizSequence() {
    currentQuestionIndex = 0;
    totalCorrectAnswers = 0;
    const controlButton = document.getElementById('quiz-next-btn');
    controlButton.style.display = 'inline-block';
    renderQuizSlide();
}

function initSmoothNavigation() {
    const links = document.querySelectorAll('.main-navbar a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
            if (this.classList.contains('menu-item')) {
                this.classList.add('active');
            }
        });
    });
}