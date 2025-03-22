import { sync } from '@semver-sync/sync';
import { resolve } from 'node:path';
import storeQiniu from './index';

sync({
  entry: resolve(process.cwd(), '../../test'),
  confirm: true,
  logFile: 'logs/sync.test.json',
  saveLog: true,
  store: storeQiniu({ key: 'only-test' }),
}).catch(console.error);
