import goblinImage from '../img/goblin.png';
import '../css/style.css';

const FIELD_SIZE = 4;
const CELLS_COUNT = FIELD_SIZE * FIELD_SIZE;
const MOVE_INTERVAL_MS = 1000;

const board = document.querySelector('.board');

if (!board) {
  throw new Error('Элемент .board не найден в DOM');
}

const cells = [];

for (let i = 0; i < CELLS_COUNT; i += 1) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  board.append(cell);
  cells.push(cell);
}

const goblin = document.createElement('img');
goblin.src = goblinImage;
goblin.alt = 'Goblin';
goblin.classList.add('goblin');

let currentIndex = null;
let moveIntervalId = null;

function getRandomIndex() {
  let newIndex;

  do {
    newIndex = Math.floor(Math.random() * cells.length);
  } while (newIndex === currentIndex);

  return newIndex;
}

function moveGoblin() {
  currentIndex = getRandomIndex();
  cells[currentIndex].append(goblin);
}

function startGame() {
  moveGoblin();
  moveIntervalId = setInterval(moveGoblin, MOVE_INTERVAL_MS);
}

function stopGame() {
  clearInterval(moveIntervalId);
  moveIntervalId = null;
}

startGame();
