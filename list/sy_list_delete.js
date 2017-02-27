"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_list_delete",
    entity_id       : "sy_list",
    title           : "Delete this List of Values",
    transactional   : true,
    requires_key    : true,
    short_title     : "Delete",
    security        : { all: false, sysmgr: true }
});


module.exports.sections.addAll([
    { id: "main", type: "Delete", entity: "sy_list" }
]);
