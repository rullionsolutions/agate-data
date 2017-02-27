"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.ContextPage.clone({
    id              : "ac_tx_context",
    entity_id       : "ac_tx",
    title           : "Transaction",
    requires_key    : true
});


module.exports.sections.addAll([
    { id: "display", type: "Display", entity: "ac_tx" }
]);


module.exports.links.addAll([
    { id: "undo", page_to: "ac_tx_undo", page_key: "{page_key}" }
]);
