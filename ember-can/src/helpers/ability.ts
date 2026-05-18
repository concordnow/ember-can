import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
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
    const { propertyName, abilityName, subProperty } = this.abilities.parse(
      abilityString ?? '',
    );

    const result = this.abilities.valueFor(
      propertyName,
      abilityName,
      model,
      properties,
    );

    if (!subProperty) {
      return result;
    }

    return get(result as object, subProperty);
  }
}
