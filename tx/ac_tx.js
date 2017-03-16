"use strict";

var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");


module.exports = Data.Entity.clone({
    id              : "ac_tx",
    title           : "Transaction",
    area            : "ac",
    primary_key     : "id",
    default_order   : "id,id",
    transactional   : false,
    display_page    : true,
    autocompleter   : true,
    non_parent_link_field: "session_id",
    label_pattern   : "[{id}] {commit_point} [{tx_stat}]",
    data_volume_oom : 5,
});


module.exports.addFields([
    { id: "id"           , label: "Id"                 , type: "Number"   , editable: false, list_column: true , search_criterion: true, decimal_digits: 0, auto_generate: true, },
    { id: "start_point"  , label: "Start Date/time"    , type: "DateTime" , editable: false, list_column: true },
    { id: "commit_point" , label: "Save Date/time"     , type: "DateTime" , editable: false, list_column: true  },
//  { id: "effect_date"  , label: "Effective Date"     , type: "DateTime" , editable: false, visible: false, dscrptn: "When updating enter the date in the first field and the time in the 2nd. Enter time in the 24h format. Example 13:30." },
    { id: "session_id"   , label: "Session"            , type: "Reference", editable: false, list_column: false, ref_entity: "ac_session", dscrptn: "A reference to a system session (login) record." },
    { id: "tx_stat"      , label: "Status"             , type: "Option"   , editable: false, list_column: true , search_criterion: true, list: "ac.tx_st" },
    { id: "stat_archive" , label: "Status Pre-Archive" , type: "Option"   , editable: false, list: "ac.session_status" },
    { id: "user_id"      , label: "User"               , type: "Reference", editable: false, list_column: true , ref_entity: "ac_user", dscrptn: "A reference to system user account." },
    { id: "page"         , label: "Page"               , type: "Text"     , editable: false, list_column: true , data_length: 40, collection_id: "pages" },
    { id: "row_count"    , label: "Row Count"          , type: "Number"   , editable: false, list_column: true , aggregation: "S", sql_function: "( select count(*) from ac_tx_sub ZZ where ZZ.tx=?._key )", decimal_digits: 0 },
    { id: "outcome"      , label: "Outcome"            , type: "Text"     , editable: false, list_column: true , data_length: 40 },
    { id: "reason_descr" , label: "Reason for Change"  , type: "Text"     , editable: false, list_column: true, separate_row: true, data_length: 255 },
    { id: "mysql_conn_id", label: "MySQL Connection Id", type: "Number"   , editable: false, decimal_digits: 0 }
]);


module.exports.define("indexes", [ "id", "session_id, id", "user_id, id", "tx_stat, commit_point" ]);


module.exports.getField("tx_stat").override("getUneditableCSSStyle", function () {
    if (this.get() === "A") {            // active
        return "color: green";
    }
    if (this.get() === "X") {        // failed
        return "color: red";
    }
    if (this.get() === "P") {        // blue
        return "color: blue";
    }                                    // B = backed-out, C = cancelled, Q = purged, I = inactive
    return "color: orange";
});


module.exports.define("getMaxIdBefore", function (date, on_or_before) {
    var out = 0;
    var resultset;

    if (typeof date === "object") {
        date = date.internal();
    }
    try {
        resultset = SQL.Connection.shared.executeQuery("SELECT MAX(id) FROM ac_tx WHERE DATE(commit_point) <" +
            (on_or_before ? "=" : "") + SQL.Connection.escape(date));
        resultset.next();
        out = resultset.getInt(1);
    } catch (e) {
        this.report(e);
    }
    SQL.Connection.finishedWithResultSet(resultset);
    return out;
});


module.exports.define("getMaxIdOnOrBefore", function (date) {
    return this.getMaxIdBefore(date, true);
});
