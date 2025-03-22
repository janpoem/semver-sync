import type { ChangedFile, StoreKeyOptions, SyncFile } from '@semver-sync/sync';
import type qiniu from 'qiniu';

export namespace StoreQiniu {
  export type UploadResponse = {
    key: string;
    hash: string;
    error?: unknown;
    [key: string]: unknown;
  };

  export type Config = {
    ak: string;
    sk: string;
    bucket: string;
    baseUrl: string;
    regionId?: string;
  };

  export type OnUploadParams = {
    baseUrl: URL;
    file: ChangedFile;
    syncFile: SyncFile;
    respBody: UploadResponse;
  };

  export type Options = {
    path?: string;
    regionId?: string;
    withVer?: boolean;
    onConfig?: (conf: qiniu.conf.Config) => void;
    makeUrl?: (params: OnUploadParams) => string;
    onUpload?: (params: OnUploadParams) => void | Promise<void>;
    onError?: (err: unknown) => void;
  };

  export type Input = StoreKeyOptions & Options;
}
