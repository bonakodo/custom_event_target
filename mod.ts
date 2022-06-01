export class CustomEventTarget<
  E extends { [type: string]: unknown },
> extends EventTarget {
  constructor() {
    super();
  }

  dispatchEvent<T extends E[keyof E]>(event: Event | CustomEvent<T>): boolean {
    const originalDispatchEvent = super.dispatchEvent;
    const { type } = event;
    if ('detail' in event && type !== '*') { // do not dispatch events with explicit '*' type twice
      const asteriskEvent = new CustomEvent('*', { detail: event.detail });
      originalDispatchEvent.call(this, asteriskEvent);
    }
    return originalDispatchEvent.call(this, event);
  }

  emit<K extends keyof E>(
    type: K,
    detail?: E[K],
    options?: EventInit,
  ): boolean {
    if (typeof type !== 'string') throw new Error('Invalid event type');
    const event = new CustomEvent(type, {
      ...options,
      detail,
    });
    return this.dispatchEvent(event);
  }

  all<T extends E[keyof E]>(allEventsListener: (detail: T) => void) {
    const listener = (evt: CustomEvent<T> | Event) => {
      if ('detail' in evt) allEventsListener(evt.detail);
    };
    this.addEventListener('*', listener);
    return listener;
  }

  on<K extends keyof E>(
    type: K,
    customEventListener: (detail: E[K]) => void,
  ) {
    if (typeof type !== 'string') throw new Error('Invalid event type');
    const listener = (evt: CustomEvent<E[K]> | Event) => {
      if ('detail' in evt) customEventListener(evt.detail);
    };
    this.addEventListener(type, listener);
    return listener;
  }

  off<K extends keyof E>(
    type: K,
    listener: (evt: Event) => void,
  ): this {
    if (typeof type !== 'string') throw new Error('Invalid event type');
    this.removeEventListener(type, listener);
    return this;
  }
}
