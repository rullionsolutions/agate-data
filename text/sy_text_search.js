"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_text_search",
    entity_id       : "sy_text",
    title           : "Search for Email Templates",
    short_title     : "Email Templates"
});


module.exports.sections.addAll([
    { id: "main", type: "Search", entity: "sy_text" }
]);


module.exports.links.addAll([
    { id: "create", page_to: "sy_text_create" }
]);
