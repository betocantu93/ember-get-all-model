# ember-get-all-model


This is a shortcut for get all locally or remotely using `modelName` and select, if you use block form, the objects will be yielded, if not, a select-autocomplete using ember-power-select addon will be placed. Feel free to contribute.


## DEMO
[Ember-get-all-model DEMO](http://albertocantug.com/ember-get-all-model/)

## Installation

    $ ember install ember-get-all-model

## Properties

  `reload`: Boolean, tells the component to query or peekAll using the modelName
  
  `required`: Boolean, if true, the component will bubble onValidChange with true/false
  
  `customValidation`: Function, will be bubbled when selectedObject changes, with (object) as params use it for any other custom validation, just return a bool.

  `filters`: Object, it will be used in the query. Example

     filters: {
        scope: 5,
        name: "Tomas"
     }
   
   or you can simple use the hash helper in template like
      
      {{#get-all-model
        modelName="user"
        filters=(hash name="Alberto" include="city,car")
        onSelect=(action (mut selectedUser))
       }}
  
  will result in 
    
    /users?filter[name]=Alberto&include=city,car
  
  `include`: String, will be used in the query

  `filterFunc`: Function, callback function which will be called with the results from peekAll(`modelName`), for every record `filterFunc` will be called with (object, objects) as params, just return a boolean and the objects will be filtered. 
  
  **Notice this is not the matcher function used by ember-power-select** it's just a preliminary function for cleaning the set of peekAll


## Usage

Without block

    {{get-all-model
      modelName="user"
      required=true 
      onValidChange=(action (mut isUserValid))
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
