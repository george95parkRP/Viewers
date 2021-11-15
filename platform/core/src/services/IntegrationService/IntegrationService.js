import EVENTS from './EVENTS';
import guid from '../../utils/guid';

class IntegrationService {
  constructor() {
    this.listeners = {};
    Object.defineProperty(this, 'EVENTS', {
      value: EVENTS,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  /**
   * Subscribe to measurement updates.
   *
   * @param {string} eventName The name of the event
   * @param {Function} callback Events callback
   * @return {Object} Observable object with actions
   */
  subscribe(eventName, callback) {
    if (this._isValidEvent(eventName)) {
      const listenerId = guid();
      const subscription = { id: listenerId, callback };

      console.info(`Subscribing to '${eventName}'.`);
      if (Array.isArray(this.listeners[eventName])) {
        this.listeners[eventName].push(subscription);
      } else {
        this.listeners[eventName] = [subscription];
      }

      return {
        unsubscribe: () => this._unsubscribe(eventName, listenerId),
      };
    } else {
      throw new Error(`Event ${eventName} not supported.`);
    }
  }

  /**
   * Unsubscribe to measurement updates.
   *
   * @param {string} eventName The name of the event
   * @param {string} listenerId The listeners id
   * @return void
   */
  _unsubscribe(eventName, listenerId) {
    if (!this.listeners[eventName]) {
      return;
    }

    const listeners = this.listeners[eventName];
    if (Array.isArray(listeners)) {
      this.listeners[eventName] = listeners.filter(
        ({ id }) => id !== listenerId
      );
    } else {
      this.listeners[eventName] = undefined;
    }
  }

  /**
   * Broadcasts measurement changes.
   *
   * @param {string} accession The exam's accession number
   * @param {string} eventName The event name
   * @return void
   */
  _broadcastChange(eventName, data) {
    const hasListeners = Object.keys(this.listeners).length > 0;
    const hasCallbacks = Array.isArray(this.listeners[eventName]);

    if (hasListeners && hasCallbacks) {
      this.listeners[eventName].forEach(listener => {
        listener.callback({ data });
      });
    }
  }

  /**
   * Check if a given measurement service event is valid.
   *
   * @param {string} eventName The name of the event
   * @return {boolean} Event name validation
   */
  _isValidEvent(eventName) {
    return Object.values(this.EVENTS).includes(eventName);
  }
}

export default IntegrationService;
