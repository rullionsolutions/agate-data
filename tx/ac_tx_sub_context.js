"use strict";


var UI = require("lazuli-ui/index.js");


module.exports = UI.ContextPage.clone({
    id              : "ac_tx_sub_context",
    entity_id       : "ac_tx_sub",
    title           : "Record Update",
    requires_key    : true
});


module.exports.sections.addAll([
    { id: "display", type: "Display", entity: "ac_tx_sub" }
]);
