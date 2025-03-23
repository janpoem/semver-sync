import { convertUploadPath, type SyncFile, syncFiles } from '@semver-sync/sync';
import { readFileSync } from 'node:fs';
import { createApi } from './api';
import { loadConfig } from './config';
import type { StoreGithub } from './types';

type Input = StoreGithub.Input;

const storeGithub = (opts: Input) => {
  const { path, withVer = true } = opts;
  const config = loadConfig(opts);
  const api = createApi(config, opts);

  const baseUrl = config.baseUrl ? new URL(config.baseUrl) : undefined;

  return syncFiles(async (file) => {
    try {
      const filePath = convertUploadPath(
        withVer ? file.verPath : file.relativePath,
        path,
        baseUrl?.pathname,
      );
      const result = await api.putFile(
        filePath,
        readFileSync(file.path).toString('utf8'),
      );
      const syncFile: SyncFile = {
        ver: file.ver,
        hash: file.hash,
        url: baseUrl ? new URL(filePath, baseUrl).toString() : filePath,
        type: file.type,
      };
      const params = { baseUrl, file, syncFile, result };
      if (opts.makeUrl) syncFile.url = opts.makeUrl(params);
      await opts.onUpload?.(params);
      return syncFile;
    } catch (err) {
      opts.onError?.(err);
      throw err;
    }
  });
};

export default storeGithub;

export * from './types';
