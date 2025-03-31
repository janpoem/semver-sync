import { convertUploadPath, type SyncFile, syncFiles } from '@semver-sync/sync';
import { errMsg } from '@zenstone/ts-utils';
import qiniu from 'qiniu';
import { loadConfig } from './config';
import type { StoreQiniu } from './types';

type Config = StoreQiniu.Config;
type Input = StoreQiniu.Input;
type UploadResponse = StoreQiniu.UploadResponse;

const uploadQiniu = (
  conf: Config,
  opts: Input,
  sourcePath: string,
  uploadPath: string,
): Promise<UploadResponse> => {
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

  return new Promise<UploadResponse>((resolve, reject) => {
    formUploader.putFile(
      token,
      uploadPath,
      sourcePath,
      putExtra,
      (respErr, respBody: UploadResponse, respInfo) => {
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

export const storeQiniu = (opts: Input) => {
  const { path, withVer = true } = opts;
  const config = loadConfig(opts);

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
        .then(async (respBody: UploadResponse) => {
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
  });
};

export * from './types';
