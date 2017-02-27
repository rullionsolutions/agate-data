/*global x, java, Packages */
"use strict";


var UI = require("lazuli-ui/index.js");

module.exports = UI.Page.clone({
    id               : "ac_max_key_search",
    entity_id       : "ac_max_key",
    title            : "Search for Maximum Taken Keys",
    short_title      : "Maximum Taken Keys"
});


module.exports.sections.addAll([
    { id: "search", type: "Search", entity: "ac_max_key" }
]);
