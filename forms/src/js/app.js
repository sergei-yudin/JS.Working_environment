const button = document.querySelector('[data-toggle="popover"]');

function createPopover(title, content) {
  const popover = document.createElement('div');
  popover.classList.add('popover');

  const popoverTitle = document.createElement('h3');
  popoverTitle.classList.add('popover-title');
  popoverTitle.textContent = title;

  const popoverContent = document.createElement('div');
  popoverContent.classList.add('popover-content');
  popoverContent.textContent = content;

  popover.append(popoverTitle);
  popover.append(popoverContent);

  return popover;
}

function positionPopover(popover, target) {
  const targetRect = target.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();

  const top = targetRect.top + window.scrollY - popoverRect.height - 8;
  const left = targetRect.left + window.scrollX + (targetRect.width - popoverRect.width) / 2;

  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;
}

button.addEventListener('click', () => {
  const existingPopover = document.querySelector('.popover');

  if (existingPopover) {
    existingPopover.remove();
    return;
  }

  const title = button.dataset.title;
  const content = button.dataset.content;

  const popover = createPopover(title, content);
  document.body.append(popover);
  positionPopover(popover, button);
});
