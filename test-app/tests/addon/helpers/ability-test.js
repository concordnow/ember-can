import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Ability } from 'ember-can';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
// eslint-disable-next-line ember/no-classic-classes
import EmberObject, { get, set } from '@ember/object';

module('Addon | Helper | ability', function (hooks) {
  setupRenderingTest(hooks);

  test('returns the raw value when no subProperty is given', async function (assert) {
    this.owner.register(
      'ability:post',
      class extends Ability {
        get canEdit() {
          return 'raw-value';
        }
      },
    );

    await render(hbs`{{ability "edit post"}}`);
    assert.dom(this.element).hasText('raw-value');
  });

  test('returns the subProperty when given', async function (assert) {
    this.owner.register(
      'ability:post',
      class extends Ability {
        get canEdit() {
          return { can: false, reason: 'because-tests' };
        }
      },
    );

    await render(hbs`{{ability "edit post:reason"}}`);
    assert.dom(this.element).hasText('because-tests');
  });

  test('works with custom parseProperty', async function (assert) {
    this.owner.register(
      'ability:post',
      class extends Ability {
        parseProperty(propertyName) {
          return propertyName; // no `can` prefix
        }

        get worksWell() {
          return { can: true, subProperty: 'prop' };
        }
      },
    );

    await render(hbs`{{ability "works well post:subProperty"}}`);
    assert.dom(this.element).hasText('prop');
  });

  test('reacts to ability changes via tracked properties', async function (assert) {
    this.owner.register(
      'service:session',
      class extends Service {
        @tracked isLoggedIn = false;
      },
    );

    this.owner.register(
      'ability:post',
      class extends Ability {
        @service session;

        get canEdit() {
          return {
            can: this.session.isLoggedIn,
            reason: this.session.isLoggedIn ? 'allowed' : 'not-logged-in',
          };
        }
      },
    );

    await render(hbs`{{ability "edit post:reason"}}`);
    assert.dom(this.element).hasText('not-logged-in');

    this.owner.lookup('service:session').isLoggedIn = true;
    await settled();

    assert.dom(this.element).hasText('allowed');
  });

  test('reacts to classic EmberObject model mutations', async function (assert) {
    this.owner.register(
      'ability:post',
      class extends Ability {
        get canEdit() {
          // eslint-disable-next-line ember/no-get
          return get(this.model, 'editable');
        }
      },
    );

    const model = EmberObject.create({ editable: false });
    this.set('model', model);

    await render(hbs`{{ability "edit post" this.model}}`);
    assert.dom(this.element).hasText('false');

    set(model, 'editable', true);
    await settled();

    assert.dom(this.element).hasText('true');
  });

  module('object-result unwrap through {{can}} / {{cannot}}', function () {
    test('{{can}} unwraps a truthy object result', async function (assert) {
      this.owner.register(
        'ability:post',
        class extends Ability {
          get canEdit() {
            return { can: true, reason: 'owner' };
          }
        },
      );

      await render(hbs`{{if (can "edit post") "allowed" "denied"}}`);
      assert.dom(this.element).hasText('allowed');
    });

    test('{{cannot}} unwraps a falsy object result', async function (assert) {
      this.owner.register(
        'ability:post',
        class extends Ability {
          get canEdit() {
            return { can: false, reason: 'not-owner' };
          }
        },
      );

      await render(hbs`{{if (cannot "edit post") "blocked" "open"}}`);
      assert.dom(this.element).hasText('blocked');
    });
  });
});
