import { errMsg, notEmptyStr } from '@zenstone/ts-utils';
import { isNumberVal } from '@zenstone/ts-utils/number';
import { isInferObj } from '@zenstone/ts-utils/object';
import { ProxyAgent, request } from 'undici';
import type BodyReadable from 'undici/types/readable';
import { type Github, MediaType, type StoreGithub } from './types';

type Config = StoreGithub.Config;
type Input = StoreGithub.Input;

const unknownErr = 'Unknown error';

export const extractJson = async <T>(
  resp: BodyReadable,
  valid?: (it: unknown) => it is T,
): Promise<T> => {
  const text = await resp.text();
  if (!text) throw new Error('Response text empty!');
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error(`JSON parse error: ${errMsg(err) || unknownErr}`);
  }
  if (valid?.(json) === false) {
    throw new Error('Response json is invalid');
  }
  return json as T;
};

export const isGithubError = (obj: unknown) =>
  isInferObj<Github.Error>(
    obj,
    (it) => notEmptyStr(it.message) && isNumberVal(it.status),
  );

export const createApi = (config: Config, opts: Input) => {
  const proxy = opts.proxy || config.proxy;
  const branch = opts.branch || config.branch;
  const apiBaseUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/`;
  const basicHeaders: [string, string][] = [
    ['authorization', `Bearer ${config.token}`],
    ['X-GitHub-Api-Version', '2022-11-28'],
    [
      'user-agent',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    ],
  ];

  const getProxyDispatcher = () => {
    if (notEmptyStr(proxy)) return new ProxyAgent(proxy);
  };

  const dateStr = () => {
    // 很奇怪的，为什么 bun test 显示的时区是 UTC，0
    // bun run 显示是 Asia/Shanghai -480
    return new Date().toLocaleString();
  };

  const isRespOk = (statusCode: number, json: unknown) =>
    statusCode < 400 && !isGithubError(json);

  const makeCommitBody = <T = object>(
    message: string,
    data?: T,
  ): Record<string, unknown> => ({
    message,
    committer: {
      name: config['committer.name'],
      email: config['committer.email'],
    },
    ...data,
  });

  const makeAcceptHeader = (accept: Github.MediaTypes): [string, string] => [
    'accept',
    MediaType[accept],
  ];

  /**
   * 获取仓库路径的信息
   *
   * @see https://docs.github.com/en/rest/repos/contents#get-repository-content
   * @param path
   */
  const getPath = async (path: string) => {
    const url = new URL(path, apiBaseUrl);
    if (notEmptyStr(branch)) {
      url.searchParams.set('ref', branch);
    }

    const { statusCode, body } = await request(url, {
      dispatcher: getProxyDispatcher(),
      headers: new Headers([makeAcceptHeader('object'), ...basicHeaders]),
    });

    const json = await extractJson(body);
    if (isRespOk(statusCode, json)) return json as Github.GetPath;
    throw new Error(errMsg(json) || unknownErr);
  };

  /**
   * 根据路径向仓库写入文件
   *
   * 会自动检查仓库是否存在该文件，如果文件存在，会自动取 sha 来提交（保证覆盖成功）
   *
   * content 为未经过 base64encode 的原始内容，只能是字符串类型
   *
   * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   * @param repoPath
   * @param content
   */
  const putFile = async (repoPath: string, content: string) => {
    let sha: string | undefined;
    let method = 'create';
    try {
      const res = await getPath(repoPath);
      if (res.type === 'dir') {
        throw new Error('put-file path in repo is a directory!');
      }
      if (res.type !== 'file') {
        throw new Error('put-file path in repo is not a file!');
      }
      sha = res.sha;
      method = 'update';
    } catch (err) {}

    const url = new URL(repoPath, apiBaseUrl);

    const data = makeCommitBody(`${method} file ${repoPath} at ${dateStr()}`, {
      content: Buffer.from(content).toString('base64'),
    });

    if (notEmptyStr(branch)) data.branch = branch;
    if (notEmptyStr(sha)) data.sha = sha;

    const { statusCode, body } = await request(url, {
      dispatcher: getProxyDispatcher(),
      method: 'put',
      body: JSON.stringify(data),
      headers: new Headers([makeAcceptHeader('object'), ...basicHeaders]),
    });

    const json = await extractJson(body);
    if (isRespOk(statusCode, json)) return json as Github.PutFile;
    throw new Error(errMsg(json) || unknownErr);
  };

  /**
   * 删除已存在的文件
   *
   * 一般用不到，只用于确保测试的完整性
   *
   * @see https://docs.github.com/en/rest/repos/contents?#delete-a-file
   * @param path
   */
  const deleteFile = async (path: string) => {
    const { sha, type } = await getPath(path);
    if (type === 'dir') {
      throw new Error('delete-file will not delete a directory!');
    }
    if (type !== 'file') {
      throw new Error('delete-file only supports remove a file!');
    }

    const url = new URL(path, apiBaseUrl);
    const data = makeCommitBody(`delete file ${path} at ${dateStr()}`, { sha });
    if (notEmptyStr(branch)) data.branch = branch;

    const { statusCode, body } = await request(url, {
      dispatcher: getProxyDispatcher(),
      method: 'delete',
      body: JSON.stringify(data),
      headers: new Headers([makeAcceptHeader('object'), ...basicHeaders]),
    });

    const json = await extractJson(body);
    if (isRespOk(statusCode, json)) return json as Github.DeleteFile;
    throw new Error(errMsg(json) || unknownErr);
  };

  return {
    getPath,
    putFile,
    deleteFile,
  };
};
