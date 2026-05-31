import { getPaymentSystem, isValidCardNumber } from './validators';

export default class CardValidatorWidget {
  constructor(element) {
    if (!element) {
      throw new Error('Элемент виджета не найден в DOM');
    }

    this.element = element;
    this.input = this.element.querySelector('[data-id="card-input"]');
    this.form = this.element.querySelector('[data-id="card-form"]');
    this.result = this.element.querySelector('[data-id="card-result"]');
    this.systems = Array.from(this.element.querySelectorAll('[data-system]'));

    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  bindToDOM() {
    this.input.addEventListener('input', this.onInput);
    this.form.addEventListener('submit', this.onSubmit);
  }

  onInput() {
    const paymentSystem = getPaymentSystem(this.input.value);

    this.systems.forEach((systemElement) => {
      systemElement.classList.toggle(
        'card-system_active',
        systemElement.dataset.system === paymentSystem,
      );
    });

    this.input.classList.remove('valid', 'invalid');
    this.result.textContent = '';
  }

  onSubmit(event) {
    event.preventDefault();

    const isValid = isValidCardNumber(this.input.value);

    this.input.classList.toggle('valid', isValid);
    this.input.classList.toggle('invalid', !isValid);

    this.result.classList.toggle('card-validator__result_valid', isValid);
    this.result.classList.toggle('card-validator__result_invalid', !isValid);
    this.result.textContent = isValid ? 'Номер карты валиден' : 'Номер карты невалиден';
  }
}
