import { isStoreKeyOptions, loadStoreKeyConfig } from '@semver-sync/sync';
import { errMsg, notEmptyStr } from '@zenstone/ts-utils';
import color from 'ansi-colors';
import type { StoreQiniu } from './types';

type Config = StoreQiniu.Config;
type Input = StoreQiniu.Input;

const storeType = 'qiniu';

const defaultConfig = (): Config => ({
  ak: '',
  sk: '',
  bucket: '',
  baseUrl: '',
});

export const verifyConfig = (data: Config): Config => {
  const errors: string[] = [];
  const requireKeys = Object.keys(defaultConfig()) as (keyof Config)[];
  for (const key of requireKeys) {
    const value = data[key];
    if (!notEmptyStr(value)) {
      errors.push(`${color.cyanBright(key)} is required`);
      continue;
    }
    if (key === 'baseUrl') {
      try {
        new URL(value);
      } catch (err) {
        errors.push(
          `${color.cyanBright(key)}: ${errMsg(err) || 'parse baseUrl failed'}`,
        );
      }
    }
  }
  if (errors.length) {
    throw new Error(
      `There are ${color.redBright(`${errors.length} error(s)`)} in qiniu config: ${errors.join(', ')}`,
    );
  }
  return data;
};

export const loadConfig = (opts: Input): Config => {
  if (isStoreKeyOptions(opts)) {
    return verifyConfig(
      loadStoreKeyConfig(storeType, opts.key, defaultConfig()),
    );
  }
  throw new Error('Invalid qiniu store options input');
};
