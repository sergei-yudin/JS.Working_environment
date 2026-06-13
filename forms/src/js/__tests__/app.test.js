const buttonMarkup = `
  <div class="container">
    <button
      class="popover-button"
      type="button"
      data-toggle="popover"
      data-title="Popover title"
      data-content="And here's some amazing content. It's very engaging. Right?"
    >
      Click to toggle popover
    </button>
  </div>
`;

describe('Popover widget', () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = buttonMarkup;
  });

  test('popover should not exist before click', () => {
    require('../app');

    expect(document.querySelector('.popover')).toBeNull();
  });

  test('popover should appear after first click', () => {
    require('../app');

    const button = document.querySelector('[data-toggle="popover"]');
    button.click();

    expect(document.querySelector('.popover')).not.toBeNull();
    expect(document.querySelector('.popover-title').textContent).toBe('Popover title');
    expect(document.querySelector('.popover-content').textContent).toBe(
      "And here's some amazing content. It's very engaging. Right?",
    );
  });

  test('popover should disappear after second click', () => {
    require('../app');

    const button = document.querySelector('[data-toggle="popover"]');
    button.click();
    button.click();

    expect(document.querySelector('.popover')).toBeNull();
  });

  test('popover should have calculated position', () => {
    require('../app');

    const button = document.querySelector('[data-toggle="popover"]');
    button.click();

    const popover = document.querySelector('.popover');

    expect(popover.style.top).not.toBe('');
    expect(popover.style.left).not.toBe('');
  });
});
