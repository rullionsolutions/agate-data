"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_text_display",
    entity_id       : "sy_text",
    title           : "Text String",
    requires_key    : true
});


module.exports.sections.addAll([
    { id: "main"    , type: "Display"      , entity: "sy_text" },
    { id: "chg_hist", type: "ChangeHistory", entity: "sy_text" }
]);


module.exports.links.addAll([
    { id: "update", page_to: "sy_text_update", page_key: "{page_key}" },
    { id: "delete", page_to: "sy_text_delete", page_key: "{page_key}" }
]);
