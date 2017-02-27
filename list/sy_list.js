"use strict";

var Data = require("lazuli-data/index.js");


module.exports = Data.Entity.clone({
    id              : "sy_list",
    title           : "List of Values",
    area            : "sy",
    display_page    : true,
    autocompleter   : true,
    transactional   : true,
    full_text_search: true,
    title_field     : "title",
    default_order   : "area,title",
    primary_key     : "area,id",
    plural_label    : "Lists of Values",
    data_volume_oom : 2,
});


module.exports.addFields([
    { id: "area" , label: "Area" , type: "Text", data_length:   2, mandatory: true, search_criterion: true, list_column: true, config_item: "areas" },
    { id: "id"   , label: "Id"   , type: "Text", data_length:  40, mandatory: true, search_criterion: true, list_column: true },
    { id: "title", label: "Title", type: "Text", data_length: 160, mandatory: true, search_criterion: true, list_column: true }
]);


module.exports.indexes = [];
