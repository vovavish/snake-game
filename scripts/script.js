const gameBoard = document.querySelector('.game-board');
const instructuionText = document.querySelector('.instruction-text');
const logo = document.querySelector('.logo');
const scoreCurrent = document.querySelector('.score_current');
const scoreGreatestText = document.querySelector('.score_greatest');

const gameBoardSize = 20;

let snake = [{x: 10, y: 10}];
let food = generateFood();
let scoreGreatest = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

function draw() {
  gameBoard.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach(segment => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    gameBoard.appendChild(snakeElement);
  })
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    gameBoard.appendChild(foodElement);
  }
}

function generateFood(){
  const x = Math.floor(Math.random() * gameBoardSize) + 1;
  const y = Math.floor(Math.random() * gameBoardSize) + 1;
  return {x, y};
}

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function move() {
  const head = {...snake[0]};

  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'right':
      head.x++;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeedDelay();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructuionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function handleKeyPress(evt) {
  if (
    (!gameStarted && evt.code === 'Space') || 
    (!gameStarted && evt.key === ' ')
  ) {
    startGame()
  } else {
    switch (evt.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
    }
  }
}

function increaseSpeedDelay() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 1 || head.x > gameBoardSize ||
    head.y < 1 || head.y > gameBoardSize
  ) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateGreatestScore();
  stopGame();
  snake = [{x: 10, y: 10}];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateGreatestScore() {
  const currentScore = snake.length - 1;
  if (currentScore > scoreGreatest) {
    scoreGreatest = currentScore;
    scoreGreatestText.textContent = scoreGreatest.toString().padStart(3, '0');
  }
  scoreGreatestText.style.display = 'block';
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructuionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateScore() {
  const currentScore = snake.length - 1;
  scoreCurrent.textContent = currentScore.toString().padStart(3, '0');
}

document.addEventListener('keydown', handleKeyPress);