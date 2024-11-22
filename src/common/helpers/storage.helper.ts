import { dirpaths, paths } from 'src/cores/consts';
import { StorageCode } from 'src/cores/enums';

export namespace Storage {
  export type DirnameType = (typeof dirpaths)[number]['type'];
  export type DirpathType = (typeof dirpaths)[number]['type'];

  export function path(code: StorageCode): string {
    return paths.find((p) => p.code === code).path;
  }

  export function dirpath(type: DirpathType | string): string {
    const dirpath = dirpaths.find((p) => p.type === type);
    if (!dirpath) {
      return type;
    }

    return dirpath.dirpath;
  }
}
