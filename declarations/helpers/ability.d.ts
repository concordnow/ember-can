import Helper from '@ember/component/helper';
import type AbilitiesService from '../services/abilities.ts';
interface AbilitySignature {
    Args: {
        Positional: [abilityString: string, model?: unknown];
        Named: Record<string, unknown>;
    };
    Return: unknown;
}
export default class AbilityHelper extends Helper<AbilitySignature> {
    abilities: AbilitiesService;
    compute([abilityString, model]: AbilitySignature['Args']['Positional'], properties?: AbilitySignature['Args']['Named']): unknown;
}
export {};
//# sourceMappingURL=ability.d.ts.map