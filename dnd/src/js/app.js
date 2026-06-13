const STORAGE_KEY = 'trello-board-state';

const defaultState = {
  todo: [],
  progress: [],
  done: [],
};

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return { ...defaultState };
  }

  return JSON.parse(savedState);
}

function saveState(currentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
}

let state = loadState();

let draggedCard = null;
let draggedColumnKey = null;
let draggedCardIndex = null;
let shiftX = 0;
let shiftY = 0;

const placeholder = document.createElement('div');
placeholder.classList.add('card-placeholder');

function createCard(text, columnKey, cardIndex) {
  return `
    <div class="card" data-column="${columnKey}" data-index="${cardIndex}">
      <div class="card-text">${text}</div>
      <button class="card-delete" type="button">×</button>
    </div>
  `;
}

function createColumn(title, key) {
  const cards = state[key]
    .map((cardText, index) => createCard(cardText, key, index))
    .join('');

  return `
    <div class="column" data-column="${key}">
      <div class="column-title">${title}</div>

      <div class="cards">
        ${cards}
      </div>

      <button class="add-card-btn" type="button">
        Add another card
      </button>
    </div>
  `;
}

function renderBoard() {
  const board = document.querySelector('[data-id="board"]');

  board.innerHTML = `
    ${createColumn('TODO', 'todo')}
    ${createColumn('IN PROGRESS', 'progress')}
    ${createColumn('DONE', 'done')}
  `;
}

function showAddCardForm(column) {
  const addButton = column.querySelector('.add-card-btn');
  addButton.classList.add('hidden');

  const form = document.createElement('form');
  form.classList.add('add-card-form');

  form.innerHTML = `
    <textarea class="add-card-textarea" placeholder="Enter a title for this card..."></textarea>
    <div class="add-card-actions">
      <button class="add-card-submit" type="submit">Add Card</button>
      <button class="add-card-cancel" type="button">×</button>
    </div>
  `;

  column.append(form);

  const textarea = form.querySelector('.add-card-textarea');
  textarea.focus();
}

function hideAddCardForm(column) {
  const form = column.querySelector('.add-card-form');
  const addButton = column.querySelector('.add-card-btn');

  if (form) {
    form.remove();
  }

  addButton.classList.remove('hidden');
}

function addCard(column, text) {
  const columnKey = column.dataset.column;

  state[columnKey].push(text);
  saveState(state);
  renderBoard();
}

function deleteCard(card) {
  const columnKey = card.dataset.column;
  const cardIndex = Number(card.dataset.index);

  state[columnKey].splice(cardIndex, 1);
  saveState(state);
  renderBoard();
}

function getCardAfterElement(cardsContainer, y) {
  const cards = Array.from(cardsContainer.querySelectorAll('.card:not(.dragged)'));

  return cards.find((card) => {
    const cardRect = card.getBoundingClientRect();
    return y < cardRect.top + cardRect.height / 2;
  });
}

function moveCardToState(targetColumnKey, targetIndex) {
  const [movedCardText] = state[draggedColumnKey].splice(draggedCardIndex, 1);

  let fixedTargetIndex = targetIndex;

  if (draggedColumnKey === targetColumnKey && draggedCardIndex < targetIndex) {
    fixedTargetIndex -= 1;
  }

  state[targetColumnKey].splice(fixedTargetIndex, 0, movedCardText);
  saveState(state);
}

function onMouseMove(event) {
  if (!draggedCard) {
    return;
  }

  draggedCard.style.left = `${event.pageX - shiftX}px`;
  draggedCard.style.top = `${event.pageY - shiftY}px`;

  draggedCard.hidden = true;
  const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
  draggedCard.hidden = false;

  if (!elementBelow) {
    return;
  }

  const cardsContainer = elementBelow.closest('.cards');

  if (!cardsContainer) {
    return;
  }

  const cardAfterElement = getCardAfterElement(cardsContainer, event.clientY);

  if (cardAfterElement) {
    cardsContainer.insertBefore(placeholder, cardAfterElement);
  } else {
    cardsContainer.append(placeholder);
  }
}

function onMouseUp() {
  if (!draggedCard) {
    return;
  }

  const targetColumn = placeholder.closest('.column');

  if (targetColumn) {
    const targetColumnKey = targetColumn.dataset.column;
    const targetCardsContainer = targetColumn.querySelector('.cards');
    const targetIndex = Array.from(targetCardsContainer.children).indexOf(placeholder);

    moveCardToState(targetColumnKey, targetIndex);
  }

  draggedCard.remove();
  placeholder.remove();

  draggedCard = null;
  draggedColumnKey = null;
  draggedCardIndex = null;

  document.body.classList.remove('dragging');
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);

  renderBoard();
}

function startDragging(card, event) {
  draggedColumnKey = card.dataset.column;
  draggedCardIndex = Number(card.dataset.index);

  const cardRect = card.getBoundingClientRect();

  shiftX = event.clientX - cardRect.left;
  shiftY = event.clientY - cardRect.top;

  placeholder.style.height = `${cardRect.height}px`;
  card.after(placeholder);

  draggedCard = card;
  draggedCard.classList.add('dragged');
  draggedCard.style.width = `${cardRect.width}px`;
  draggedCard.style.left = `${event.pageX - shiftX}px`;
  draggedCard.style.top = `${event.pageY - shiftY}px`;

  document.body.append(draggedCard);
  document.body.classList.add('dragging');

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('add-card-btn')) {
    const column = event.target.closest('.column');
    showAddCardForm(column);
  }

  if (event.target.classList.contains('add-card-cancel')) {
    const column = event.target.closest('.column');
    hideAddCardForm(column);
  }

  if (event.target.classList.contains('card-delete')) {
    const card = event.target.closest('.card');
    deleteCard(card);
  }
});

document.addEventListener('submit', (event) => {
  if (!event.target.classList.contains('add-card-form')) {
    return;
  }

  event.preventDefault();

  const column = event.target.closest('.column');
  const textarea = event.target.querySelector('.add-card-textarea');
  const text = textarea.value.trim();

  if (!text) {
    return;
  }

  addCard(column, text);
});

document.addEventListener('mousedown', (event) => {
  if (event.target.classList.contains('card-delete')) {
    return;
  }

  const card = event.target.closest('.card');

  if (!card) {
    return;
  }

  event.preventDefault();
  startDragging(card, event);
});

renderBoard();
