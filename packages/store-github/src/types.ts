import type { ChangedFile, StoreKeyOptions, SyncFile } from '@semver-sync/sync';

// @see https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2022-11-28#media-types
export const MediaType = {
  raw: 'application/vnd.github.raw+json',
  html: 'application/vnd.github.html+json',
  object: 'application/vnd.github.object+json',
  normal: 'application/vnd.github+json',
  default: 'application/json',
} as const;

export namespace Github {
  export type Error = {
    message: string;
    documentation_url: string;
    status: `${number}`;
  };

  export type MediaTypes = keyof typeof MediaType;

  export type Author = {
    date: string;
    name: string;
    email: string;
  };

  export type Committer = {
    name: string;
    email: string;
  };

  export type CommitterWithDate = Committer & {
    date: string;
  };

  export type Tree = {
    url: string;
    sha: string;
  };

  export type Parent = {
    url: string;
    html_url: string;
    sha: string;
  };

  export type Links = { self: string; git: string; html: string };

  export type Verification = {
    verified: boolean;
    reason: string;
    signature: string | null;
    payload: string | null;
    verified_at: string | null;
  };

  export type ContentType = 'file' | 'dir' | string;

  // @see https://docs.github.com/en/rest/repos/contents
  export type Content = {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: ContentType;
    _links: Links;
  };

  export type FileContent = Omit<Content, 'type'> & {
    type: 'file';
  };

  export type ObjectContent = Content & {
    entries?: Content[];
  };

  export type Commit = {
    sha: string;
    node_id: string;
    url: string;
    html_url: string;
    author: Author;
    committer: CommitterWithDate;
    message: string;
    tree: Tree;
    parents: Parent[];
    verification: Verification;
  };

  export type GetPath = ObjectContent;

  export type PutFile = {
    content: FileContent;
    commit: Commit;
  };

  export type DeleteFile = {
    content: null;
    commit: Commit;
  };
}

export namespace StoreGithub {
  export type Config = {
    owner: string;
    repo: string;
    token: string;
    'committer.name': string;
    'committer.email': string;
    baseUrl?: string;
    branch?: string;
    proxy?: string;
  };

  export type OnUploadParams = {
    baseUrl?: URL;
    file: ChangedFile;
    syncFile: SyncFile;
    result: Github.PutFile;
  };

  export type Options = {
    path?: string;
    withVer?: boolean;
    branch?: string;
    proxy?: string;
    // onConfig?: (conf: qiniu.conf.Config) => void;
    makeUrl?: (params: OnUploadParams) => string;
    onUpload?: (params: OnUploadParams) => void | Promise<void>;
    onError?: (err: unknown) => void;
  };

  export type Input = StoreKeyOptions & Options;
}
