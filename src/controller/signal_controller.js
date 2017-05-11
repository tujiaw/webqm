let __instance = (function() {
  let instance;
  return (newInstance) => {
    if (newInstance) {
      instance = newInstance;
    }
    return instance;
  }
}());

class Signals {
  constructor() {
    if (__instance()) {
      return __instance();
    }

    this.subscribers = new Map([['any', []]]);
    __instance(this);
  }

  on(cmd, fn) {
    let subs = this.subscribers;
    if (!subs.get(cmd)) return subs.set(cmd, [fn]);
    subs.set(cmd, (subs.get(cmd).push(fn)));
  }

  emit(cmd, data) {
    for (let fn of this.subscribers.get(cmd)) {
      fn(data);
    }
  }
}

const SignalController = new Signals();
export default SignalController;