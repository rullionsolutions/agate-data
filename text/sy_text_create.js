"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_text_create",
    entity_id       : "sy_text",
    title           : "Create a Text String",
    transactional   : true,
    short_title     : "Create"
});


module.exports.sections.addAll([
    { id: "main", type: "Create", entity: "sy_text" }
]);


module.exports.defbind("setupEnd", "setupEnd", function () {
    this.getPrimaryRow().setupText();
});


module.exports.defbind("before", "updateBeforeSections", function (params) {
    this.getPrimaryRow().updateText(params);
});
