# @semver-sync/sync

Synchronize files based on self-managed version comparison, automatically
incrementing version numbers.

基于本地日志实现文件同步的自管理，并实现版本号自增。

![image01.png](https://static.kephp.com/assets/semver-sync/image01.png)

## 使用说明

指定一个待同步目录，指定一个日志文件路径（json 格式，文件初始不存在也没问题）

```ts
import sync from '@semver-sync/sync';

sync({
  cwd: process.cwd(),
  // 入口目录，必须是目录
  entry: 'dist',
  // 版本日志，只记录最新版本
  logFile: 'logs/sync.test.json',
  // 是否要用户确认才进行下一步，默认为 false
  confirm: ture,
  store: () => {
    // 待同步文件的同步操作
  }
}).catch(console.error);
```

- 如果 `logFile` 初始不存在，则所有待同步目录里的文件皆为需要同步的文件，初始版本号为
  `1.0.0`
- 如果 `logFile` 存在，且包含有效数据，则会根据待同步目录里的文件的 hash 和
  `logFile` 对应的 hash 进行比较，如果差异，则表示需要同步，自动追加版本号为
  `1.0.1`

`logFile` 只记录最新版号，最新hash，文件后缀类型，对应版本号的相对路径 url，参考如下：

```json
{
  "files": {
    "a.js": {
      "url": "a-1.0.0.js",
      "hash": "052b17f119d924e699c14f5c5f827bcc",
      "type": "js",
      "ver": "1.0.0"
    },
    "a/b/2.js": {
      "url": "a/b/2-1.0.0.js",
      "hash": "d41d8cd98f00b204e9800998ecf8427e",
      "type": "js",
      "ver": "1.0.0"
    },
    "c/a/test.css": {
      "url": "c/a/test-1.0.0.css",
      "hash": "d41d8cd98f00b204e9800998ecf8427e",
      "type": "css",
      "ver": "1.0.0"
    }
    // ...省略...
  },
  "lastSync": 1742552242
}
```

假定中途待同步目录内的文件有更新，再次执行，会提示如下图：

![image02.png](https://static.kephp.com/assets/semver-sync/image02.png)

可见基于和已存在的 `logFile` 内容进行比较，他自动生成下一个版本的文件名。

### 同步文件实现

基于 `syncFiles` ，该函数是一个同步操作的 curry 化函数，根据传入的 callback
执行具体的同步操作。

以下是一个例子（[sync.test.ts](src/sync.test.ts)），其中 callback
并没有实际保存，只是模拟延时保存操作。

```ts
import sync, { syncFiles } from '@semver-sync/sync';

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

sync({
  cwd: process.cwd(),
  entry: 'test',
  confirm: true,
  logFile: 'sync.test.json',
  saveLog: true,
  store: syncFiles(
    ({ verPath, hash, type, ver }) =>
      new Promise((resolve, reject) => {
        setTimeout(
          () => {
            const seed = getRandomInt(0, 100);
            if (seed < 10) {
              // 这里以 10% 的概率模拟操作失败
              reject(new Error(`random seed ${seed} error`));
            } else {
              resolve({
                url: verPath,
                hash,
                type,
                ver,
              });
            }
          },
          getRandomInt(10, 800),
        );
      }),
  ),
}).catch(console.error);
```

同步失败的文件，不会写入 `logFile` ，再执行一次同步，之前同步失败的文件就会被检查到，并重新同步。

### sync 参数说明

以下只列出核心的类型

列举目录的库使用 [glob](https://www.npmjs.com/package/glob)

```ts
import type { GlobOptionsWithFileTypesTrue } from 'glob';

type MaybePromise<T> = T | Promise<T>;

declare function sync(opts: SyncOptions): Promise<SyncResult>;

type SyncResult = {
  files: ListFilesRecord;
  changedFiles: ChangedRecord;
  log: SyncRecord;
  isConfirm: boolean;
};

// sync 函数的参数
type SyncOptions = {
  // 入口目录，必填
  entry: string | string[];
  // ext 查询格式，例如：`{js,cjs,css}` ，可参考 glob 使用说明
  ext?: string;
  // 日志文件路径
  logFile?: string;
  // 是否保存日志，默认为 true
  saveLog?: boolean;
  // 读取入口目录符合条件的文件事件
  onFiles?: (files: ListFilesRecord) => MaybePromise<void>;
  // 文件排序算法自定义函数
  orderFiles?: OrderFilesFn;
  // 在得出改动后的文件事件
  onChangeFiles?: (files: ChangedRecord) => MaybePromise<void>;
  // 存储接口实现
  store: SyncStoreOptions;
  // 保存日志前的事件
  onLog?: (params: OnLogParams) => MaybePromise<void>;
  // 同步完成后的事件
  onSync?: (params: OnSyncParams) => MaybePromise<void>;
  // 是否需要用户确认才执行同步操作（只列出所有差异，而不自动同步）
  confirm?: boolean;
  // 提取是否变动文件的参数
  changed?: ExtractChangedOptions;
  cwd?: string;
  // glob 额外参数
  glob?: ListFilesGlobOptions;
};

// 列举一个目录下的全部文件记录，以 relativePath 为 key
type ListFilesRecord = Record<string, ListFile>;
type ListFile = {
  // 绝对路径
  path: string;
  // 相对路径
  relativePath: string;
  // 相对路径的第层目录
  prefix: string;
  // 文件大小
  size: number;
  // 绝对路径中的文件目录深度
  depth: number;
  // 文件更新时间，日期对象
  mtime: Date | undefined;
  // 文件更新时间，秒
  mtimeSec: number;
};

// 已更改过的文件文件记录
// 这时已经经过对日志版本进行比较
type ChangedRecord = Record<string, ChangeFile>;
type ChangedFile = {
  key: string;
  basename: string;
  path: string;
  relativePath: string;
  hash: string;
  size: string;
  filesize: number;
  mtime?: Date;
  ver: string;
  verPath: string;
  type: string;
};

// 最终同步到 logFile 的同步记录
type SyncRecord = {
  files: SyncFiles;
  lastSync: number;
};
type SyncFiles = Record<string, SyncFile>;
// 同步记录中的文件数据结构
type SyncFile = {
  ver: string;
  hash: string;
  url: string;
  type: string;
};

// 同步接口函数实现
type SyncStoreCallbackImpl = (changed: ChangedRecord) => SyncFiles | Promise<SyncFiles>;
// store 选项
type SyncStoreOptions = SyncStoreCallbackImpl;

export type ExtractChangedOptions = {
  // 带版本比较，默认为 true
  withVer?: boolean;
  // changed item 拦截
  item?: (item: ChangeFile) => ChangeFile | undefined | null;
  // 用户自定义的文件 hash 方法，注意保持统一性，默认使用 md5
  hash?: UserHashFileFn;
};
type UserHashFileFn = (path: string, item: ListFile) => MaybePromise<string>;

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

// 文件排序的自定义函数
type OrderFilesFn = (a: ListFile, b: ListFile) => number;

// glob 额外参数
export type ListFilesGlobOptions = Omit<GlobOptionsWithFileTypesTrue, 'stat'>;
```

### syncFiles 参数说明

```ts
declare function syncFiles(handle: SyncHandleCallback): (files: ChangedRecord) => Promise<SyncFiles>;

export type SyncHandleCallback = (
  file: ChangeFile,
) => Promise<SyncFile> | SyncFile;

// 已更改过的文件文件记录
// 这时已经经过对日志版本进行比较
type ChangedRecord = Record<string, ChangeFile>;
type ChangeFile = {
  key: string;
  basename: string;
  path: string;
  relativePath: string;
  hash: string;
  size: string;
  filesize: number;
  mtime?: Date;
  ver: string;
  verPath: string;
  type: string;
};

type SyncFiles = Record<string, SyncFile>;
type SyncFile = {
  ver: string;
  hash: string;
  url: string;
  type: string;
};
```
