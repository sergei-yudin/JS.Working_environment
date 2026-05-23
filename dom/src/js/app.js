// TODO: write code here
import goblinImage from '../img/goblin.png';
import '../css/style.css';

const board = document.querySelector('.board');
const cells = [];

for (let i = 0; i < 16; i += 1) {
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

moveGoblin();

setInterval(moveGoblin, 1000);
