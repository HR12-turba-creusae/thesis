
exports.up = function(knex, Promise) {
  return Promise.all([

  knex.schema.createTableIfNotExists('user', function(table) {
      table.increments('id').primary()
      table.string('name', 100);
      table.string('email', 100);
      table.string('token', 150);
      table.integer('member_status');
  }),
  
  knex.schema.createTableIfNotExists('event', function(table){
    table.increments('id').primary();
    table.integer('host_id');
    table.string('name');
    table.string('description', 500);
    table.integer('date', 8);
    table.string('location', 100);
    table.string('image', 200);
  }),
  
  knex.schema.createTableIfNotExists('event_attendee', function(table){
    table.increments('id').primary();
    table.integer('user_id');
    table.integer('event_id');
    table.integer('reply')
  }),
  
  knex.schema.createTableIfNotExists('item', function(table){
    table.increments('id').primary();
    table.string('name', 100);
    table.integer('user_id');
    table.integer('event_id');
  }),
  
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user'),
    knex.schema.dropTable('event'),
    knex.schema.dropTable('event_attendee'),
    knex.schema.dropTable('item')
   ])
};
