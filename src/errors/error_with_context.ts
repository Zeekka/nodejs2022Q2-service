export class ErrorWithContext extends Error {
  private readonly context: any;

  constructor(message: string, context: any) {
    super(message);
    this.context = context;
  }

  getContext(): string {
    return this.context;
  }
}
