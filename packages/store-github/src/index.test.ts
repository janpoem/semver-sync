import { sync } from '@semver-sync/sync';
import { resolve } from 'node:path';
import { storeGithub } from './index';

sync({
  entry: resolve(process.cwd(), '../../test'),
  // confirm: true,
  logFile: 'logs/sync.test.json',
  saveLog: true,
  store: storeGithub({ key: 'test' }),
}).catch(console.error);
