import { ISignSignedUrlOption, IVerifySignedUrlOption } from 'src/cores/interfaces';

export abstract class ISignedUrlServiceProvider {
  abstract sign(url: string, options?: ISignSignedUrlOption): string;

  abstract verify(
    url: string,
    options?: IVerifySignedUrlOption,
  ): {
    url: string;
    data: string | null;
  } | null;
}
