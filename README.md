# feathers-linvodb

[![Build Status](https://travis-ci.org/leeroybrun/feathers-linvodb.png?branch=master)](https://travis-ci.org/feathersjs/feathers-linvodb)
[![Code Climate](https://codeclimate.com/github/leeroybrun/feathers-linvodb.png)](https://codeclimate.com/github/feathersjs/feathers-linvodb)

> Create an [LinvoDB](https://github.com/Ivshti/linvodb3) Service for [FeatherJS](https://github.com/feathersjs).


## Installation

```bash
npm install linvodb3 feathers-linvodb --save
```

You need to install either LevelDown (for pure node.js, using LevelDB), or medeadown (for NW.js/Electron, JS-only backend) :

```bash
npm install medeadown # For NW.js, using Medea
npm install leveldown # For pure node.js, using LevelDB
```

## Documentation

Please refer to the [LinvoDB documentation](https://github.com/Ivshti/linvodb3) for more informations about it.

Please refer to the [Feathers database adapter documentation](http://docs.feathersjs.com/databases/readme.html) for more details or directly at:

- [NeDB](http://docs.feathersjs.com/databases/nedb.html) - The detailed documentation for this adapter
- [Extending](http://docs.feathersjs.com/databases/extending.html) - How to extend a database adapter
- [Pagination and Sorting](http://docs.feathersjs.com/databases/pagination.html) - How to use pagination and sorting for the database adapter
- [Querying](http://docs.feathersjs.com/databases/querying.html) - The common adapter querying mechanism


## Complete Example

Here's an example of a Feathers server with a `todos` linvodb-service.

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const LinvoDB = require('linvodb3');
const linvodbService = require('feathers-linvodb');
const bodyParser = require('body-parser');

const db = new LinvoDB('todo', {});

// Create a feathers instance.
var app = feathers()
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}));

// Connect to the db, create and register a Feathers service.
app.use('todos', linvodbService({
  Model: db,
  paginate: {
    default: 2,
    max: 4
  }
}));

// Start the server.
var port = 3030;
app.listen(port, function() {
  console.log(`Feathers server listening on port ${port}`);
});
```

You can run this example by using `node examples/app` and going to [localhost:3030/todos](http://localhost:3030/todos). You should see an empty array. That's because you don't have any Todos yet but you now have full CRUD for your new todos service.

## Changelog

__2.1.0__

- Use internal methods instead of service methods directly

__2.0.0__

- Remove NeDB dependency
- Migration to ES6 and latest service test suite
- Changing the way that NeDB services are initialized to be compliant with Feathers 2.0.

__1.2.0__

- Migration to shared service test suite ([#4](https://github.com/feathersjs/feathers-nedb/pull/4))

__1.0.0__

- First final release

__0.1.1__

- Minor license and documentation updates

__0.1.0__

- Initial release.


## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).


## Author

[Marshall Thompson](https://github.com/marshallswain)
