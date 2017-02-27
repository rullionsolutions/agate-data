/* global Packages */

"use strict";

var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");
var Rhino = require("lazuli-rhino/index.js");


module.exports = Data.Entity.clone({
    id              : "ac_max_key",
    title           : "Maximum Taken Key",
    area            : "ac",
    primary_key     : "entity,rest_of_key",
    default_order   : "entity,rest_of_key",
    title_field     : "entity",
    transactional   : false,
    display_page    : false,
    pack_level      : -1            // exclude from any pack/unpack
});

module.exports.addFields([
    { id: "entity"      , label: "Entity"       , type: "Text"     , editable: false, list_column: true, search_criterion: true, data_length: 25, config_item: "entities" },
    { id: "rest_of_key" , label: "Rest of Key"  , type: "Text"     , editable: false, list_column: true, search_criterion: true, data_length: 220 },
    { id: "highest_val" , label: "Highest Value", type: "Number"   , editable: false, list_column: true, search_criterion: true, decimal_digits: 0 },
    { id: "taken_by_tx" , label: "Taken by Tx"  , type: "Reference", editable: false, list_column: true, search_criterion: true, ref_entity: "ac_tx" }
]);


module.exports.define("indexes", [ "entity, taken_by_tx" ]);


Rhino.app.defbind("truncate_ac_max_key", "dailyBatch", function (session) {
    module.exports.truncate();           // empty table while app is offline
});


module.exports.define("generate", function (table, where_clause, rest_of_key, id_column, trans_id, session) {
    var conn,
        retries = 2;

    while (retries > 0) {
        try {
            conn = SQL.Connection.shared.getConnection();
            this.debug(this, "generate() using: " + conn.hashCode() + " with where_clause: " + where_clause +
                ", rest_of_key: " + rest_of_key + ", id_column: " + id_column);
//            conn.getStatement();        // ensure conn is ready...
            return String(Packages.rsl.Lib.getNextNumber(conn, table, where_clause, rest_of_key, id_column, trans_id));
        } catch (e) {
            this.report(e);
        } finally {
            SQL.Connection.shared.finishedWithConnection(conn);
        }
        this.warn(this, "generate() error, retries = " + retries);
        retries -= 1;
    }
    this.throwError({ id: "failed_to_generate_new_key" });
});


module.exports.define("purge", function (path, non_destructive) {
    SQL.Connection.shared.executeUpdate("DELETE FROM ac_max_key" );
});
