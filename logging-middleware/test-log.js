const { Logger, BackendPackage } = require("./dist");

// Test logging
Logger.info(BackendPackage.HANDLER, "Test log from direct script");
console.log("Log sent successfully!");
