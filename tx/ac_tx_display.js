"use strict";


var UI = require("lazuli-ui/index.js");

module.exports = UI.Page.clone({
    id              : "ac_tx_display",
    entity_id       : "ac_tx",
    title           : "Transaction",
    requires_key    : true
});


module.exports.sections.addAll([
    { id: "display", type: "Display"  , entity: "ac_tx" },
    { id: "records", type: "ListQuery", entity: "ac_tx_sub", link_field: "tx" },
    { id: "visits" , type: "ListQuery", entity: "ac_visit" , link_field: "tx" }
//    { id: "workflows", type: "ListQuery", entity: "ac_wf_inst_node", title: "Workflows" }
]);


module.exports.links.addAll([
    { id: "undo", page_to: "ac_tx_undo", page_key: "{page_key}" }
]);
