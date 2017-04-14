"use strict";

var SQL = require("lazuli-sql/index.js");
var IO = require("lazuli-io/index.js");
var Rhino = require("lazuli-rhino/index.js");


Rhino.App.defbind("data_loadData", "build", function () {
    SQL.Connection.shared.loadSQLFile(IO.File.getModulePath(module) + "/list/build.sql");
    SQL.Connection.shared.loadSQLFile(IO.File.getModulePath(module) + "/text/build.sql");
    SQL.Connection.shared.loadSQLFile(IO.File.getModulePath(module) + "/tx/build.sql");
});
