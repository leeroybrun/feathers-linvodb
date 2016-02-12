import LinvoDB from 'nedb';
import feathers from 'feathers';
import rest from 'feathers-rest';
import bodyParser from 'body-parser';
import linvodbService from '../lib';

const db = new LinvoDB('todo', {});

// NeDB ids do not seem to be generated sequentially but sorted lexigraphically
// if no other sort order is given. This means that items can not be returned in the
// same order they have been created so this counter is used for sorting instead.
let counter = 0;

const todoService = linvodbService({
  Model: db,
  paginate: {
    default: 2,
    max: 4
  }
}).extend({
  find(params) {
    params.query = params.query || {};
    if(!params.query.$sort) {
      params.query.$sort = { counter: 1 };
    }

    return this._super(params);
  },

  create(data, params) {
    data.counter = ++counter;
    return this._super(data, params);
  }
});

// Create a feathers instance.
var app = feathers()
  // Setup the public folder.
  .use(feathers.static(__dirname + '/public'))
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}))
  .use('/todos', todoService);

// A basic error handler, just like Express
app.use(function(error, req, res, next){
  res.json(error);
});

// Start the server
module.exports = app.listen(3030);

console.log('Feathers Todo LinvoDB service running on 127.0.0.1:3030');
