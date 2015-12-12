var Q = require('q');

function eachSeriesSettled (items, iterator) {
  var accumulator = [];
  return items.reduce((promise, item) => {
    return promise.then(() => {
         return iterator(item);
      }).then((result) => {
        accumulator.push({ state: 'resolved', value: result });
      }).catch((err) => {
        accumulator.push({ state: 'rejected', value: err });
      });
  }, Q()).then(() => {
    return accumulator;
  });
};

module.exports = {
  eachSeriesSettled
};