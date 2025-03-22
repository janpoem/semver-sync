import type { GlobOptionsWithFileTypesTrue } from 'glob';

type MaybePromise<T> = T | Promise<T>;

export type OnSyncParams = {
  files: ListFilesRecord;
  changedFiles: ChangedRecord;
  syncFiles: SyncFiles;
  log: SyncRecord;
};

export type OnLogParams = {
  files: ListFilesRecord;
  changedFiles: ChangedRecord;
  syncFiles: SyncFiles;
  log: SyncRecord;
};

export type OrderFilesFn = (a: ListFile, b: ListFile) => number;

export type UserHashFileFn = (
  path: string,
  item: ListFile,
) => MaybePromise<string>;

export type SyncOptions = {
  entry: string | string[];
  ext?: string;
  logFile?: string;
  saveLog?: boolean;
  onFiles?: (files: ListFilesRecord) => MaybePromise<void>;
  orderFiles?: OrderFilesFn;
  onChangeFiles?: (files: ChangedRecord) => MaybePromise<void>;
  store: SyncStoreOptions;
  onLog?: (params: OnLogParams) => MaybePromise<void>;
  onSync?: (params: OnSyncParams) => MaybePromise<void>;
  confirm?: boolean;
  changed?: ExtractChangedOptions;
  cwd?: string;
  glob?: ListFilesGlobOptions;
};

export type SyncResult = {
  files: ListFilesRecord;
  changedFiles: ChangedRecord;
  log: SyncRecord;
  isConfirm: boolean;
};

export type ExtractChangedOptions = {
  withVer?: boolean;
  item?: (item: ChangedFile) => ChangedFile | undefined | null;
  hash?: UserHashFileFn;
};

// export type StoreCallbackOptions = {
//   path?: string;
//   callback?: (record: SyncFiles) => void | Promise<void>;
//   withVer?: boolean;
// };

export type StoreHomedirKeyOptions = { key: string };

export type StoreCustomConfigOptions<Config extends object> = {
  config: Config | (() => MaybePromise<Config>);
};

// export type StoreQiniuConfig = {
//   ak: string;
//   sk: string;
//   bucket: string;
//   baseUrl: string;
// };

// export type StoreQiniuOptions = StoreCallbackOptions &
//   (StoreHomedirKeyOptions | StoreQiniuConfig);

export type SyncStoreCallbackImpl = (
  changed: ChangedRecord,
) => SyncFiles | Promise<SyncFiles>;

export type SyncStoreOptions = SyncStoreCallbackImpl;

export type SyncFile = {
  // 更新版本号
  ver: string;
  // 文件 hash
  hash: string;
  // 远端保存的文件路径
  url: string;
  // 文件类型（后缀名）
  type: string;
};

export type SyncFiles = Record<string, SyncFile>;

export type SyncRecord = {
  files: Record<string, SyncFile>;
  lastSync: number;
};

export type ListFile = {
  path: string;
  relativePath: string;
  prefix: string;
  size: number;
  depth: number;
  mtime: Date | undefined;
  mtimeSec: number;
};

// 列出所有的文件记录：
// key 为http格式的相对路径
// value 为源文件的完整路径
export type ListFilesRecord = Record<string, ListFile>;

export type ListFilesGlobOptions = Omit<GlobOptionsWithFileTypesTrue, 'stat'>;

export type ChangedFile = {
  // 源文件相对路径名
  key: string;
  basename: string;
  // 源文件路径
  path: string;
  relativePath: string;
  hash: string;
  size: string;
  filesize: number;
  mtime?: Date;
  // 更新版本号
  ver: string;
  verPath: string;
  type: string;
};

export type ChangedRecord = Record<string, ChangedFile>;
