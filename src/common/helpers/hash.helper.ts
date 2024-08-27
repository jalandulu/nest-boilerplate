import { compare, hash } from 'bcrypt';

export namespace Hash {
  export async function make(
    value: string,
    saltOrRound: number = 10,
  ): Promise<string> {
    return await hash(value, saltOrRound);
  }

  export async function verify(
    data: string,
    encrypted: string,
  ): Promise<boolean> {
    return await compare(data, encrypted);
  }
}
