var nconf = require('nconf');

nconf.use('file', { file: './queue.json' });
nconf.load();

function save (item) {
  nconf.set(item.id + ':type', item.type);
  nconf.set(item.id + ':title', item.title);
  nconf.set(item.id + ':downloaded', item.downloaded);

  nconf.save(function (err) {
    if (err) {
      console.error(err.message);
      return;
    }
  });
}

function getAll () {
  return nconf.get();
}

function getById (id) {
  return nconf.get(id);
}

module.exports = {
  save: save,
  getAll: getAll,
  getById: getById
};