const INPUT_SELECTOR = '[data-dice="input"]';
const FORM_SELECTOR = '[data-dice="form"]';
const RESULT_SELECTOR = '[data-result="text"]';
const ERROR_SELECTOR = '[data-error="text"]';
const KEY_CODE_1 = 49;
const KEY_CODE_6 = 54;
const KEY_CODE_DASH = 189;
const KEY_CODE_ENTER = 13;

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
  input.value = get_valid(input.value);
});

const get_array = str => {
  return str.split('').map(e => +e);
};

const rolls = dice_arr => {
  let rolled_one = false;
  let rolled_six = false;
  let count = 0;

  for (let i = 0; i < dice_arr.length; i++) {
    const roll = dice_arr[i];
    count += roll_value(roll, rolled_one, rolled_six);
    rolled_one = rolled_six = false;
    if (roll === 1) rolled_one = true;
    if (roll === 6) rolled_six = true;
  }

  return count;
};

const roll_value = (roll, rolled_one, rolled_six) => {
  if (rolled_one) return 0;
  if (rolled_six) return 2 * roll;
  return roll;
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
