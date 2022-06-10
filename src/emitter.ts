import { Callback } from "./types";
import { isAsync } from "./utils";
/**
 * @class Emitter
 * @description The emitter class provides an interface for
 * listening and emitting custom events in a strongly typed way
 */
export default class Emitter<
  Listeners extends { [key in keyof Listeners]: Callback }
> {
  private _events: {
    [key in keyof Listeners]?: Array<Listeners[key]>;
  } = {};
  private _oneTimeEvents: {
    [key in keyof Listeners]?: Array<Listeners[key]>;
  } = {};

  /**
   * @method on
   * @description Bind event listeners
   * @param event Name of the event to listen to
   * @param listener to call on any Event
   * @example Emitter.on('EVENT_NAME', (parameter: ParameterType) => {})
   */
  on<T extends keyof Listeners>(event: T, listener: Listeners[T]) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event]!.push(listener);
    return listener;
  }

  /**
   * @method on
   * @description Bind event listeners
   * @param event Name of the event to listen to
   * @param listener to call on any Event
   * @example Emitter.on('EVENT_NAME', (parameter: ParameterType) => {})
   */
  once<T extends keyof Listeners>(event: T, listener: Listeners[T]) {
    if (!this._oneTimeEvents[event]) {
      this._oneTimeEvents[event] = [];
    }

    this._oneTimeEvents[event]!.push(listener);
    return listener;
  }

  /**
   * @method off
   * @description Removes an event listener from the listener box
   * @param event Name of the event to unsubscribe from
   * @param listener Listener function to remove
   * @example Emitter.off("EVENT_NAME", (parameter: ParameterType) => {})
   */
  off<T extends keyof Listeners>(event: T, listenerToRemove: Listeners[T]) {
    if (!this._events[event] && !this._oneTimeEvents[event]) {
      throw new Error(
        `Can't remove a listener. Event "${event.toString()}" doesn't exits.`
      );
    }

    const filteredListeners =
      this._events[event]?.filter(
        (listener: Listeners[T]) => listener !== listenerToRemove
      ) || [];

    const filteredOntimeListeners =
      this._oneTimeEvents[event]?.filter(
        (listener: Listeners[T]) => listener !== listenerToRemove
      ) || [];

    this._events[event] = filteredListeners;
    this._oneTimeEvents[event] = filteredOntimeListeners;

    return true;
  }

  /**
   * @method removeAllListeners
   * @description Removes all listeners from the listener box
   * @example Emitter.removeAllListeners()
   */
  removeAllListeners() {
    this._events = {};
    this._oneTimeEvents = {};
  }

  /**
   * @method emit
   * @description Emits an event to all listeners
   * @param event Name of the event to emit
   * @param data Data to provide to listeners
   * @example Emitter.emit('EVENT_NAME', {eventParam, otherParam})
   */
  protected emit<T extends keyof Listeners>(
    event: T,
    ...[data]: Parameters<Listeners[T]>
  ) {
    if (!this._events[event]) return;

    this._emit(this._events[event]!, data);

    if (!this._oneTimeEvents[event]) return;

    this._emit(this._oneTimeEvents[event]!, data)
      ?.then(() => {
        delete this._oneTimeEvents[event];
      })
      .catch(() => {
        delete this._oneTimeEvents[event];
      });
  }

  /**
   * @method _emit
   * @description Emits an event to all listeners that has been passed as argument
   * @param stack The stack of listeners to emit to
   * @returns a promise in case of async listeners
   */
  protected _emit<T extends keyof Listeners>(
    stack: Listeners[T][],
    data: Parameters<Listeners[T]>
  ) {
    if (isAsync(stack[0])) {
      return Promise.all(stack.map((listener) => listener()));
    }

    stack.forEach((listener) => listener(data));
  }

  /**
   * @method listenersCount
   * @description Returns the number of listeners for a given event
   * @param event Name of the event to emit
   * @returns The number of listeners for the event
   */
  listenersCount<T extends keyof Listeners>(event: T) {
    return (
      (this._events[event]?.length || 0) +
      (this._oneTimeEvents[event]?.length || 0)
    );
  }
}
