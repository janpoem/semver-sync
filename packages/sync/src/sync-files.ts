import { errMsg } from '@zenstone/ts-utils';
import color from 'ansi-colors';
import type { ChangedFile, ChangedRecord, SyncFile, SyncFiles } from './_types';
import { reduceMicrosecond } from './_utils';

export type SyncHandleFileCallback = (
  file: ChangedFile,
) => Promise<SyncFile> | SyncFile;

const output = console.log;

export const syncFiles = (handle: SyncHandleFileCallback) => {
  return async (files: ChangedRecord): Promise<SyncFiles> => {
    const keysMaxLength = Object.keys(files).reduce(
      (it, key) => (key.length > it ? key.length : it),
      0,
    );

    const records: SyncFiles = {};

    for (const [key, file] of Object.entries(files)) {
      const startMs = Date.now();

      let res: SyncFile | undefined;
      let msg = '';

      try {
        res = await handle(file);
        records[key] = res;
      } catch (err) {
        msg = errMsg(err) || 'Unknown error';
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
                color.bgGreenBright('[ok]'),
                color.greenBright(', '),
                color.yellow(res.url),
              ]
            : [color.bgRedBright('[err]'), color.gray(', '), color.grey(msg)]),
          color.gray(', '),
          color.magenta(time),
        ].join(''),
      );
    }

    return records;
  };
};
