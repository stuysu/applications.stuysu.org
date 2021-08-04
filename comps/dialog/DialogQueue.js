import EventEmitter from "events";

class DialogQueue {
  queue = [];
  isActive = false;
  defaultProps = {};
  emitter;

  constructor(defaultProps) {
    this.defaultProps = defaultProps;
    this.emitter = new EventEmitter();
  }

  static getPromise() {
    const obj = {};

    obj.Promise = new Promise((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = reject;
    });

    return obj;
  }

  async startQueue() {
    if (this.isActive || this.queue.length === 0) {
      return;
    }

    this.isActive = true;

    while (this.queue.length > 0) {
      const displayObj = this.queue.shift();

      this.emitter.emit("display", displayObj);

      await displayObj.promise.Promise;
    }

    this.isActive = false;
  }

  add(info) {
    const promiseObj = DialogQueue.getPromise();

    const displayObj = {
      ...info,
      promise: promiseObj,
    };

    this.queue.push(displayObj);

    if (!this.isActive) {
      this.startQueue();
    }

    return promiseObj.Promise;
  }
}

export default DialogQueue;
