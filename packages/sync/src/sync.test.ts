import { resolve } from 'node:path';
import { sync } from './sync';
import { syncFiles } from './sync-files';

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

sync({
  entry: resolve(process.cwd(), '../../test'),
  confirm: true,
  logFile: 'logs/sync.test.json',
  saveLog: true,
  store: syncFiles(
    ({ verPath, hash, type, ver }) =>
      new Promise((resolve, reject) => {
        setTimeout(
          () => {
            const seed = getRandomInt(0, 100);
            if (seed < 10) {
              reject(new Error(`random seed ${seed} error`));
            } else {
              resolve({
                url: verPath,
                hash,
                type,
                ver,
              });
            }
          },
          getRandomInt(10, 800),
        );
      }),
  ),
}).catch(console.error);
