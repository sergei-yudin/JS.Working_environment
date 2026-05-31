import goblinImage from '../img/goblin.png';

const FIELD_SIZE = 4;
const CELLS_COUNT = FIELD_SIZE * FIELD_SIZE;
const APPEARANCE_TIME_MS = 1000;
const MAX_MISSES = 5;

class Board {
  constructor(boardElement) {
    if (!boardElement) {
      throw new Error('Элемент .board не найден в DOM');
    }

    this.boardElement = boardElement;
    this.cells = [];
    this.currentIndex = null;
  }

  create() {
    for (let i = 0; i < CELLS_COUNT; i += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      this.boardElement.append(cell);
      this.cells.push(cell);
    }
  }

  getRandomCell() {
    let nextIndex;

    do {
      nextIndex = Math.floor(Math.random() * this.cells.length);
    } while (nextIndex === this.currentIndex);

    this.currentIndex = nextIndex;
    return this.cells[nextIndex];
  }
}

class Goblin {
  constructor(imageSrc) {
    this.element = document.createElement('img');
    this.element.src = imageSrc;
    this.element.alt = 'Goblin';
    this.element.classList.add('goblin');
  }

  show(cell) {
    cell.append(this.element);
  }

  hide() {
    this.element.remove();
  }
}

class Game {
  constructor(board, goblin, scoreElement, missesElement) {
    if (!scoreElement) {
      throw new Error('Элемент #score не найден в DOM');
    }

    if (!missesElement) {
      throw new Error('Элемент #misses не найден в DOM');
    }

    this.board = board;
    this.goblin = goblin;
    this.scoreElement = scoreElement;
    this.missesElement = missesElement;

    this.score = 0;
    this.misses = 0;
    this.isGoblinHit = false;
    this.intervalId = null;

    this.onGoblinClick = this.onGoblinClick.bind(this);
  }

  start() {
    this.board.create();
    this.goblin.element.addEventListener('click', this.onGoblinClick);
    this.showGoblin();
    this.intervalId = setInterval(() => this.nextRound(), APPEARANCE_TIME_MS);
  }

  showGoblin() {
    this.isGoblinHit = false;
    const cell = this.board.getRandomCell();
    this.goblin.show(cell);
  }

  nextRound() {
    if (!this.isGoblinHit) {
      this.misses += 1;
      this.updateStats();
    }

    if (this.misses >= MAX_MISSES) {
      this.stop();
      return;
    }

    this.showGoblin();
  }

  onGoblinClick() {
    this.score += 1;
    this.isGoblinHit = true;
    this.updateStats();
    this.goblin.hide();
  }

  updateStats() {
    this.scoreElement.textContent = this.score;
    this.missesElement.textContent = this.misses;
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.goblin.hide();
    this.goblin.element.removeEventListener('click', this.onGoblinClick);
    alert('Игра окончена! Вы пропустили 5 гоблинов.');
  }
}

const boardElement = document.querySelector('.board');
const scoreElement = document.querySelector('#score');
const missesElement = document.querySelector('#misses');

const board = new Board(boardElement);
const goblin = new Goblin(goblinImage);
const game = new Game(board, goblin, scoreElement, missesElement);

game.start();
