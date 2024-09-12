export namespace String {
  export function extractURL(url: string, param: string): string | null {
    const searchParams = new URLSearchParams(url.split('?')[1]);
    return searchParams.get(param);
  }
}
