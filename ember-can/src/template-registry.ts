import AbilityHelper from './helpers/ability.ts';
import CanHelper from './helpers/can.ts';
import CannotHelper from './helpers/cannot.ts';

export default interface Registry {
  ability: typeof AbilityHelper;
  can: typeof CanHelper;
  cannot: typeof CannotHelper;
}
