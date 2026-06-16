import { categoryColors, invalidInputs } from './constants.js';
import { useAlertsStore } from './stores/alerts.js';
import { figureGet, figureSet } from './db/idb.js';
import { useFigureSearchStore } from './stores/figuresearch.js';

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
    stringifyCharacters(obj?.character) ||
    stringifyCharacters(obj?.characters) ||
    obj?.title ||
    obj?.classification ||
    'unknown_character'
  );
}

export function getJpDisplayName(obj) {
  return (
    stringifyCharacters(obj?.jp.character) ||
    stringifyCharacters(obj?.jp.characters) ||
    obj?.jp.title ||
    obj?.jp.classification ||
    'unknown_character'
  );
}

export async function tryAddFigure(obj) {
  const alerts = useAlertsStore();
  const fsearch = useFigureSearchStore();
  let figureObject = obj
  try {
    if (!figureObject.character && !figureObject.characters && !figureObject.origin) {
      throw new SyntaxError("Input doesn't fit figure schema.");
    }

    let oldData = await figureGet(figureObject.id);
    if (oldData) {
      const mergedFigure = {
        ...oldData.value,
        ...figureObject,
      };
      figureObject = mergedFigure;
    }
    await figureSet(figureObject.id, figureObject);
    await fsearch.updateEntries();
    alerts.push({
      message: 'Added/Updated "' + getDisplayName(figureObject) + '" successfully!',
      type: 'success',
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      alerts.push({
        message:
          'Could not add data. No valid figure data JSON object in clipboard.\n' + e.message,
        type: 'error',
      });
      return;
    }
    alerts.push({
      message: e,
      type: 'error',
    });
    throw e;
  }
}