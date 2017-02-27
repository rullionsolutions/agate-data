"use strict";

var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");
var Rhino = require("lazuli-rhino/index.js");


module.exports = Data.Entity.clone({
    id              : "ac_tx_sub",
    title           : "Record Update",
    area            : "ac",
    primary_key     : "tx,id",
    default_order   : "tx,id",
    transactional   : false,
    display_page    : true,
    parent_entity   : "ac_tx",
    link_field      : "tx",
    label_pattern   : "{entity}:{key_string}",
    data_volume_oom : 6,
});


module.exports.addFields([
    { id: "tx"            , label: "Transaction"       , type: "Reference", editable: false, list_column: true, search_criterion: true, ref_entity: "ac_tx", description: "The transaction that made this change." },
    { id: "id"            , label: "Row"               , type: "Number"   , editable: false, list_column: true, decimal_digits: 0 },
    { id: "key_string"    , label: "Key String"        , type: "Text"     , editable: false, list_column: true, search_criterion: true, data_length: 80 },
    { id: "entity"        , label: "Entity"            , type: "Text"     , editable: false, list_column: true, search_criterion: true, data_length: 25, config_item: "entities" },
    { id: "action_type"   , label: "Action Type"       , type: "Option"   , editable: false, list_column: true, list: "ac.action_type" },
    { id: "prev_tx"       , label: "Previous Trans"    , type: "Reference", editable: false, list_column: true, ref_entity: "ac_tx", description: "The transaction that last updated this record." },
    { id: "url"           , label: "Link to Record"    , type: "URL"      , editable: false, list_column: true, icon: "/cdn/Axialis/Png/16x16/Go Out.png",
        sql_function: "key_string" }
]);


module.exports.define("indexes", [ "tx, id", "entity, key_string" ]);


module.exports.getField("url").override("getURLFromVal", function () {
    var entity = Data.entities.get(this.owner.getField("entity").get());
    try {
        return entity.getDisplayURL(this.get());
    } catch (e) {
        this.trace(e);
    }        // swallow no display page and invalid key
});


module.exports.override("archive", function (path, non_destructive, max_trans, max_session) {
    var rows;
    var filename = this.id + ".sql";
    var condition = "tx <= " + max_trans;

    Rhino.app.dumpMySQLDataThrowOnFail(path + filename, {
        tables: "ac_tx_sub",
        where_clause: condition,
    });
    if (!non_destructive) {
        rows = SQL.Connection.shared.executeUpdate("DELETE FROM ac_tx_sub WHERE " + condition);
        this.info("Archived " + rows + " rows from " + this.table);
    }
    return filename;
});
