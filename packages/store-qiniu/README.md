# @semver-sync/store-qiniu

七牛云存储的实现。

```ts
import sync from '@semver-sync/sync';
import storeQiniu from '@semver-sync/store-qiniu';

type OnUploadParams = {
  baseUrl: URL;
  file: ChangedFile;
  syncFile: SyncFile;
  respBody: QiniuResponse;
};

sync({
  cwd: process.cwd(),
  entry: 'dist',
  logFile: 'logs/sync.test.json',
  store: storeQiniu({
    key: 'my-repo',
    // 七牛云存储区域，请根据自己的仓库情况设定，为空时默认为 z0
    regionId: '',
    // 对七牛云配置进行微调
    onConfig: (conf: qiniu.conf.Config) => void 0,
    // 上传成功时的回调
    onUpload: (params: OnUploadParams) => void 0,
    // 上传出错时的回调
    onError: (err: unknown) => void 0,
    // 手动控制生成的 url，必须返回一个字符串
    makeUrl: (params: OnUploadParams) => '',
  }),
}).catch(console.error);
```

`regionId`
取值可参考 [七牛云存储区域文档](https://developer.qiniu.com/kodo/1671/region-endpoint-fq)

- `z0` - 华东-浙江
- `cn-east-2` - 华东-浙江2
- `z1` - 华北-河北
- `z2` - 华南-广东
- `cn-northwest-1` - 西北-陕西1
- `na0` - 北美-洛杉矶
- `as0` - 亚太-新加坡（原东南亚）
- `ap-southeast-2` - 亚太-河内
- `ap-southeast-3` - 亚太-胡志明

### key 说明

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
import storeQiniu from '@semver-sync/store-qiniu';

storeQiniu({
  key: 'repo-name',
  path: 'a-project',
  // 强制去掉版本号后缀，有些同步，只需要确保同名覆盖，不需要管版本号
  // 默认为 true
  withVer: false,
});
```

则对应生成最终的 url 为：`http://domain.com/path/a-project/filename.ext`

`key` 可以也是一个函数，返回一个字符串，表示对应的配置文件存储路径。

