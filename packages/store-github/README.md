# @semver-sync/store-github

Github 仓库存储实现，私有仓库也可以（非 public）。

为何会用 Github 做存储呢？因为他真的可以，而且基于 git 的一些特性，可操作性和管理便利性还很高。

虽然有 git 的机制，不过我们依旧保留自增版本号的机制，因为对于 http
请求，通知更新缓存的有效机制就是 url 的变化。

```ts
import sync from '@semver-sync/sync';
import { storeQiniu } from '@semver-sync/store-github';

sync({
  cwd: process.cwd(),
  entry: 'dist',
  logFile: 'logs/sync.test.json',
  store: storeGithub({
    key: 'test',
    branch: 'test',
    proxy: 'http://xxxx:yyyy',
    // 上传成功时的回调
    onUpload: (params: OnUploadParams) => void 0,
    // 上传出错时的回调
    onError: (err: unknown) => void 0,
    // 手动控制生成的 url，必须返回一个字符串
    makeUrl: (params: OnUploadParams) => '',
  }),
}).catch(console.error);
```

`key` 对应是 github 仓库配置，默认目录在 `%UserProfile%`，对应的文件为：
`%UserProfile%/sync-github-${key}.json`。

配置可用格式如下

```json5
{
  "owner": "owner",
  "repo": "repo",
  "token": "token",
  "committer.name": "username",
  "committer.email": "email",
  // 可选，对外 URL，与 github 仓库存储无关
  "baseUrl": "",
  // 可选，分支名称
  "branch": "test",
  // 可选，配置代理
  "proxy": "http://localhost:1080"
}
```

因为众所周知的原因，github 在某个时空里是不存在的，所以请求库该用了 `undici`
，以便于统一梯子的使用。
