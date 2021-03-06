import Mixin from '@ember/object/mixin';
import { get, set } from '@ember/object';
import { send } from 'ember-metal/events';
import { inject as service } from '@ember/service';
import Errors from 'shared/utils/errors';

export default Mixin.create({
  access:       service(),

  preload(type, storeName='store', opt=null) {
    return get(this,storeName).find(type,null,opt);
  },

  loadSchemas(storeName) {
    var store = get(this,storeName);
    store.resetType('schema');
    return store.rawRequest({url:'schema', dataType: 'json'}).then((xhr) => {
      store._bulkAdd('schema', xhr.body.data);
    });
  },

  loadingError(err, transition) {
    let isAuthEnabled = get(this, 'access.enabled');
    let isAuthFail = err && err.status && [401,403].includes(err.status);

    var msg = Errors.stringify(err);
    console.log('Loading Error:', msg, err);
    if ( err && (isAuthEnabled || isAuthFail) ) {
      set(this, 'access.enabled', true);
      send(this, 'logout', transition, isAuthFail, (isAuthFail ? undefined : msg));
    } else {
      this.replaceWith('global-admin.clusters');
    }
  },
});
