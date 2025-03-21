import color from 'ansi-colors';
import type { ChangedRecord, ChangeFile, SyncFile, SyncFiles } from './_types';
import { extractErrorMessage, reduceMicrosecond } from './_utils';

export type SyncHandleCallback = (
  file: ChangeFile,
) => Promise<SyncFile> | SyncFile;

const output = console.log;

export function syncFiles(handle: SyncHandleCallback) {
  return async (files: ChangedRecord): Promise<SyncFiles> => {
    const keysMaxLength = Object.keys(files).reduce(
      (it, key) => (key.length > it ? key.length : it),
      0,
    );

    const records: SyncFiles = {};

    for (const [key, file] of Object.entries(files)) {
      const startMs = Date.now();

      let res: SyncFile | undefined;
      let errMsg = '';

      try {
        res = await handle(file);
        records[key] = res;
      } catch (err) {
        errMsg = extractErrorMessage(err) || 'Unknown error';
      }

      const elapsedMs = Date.now() - startMs;
      const time = reduceMicrosecond(elapsedMs);

      // key =>  ok, url, time
      // key => err, errMsg, time

      output(
        [
          color.cyanBright(key + ' '.repeat(keysMaxLength - key.length)),
          color.gray(': '),
          ...(res != null
            ? [
                color.bgGreen('[ok]'),
                color.greenBright(', '),
                color.yellow(res.url),
              ]
            : [color.bgRed('[err]'), color.gray(', '), color.grey(errMsg)]),
          color.gray(', '),
          color.magenta(time),
        ].join(''),
      );
    }

    return records;
  };
}
