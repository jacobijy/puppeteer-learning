import * as log4js from 'log4js';
import { join } from 'path';

log4js.configure(join(__dirname, 'log4jsConfig.json'));

const logger = log4js.getLogger();

export default logger;
