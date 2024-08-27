export namespace Formatter {
  export function name(value: string): string {
    return value
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }

  export function email(value: string): string {
    return value.toLowerCase().trim();
  }

  export function padNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }
}
