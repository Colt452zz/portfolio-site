// ---- DOM REFERENCES ----
const skipButton = document.getElementById('skipButton');
const timesClicked = document.getElementById('timesClicked');
const clickButton = document.getElementById('clickMe');
const resetButton = document.getElementById('reset');
const clicksLeftTo = document.getElementById('clicksLeftTo');
const selfie = document.getElementById('selfie');
const equation = document.getElementById('equation');
const menuBar = document.getElementById('menuBar');
const answerInput = document.getElementById('answer');
const solutionStatus = document.getElementById('status');

// ---- STATE ----
let clicks = 0;

// ---- PROGRESSION ----
function tier(clicks) {
    if (clicks < 10) return 0;
    if (clicks < 20) return 1;
    if (clicks < 50) return 2;
    return 3;
}

function clicksToNext() {
    if (clicks < 10) return 10 - clicks;
    if (clicks < 20) return 20 - clicks;
    if (clicks < 50) return 50 - clicks;
    return 0;
}

// ---- RANDOM UTILS ----
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---- EQUATION MODEL ----
const additionProblem = {
    a: 0,
    b: 0,

    generate() {
        this.a = getRandomInt(1, 100);
        this.b = getRandomInt(1, 100);
        answerInput.value = '';
        equation.querySelector('label').textContent = `${this.a} + ${this.b} = `;
        solutionStatus.classList.add('hidden');
    },

    isSolved() {
        return Number(answerInput.value) === this.a + this.b;
    },

    show() {
        equation.classList.remove('hidden');
    },

    hide() {
        equation.classList.add('hidden');
    }
};

// ---- UI UPDATE ----
function updateText(level) {
    timesClicked.textContent =
        clicks === 0
            ? "You haven't clicked the button yet"
            : `You clicked the button ${clicks} time${clicks === 1 ? '' : 's'}!`;

    const remaining = clicksToNext();

    if (level === 0) {
        clicksLeftTo.textContent = `${remaining} more click${remaining === 1 ? '' : 's'} to unlock my picture`;
    } else if (level === 1) {
        clicksLeftTo.textContent = `${remaining} more click${remaining === 1 ? '' : 's'} to unlock a math problem`;
    } else if (level === 2) {
        clicksLeftTo.textContent = `${remaining} more click${remaining === 1 ? '' : 's'} to unlock the menu bar and be taken to my about me page`;
    } else {
        clicksLeftTo.textContent = 'All features have been unlocked!';
    }
}

function updateVisibility(level) {
    resetButton.classList.toggle('hidden', clicks === 0);
    selfie.classList.toggle('hidden', level < 1);
    menuBar.classList.toggle('hidden', level < 3);
    skipButton.classList.toggle('hidden', level === 3);

    if (level === 2) {
        additionProblem.show();
    } else {
        additionProblem.hide();
        solutionStatus.classList.add('hidden');
    }
}

function render() {
    const level = tier(clicks);
    updateText(level);
    updateVisibility(level);
}

// ---- EVENTS ----
skipButton.addEventListener('click', () => {
    skipped = true;
    clicks = clicks + 50;
    localStorage.setItem('clicks', clicks.toString());
    render();
    alert('You\'re no fun!');
    window.location.href = 'aboutMe.html';
});

clickButton.addEventListener('click', () => {
    const level = tier(clicks);

    if (level === 2) {
        if (!additionProblem.isSolved()) return;
    }
    clicks++;
    localStorage.setItem('clicks', clicks.toString());
    if (clicks === 50) {
        window.location.href = 'aboutMe.html';
    }
    render();
});

answerInput.addEventListener('input', () => {
    if (additionProblem.isSolved()) {
        solutionStatus.classList.remove('hidden');
    } else {
        solutionStatus.classList.add('hidden');
    }
});

resetButton.addEventListener('click', () => {
    clicks = 0;
    localStorage.setItem('clicks', clicks.toString());
    additionProblem.generate();
    render();
});

// ---- INIT ----
clicks = Number(localStorage.getItem('clicks')) || 0;
additionProblem.generate();
render();