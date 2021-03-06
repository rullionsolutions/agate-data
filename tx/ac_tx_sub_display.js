"use strict";

var UI = require("lazuli-ui/index.js");
var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");


module.exports = UI.Page.clone({
    id: "ac_tx_sub_display",
    entity_id: "ac_tx_sub",
    title: "Record Update",
    requires_key: true,
});


module.exports.sections.addAll([
    { id: "display", type: "Display", entity: "ac_tx_sub" },
    { id: "values", type: "ListBase", title: "Before/After Values" }
]);


module.exports.sections.get("values").defbind("setupValues", "setup", function () {
    var entity_id = this.owner.page.sections.get("display").fieldset.getField("entity").get();
    this.right_align_numbers = false;
    this.columns.add({ id: "field", label: "Field Name", visible: true });
    this.columns.add({ id: "before", label: "Before Value", visible: true });
    this.columns.add({ id: "after", label: "After Value", visible: true });
    if (!Data.entities.get(entity_id)) {
        this.owner.page.session.messages.add({ text: "Unknown entity: " + entity_id, type: "E" });
    }
});


module.exports.sections.get("values").override("renderList", function (render_opts) {
    var sql;
    var delim = "";
    var entity_id = this.owner.page.sections.get("display").fieldset.getField("entity").get();
    var key = this.owner.page.sections.get("display").fieldset.getField("key_string").get();
    var prev_tx = this.owner.page.sections.get("display").fieldset.getField("prev_tx").get();
    var this_tx = this.owner.page.sections.get("display").fieldset.getField("tx").get();

    this.record = Data.entities.getThrowIfUnrecognized(entity_id).getRecord({
        modifiable: false,
        page: this.owner.page,
        session: this.owner.page.session,
    });
    sql = "SELECT ";
    this.record.each(function (field) {
        if (!field.sql_function) {
            sql += delim + "A." + field.getId();
            delim = ", ";
        }
    });
    sql += " FROM _history_" + entity_id + " A WHERE A._key=" + SQL.Connection.escape(key) + " AND A._tx=";
    this.found1 = false;
    this.found2 = false;
    try {
        if (prev_tx) {
            this.resultset1 = SQL.Connection.shared.executeQuery(sql + prev_tx);
            this.found1 = this.resultset1.next();
        }
        if (!this.found1) {
            this.columns.get("before").visible = false;
        }
        if (this_tx) {
            this.resultset2 = SQL.Connection.shared.executeQuery(sql + this_tx);
            this.found2 = this.resultset2.next();
        }
        if (!this.found2) {
            this.columns.get("after" ).visible = false;
        }
        UI.ListBase.renderList.call(this, render_opts);
    } catch (e) {
        this.report(e);
    } finally {
        SQL.Connection.shared.finishedWithResultSet(this.resultset1);
        SQL.Connection.shared.finishedWithResultSet(this.resultset2);
    }
});


module.exports.sections.get("values").override("renderBody", function (render_opts) {
    var that = this;
    this.record.each(function (field) {
        if (!field.sql_function && !field.getComputed) {
            that.renderRow(render_opts, field);
            that.row_count += 1;
        }
    });
});


module.exports.sections.get("values").override("renderRow", function (render_opts, field) {
    var row_elem;
    var java_str1;
    var java_str2;
    var css_class = null;
    if (this.found1 && this.found2) {
        java_str1 = SQL.Connection.getColumnString(this.resultset1, field.query_column.name);
        java_str2 = SQL.Connection.getColumnString(this.resultset2, field.query_column.name);
        if (java_str1 !== java_str2) {
            css_class = "info";
        }
    }
    row_elem = this.getTableElement(render_opts).addChild("tr", null, css_class);
    this.columns.get(0).text = field.label;
    this.columns.get(0).renderCell(row_elem, render_opts, 0);
    if (this.found1) {
        field.setFromResultSet(this.resultset1);
        this.columns.get(1).field = field;
        this.columns.get(1).renderCell(row_elem, render_opts, 1);
    }
    if (this.found2) {
        field.setFromResultSet(this.resultset2);
        this.columns.get(2).field = field;
        this.columns.get(2).renderCell(row_elem, render_opts, 2);
    }
    return row_elem;
});
