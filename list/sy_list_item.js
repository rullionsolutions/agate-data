"use strict";

var Data = require("lazuli-data/index.js");


module.exports = Data.Entity.clone({
    id              : "sy_list_item",
    title           : "List Item",
    area            : "sy",
    primary_key     : "list,id",    // Specified like this to avoid issues with multi-part keys from changing sequence
    parent_entity   : "sy_list",
    link_field      : "list",
    default_order   : "list,seq_number",
    title_field     : "text",
    transactional   : true,
    data_volume_oom : 3,
});


module.exports.addFields([
    { id: "seq_number"  , label: "Seq"       , type: "Number"   , mandatory: true, search_criterion: true, list_column: true, decimal_digits: 0, sort_seq: 1 },
    { id: "list"        , label: "List"      , type: "Reference", mandatory: true, search_criterion: true, list_column: true, ref_entity: "sy_list" },
    { id: "id"          , label: "Id"        , type: "Text"     , mandatory: true, list_column: true, data_length: 10 },
    { id: "text"        , label: "Text"      , type: "Text"     , mandatory: true, list_column: true, data_length: 100 },
    { id: "active"      , label: "Active for Selection?", type: "Option", mandatory: true, list_column: true, list : "sy.active", default_val: "A" },
    { id: "from_value"  , label: "From Value", type: "Number"   , list_column: true, decimal_digits: 0 },
    { id: "to_value"    , label: "To Value"  , type: "Number"   , list_column: true, decimal_digits: 0 }
]);


module.exports.define("indexes", [ "list, id" ]);
