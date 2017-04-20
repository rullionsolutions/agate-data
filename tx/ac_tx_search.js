"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.SearchPage.clone({
    id              : "ac_tx_search",
    entity_id       : "ac_tx",
    title           : "Search for Transactions",
    short_title     : "Transactions"
});


module.exports.sections.addAll([
    { id: "search", type: "Search", entity: "ac_tx" }
]);


module.exports.defbind("setupEnd", "setupEnd", function () {
    this.sections.get("search").filters.get("tx_stat_0").setDefaults("A");
});
