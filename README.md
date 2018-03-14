# ember-get-all-model


This is a shortcut for get all locally or remotely using `modelName` and select, if you use block form, the objects will be yielded, if not, a select-autocomplete using ember-power-select addon will be placed. Feel free to contribute.

## DEMO
[Ember-get-all-model DEMO](http://albertocantug.com/ember-get-all-model/)

## Installation

    $ ember install ember-get-all-model

## Properties

  `reload`: Boolean, tells the component to query or peekAll using the modelName

  `remoteFilters`: Object, it will be used in the query. Example

     remotefilters: {
        scope: 5,
        name: "Tomas"
     }

  `include`: String, will be used in the query

  `filterFunc`: Function, callback to filter function you can provide to be used for the results of peekAll(`modelName`), for every record returned from peekAll `filterFunc` will be called with (object, objects) as params, just return a boolean and the objects will be filtered.


## Usage

Without block

    {{get-all-model
      modelName="user"
      placeholder="Select a user"
      reload=false //change to true to a force reload, making a remote to query(modelName)
      onSelect=(action (mut selectedUser))
    }}

Block form

    {{#get-all-model
      modelName="image"
      onSelect=(action (mut selectedImage))
      as |component object|}}

      <img class="flex-none" {{action "select" object target=component}} src={{object.url}}/>

    {{/get-all-model}}
