'use strict';

module.exports = (state) => {
  const stateMap = {
    "new": "New",
    "open": "Open",
    "resolved": "Resolved",
    "closed": "Closed",
    "invalid": "Invalid",
    "wontfix": "Wontfix",
    "duplicate": "Invalid",
  };
  return stateMap[state]
};
