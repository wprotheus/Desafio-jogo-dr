const state = {
    view: {
        square: document.querySelectorAll('.painel-column'),
        timeLeft: document.querySelector('#time'),
        score: document.querySelector('#score'),
        lives: document.querySelector('#lives'),
        startButton: document.querySelector('#start-button'),
        gameOverMessage: document.querySelector('#game-over-message'),
    },
    values: {
        timer: null,
        enemyInterval: null,
        enemyPosition: null,
        resultScore: 0,
        lives: 3,
        totalTime: 60,
    },
};

function enemyPosition() {
    return Math.floor(Math.random() * state.view.square.length);
}

function playSound(sound) {    
    const audio = new Audio(`./assets/audios/${sound}`); 
    audio.volume = 0.4;
    audio.play();
}

function resetGame() {
    showStartButton();
}

function updateUI() {
    state.view.timeLeft.textContent = `${state.values.totalTime}`;
    state.view.score.textContent = `${state.values.resultScore}`;
    state.view.lives.textContent = `x${state.values.lives}`;
    updateView();
}

function updateView() {
    state.view.square.forEach((square, index) => {
        square.classList.remove('enemy');
        if (index === state.values.enemyPosition) {
            square.classList.add('enemy');
        }
    });
}

function moveEnemy() {
    state.values.enemyPosition = enemyPosition();
    updateView();
}

function startGame() {
    setUpGame();
    updateUI();
    listenerHitSquare();
}

function setUpGame() {
    clearInterval(state.values.timer);
    clearInterval(state.values.enemyInterval);
    state.values.resultScore = 0;
    state.values.lives = 3;
    state.values.totalTime = 60;
    state.values.enemyPosition = null;
    state.values.enemyInterval = setInterval(moveEnemy, 1000);
    state.values.enemyPosition = enemyPosition();
    state.values.timer = setInterval(countdown, 1000);
}

function showStartButton() {
    state.view.startButton.classList.remove('hidden');
    startGame();
}

function hideStartButton() {
    state.view.startButton.classList.add('hidden');
}

function init() {
    state.view.startButton.addEventListener('click', () => {
        hideStartButton();
        startGame();
    });
}

function showGameOverMessage() {
    state.view.finalScore = document.querySelector('#final-score');
    state.view.restartButton = document.querySelector('#restart-button');

    state.view.finalScore.textContent = `Fim da partida! Sua pontuação: ${state.values.resultScore}`;
    state.view.gameOverMessage.classList.remove('hidden'); // Exibe o modal

    state.view.restartButton.addEventListener('click', () => {
        state.view.gameOverMessage.classList.add('hidden'); // Esconde o modal
        resetGame();
    });
}

function countdown() {
    if (state.view.startButton.classList.contains('hidden')) {
        state.values.totalTime--;
        state.view.timeLeft.textContent = `${state.values.totalTime}`;
        if (state.values.totalTime <= 0) {
            state.view.timeLeft.textContent = `Time out!`;
            showGameOverMessage();
        }
    } else
        state.view.timeLeft.textContent = `60`;
}

function listenerHitSquare() {
    state.view.square.forEach((square) => {
        square.replaceWith(square.cloneNode(true));
    });
    state.view.square = document.querySelectorAll('.painel-column');
    state.view.square.forEach((square, index) => {
        square.addEventListener('mousedown', (event) => {
            if (index === state.values.enemyPosition) {
                state.values.resultScore += 5;
                state.view.score.textContent = `${state.values.resultScore}`;
                playSound('hit.m4a');
                moveEnemy();
            } else {
                playSound('error.mp3'); // NowTHATSaMFsnare by you_cannot_use_this_username_d -- https://freesound.org/s/733615/ -- License: Creative Commons 0
                state.values.lives--;
                state.view.lives.textContent = `x${state.values.lives}`;
                if (state.values.lives <= 0) {
                    state.view.lives.textContent = `x0`;
                    showGameOverMessage();
                }
            }
        });
    });
}

init();
