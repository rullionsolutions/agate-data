"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_text_update",
    entity_id       : "sy_text",
    title           : "Update this Text String",
    transactional   : true,
    requires_key    : true,
    short_title     : "Update"
});


module.exports.sections.addAll([
    { id: "main" , type: "Update"    , entity: "sy_text" }
]);


module.exports.defbind("setupEnd", "setupEnd", function () {
    var area = this.sections.get("main").fieldset;
    this.getPrimaryRow().setupText();
    this.getPrimaryRow().setIdLoV();
    this.getPrimaryRow().setTokens();
    area.getField("area_opt").set(area.getField("area").get());
    area.getField("area_opt").editable = false;
    area.getField("id_opt"  ).set(area.getField("id"  ).get());
    area.getField("id_opt").editable = false;
});


module.exports.defbind("after", "updateAfterSections", function () {
    this.getPrimaryRow().validateTokens();
});


module.exports.defbind("blankTokensField", "presave", function () {
    this.getPrimaryRow().getField("tokens").set("");
});
