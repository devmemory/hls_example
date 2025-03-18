export class Completer<T> {
  public readonly promise: Promise<T>;
  public complete!: (value: T | PromiseLike<T>) => void;
  public reject!: (reason?: any) => void;

  public constructor() {
      this.promise = new Promise<T>((res, rej) => {
          this.complete = res;
          this.reject = rej;
      });
  }
}