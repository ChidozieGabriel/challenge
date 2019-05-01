const INPUT_SELECTOR = '[data-dice="input"]';
const FORM_SELECTOR = '[data-dice="form"]';
const RESULT_SELECTOR = '[data-result="text"]';
const ERROR_SELECTOR = '[data-error="text"]';

const input = document.querySelector(INPUT_SELECTOR);
const form = document.querySelector(FORM_SELECTOR);
const result = document.querySelector(RESULT_SELECTOR);
const error = document.querySelector(ERROR_SELECTOR);

form.addEventListener('submit', e => {
  e.preventDefault();
  error.innerHTML = null;

  try {
    const values = get_array(input.value);
    throw_error(values);
    result.innerHTML = read_result(rolls(values));
  } catch (e) {
    error.innerHTML = read_error(e.message);
  } finally {
    input.blur();
  }
});

input.addEventListener('input', () => {
  result.innerHTML = null;
  error.innerHTML = null;
});

input.addEventListener('keyup', () => {
  const valid_value = get_valid(input.value);
  if (valid_value.length !== input.value.length)
    error.innerHTML = read_error('Invalid input!');
  input.value = valid_value;
});

const get_array = str => {
  return str.split('').map(e => +e);
};

const rolls = dice_arr => {
  return dice_arr.reduce((sum, cur, idx, arr) => {
    const prev = arr[idx - 1];
    if (prev === 1) return sum;
    if (prev === 6) return sum + 2 * cur;
    return sum + cur;
  });
};

const throw_error = arr => {
  if (arr.length < 3)
    throw new Error(
      `Total dice rolled (${arr.length}) must be greater than 2 !`
    );
};

const get_valid = str => {
  if (str.length === 0) return '';
  if (str.length === 1) {
    const a = str[0];
    return is_valid(a) ? a : '';
  }
  const pos = Math.ceil(str.length / 2);
  return get_valid(str.slice(0, pos)) + get_valid(str.slice(pos));
};

const is_valid = str => !isNaN(str) && +str >= 1 && +str <= 6;
const read_error = err => '*' + err;
const read_result = res => 'Total Rolls: ' + res;
