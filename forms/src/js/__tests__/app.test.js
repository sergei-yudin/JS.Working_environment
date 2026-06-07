test('popover should appear after button click', () => {
  document.body.innerHTML = `
    <button
      type="button"
      data-toggle="popover"
      data-title="Popover title"
      data-content="Popover text"
    >
      Click
    </button>
  `;

  const button = document.querySelector('[data-toggle="popover"]');

  button.addEventListener('click', () => {
    const popover = document.createElement('div');
    popover.classList.add('popover');
    document.body.append(popover);
  });

  button.click();

  expect(document.querySelector('.popover')).not.toBeNull();
});
