import type { ChangedFile, StoreKeyOptions, SyncFile } from '@semver-sync/sync';
import type qiniu from 'qiniu';

export type QiniuResponse = {
  key: string;
  hash: string;
  error?: unknown;
  [key: string]: unknown;
};

export type StoreQiniuConfig = {
  ak: string;
  sk: string;
  bucket: string;
  baseUrl: string;
  regionId?: string;
};

export type StoreQiniuOptions = {
  path?: string;
  regionId?: string;
  withVer?: boolean;
  onConfig?: (conf: qiniu.conf.Config) => void;
  makeUrl?: (params: OnUploadParams) => string;
  onUpload?: (params: OnUploadParams) => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export type StoreQiniuInputOptions = StoreKeyOptions & StoreQiniuOptions;

export type OnUploadParams = {
  baseUrl: URL;
  file: ChangedFile;
  syncFile: SyncFile;
  respBody: QiniuResponse;
};
