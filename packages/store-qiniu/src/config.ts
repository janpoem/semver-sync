import { isHomedirKeyOptions, readHomedirKey } from '@semver-sync/sync';
import { errMsg, notEmptyStr } from '@zenstone/ts-utils';
import color from 'ansi-colors';
import type { StoreQiniuConfig, StoreQiniuInputOptions } from './types';

export const verifyConfig = (
  key: string,
  data?: StoreQiniuConfig,
): StoreQiniuConfig => {
  if (data == null) {
    throw new Error(`Load qiniu store config ${color.yellow(key)} data null`);
  }
  const errors: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (!notEmptyStr(value)) {
      errors.push(`* ${color.cyanBright(key)} is required`);
      continue;
    }
    if (key === 'baseUrl') {
      try {
        new URL(value);
      } catch (err) {
        errors.push(
          `* ${color.cyanBright(key)}: ${errMsg(err) || 'try parse baseUrl failed'}`,
        );
      }
    }
  }
  if (errors.length) {
    console.log(
      `There are ${color.redBright(`${errors.length} error(s)`)} in qiniu store config ${color.yellowBright(key)}`,
    );
    for (const err of errors) {
      console.log(err);
    }
    process.exit(0);
  }
  return data;
};

const defaultConfig = (): StoreQiniuConfig => ({
  ak: '',
  sk: '',
  bucket: '',
  baseUrl: '',
});

export const loadConfig = (opts: StoreQiniuInputOptions): StoreQiniuConfig => {
  if (isHomedirKeyOptions(opts)) {
    return verifyConfig(
      opts.key,
      readHomedirKey('qiniu', opts.key, defaultConfig()),
    );
  }
  throw new Error('Invalid qiniu store options input');
};
