/**
 * Normalize string into an object with extracted propertyName, abilityName and optional subProperty
 * eg. for 'create projects in account' -> `{ propertyName: 'createProjects', abilityName: 'account', subProperty: undefined }`
 * eg. for 'edit posts:reason'         -> `{ propertyName: 'edit',           abilityName: 'post',    subProperty: 'reason' }`
 * @private
 * @param  {String} string eg. 'create projects in account'
 * @return {Object}        extracted propertyName, abilityName and subProperty
 */
export default function (string: string): {
    propertyName: string;
    abilityName: string;
    subProperty: string | undefined;
};
//# sourceMappingURL=normalize.d.ts.map