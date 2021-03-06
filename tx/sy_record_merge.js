"use strict";

var UI = require("lazuli-ui/index.js");
var SQL = require("lazuli-sql/index.js");
var Data = require("lazuli-data/index.js");


module.exports = UI.Page.clone({
    id              : "sy_record_merge",
    title           : "Record Merge",
    security        : { sysmgr: true },
    requires_key    : true,
    transactional   : true
});


module.exports.sections.addAll([
    { id: "sidebyside", type: "SideBySide", title: "Merge Records", left_heading: "Record to Keep", right_heading: "Record to Delete" }
]);


module.exports.buttons.addAll([
    { id: "swap_sides", label: "Swap Sides" }
]);


module.exports.defbind("setupEnd", "setupEnd", function (params) {
    var parts;
    if (!this.page_key) {
        this.throwError({
            id: "missing_parameters",
            text: "Missing parameter(s) - page_key must be of the form {entity_id}|{left_key}|{right_key}",
        });
    }
    parts = this.page_key.split("|");
    if (parts.length < 3) {
        this.throwError({
            id: "missing_parameters",
            text: "Missing parameter(s) - page_key must be of the form {entity_id}|{left_key}|{right_key}",
        });
    }
    this.entity_id = parts[0];
    this.left_key = parts[1];
    this.right_key = parts[2];
    this.setupSideBySide();

    this.chg_array = [];
    Data.entities.get(this.entity_id).findKeyMergeUpdates(this.right_key, this.left_key, this.chg_array);
    this.displayChanges();
});


module.exports.define("setupSideBySide", function () {
    var missing_params = "";
    if (!this.entity_id) {
        missing_params += "entity_id, ";
    }
    if (!this.left_key) {
        missing_params += " left_key, ";
    }
    if (!this.right_key) {
        missing_params += "right_key, ";
    }
    if (missing_params) {
        this.throwError({
            id: "missing_parameters",
            text: "Missing parameter(s): " + missing_params.substr(0, missing_params.length - 2),
        });
    }
    if (this.left_key === this.right_key) {
        this.throwError({
            id: "invalid_parameters",
            text: "Left and right hand keys must be different",
        });
    }
    try {
        this.sections.get("sidebyside").setLeftFieldSet(this.getTrans().getActiveRow(this.entity_id, this.left_key));
    } catch (e) {
        this.report(e);
        this.throwError({
            id: "invalid_record",
            text: "Error getting left-hand side record",
        });
    }
    try {
        this.sections.get("sidebyside").setRightFieldSet(this.getTrans().getActiveRow(this.entity_id, this.right_key));
        this.sections.get("sidebyside").right_fieldset.deleting = true;     // avoid set child records to be deleted
        this.sections.get("sidebyside").right_fieldset.each(function (field) {
            field.editable = false;
        });
    } catch (e2) {
        this.report(e2);
        this.throwError({
            id: "invalid_record",
            text: "Error getting right-hand side record",
        });
    }
});


module.exports.define("displayChanges", function () {
    var that = this;
    var counter = {};
    var dups = 0;

    this.chg_array.forEach(function (item) {
        var str = item.entity_title + " (" + item.field_label + ")";
        if (item.dup) {
            dups += 1;
        }
        if (!counter[str]) {
            counter[str] = 0;
        }
        counter[str] += 1;
    });
    Object.keys(counter).forEach(function (str) {
        that.getTrans().messages.add({
            id: "changes",
            type: 'I',
            text: counter[str] + " " + str + " update(s)",
        });
    });
    if (dups > 0) {
        this.getTrans().messages.add({
            id: "dups",
            type: 'E',
            fixed: true,
            text: dups + " duplicate keys would be caused",
        });
    }
});


module.exports.defbind("updateAfterSections", "updateAfterSections", function (params) {
    if (params.page_button === "swap_sides") {
        this.cancel();
        this.redirect_url = this.getSimpleURL(this.entity_id + "|" + this.right_key + "|" + this.left_key);
    }
});


module.exports.defbind("processChangesAndReport", "presave", function (outcome_id) {
//    var msg = Data.entities.get(this.entity_id).mergePrimaryKeys(this.right_key, this.left_key, this.getTrans().connection);
    this.processChanges();
    this.getTrans().messages.add({
        id: "record_updates",
        type: 'I',
        text: this.chg_array.length + " related record updates",
    });
});


module.exports.define("processChanges", function () {
    var that = this;
/*
    this.chg_array.forEach(function (item) {
        var sql = "UPDATE " + item.entity_id + " SET " + item.field_id + " = " +
            SQL.Connection.escape(item.to_val);

        if (item.new_key) {
            sql += ", _key = " + SQL.Connection.escape(item.new_key);
        }

        sql += " WHERE _key = " + SQL.Connection.escape(item.key_string);
        this.getTrans().connection.executeUpdate(sql);
    });
*/
// this approach causes attempted duplicate key INSERT...
    this.chg_array.forEach(function (item) {
       var row = that.getTrans().getActiveRow(item.entity_id, item.key_string);
       row.getField(item.field_id).setAllowingExistingRecordKeyChange(item.to_val);
    });
});
