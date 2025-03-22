import {
  type ChangedRecord,
  convertUploadPath,
  type SyncFile,
  type SyncFiles,
  syncFiles,
} from '@semver-sync/sync';
import { errMsg } from '@zenstone/ts-utils';
import qiniu from 'qiniu';
import { loadConfig } from './config';
import type {
  QiniuResponse,
  StoreQiniuConfig,
  StoreQiniuInputOptions,
} from './types';

export const uploadQiniu = (
  conf: StoreQiniuConfig,
  opts: StoreQiniuInputOptions,
  sourcePath: string,
  uploadPath: string,
): Promise<{ key: string; hash: string }> => {
  const { ak, sk, bucket } = conf;

  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const scope = `${bucket}:${uploadPath}`;
  const options = { scope };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const token = putPolicy.uploadToken(mac);

  const regionId = conf.regionId || opts.regionId || 'z0';
  const config = new qiniu.conf.Config();
  config.regionsProvider = qiniu.httpc.Region.fromRegionId(regionId);
  opts.onConfig?.(config);

  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();

  return new Promise<QiniuResponse>((resolve, reject) => {
    formUploader.putFile(
      token,
      uploadPath,
      sourcePath,
      putExtra,
      (respErr, respBody: QiniuResponse, respInfo) => {
        if (respErr) {
          reject(respErr);
        } else {
          if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(
              new Error(errMsg(respErr || respBody?.error) || 'Unknown error'),
            );
          }
        }
      },
    );
  });
};

const storeQiniu =
  (opts: StoreQiniuInputOptions) =>
  // 上一层，只是 currying store options
  async (files: ChangedRecord): Promise<SyncFiles> => {
    const { path, withVer = true } = opts;
    const config = await loadConfig(opts);

    if (!config.baseUrl) {
      throw new Error('You must specify the baseUrl');
    }

    const baseUrl = new URL(config.baseUrl);
    const { host, pathname: basePath } = baseUrl;

    return syncFiles((file) => {
      return new Promise((resolve, reject) => {
        const uploadPath = convertUploadPath(
          withVer ? file.verPath : file.relativePath,
          path,
          basePath,
        );
        uploadQiniu(config, opts, file.path, uploadPath)
          .then(async (respBody: QiniuResponse) => {
            const syncFile: SyncFile = {
              ver: file.ver,
              hash: file.hash,
              url: `//${host}/${respBody.key}`,
              type: file.type,
            };
            const params = { file, syncFile, respBody, baseUrl };
            if (opts.makeUrl) syncFile.url = opts.makeUrl?.(params);
            await opts.onUpload?.(params);
            resolve(syncFile);
          })
          .catch((err) => {
            opts.onError?.(err);
            reject(err);
          });
      });
    })(files);
  };

export default storeQiniu;
