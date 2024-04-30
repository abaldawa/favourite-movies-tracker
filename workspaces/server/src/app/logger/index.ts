/**
 * @author Abhijit Baldawa
 */

import { createServiceLogger } from "../utils/logger";

/**
 * Note: For production separate error and info logs, save the logs in
 * different files and set the `logLevel` at 'info' level
 */
const logger = createServiceLogger({
  logLevel: "debug",
  serviceName: "entertainment-service",
  productionMode: false,
});

export { logger };
