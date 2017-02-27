"use strict";

var UI = require("lazuli-ui/index.js");
var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");


module.exports = UI.Page.clone({
    id: "ac_tx_undo",
    entity_id       : "ac_tx",
    title: "Undo this Transaction",
    short_title: "Undo",
//    transactional: true,
    requires_key: true,
    security: { all: true, },            // only sysmgr can undo other people's transactions though
    exit_url_cancel: "?page_id=ac_tx_search",
});


module.exports.override("checkRecordSecurity", function (session, page_key, cached_record, allowed) {
    if (!cached_record) {
        cached_record = Data.entities.get("ac_tx").getSecurityRecord(session, page_key);
    }
    if (!cached_record) {
        allowed.access = false;
        allowed.reason = "Access Denied";
    } else if (!session.isUserInRole("sysmgr") && (cached_record.getField("user_id").get() !== session.user_id)) {
        allowed.access = false;
        allowed.reason = "non-System-Managers can only undo own transactions";
    }
});


module.exports.sections.addAll([
    {
        id: "main",
        type: "Display",
        title: "Undo this Transaction",
        entity: "ac_tx",
    },
]);


module.exports.buttons.addAll([
    {
        id: "undo",
        label: "Undo",
        main_button: true,
        css_class: "btn-danger",
    },
    {
        id: "cancel",
        label: "Cancel",
    },
]);


module.exports.defbind("loadStatements", "setupEnd", function () {
    var query;

    try {
        if (!this.session.isUserInRole("sysmgr") && this.getPrimaryRow().getField("user_id").get() !== this.session.user_id) {
            this.throwError("No access to this transaction");
        }
                                                        // Override action of Page.getPrimaryRow()
        this.exit_url_save = this.session.last_non_trans_page_url;
        this.sql_statements = [];
        query = Data.entities.get("ac_tx_sub").getQuery();
        query.addCondition({
            id: "tx",
            column: "tx",
            operator: "=",
            value: this.page_key,
        });
        query.getColumn("A.id").sortTop();
        query.getColumn("A.id").sortDesc();        // descending order of id

        while (query.next()) {
            this.loadStatement(query);
        }
        if (this.sql_statements.length === 0) {
            this.throwError("No work to do");
        }
    } catch (e) {
        this.session.messages.add({
            type: "E",
            text: e.message,
        });
        this.cancel();
    }
    query.reset();
});


module.exports.define("loadStatement", function (query) {
    var action_type = query.getColumn("A.action_type").get();
    var key = query.getColumn("A.key_string").get();
    var prev_tx = query.getColumn("A.prev_tx").get();
    var entity = Data.entities.get(query.getColumn("A.entity").get());
    var column_list = entity.getInsertClause();
    var record;
    var sql;
    this.debug("prev_tx: " + prev_tx + ", typeof: " + (typeof prev_tx));

    try {                                                // throws 'Record not found' if not found
        record = entity.getRow(key);
    } catch (ignore) {
        if (action_type === "D") {
            sql = "INSERT INTO " + entity.table + " ( " + column_list + " ) SELECT " + column_list
                + " FROM _history_" + entity.table + " WHERE _key=" + SQL.Connection.escape(key);
            if (prev_tx) {
                sql += " AND _tx=" + prev_tx;
            }
            this.debug("ac_tx_undo[D]: " + sql);
            this.sql_statements.push(sql);
        } else {
            this.throwError("Record not found: " + entity.id + " [" + key + "]");
        }
    }

    if (record) {
        if (record.curr_tx !== this.page_key) {
            this.throwError("Record subsequently altered: " + entity.id + " [" + key + "]");
        } else {
            if (action_type === "U" || action_type === "C") {
                sql = "DELETE FROM " + entity.table + " WHERE _key=" + SQL.Connection.escape(key) + " AND _tx=" + this.page_key;
                this.debug("ac_tx_undo[U/C]: " + sql);
                this.sql_statements.push(sql);
            }
            if (action_type === "U" || action_type === "D") {
                sql = "INSERT INTO " + entity.table + " ( " + column_list + " ) SELECT " + column_list
                    + " FROM _history_" + entity.table + " WHERE _key=" + SQL.Connection.escape(key);
                if (prev_tx) {
                    sql += " AND _tx=" + prev_tx;
                }
                this.debug("ac_tx_undo[U/D]: " + sql);
                this.sql_statements.push(sql);
            }
        }
    }
});


module.exports.defbind("executeLogic", "updateAfterSections", function (params) {
    var connection;
    var i;

    if (params.page_button === "cancel") {
        this.cancel();
    } else if (params.page_button === "undo") {
        this.sql_statements.push("UPDATE ac_tx SET tx_stat='B' WHERE id=" + this.page_key);
        connection = SQL.Connection.clone({
            id: "ac_tx_undo",
            auto_commit: false,
            retain_connection: true,
            isolation_level: "READ COMMITTED",
        });
        try {
//            connection.conn = connection.getConnection();     // keep a dedicated connection
            connection.executeUpdate("START TRANSACTION");
            for (i = 0; i < this.sql_statements.length; i += 1) {
                if (connection.executeUpdate(this.sql_statements[i]) !== 1) {
                    this.throwError("Previous data is missing - can't undo");
                }
            }
            connection.executeUpdate("COMMIT");
            this.redirect_url = this.exit_url_save;
            this.session.messages.add({
                type: "I",
                text: "Update undone",
            });
        } catch (e) {
            connection.executeUpdate("ROLLBACK");
            this.report(e);
            this.session.messages.report(e);
        } finally {
            connection.finishedWithConnection();
        }
    }
});
