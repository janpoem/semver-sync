import type {
  ChangedFile,
  StoreHomedirKeyOptions,
  SyncFile,
} from '@semver-sync/sync';
import type qiniu from 'qiniu';

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
  onUpload?: (params: OnUploadParams) => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export type StoreQiniuInputOptions = StoreHomedirKeyOptions & StoreQiniuOptions;

export type OnUploadParams = {
  file: ChangedFile;
  syncFile: SyncFile;
  respBody: QiniuResponse;
};

export type QiniuResponse = {
  key: string;
  hash: string;
  error?: unknown;
  [key: string]: unknown;
};
