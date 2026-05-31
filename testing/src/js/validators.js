export function normalizeCardNumber(value) {
  return String(value).replace(/\D/g, '');
}

export function isValidCardNumber(value) {
  const cardNumber = normalizeCardNumber(value);

  if (cardNumber.length < 12 || cardNumber.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
    let digit = Number(cardNumber[i]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function getPaymentSystem(value) {
  const cardNumber = normalizeCardNumber(value);

  if (cardNumber.length === 0) {
    return 'unknown';
  }

  if (cardNumber.startsWith('4')) {
    return 'visa';
  }

  const firstTwoDigits = Number(cardNumber.slice(0, 2));
  if (firstTwoDigits >= 51 && firstTwoDigits <= 55) {
    return 'mastercard';
  }

  const firstFourDigits = Number(cardNumber.slice(0, 4));
  if (firstFourDigits >= 2200 && firstFourDigits <= 2204) {
    return 'mir';
  }

  if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) {
    return 'amex';
  }

  if (cardNumber.startsWith('6011') || cardNumber.startsWith('65')) {
    return 'discover';
  }

  if (cardNumber.startsWith('35')) {
    return 'jcb';
  }

  if (
    cardNumber.startsWith('300')
    || cardNumber.startsWith('301')
    || cardNumber.startsWith('302')
    || cardNumber.startsWith('303')
    || cardNumber.startsWith('304')
    || cardNumber.startsWith('305')
    || cardNumber.startsWith('36')
    || cardNumber.startsWith('38')
  ) {
    return 'diners';
  }

  return 'unknown';
}
