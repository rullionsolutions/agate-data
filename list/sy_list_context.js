"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.ContextPage.clone({
    id              : "sy_list_context",
    entity_id       : "sy_list",
    title           : "List of Values",
    requires_key    : true
});


module.exports.sections.addAll([
    { id: "main"    , type: "Display", entity: "sy_list" }
]);


module.exports.links.addAll([
    { id: "update", page_to: "sy_list_update", page_key: "{page_key}" },
    { id: "delete", page_to: "sy_list_delete", page_key: "{page_key}" }
]);
