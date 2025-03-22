import { isInferObj, notEmptyStr } from '@zenstone/ts-utils';
import { filesize } from 'filesize';
import { glob } from 'glob';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, relative, resolve } from 'node:path';
import { SemVer, valid } from 'semver';
import type {
  ChangedFile,
  ChangedRecord,
  ExtractChangedOptions,
  ListFile,
  ListFilesGlobOptions,
  ListFilesRecord,
  OrderFilesFn,
  StoreHomedirKeyOptions,
  SyncFile,
  SyncFiles,
  SyncRecord,
  SyncStoreImpl,
  SyncStoreOptions,
} from './_types';

// import { storeQiniu } from './storeQiniu';

/**
 * 判断给定路径是否为一个文件
 *
 * @param path
 * @param canSymbolicLink
 */
export const isFile = (path: string, canSymbolicLink?: boolean): boolean => {
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
};

/**
 * 判断给定路径是否为一个目录
 *
 * @param path
 * @param canSymbolicLink
 */
export const isDir = (path: string, canSymbolicLink?: boolean): boolean => {
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
};

/**
 * 读取指定路径的 json 数据
 *
 * 该方法不做任何判定，只要能正确 JSON.parse 即满足泛型 `T`。
 *
 * @param path
 */
export const loadJson = <T>(path: string): T | undefined => {
  try {
    if (isFile(path)) {
      return JSON.parse(readFileSync(path, { encoding: 'utf-8' }).toString());
    }
  } catch (_err) {
    return undefined;
  }
};

/**
 * 以一个 obj 结构方式加载 json
 *
 * @param path
 * @param dft
 */
export const loadJsonObj = <T extends object>(
  path: string,
  dft?: T,
): T | undefined => {
  const res = loadJson<T>(path);
  if (res != null && typeof res === 'object' && !Array.isArray(res)) {
    return { ...dft, ...res };
  }
  return dft;
};

/**
 * 返回一个默认的 {@link SyncRecord} 结构
 */
export const getDefaultSyncLog = (): SyncRecord => {
  return {
    files: {},
    lastSync: 0,
  };
};

export const loadSyncLog = (path: string): SyncRecord => {
  return loadJsonObj(path, getDefaultSyncLog()) || getDefaultSyncLog();
};

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
export const buildPatterns = (
  entry: string | string[],
  ext?: string,
): ListFilePattern[] => {
  return (Array.isArray(entry) ? entry : [entry])
    .map<ListFilePattern>((it) => {
      return [
        it,
        ([it, '**', '*'].filter(Boolean).join('/') +
          (ext ? `.${ext}` : '.*')) as string,
      ];
    })
    .filter(Boolean);
};

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
export const listFiles = async (
  entry: string | string[],
  ext: string,
  cwd: string,
  opts?: ListFilesGlobOptions,
  orderFiles?: OrderFilesFn,
): Promise<ListFilesRecord> => {
  const items: ListFile[] = [];
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
      // 0. => 目录深度正序
      if (a.depth === b.depth) {
        // 1. => 目录前缀正序
        if (a.prefix === b.prefix) {
          // 2. => 最后修改时间反序
          if (a.mtimeSec === b.mtimeSec) {
            // 3. => 相对路径正序
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
};

/**
 * 类型推断：是否为一个有效的 {@link SyncFile} 结构
 *
 * @param file
 */
export const isSyncFile = (file: unknown) =>
  isInferObj<SyncFile>(
    file,
    (it) =>
      notEmptyStr(it.ver) &&
      !!valid(it.ver) &&
      notEmptyStr(it.hash) &&
      notEmptyStr(it.url),
  );

// export function isValidSyncFile(value: unknown): value is SyncFile {
//   if (isAnyRecord(value)) {
//     return !!(
//       notEmptyString(value.ver) &&
//       valid(value.ver) &&
//       notEmptyString(value.hash) &&
//       notEmptyString(value.url)
//     );
//   }
//   return false;
// }

/**
 * 类型推断：是否为一个有效的 {@link ChangedFile} 结构
 *
 * @param file
 */
export const isChangeFile = (file: unknown) =>
  isInferObj<ChangedFile>(
    file,
    (it) =>
      notEmptyStr(it.key) &&
      notEmptyStr(it.path) &&
      notEmptyStr(it.relativePath) &&
      notEmptyStr(it.hash) &&
      notEmptyStr(it.ver) &&
      notEmptyStr(it.verPath),
  );

/**
 * 判断是否为一个有效的 {@link ChangedFile} 结构，并额外检查该文件是否存在
 *
 * 如果文件不存在，不会返回 false，支持额外打印一个 warn 信息
 *
 * @param file
 */
export const verifyChangeFile = (file: unknown): file is ChangedFile => {
  if (isChangeFile(file)) {
    if (!isFile(file.path)) {
      console.warn(`file ${file.key} path '${file.path}' not exists!`);
    }
    return true;
  }
  return false;
};

// export function isValidChangeFile(it: unknown): it is ChangeFile {
//   if (isAnyRecord(it)) {
//     if (
//       notEmptyString(it.key) &&
//       notEmptyString(it.path) &&
//       notEmptyString(it.hash) &&
//       notEmptyString(it.ver) &&
//       notEmptyString(it.verPath)
//     ) {
//       if (!isFile(it.path)) {
//         console.warn(`file ${it.key} path '${it.path}' not exists!`);
//       }
//       return true;
//     }
//   }
//   return false;
// }

/**
 * hash 文件的方法
 *
 * @param path
 * @param _item
 */
export const hashFile = (path: string, _item: ListFile): string => {
  return createHash('md5').update(readFileSync(path)).digest('hex');
};

/**
 * 提取变动的文件记录
 *
 * @param files
 * @param syncLog
 * @param withVer
 * @param itemCallback
 * @param userHashFile
 */
export const extractChangedRecord = async (
  files: ListFilesRecord,
  syncLog: SyncRecord,
  {
    withVer,
    item: itemCallback,
    hash: userHashFile,
  }: ExtractChangedOptions = {},
): Promise<ChangedRecord> => {
  withVer = withVer ?? true;
  const changed: ChangedRecord = {};
  for (const [key, item] of Object.entries(files)) {
    const ref = isSyncFile(syncLog.files[key])
      ? syncLog.files[key]
      : { ver: '1.0.0', hash: '' };
    const ver = new SemVer(ref.ver);
    const { path, size, mtime, relativePath } = item;

    const hash = await (userHashFile ?? hashFile)(path, item);
    if (hash !== ref.hash) {
      if (ref.hash !== '') {
        ver.inc('patch');
      }
      const fileExt = extname(key).toLowerCase();
      const fileBasename = key.replace(new RegExp(`${fileExt}$`), '');
      const verPath =
        fileBasename + (withVer ? `-${ver.version}` : '') + fileExt;
      const newItem: ChangedFile = {
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
        if (verifyChangeFile(ret)) {
          changed[key] = ret;
        }
      } else {
        changed[key] = newItem;
      }
    }
  }
  return changed;
};

// function isQiniuStore(
//   type: unknown,
//   opts: Omit<SyncStoreOptions, 'type'>,
// ): opts is StoreQiniuOptions {
//   return type === 'qiniu';
// }

/**
 * 类型推断：判断是否为一个有效的 {@link SyncStoreImpl}
 *
 * 以前老版本，提供直接的配置的方式，现在已经去掉，但这里预留扩展
 *
 * @param opts
 */
export const isSyncStoreImpl = (opts: unknown): opts is SyncStoreImpl => {
  return opts != null && typeof opts === 'function';
};

/**
 * 同步文件到对应的存储容器的 API 封装入口
 *
 * 该方法只是一个统一入口，而不关心具体实现
 *
 * @param changed
 * @param opts
 */
export async function syncStore(
  changed: ChangedRecord,
  opts: SyncStoreOptions,
): Promise<SyncFiles> {
  if (isSyncStoreImpl(opts)) {
    return opts(changed);
  }
  // const { type, ...rest } = opts;
  // if (isQiniuStore(type, rest)) {
  //   return storeQiniu(changed, opts);
  // }
  throw new Error('Synchronous storage type not supported');
}

/**
 * 类型推断：判定 opts 是否有效的 {@link StoreHomedirKeyOptions} （只要包含一个非空字符串的 `key`）
 *
 * @param opts
 */
export const isHomedirKeyOptions = (opts: unknown) =>
  isInferObj<StoreHomedirKeyOptions>(opts, (it) => notEmptyStr(it.key));

/**
 * 基于路径，读取用户 Homedir 下的文件内容。
 *
 * @param type
 * @param path
 * @param dft
 */
export const readHomedirKey = <T extends object>(
  type: string,
  path: string,
  dft: T,
): T | undefined => {
  const file = `sync-${type}-${path}.json`;
  const fullPath = resolve(homedir(), file);
  if (!isFile(fullPath)) {
    throw new Error(
      `The sync configuration file '${fullPath}' does not exist. Please create it manually. ` +
        `The content format is as follows: ${JSON.stringify(dft)}`,
    );
  }
  return loadJsonObj<T>(fullPath, dft);
};

/**
 * 净化路径
 *
 * - null | undefined | '' | '/' => ''
 * - 移除头尾的 `/`
 *
 * @param path
 */
export const purgeHttpPath = (path?: string | null): string => {
  if (path == null || path === '' || path === '/') {
    return '';
  }
  const p = path.replace(/(^\/+|\/+$)/gm, '');
  if (p === '/') return '';
  return p;
};

/**
 * 转换 http 路径
 *
 * @param path
 */
export const convertHttpPath = (path: string): string => {
  return path.replace(/\\+/gm, '/');
};

/**
 * 转化上传路径，如果 path, basePath 传入为空字符、null、undefined 则会过滤掉
 *
 * @param file
 * @param path
 * @param basePath
 */
export const convertUploadPath = (
  file: string,
  path?: string | null,
  basePath?: string | null,
): string => {
  return [purgeHttpPath(basePath), purgeHttpPath(path), file]
    .filter(Boolean)
    .join('/');
};

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
export const fillZero = (v: number, length = 2): string => {
  return (v < 10 ? '0'.repeat(length - 1) : '') + v;
};

/**
 * 简单化日期事件格式化
 *
 * @param d
 */
export const dateFormat = (d: Date | undefined | null): string => {
  if (d == null) {
    return ' '.repeat(19);
  }
  return `${d.getFullYear()}-${fillZero(d.getMonth() + 1)}-${fillZero(
    d.getDate(),
  )} ${d.toLocaleTimeString()}`;
};

/**
 * （基于比较时间差）降解 Microsecond 单位
 *
 * @param iValue
 */
export const reduceMicrosecond = (iValue: number): string => {
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
};
