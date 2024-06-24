import { EventEmitter } from 'events';

export class TypedEventEmitter<
  TEvents extends {
    [K in keyof TEvents]: TEvents[K];
  },
> {
  private emitter = new EventEmitter();

  emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArg: Parameters<TEvents[TEventName]>
  ) {
    this.emitter.emit(eventName, ...(eventArg as unknown as []));
  }

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: TEvents[TEventName],
  ) {
    this.emitter.on(eventName, handler);
  }

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: TEvents[TEventName],
  ) {
    this.emitter.off(eventName, handler);
  }
}
