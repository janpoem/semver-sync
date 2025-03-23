import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { join } from 'node:path/posix';
import { createApi } from './api';
import { loadConfig } from './config';

describe('github-api', () => {
  const baseDir = 'tmp';
  let lastPath: string | undefined;
  const pathsMap = new Map<string, string>();

  const randomInt = (min: number, max: number) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil) + minCeil);
  };

  const createFile = () => {
    const timestamp = Date.now();
    const filename = `test_${timestamp}_${randomInt(100000, 999999)}.json`;
    const path = join(baseDir, filename);
    const content = JSON.stringify({ filename, path, timestamp });
    return { path, content };
  };

  const addRecord = (path: string, content: string) => {
    lastPath = path;
    pathsMap.set(path, content);
  };

  beforeAll(() => {});

  afterAll(async () => {
    // const size = pathsMap.size;
    // if (size > 0) {
    //   for await (const [path] of pathsMap.entries()) {
    //     await api.deleteFile(path);
    //   }
    //   pathsMap.clear();
    //   console.log(`deleting ${size} path(s) from github...`);
    // }
  });

  // 开始下面的测试前，请先确保测试的仓库，对应的资源存在。
  const input = { key: 'test', branch: 'test' };
  const api = createApi(loadConfig(input), input);

  describe('putFile', () => {
    it('put a new file', async () => {
      const { path, content } = createFile();
      const res = await api.putFile(path, content);
      addRecord(path, content);

      expect(res.content.type).toBe('file');
      expect(res.content.path).toBe(path);
    });

    // it('update a file', async () => {
    //   const { path, content } = createFile();
    //   const res = await api.putFile(path, content);
    //   const sha = res.content.sha;
    //   addRecord(path, content);
    //
    //   expect(res.content.type).toBe('file');
    //   expect(res.content.path).toBe(path);
    //
    //   const newContent = JSON.stringify(`update ${dateFormat(new Date())}`);
    //   const newRes = await api.putFile(path, newContent);
    //   const newSha = newRes.content.sha;
    //
    //   expect(sha).not.toEqual(newSha);
    // });
  });

  // describe('getPath', () => {
  //   it('fetch an existing file', async () => {
  //     if (lastPath != null) {
  //       const res = await api.getPath(lastPath);
  //       expect(res.type).toBe('file');
  //       expect(res.name).toBeDefined();
  //       expect(res.sha).toBeDefined();
  //     }
  //   });
  //
  //   it('fetch an existing dir', async () => {
  //     const res = await api.getPath(baseDir);
  //     expect(res.type).toBe('dir');
  //     expect(res.entries).toBeDefined();
  //     expect(res.entries).toBeArray();
  //   });
  //
  //   it('fetch a non-existent path', () => {
  //     expect(async () => await api.getPath('nothing')).toThrow('Not Found');
  //   });
  // });
});
