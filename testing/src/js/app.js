import CardValidatorWidget from './widget';

const widgetElement = document.querySelector('[data-widget="card-validator"]');
const widget = new CardValidatorWidget(widgetElement);

widget.bindToDOM();
