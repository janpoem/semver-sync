# @semver-sync/sync

[![version](https://img.shields.io/npm/v/@semver-sync/sync?style=for-the-badge)](https://www.npmjs.com/package/@semver-sync/sync)
[![dt](https://img.shields.io/npm/dt/@semver-sync/sync?style=for-the-badge)](https://www.npmjs.com/package/@semver-sync/sync)

Synchronize files based on self-managed version comparison, automatically
incrementing version numbers.

基于本地日志实现文件同步的自管理，并实现版本号自增。

![image01.png](https://static.kephp.com/assets/semver-sync/image01.png)

![image02.png](https://static.kephp.com/assets/semver-sync/image02.png)

```bash
npm install @semver-sync/sync
# or
bun add @semver-sync/sync
```

如果是七牛云存储，可以使用：

```bash
bun add @semver-sync/sync @semver-sync/store-qiniu
# or
npm install @semver-sync/sync @semver-sync/store-qiniu
```

后续会陆续添加一些必要的 store（有空的话）。

基于 `@semver-sync/sync` 的 `syncFiles`
自己[去做实现](https://github.com/janpoem/ver-sync/blob/main/packages/semver-sync/README.md#%E5%90%8C%E6%AD%A5%E6%96%87%E4%BB%B6%E5%AE%9E%E7%8E%B0)
也很简单。

## 说明文档

- [@semver-sync/sync](https://github.com/janpoem/semver-sync/tree/main/packages/sync)

### stores

- [@semver-sync/store-qiniu](https://github.com/janpoem/semver-sync/tree/main/packages/store-qiniu)
