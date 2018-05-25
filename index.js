/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-get-all-model',
  
  contentFor: function(type, config) {
    if (type === 'body-footer') {
      var emberBasicDropdown = this.addons.filter(function(addon) {
        return addon.name === 'ember-power-select';
      })[0];
      return emberBasicDropdown.contentFor(type, config);
    } else {
      return '';
    }
  }

};
