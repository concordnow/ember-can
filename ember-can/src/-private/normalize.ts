import { camelize } from '@ember/string';
import { singularize } from 'ember-inflector';

const stopWords = ['of', 'in', 'for', 'to', 'from', 'on', 'as'];

/**
 * Normalize string into an object with extracted propertyName, abilityName and optional subProperty
 * eg. for 'create projects in account' -> `{ propertyName: 'createProjects', abilityName: 'account', subProperty: undefined }`
 * eg. for 'edit posts:reason'         -> `{ propertyName: 'edit',           abilityName: 'post',    subProperty: 'reason' }`
 * @private
 * @param  {String} string eg. 'create projects in account'
 * @return {Object}        extracted propertyName, abilityName and subProperty
 */
export default function (string: string) {
  const [abilityString, subProperty] = string
    .split(':')
    .map((s) => s.trim()) as [string, string | undefined];
  const parts = abilityString.split(' ');
  const abilityName = singularize(parts.pop() as string);
  const last = parts[parts.length - 1];

  if (stopWords.includes(last as string)) {
    parts.pop();
  }

  const propertyName = camelize(parts.join(' '));

  return { propertyName, abilityName, subProperty };
}
