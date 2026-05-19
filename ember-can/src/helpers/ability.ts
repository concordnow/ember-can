import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import type AbilitiesService from '../services/abilities.ts';

interface AbilitySignature {
  Args: {
    Positional: [abilityString: string, model?: unknown];
    Named: Record<string, unknown>;
  };
  Return: unknown;
}

export default class AbilityHelper extends Helper<AbilitySignature> {
  @service declare abilities: AbilitiesService;

  compute(
    [abilityString, model]: AbilitySignature['Args']['Positional'],
    properties: AbilitySignature['Args']['Named'] = {},
  ): unknown {
    assert(
      `ember-can {{ability}} helper requires a non-empty ability string as its first argument`,
      typeof abilityString === 'string' && abilityString.length > 0,
    );

    const { propertyName, abilityName, subProperty } =
      this.abilities.parse(abilityString);

    const result = this.abilities.valueFor(
      propertyName,
      abilityName,
      model,
      properties,
    );

    if (!subProperty) {
      return result;
    }

    assert(
      `ember-can {{ability}}: subProperty '${subProperty}' was requested but the '${abilityName}' ability returned ${result === null ? 'null' : typeof result} — ability properties must return an object when ':subProperty' syntax is used`,
      result !== null && typeof result === 'object',
    );

    return get(result, subProperty);
  }
}
