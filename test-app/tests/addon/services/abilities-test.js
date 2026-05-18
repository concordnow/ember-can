import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Ability } from 'ember-can';
import Sinon from 'sinon';

module('Unit | Service | abilities', function (hooks) {
  setupTest(hooks);

  test('can', function (assert) {
    let service = this.owner.lookup('service:abilities');

    this.owner.register(
      'ability:super-model',
      class extends Ability {
        get canTouchThis() {
          return this.model.yeah;
        }
      },
    );

    assert.true(service.can('touchThis in superModel', { yeah: true }));
  });

  test('cannot', function (assert) {
    let service = this.owner.lookup('service:abilities');

    this.owner.register(
      'ability:super-model',
      class extends Ability {
        get canTouchThis() {
          return this.model.yeah;
        }
      },
    );

    assert.true(service.cannot('touchThis in superModel', { yeah: false }));
  });

  test('valueFor', function (assert) {
    const fakeAbility = Sinon.fake(({ yeah }) => yeah);

    this.owner.register(
      'ability:super-model',
      class extends Ability {
        canTouchThis() {
          return fakeAbility(...arguments);
        }
      },
    );

    let service = this.owner.lookup('service:abilities');

    assert.strictEqual(
      service.valueFor(
        'touchThis',
        'superModel',
        { yeah: 'Yeah!' },
        { props: true },
      ),
      'Yeah!',
    );

    assert.true(fakeAbility.calledOnce);
    assert.deepEqual(fakeAbility.firstCall.args[0], { yeah: 'Yeah!' });
    assert.deepEqual(fakeAbility.firstCall.args[1], { props: true });
  });

  test('abilityFor', function (assert) {
    let service = this.owner.lookup('service:abilities');

    this.owner.register('ability:super-model', class extends Ability {});

    let ability = service.abilityFor('superModel');

    assert.ok(ability);
    assert.ok(ability instanceof Ability);

    assert.throws(
      () => service.abilityFor('abilityNotFound'),
      'No ability type found for abilityNotFound',
    );
  });

  test('parse', function (assert) {
    let service = this.owner.lookup('service:abilities');

    assert.deepEqual(service.parse('manage members in project'), {
      propertyName: 'manageMembers',
      abilityName: 'project',
      subProperty: undefined,
    });

    assert.deepEqual(service.parse('add tags to post'), {
      propertyName: 'addTags',
      abilityName: 'post',
      subProperty: undefined,
    });

    assert.deepEqual(service.parse('manage members in project:reason'), {
      propertyName: 'manageMembers',
      abilityName: 'project',
      subProperty: 'reason',
    });
  });

  test('can unwraps object results via the can key', function (assert) {
    this.owner.register(
      'ability:post',
      class extends Ability {
        get canEdit() {
          return { can: true, reason: 'allowed' };
        }
      },
    );

    let service = this.owner.lookup('service:abilities');

    assert.true(service.can('edit post'));
  });

  test('cannot unwraps object results via the can key', function (assert) {
    this.owner.register(
      'ability:post',
      class extends Ability {
        get canEdit() {
          return { can: false, reason: 'nope' };
        }
      },
    );

    let service = this.owner.lookup('service:abilities');

    assert.true(service.cannot('edit post'));
  });

  test('can throws if object result has no can key', function (assert) {
    this.owner.register(
      'ability:post',
      class extends Ability {
        get canEdit() {
          return { reason: 'whoops' };
        }
      },
    );

    let service = this.owner.lookup('service:abilities');

    assert.throws(() => service.can('edit post'));
  });

  test('can forbids :subProperty syntax', function (assert) {
    this.owner.register(
      'ability:post',
      class extends Ability {
        get canEdit() {
          return { can: true, reason: 'ok' };
        }
      },
    );

    let service = this.owner.lookup('service:abilities');

    assert.throws(() => service.can('edit post:reason'));
  });
});
