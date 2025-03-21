import { errMsg, notEmptyStr } from '@zenstone/ts-utils';
import color from 'ansi-colors';
import qiniu from 'qiniu';
import { syncFiles } from 'ver-sync';
import type {
  StoreHomedirKeyOptions,
  StoreQiniuConfig,
  StoreQiniuOptions,
} from 'ver-sync';
import {
  convertUploadPath,
  isHomedirKeyOptions,
  readHomedirKey,
} from 'ver-sync';

const defaultConfig = (): StoreQiniuConfig => ({
  ak: '',
  sk: '',
  bucket: '',
  baseUrl: '',
});

const verifyConfig = (
  key: string,
  data?: StoreQiniuConfig,
): StoreQiniuConfig => {
  if (data == null) {
    throw new Error(`Load qiniu store config ${color.yellow(key)} data null`);
  }
  const errors: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (!notEmptyStr(value)) {
      errors.push(`* ${color.cyanBright(key)} is required`);
      continue;
    }
    if (key === 'baseUrl') {
      try {
        new URL(value);
      } catch (err) {
        errors.push(
          `* ${color.cyanBright(key)}: ${errMsg(err) || 'try parse baseUrl failed'}`,
        );
      }
    }
  }
  if (errors.length) {
    console.log(
      `There are ${color.redBright(`${errors.length} error(s)`)} in qiniu store config ${color.yellowBright(key)}`,
    );
    for (const err of errors) {
      console.log(err);
    }
    process.exit(0);
  }
  return data;
};

const extractConfig = (
  opts: StoreHomedirKeyOptions | StoreQiniuConfig,
): StoreQiniuConfig => {
  if (isHomedirKeyOptions(opts)) {
    return verifyConfig(
      opts.key,
      readHomedirKey('qiniu', opts.key, defaultConfig()),
    );
  }
  return opts;
};

export const uploadQiniu = (
  { ak, sk, bucket }: StoreQiniuConfig,
  sourcePath: string,
  uploadPath: string,
): Promise<{ key: string; hash: string }> => {
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const scope = `${bucket}:${uploadPath}`;
  const options = { scope };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const token = putPolicy.uploadToken(mac);
  const config = new qiniu.conf.Config({
    zone: qiniu.zone.Zone_z2,
  });

  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();

  return new Promise((resolve, reject) => {
    formUploader.putFile(
      token,
      uploadPath,
      sourcePath,
      putExtra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        } else {
          if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(new Error(respBody?.error || 'Unknown error'));
          }
        }
      },
    );
  });
};

const storeQiniu = ({
  callback,
  path,
  withVer = true,
  ...opts
}: StoreQiniuOptions) => {
  const config = extractConfig(opts);

  if (!config.baseUrl) {
    throw new Error('You must specify the baseUrl');
  }
  const { host, pathname: basePath } = new URL(config.baseUrl);

  return syncFiles((file) => {
    return new Promise((resolve, reject) => {
      const uploadPath = convertUploadPath(
        withVer ? file.verPath : file.key,
        path,
        basePath,
      );
      uploadQiniu(config, file.path, uploadPath)
        .then(({ key }) => {
          resolve({
            ver: file.ver,
            hash: file.hash,
            url: `//${host}/${key}`,
            type: file.type,
          });
        })
        .catch(reject);
    });
  });
};

export default storeQiniu;
