import { categoryColors, invalidInputs } from './constants.js';
import { useAlertsStore } from './stores/alerts.js';

export function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  // The maximum is exclusive and the minimum is inclusive
}

export function removeInvalid(input) {
  for (const char of invalidInputs) {
    input = input.replaceAll(char, '');
  }
  return input;
}
export function hasInvalid(input) {
  for (const char of invalidInputs) {
    if (input.includes(char)) return true;
  }
  return false;
}

export function getCategoryColor(category) {
  return categoryColors[category.replaceAll('/', '_').replaceAll(' ', '_')];
}
export function isIterable(value) {
  if (value instanceof String) {
    return false;
  }
  return value != null && typeof value.forEach === 'function';
}

export function transformValue(value) {
  if (!isIterable(value)) {
    return value;
  }
  let vals = [];
  for (const val of value) {
    for (const [key, value] of Object.entries(val)) {
      vals.push(value);
    }
  }
  return vals.join('_$split$_');
}

export async function copyToCb(event) {
  event.preventDefault();
  const alerts = useAlertsStore();

  const copiedText = event.currentTarget.innerText;
  navigator.clipboard.writeText(copiedText).then(() => {
    alerts.push({ message: 'Copied \"' + copiedText + '\" to clipboard' });
  });
}
export function withoutKeys(obj, keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
}

export function getJpValue(obj, key) {
  if (!obj.jp[key]) return '---';
  return transformValue(obj.jp[key]);
}

export function stringifyCharacters(obj) {
  if (!isIterable(obj)) {
    return obj;
  }
  if (!obj) {
    return null;
  }
  let vals = [];
  for (const val of obj) {
    for (const [key, value] of Object.entries(val)) {
      vals.push(value);
    }
  }
  return vals.join(', ');
}

export function getDisplayName(obj) {
  return (
    obj?.character ||
    stringifyCharacters(obj?.characters) ||
    obj?.title ||
    obj?.classification ||
    'unknown_character'
  );
}

export function getJpDisplayName(obj) {
  return (
    obj?.jp.character ||
    stringifyCharacters(obj?.jp.characters) ||
    obj?.jp.title ||
    obj?.jp.classification ||
    'unknown_character'
  );
}