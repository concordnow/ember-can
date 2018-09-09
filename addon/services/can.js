import Service from '@ember/service';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { assign } from '@ember/polyfills';
import { run } from '@ember/runloop';

import normalizeAbilityString from 'ember-can/utils/normalize';

export default Service.extend({
  /**
   * Parse ablityString into an object with extracted propertyName and abilityName
   * eg. for 'create projects in account' -> `{ propertyName: 'createProjects', abilityName: 'account'}`
   * @param  {String} string eg. 'create projects in account'
   * @return {Object}        extracted propertyName and abilityName
   */
  parse(abilityString) {
    return normalizeAbilityString(abilityString);
  },

  /**
   * Create an instance of Ability
   * @param  {String} abilityName     name of ability class
   * @param  {} model
   * @param  {Object} [properties={}] extra properties (to be set on the ability instance)
   * @return {Ability}                 Ability instance of requested ability
   */
  abilityFor(abilityName, model, properties = {}) {
    let Ability = getOwner(this).factoryFor(`ability:${abilityName}`);

    assert(`No ability type found for '${abilityName}'`, Ability);

    if (typeof model != 'undefined') {
      properties = assign({}, { model }, properties);
    }

    return Ability.create(properties);
  },

  /**
   * Returns a value for requested ability in specified ability class
   * @param  {String} propertyName name of ability, eg `createProjects`
   * @param  {String} abilityName  name of ability class
   * @param  {} model
   * @param  {Object} properties   extra properties (to be set on the ability instance)
   * @return {}                    value of ability
   */
  valueFor(propertyName, abilityName, model, properties) {
    let ability = this.abilityFor(abilityName, model, properties);
    let result = ability.getAbility(propertyName);

    run(() => ability.destroy());

    return result;
  },

  /**
   * Returns `true` if ability is permitted
   * @param  {[type]} abilityString eg. 'create projects in account'
   * @param  {} model
   * @param  {[type]} properties    extra properties (to be set on the ability instance)
   * @return {Boolean}              value of ability converted to boolean
   */
  can(abilityString, model, properties) {
    let { propertyName, abilityName } = this.parse(abilityString);
    return !!this.valueFor(propertyName, abilityName, model, properties);
  },

  /**
   * Returns `true` if ability is not permitted
   * @param  {[type]} abilityString eg. 'create projects in account'
   * @param  {} model
   * @param  {[type]} properties    extra properties (to be set on the ability instance)
   * @return {Boolean}              value of ability converted to boolean
   */
  cannot(abilityString, model, properties) {
    return !this.can(abilityString, model, properties);
  }
});
