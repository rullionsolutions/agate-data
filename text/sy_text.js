"use strict";

var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");
var Rhino = require("lazuli-rhino/index.js");


module.exports = Data.Entity.clone({
    id              : "sy_text",
    title           : "Text String",
    area            : "sy",
    display_page    : true,
    autocompleter   : true,
    transactional   : true,
    full_text_search: true,
    title_field     : "label_string",
    default_order   : "area,label_string",
    primary_key     : "area,id",
    data_volume_oom : 3,
});


module.exports.addFields([
    { id: "area"        , label: "Area"        , type: "Text"    , data_length:   2, mandatory: true, search_criterion: true, list_column: true, collection_id: "areas" },
    { id: "id"          , label: "Id"          , type: "Text"    , data_length:  80, mandatory: true, search_criterion: true, list_column: true },
    { id: "area_opt"    , label: "Area"        , type: "Option"  , tb_input: "input-xxlarge", css_reload: true, data_length:   2, mandatory: true, visible: false },
    { id: "id_opt"      , label: "Id"          , type: "Option"  , tb_input: "input-xxlarge", css_reload: true, data_length:  80, mandatory: true, visible: false },
    { id: "tokens"      , label: "Tokens"      , type: "Textarea", tb_input: "input-xxlarge", editable: false },
    { id: "msg_type"    , label: "Message Type", type: "Option"  , tb_input: "input-xxlarge", list: "sy.msg_type", editable: false, mandatory: true, search_criterion: true, list_column: true },
    { id: "label_string", label: "Subject"     , type: "Text"    , tb_input: "input-xxlarge", data_length: 160, mandatory: true, search_criterion: true, list_column: true },
    { id: "purpose"     , label: "Purpose"     , type: "Text"    , tb_input: "input-xxlarge", data_length: 160, editable: false, list_column: true },
    { id: "detail"      , label: "Body"        , type: "Textarea", tb_input: "input-xxlarge" }
]);


module.exports.define("indexes", [ "area,id" ]);


module.exports.define("generic_email_tokens",
    "- if the recipient is specified by their user id (to_user property) then:\n" +
    "-- {user_name} (i.e. last name comma space first name)\n" +
    "-- {first_name}\n" +
    "-- {last_name} and\n" +
    "-- {nice_name} (i.e. first name space last name) are all available\n" +
    "- {email_header} = 'Dear ', and if {first_name} is specified, then {first_name}, a comma and a newline are appended to it\n" +
    "- {email_footer} = 2 newlines, 'Kind Regards,' newline, Rhino.app.product_name (" + Rhino.app.product_name + ")\n" +
    "- {app_title}    = Rhino.app.title (" + Rhino.app.title + ")\n" +
    "- {base_uri}     = Rhino.app.base_uri (set automatically)\n" +
    "- {product_name} = Rhino.app.product_name (" + Rhino.app.product_name + ")\n" +
    "- {client_name}  = Rhino.app.client.organization_name (" + Rhino.app.client.organization_name + ")");


module.exports.define("loadData", function () {
    var query = module.exports.getQuery(),
        area,
        text_id,
        text_obj;

    while (query.next()) {
        area     = query.getColumn("A.area").get();
        text_id  = query.getColumn("A.id"  ).get();
        text_obj = Data.areas.get(area).text_strings[text_id];
        if (!text_obj) {
            text_obj = {};
            Data.areas.get(area).text_strings[text_id] = text_obj;
        }
        text_obj.text   = query.getColumn("A.label_string").get();
        text_obj.type   = query.getColumn("A.msg_type"    ).get();
        text_obj.detail = query.getColumn("A.detail"      ).get();
    }
    query.reset();
});


Rhino.app.defbind("loadTextStrings", "loadEnd", function () {
    if (SQL.Connection.database_exists) {
        Data.entities.get("sy_text").loadData();
    }
});


module.exports.define("getObject", function (text_id) {
    var part = text_id.split(".");
    if (part.length !== 2) {
        this.throwError("getObject() requires a text id of the form {area}.{text id}: " + text_id);
    }
    // to be amended to find a sy_text record, and if found, make a new object using its field values in preference of the main object.
    return Data.areas.get(part[0]) && Data.areas.get(part[0]).text_strings && Data.areas.get(part[0]).text_strings[part[1]];
});


// deprecated in favour of the above
module.exports.define("getText", function (text_id) {
    var part = text_id.split("."),
        text_string,
        row_query;

    if (part.length !== 2) {
        this.throwError("getText() requires a text id of the form {area}.{text id}: " + text_id);
    }
    row_query = module.exports.getQuery();
    row_query.addCondition({ column: "A._key", operator: "=", value: text_id });
    if (row_query.next()) {
        text_string = {
                text  : row_query.getColumn("A.label_string").get(),
                detail: row_query.getColumn("A.detail").get(),
                type  : row_query.getColumn("A.msg_type").get()
        };
    } else {
        text_string = Data.areas.get(part[0]) && Data.areas.get(part[0]).text_strings && Data.areas.get(part[0]).text_strings[part[1]];
    }
    row_query.reset();
    return text_string;
});


module.exports.define("display", function (type) {
    var lov = this.getField("msg_type").getLoV();
    var that = this;
    Data.Area.areas.each(function (area) {
        Object.keys(area.text_strings).forEach(function (text_id) {
            var text_obj = area.text_strings[text_id];
            if (!type || type === text_obj.type) {
                that.output("------------------------------------------------------------------------------------------------");
                that.output("id / type    : " + area.id + "." + text_id + " / " + lov.getItem(text_obj.type).label);
                that.output("purpose      : " + text_obj.purpose || "unknown");
                that.output("subject      : " + text_obj.text);
                that.output("detail / body: " + text_obj.detail);
            }
        });
    });
});


module.exports.define("getTokens", function (text_id) {
    var text_obj,
        out = Data.entities.get("sy_text").generic_email_tokens,
        i;

    function appendFieldToken(field_id, field) {
        out += "\n- {" + (text_obj.tokens[i].prefix || "") + field.id + "}  = Value in record of " + field.label;
    }
    text_obj = this.getObject(text_id);
    for (i = 0; Array.isArray(text_obj.tokens) && i < text_obj.tokens.length; i += 1) {
        if (typeof text_obj.tokens[i] === "string") {
            out += "\n" + text_obj.tokens[i];
        } else {
            Data.entities.get(text_obj.tokens[i].entity_id).each(appendFieldToken);
        }
    }
    return out;
});


module.exports.define("validateTokens", function () {
    var token,
        result = true,
        pattern = new RegExp("{.*?}", "gi"),
        text = this.getField("detail").get(),
        available_tokens = this.getField("tokens").get(),
        subject = this.getField("label_string").get();

    while ((token = pattern.exec(text)) !== null) {
        if (!available_tokens.match(token)) {
            result = false;
            this.trans.messages.add({ type: "E", text: token + " is not a valid token" });
        }
    }

    while ((token = pattern.exec(subject)) !== null) {
        if (!available_tokens.match(token)) {
            result = false;
            this.trans.messages.add({ type: "E", text: token + " is not a valid token" });
        }
    }

    return result;
});


module.exports.define("setTokens", function () {
    var area    = this.getField("area").get(),
        text_id = this.getField("id"  ).get();

    if (!this.getField("id").isBlank()) {
        this.getField("tokens").set(this.getTokens(area + "." + text_id));
    }
});


module.exports.define("populateText", function () {
    var area    = this.getField("area").get();
    var text_id = this.getField("id"  ).get();
    var text_string = Data.areas.get(area) && Data.areas.get(area).text_strings[text_id];

    if (text_string) {
        this.setTokens();
        if (text_string.text) {
            this.getField("label_string").set(text_string.text);
        }
        this.getField("msg_type").set(text_string.type);
        if (text_string.purpose) {
            this.getField("purpose").set(text_string.purpose);
        }
        if (text_string.detail) {
            this.getField("detail").set(text_string.detail);
        }
    }
});


module.exports.define("clearFields", function () {
    var do_not_clear = ["area", "id", "area_opt", "id_opt"];
    this.each(function (field) {
        if (do_not_clear.indexOf(field.id) === -1) {
            field.set("");
        }
    });
});


module.exports.define("setIdLoV", function () {
    var LoV  = this.getField("id_opt").getLoV(),
        area = this.getField("area_opt");
    var text_strings = Data.areas.get(area.get()).text_strings;

    LoV.clear();
    text_strings.forEach(function (key) {
        if (text_strings[key].type === "N" || text_strings[key].type === "I") {
            LoV.addItem(key, key, true);
        }
    });
});


module.exports.define("updateText", function (params) {
    var area    = this.getField("area_opt"),
        text_id = this.getField("id_opt"),
        tokens_valid;


    if (!area.isBlank() && area.isChangedSincePreviousUpdate()) {
        this.clearFields();
        this.getField("area").set(area.get());
        this.setIdLoV();
    }

    if (text_id.isChangedSincePreviousUpdate()) {
        this.clearFields();
        this.getField("id").set(text_id.get());
        this.populateText();
    }

    if (params.page_button === "save") {
        tokens_valid = this.validateTokens();

        if (!tokens_valid) {
            delete params.page_button;
        } else {
            this.getField("tokens").set("");
        }
    }
});


module.exports.define("setupText", function () {
    var lov = Data.LoV.clone({ id: "areas" });

    Data.Area.areas.each(function (area) {
        if (area.text_strings) {
            lov.addItem(area.id, area.id, true);
        }
    });

    this.getField("area").visible = false;
    this.getField("id"  ).visible = false;

    this.getField("area_opt").visible = true;
    this.getField("id_opt"  ).visible = true;
    this.getField("area_opt").lov = lov;
    this.getField("id_opt").lov = Data.LoV.clone({ id: "id" });
});
