import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import Driver from 'shared/mixins/host-driver';
import layout from './template';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Component.extend(Driver, {
  layout,
  clusterStore:    service(),
  errors:          null,
  host:            null,
  clonedModel:     null,
  primaryResource: alias('clonedModel'),
  hostOptions:     null,
  labelResource:   alias('primaryResource'),

  didReceiveAttrs() {
    this._super(...arguments);

    let cm = get(this, 'clusterStore').createRecord({type: 'machine'});
    this.setProperties({
      hostOptions: this.get(`machineTemplate.${this.get('machineTemplate.driver')}Config`),
      // @@TODO@@ - 11-28-17 - not sure we should be doing this this way how the heck do we know which host to clone labels from?
      // clonedModel: this.get('host').clone(),
      clonedModel: cm,
    });

  },
});
