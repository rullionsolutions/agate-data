"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_list_search",
    entity_id       : "sy_list",
    title           : "Search for Lists of Values",
    short_title     : "Lists of Values"
});


module.exports.sections.addAll([
    { id: "main", type: "Search", entity: "sy_list" }
]);


module.exports.links.addAll([
    { id: "create", page_to: "sy_list_create" }
]);
