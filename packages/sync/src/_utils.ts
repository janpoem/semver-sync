import { isInferObj, notEmptyStr } from '@zenstone/ts-utils';
import { filesize } from 'filesize';
import { glob } from 'glob';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, relative, resolve } from 'node:path';
import { SemVer, valid } from 'semver';
import type {
  ChangedRecord,
  ChangeFile,
  ExtractChangedOptions,
  ListFilesGlobOptions,
  ListFilesRecord,
  ListFilesRecordItem,
  OrderFilesFn,
  StoreHomedirKeyOptions,
  SyncFile,
  SyncFiles,
  SyncRecord,
  SyncStoreCallback,
  SyncStoreOptions,
} from './_types';

// import { storeQiniu } from './storeQiniu';

/**
 * 判断给定路径是否为一个文件
 *
 * @param path
 * @param canSymbolicLink
 */
export function isFile(path: string, canSymbolicLink?: boolean): boolean {
  try {
    const stats = lstatSync(path);
    const isFile = stats.isFile();
    if (isFile && canSymbolicLink === false) {
      return !stats.isSymbolicLink();
    }
    return isFile;
  } catch (_err) {
    return false;
  }
}

/**
 * 判断给定路径是否为一个目录
 *
 * @param path
 * @param canSymbolicLink
 */
export function isDir(path: string, canSymbolicLink?: boolean): boolean {
  try {
    const stats = lstatSync(path);
    const isDir = stats.isDirectory();
    if (isDir && canSymbolicLink === false) {
      return !stats.isSymbolicLink();
    }
    return isDir;
  } catch (_err) {
    return false;
  }
}

/**
 * 读取指定路径的 json 数据
 *
 * 该方法不做任何判定，只要能正确 JSON.parse 即满足泛型 `T`。
 *
 * @param path
 */
export function loadJson<T>(path: string): T | undefined {
  try {
    if (isFile(path)) {
      return JSON.parse(readFileSync(path, { encoding: 'utf-8' }).toString());
    }
  } catch (_err) {
    return undefined;
  }
}

export function getDefaultSyncLog(): SyncRecord {
  return {
    files: {},
    lastSync: 0,
  };
}

export function loadSyncLog(path: string): SyncRecord {
  return loadJsonObj(path, getDefaultSyncLog()) || getDefaultSyncLog();
}

/**
 * 以一个 obj 结构方式加载 json
 *
 * @param path
 * @param dft
 */
export function loadJsonObj<T extends object>(
  path: string,
  dft?: T,
): T | undefined {
  const res = loadJson<T>(path);
  if (res != null && typeof res === 'object' && !Array.isArray(res)) {
    return { ...dft, ...res };
  }
  return dft;
}

export type ListFilePattern = [
  // 入口目录
  string,
  // 完整文件匹配表达式
  string,
];

/**
 * 构建基于入口和后缀名，生成对应的文件查询表达式
 *
 * - 支持多入口
 * - 多个 ext 的名，采用 glob 输入格式，如：{png,jpeg}，如果不指定，默认为 *
 *
 * @see https://github.com/isaacs/node-glob?tab=readme-ov-file#glob-primer
 * @see https://www.npmjs.com/package/glob
 * @param entry
 * @param ext
 */
export function buildPatterns(
  entry: string | string[],
  ext?: string,
): ListFilePattern[] {
  return (Array.isArray(entry) ? entry : [entry])
    .map<ListFilePattern>((it) => {
      return [
        it,
        ([it, '**', '*'].filter(Boolean).join('/') +
          (ext ? `.${ext}` : '.*')) as string,
      ];
    })
    .filter(Boolean);
}

// export type ListFileItem = {
//   path: string;
//   relativePath: string;
// };

/**
 * 根据指定的 enter, ext ，列举出目录下符合条件的文件
 *
 * - 可以额外指定 {@link ListFilesGlobOptions} 额外查询选项
 * - 亦可指定文件的排序算法 {@link OrderFilesFn}
 *
 * @param entry
 * @param ext
 * @param cwd
 * @param opts
 * @param orderFiles
 */
export async function listFiles(
  entry: string | string[],
  ext: string,
  cwd: string,
  opts?: ListFilesGlobOptions,
  orderFiles?: OrderFilesFn,
): Promise<ListFilesRecord> {
  const items: ListFilesRecordItem[] = [];
  const patterns = buildPatterns(entry, ext);
  for (const patternIt of patterns) {
    const [base, pattern] = patternIt;
    const files = await glob(pattern, {
      nodir: true,
      ...opts,
      stat: true,
      withFileTypes: true,
      cwd,
    });
    const root = resolve(cwd, base);
    for (const it of files) {
      const path = it.fullpath();
      const relativePath = convertHttpPath(relative(root, path));
      const mtime = it.mtime ?? it.ctime ?? undefined;
      const prefix = relativePath.includes('/')
        ? relativePath.split('/')[0] || ''
        : '';
      items.push({
        path,
        relativePath,
        prefix,
        size: it.size ?? 0,
        depth: it.depth(),
        mtime,
        mtimeSec: Math.floor(it.mtimeMs ?? 0 / 1000),
      });
    }
  }

  const orderFn: OrderFilesFn =
    orderFiles ??
    ((a, b) => {
      if (a.depth === b.depth) {
        if (a.prefix === b.prefix) {
          if (a.mtimeSec === b.mtimeSec) {
            return a.relativePath.localeCompare(b.relativePath);
          }
          return b.mtimeSec - a.mtimeSec;
        }
        return a.prefix.localeCompare(b.prefix);
      }
      return a.depth - b.depth;
    });

  return items.sort(orderFn).reduce((map, it) => {
    map[it.relativePath] = it;
    return map;
  }, {} as ListFilesRecord);
  /**
  for (let i = 0; i < patterns.length; i++) {
    const [base, pattern] = patterns[i];
    const files = await glob(pattern, {
      nodir: true,
      ...opts,
      stat: true,
      withFileTypes: true,
      cwd,
    });
    const root = resolve(cwd, base);
    files.forEach((it) => {
      const path = it.fullpath();
      const relativePath = convertHttpPath(relative(root, path));
      const mtime = it.mtime ?? it.ctime ?? undefined;
      const prefix = relativePath.includes('/')
        ? relativePath.split('/')[0]
        : '';
      if (record[relativePath] == null) {
        record[relativePath] = {
          path,
          prefix,
          size: it.size ?? 0,
          depth: it.depth(),
          mtime,
          mtimeSec: Math.floor(it.mtimeMs ?? 0 / 1000),
        };
      }
    });
  }
  return Object.keys(records)
    .sort((a, b) => {
      if (records[a].prefix === records[b].prefix) {
        if (records[a].depth === records[b].depth) {
          if (records[a].mtimeSec === records[b].mtimeSec) {
            return a < b ? -1 : a > b ? 1 : 0;
          }
          return records[b].mtimeSec - records[a].mtimeSec;
        }
        return records[b].depth - records[a].depth;
      }
      return records[a].prefix > records[b].prefix ? -1 : 1;
    })
    .reduce((map, key) => {
      map[key] = records[key];
      return map;
    }, {} as ListFilesRecord);
   */
}

export function convertHttpPath(path: string): string {
  return path.replace(/\\+/gm, '/');
}

export function hashFile(path: string): string {
  return createHash('md5').update(readFileSync(path)).digest('hex');
}

function isAnyRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object';
}

function isString(value: unknown): value is string {
  return value != null && typeof value === 'string';
}

function notEmptyString(value: unknown): value is string {
  return isString(value) && value.trim() !== '';
}

export function isValidSyncFile(value: unknown): value is SyncFile {
  if (isAnyRecord(value)) {
    return !!(
      notEmptyString(value.ver) &&
      valid(value.ver) &&
      notEmptyString(value.hash) &&
      notEmptyString(value.url)
    );
  }
  return false;
}

export function isValidChangeFile(it: unknown): it is ChangeFile {
  if (isAnyRecord(it)) {
    if (
      notEmptyString(it.key) &&
      notEmptyString(it.path) &&
      notEmptyString(it.hash) &&
      notEmptyString(it.ver) &&
      notEmptyString(it.verPath)
    ) {
      if (!isFile(it.path)) {
        console.warn(`file ${it.key} path '${it.path}' not exists!`);
      }
      return true;
    }
  }
  return false;
}

export function extractChangedRecord(
  files: ListFilesRecord,
  syncLog: SyncRecord,
  { withVer, item: itemCallback }: ExtractChangedOptions = {},
): ChangedRecord {
  withVer = withVer ?? true;
  const changed: ChangedRecord = {};
  for (const [key, item] of Object.entries(files)) {
    const ref = isValidSyncFile(syncLog.files[key])
      ? syncLog.files[key]
      : { ver: '1.0.0', hash: '' };
    const ver = new SemVer(ref.ver);
    const { path, size, mtime, relativePath } = item;

    const hash = hashFile(path);
    if (hash !== ref.hash) {
      if (ref.hash !== '') {
        ver.inc('patch');
      }
      const fileExt = extname(key).toLowerCase();
      const fileBasename = key.replace(new RegExp(`${fileExt}$`), '');
      const verPath =
        fileBasename + (withVer ? `-${ver.version}` : '') + fileExt;
      const newItem: ChangeFile = {
        key,
        basename: fileBasename,
        path,
        relativePath,
        hash,
        size: filesize(size, { base: 2, standard: 'jedec' }),
        filesize: size,
        ver: ver.version,
        verPath,
        mtime,
        type: fileExt.replace(/^\./, ''),
      };
      if (typeof itemCallback === 'function') {
        const ret = itemCallback(newItem);
        if (isValidChangeFile(ret)) {
          changed[key] = ret;
        }
      } else {
        changed[key] = newItem;
      }
    }
  }
  return changed;
}

// function isQiniuStore(
//   type: unknown,
//   opts: Omit<SyncStoreOptions, 'type'>,
// ): opts is StoreQiniuOptions {
//   return type === 'qiniu';
// }

function isSyncStoreCallback(
  opts: SyncStoreOptions,
): opts is SyncStoreCallback {
  return opts != null && typeof opts === 'function';
}

export async function syncStore(
  changed: ChangedRecord,
  opts: SyncStoreOptions,
): Promise<SyncFiles> {
  if (isSyncStoreCallback(opts)) {
    return opts(changed);
  }
  // const { type, ...rest } = opts;
  // if (isQiniuStore(type, rest)) {
  //   return storeQiniu(changed, opts);
  // }
  throw new Error('Synchronous storage type not supported');
}

export const isHomedirKeyOptions = (opts: unknown) =>
  isInferObj<StoreHomedirKeyOptions>(opts, (it) => notEmptyStr(it.key));

export function readHomedirKey<T extends object>(
  type: string,
  path: string,
  dft: T,
): T | undefined {
  const file = `sync-${type}-${path}.json`;
  const fullPath = resolve(homedir(), file);
  if (!isFile(fullPath)) {
    throw new Error(
      `The sync configuration file '${fullPath}' does not exist. Please create it manually. ` +
        `The content format is as follows: ${JSON.stringify(dft)}`,
    );
  }
  return loadJsonObj<T>(fullPath, dft);
}

/**
 * 净化路径
 *
 * - null | undefined | '' | '/' => ''
 * - 移除头尾的 `/`
 *
 * @param path
 */
export function purgeHttpPath(path?: string | null): string {
  if (path == null || path === '' || path === '/') {
    return '';
  }
  const p = path.replace(/(^\/+|\/+$)/gm, '');
  if (p === '/') return '';
  return p;
}

/**
 * 转化上传路径，如果 path, basePath 传入为空字符、null、undefined 则会过滤掉
 *
 * @param file
 * @param path
 * @param basePath
 */
export function convertUploadPath(
  file: string,
  path?: string | null,
  basePath?: string | null,
): string {
  return [purgeHttpPath(basePath), purgeHttpPath(path), file]
    .filter(Boolean)
    .join('/');
}

// export const waiting = (s: number, callback?: () => void): Promise<void> =>
//   new Promise((res) =>
//     setTimeout(async () => {
//       callback?.();
//       res();
//     }, s * 1000),
//   );

/**
 * 补前导 0
 *
 * @param v
 * @param length
 */
export function fillZero(v: number, length = 2): string {
  return (v < 10 ? '0'.repeat(length - 1) : '') + v;
}

/**
 * 简单化日期事件格式化
 *
 * @param d
 */
export function dateFormat(d: Date | undefined | null): string {
  if (d == null) {
    return ' '.repeat(19);
  }
  return `${d.getFullYear()}-${fillZero(d.getMonth() + 1)}-${fillZero(
    d.getDate(),
  )} ${d.toLocaleTimeString()}`;
}

export function extractErrorMessage(err: unknown): string {
  if (err == null) return '';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  return '';
}

export function reduceMicrosecond(iValue: number): string {
  let value = iValue;
  if (value < 1000) return `${value}ms`;
  value = value / 1000;
  if (value < 60) return `${value.toFixed(2)}sec`;
  value = value / 60;
  if (value < 60) return `${value.toFixed(2)}min`;
  value = value / 60;
  if (value < 60) return `${value.toFixed(2)}hours`;
  value = value / 24;
  return `${value.toFixed(2)}days`;
}
