import Helper from '@ember/component/helper';
import { inject } from '@ember/service';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { g, i } from 'decorator-transforms/runtime';

class AbilityHelper extends Helper {
  static {
    g(this.prototype, "abilities", [inject]);
  }
  #abilities = (i(this, "abilities"), void 0);
  compute([abilityString, model], properties = {}) {
    assert(`ember-can {{ability}} helper requires a non-empty ability string as its first argument`, typeof abilityString === 'string' && abilityString.length > 0);
    const {
      propertyName,
      abilityName,
      subProperty
    } = this.abilities.parse(abilityString);
    const result = this.abilities.valueFor(propertyName, abilityName, model, properties);
    if (!subProperty) {
      return result;
    }
    if (result === null || typeof result !== 'object') {
      return undefined;
    }
    return get(result, subProperty);
  }
}

export { AbilityHelper as default };
//# sourceMappingURL=ability.js.map
