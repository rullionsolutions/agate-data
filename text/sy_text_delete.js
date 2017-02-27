"use strict";


var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_text_delete",
    entity_id       : "sy_text",
    title           : "Delete this Text String",
    transactional   : true,
    requires_key    : true,
    short_title     : "Delete",
    security        : { all: false, sysmgr: true }
});


module.exports.sections.addAll([
    { id: "main", type: "Delete", entity: "sy_text" }
]);
