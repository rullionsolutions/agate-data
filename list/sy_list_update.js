"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_list_update",
    entity_id       : "sy_list",
    title           : "Update this List of Values",
    transactional   : true,
    requires_key    : true,
    short_title     : "Update"
});


module.exports.sections.addAll([
    { id: "main" , type: "Update"    , entity: "sy_list" },
    { id: "items", type: "ListUpdate", entity: "sy_list_item", link_field: "list" }
]);
