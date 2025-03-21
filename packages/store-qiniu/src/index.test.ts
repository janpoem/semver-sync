import { sync } from 'ver-sync';
import storeQiniu from './index';

sync({
  cwd: process.cwd(),
  entry: 'test',
  confirm: true,
  logFile: 'logs/sync.test.json',
  saveLog: true,
  store: storeQiniu({ key: 'only-test' }),
}).catch(console.error);
