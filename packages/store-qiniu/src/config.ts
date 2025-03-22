import { isStoreKeyOptions, loadStoreKeyConfig } from '@semver-sync/sync';
import { errMsg, notEmptyStr } from '@zenstone/ts-utils';
import color from 'ansi-colors';
import type { StoreQiniuConfig, StoreQiniuInputOptions } from './types';

export const verifyConfig = (data: StoreQiniuConfig): StoreQiniuConfig => {
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
      `There are ${color.redBright(`${errors.length} error(s)`)} in qiniu store config`,
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

export const loadConfig = async (
  opts: StoreQiniuInputOptions,
): Promise<StoreQiniuConfig> => {
  if (isStoreKeyOptions(opts)) {
    return verifyConfig(loadStoreKeyConfig('qiniu', opts.key, defaultConfig()));
  }
  throw new Error('Invalid qiniu store options input');
};
