import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Ability } from 'ember-can';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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
});
