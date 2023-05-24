// import logger from 'electron-log';
// import { app } from 'electron';
// import path from 'path';

// logger.transports.file.level = 'debug';
// logger.transports.file.maxSize = 1002430; // 10M
// logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
// const now = new Date();
// const date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
// logger.transports.file.resolvePathFn = () =>
//   path.join(app.getPath('userData'), 'electron_log', date, 'main.log');

// export default {
//   info(param: any[]) {
//     logger.info(param);
//   },
//   warn(param: any[]) {
//     logger.warn(param);
//   },
//   error(param: any[]) {
//     logger.error(param);
//   },
//   debug(param: any[]) {
//     logger.debug(param);
//   },
//   verbose(param: any) {
//     logger.verbose(param);
//   },
//   silly(param: any[]) {
//     logger.silly(param);
//   },
// };
