import { Logger, BackendPackage } from "./index";

// Send a test log to the evaluation server
async function testLogger() {
  try {
    Logger.info(BackendPackage.HANDLER, "Test log from logging-middleware");
    console.log("Test log sent successfully!");
  } catch (error) {
    console.error("Failed to send test log:", error);
  }
}

testLogger();
