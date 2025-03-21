# @ver-sync/store-qiniu

七牛云存储的实现。

```ts
import sync from 'ver-sync';
import storeQiniu from '@ver-sync/store-qiniu';

sync({
  cwd: process.cwd(),
  entry: 'dist',
  logFile: 'logs/sync.test.json',
  store: storeQiniu({ key: 'my-repo' })
}).catch(console.error);
```

`my-repo` 表示对应的七牛配置文件，其文件路径，为系统用户目录
`sync-qiniu-my-repo.json`。

Windows 为例，则是 `C:\Users\username\sync-qiniu-my-repo.json`。

json 配置文件格式如下：

```json
{
  "ak": "qiniu-access-key",
  "sk": "qiniu-secret-key",
  "bucket": "bucket-name",
  "baseUrl": "base-url"
}
```

`baseUrl` ，请使用完全的 URL ，如：`http://domain.com/path` ，在生成实际的 URL 时，会转为
`//domain.com/path/filename.ext`。所以不用纠结于 `baseUrl` 到底应该是 http 还是
https 开头。

可以通过 `baseUrl` 指定一个目录，然后可以通过 `storeQiniu` 的参数再指定一个路径。

假定配置里的 baseUrl 为：`http://domain.com/path`

```ts
import storeQiniu from '@ver-sync/store-qiniu';

storeQiniu({
  key: 'repo-name',
  path: 'a-project',
  // 强制去掉版本号后缀，有些同步，只需要确保同名覆盖，不需要管版本号
  // 默认为 true
  withVer: false,
});
```

则对应生成最终的 url 为：`http://domain.com/path/a-project/filename.ext`

