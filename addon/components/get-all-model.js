import Component from '@ember/component';
import layout from '../templates/components/get-all-model';
import { get, set, getProperties, computed, observer, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { isBlank } from '@ember/utils';

export default Component.extend({
  layout,
  tagName: '',
  store: service(),
  publicAPI: null,

  noMatchesMessage: 'No results found',
  /*
    Force a server reload
  */
  reload: true,

  customRendering: false, //defaults to show the template of a select/autocomplete field

  /*
    Entity to peekAll or query from
  */
  modelName: null,


  /*
    Remote filters to append
  */
  filters: {},

  /*
    The result of peekAll or query
  */
  objects: null,

  /*

    You can provide a function to filter the peekAll, if so, be sure to return a boolean, the function will be called with (object)
    Example

    filterFunc: (object) => {
      return object.get('age') > 20;
    };

    Will filter the entire peekAll for objects with age greater than 20

  }
  */
  filterFunc: null,

  /*
    Presentational State
  */
  isLoading: true,
  allowClear: true,
  noMatchesMessage: "No results found",
  isInvalid: false,

  /*
    Key to search and filter
  */
  searchField: "name",
  labelPath: "name",
  label: null,

  /*
    If true, the component will bubble onValidChange with true/false everytime it changes
  */
  required: false,

  /*
    Bubble true/false everytime the validity changes, using isBlank and customValidation function
  */
  onValidChange() {},

  /*
    Will bubble onError if remote fetch fails with json as parameter
  */
  onError(json) {},


  /*
    Override this function for cutomValidations appart from the presence, it gets called with the selectedObject, which might be null.
  */
  customValidation: (selectedObject) => {
    return true;
  },

  /*
  * Reset if modelChanges or filters change
  * */
  modelNameChanged: observer('modelName', function(){
    this._reset();
    get(this, 'onSelect')(null);
    this._load();
  }),

  filtersChange: observer('filters', function(){

    let required = get(this, 'required');

    this._reset();

    get(this, 'onSelect')(null);

    if(required) {
      get(this, 'onValidChange')(false);
      set(this, 'isInvalid', true);
    } else {
      get(this, 'onValidChange')(true);
    }

    this._load();

  }),

  reloadChanged: observer('reload', function(){

    let required = get(this, 'required');

    this._reset();

    get(this, 'onSelect')(null);

    if(required) {
      get(this, 'onValidChange')(false);
      set(this, 'isInvalid', true);
    } else {
      get(this, 'onValidChange')(true);
    }

    this._load();

  }),

  searchEnabled: computed('objects.[]', function(){
    return get(this, 'objects.length');
  }),

  _reset(){
    setProperties(this, {
      selectedObject: null
    });
  },

  /*
    Observer to validate every change on selectedObject
  */
  isValid: observer('selectedObject', function(){

    let { required, selectedObject, customValidation } = getProperties(this, 'required', 'selectedObject', 'customValidation');

    if(required) {
      get(this, 'onValidChange')(customValidation(selectedObject) && !isBlank(selectedObject));
      set(this, 'isInvalid', isBlank(selectedObject));
    } else {
      get(this, 'onValidChange')(true);
    }

  }),

  didInsertElement(){
    this._super(...arguments);
    this._load();
  },
  actions: {

    /*
      Select the object and bubble it.
    */
    select(object){
      set(this, 'selectedObject', object);
      get(this, 'onSelect')(object);
    }

  },


  /*
    If reload is set to true, it will do a query, if set to false, it will do a peekAll
  */
  _load(){

    let {
      reload,
      modelName,
      filters,
      filterFunc,
      store,
      include
    } = getProperties(this, 'reload', 'modelName', 'filters', 'filterFunc', 'store', 'include');

    assert('Must pass an modelName', modelName);

    if(reload) {

      set(this, 'isLoading', true);

      let _filters = {
        filter: filters,
      };

      if(include) {
        Object.assign(_filters, include);
      }

      get(this, 'store').query(modelName, _filters).then((results) => {

        setProperties(this, {
          isLoading: false,
          objects: results
        });

      }).catch((json) => {
        get(this, 'onError')(json);
      });

    } else {

      let objects = store.peekAll(modelName);

      if(typeof filterFunc === 'function') {

        objects = objects.filter((object) => {
          return filterFunc(object, objects);
        })

      }

      set(this, 'objects', objects);

      set(this, 'isLoading', false);
    }


  },
});
