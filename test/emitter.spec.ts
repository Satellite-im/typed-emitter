import { Emitter } from "../src/index";

type TestListeners = {
  data: (params: { first: string; second: string }) => void;
  asyncData: (params: { first: string }) => Promise<void>;
};

class MyEmitter extends Emitter<TestListeners> {
  onData() {
    this.emit("data", { first: "first", second: "second" });
  }

  onAsyncData() {
    this.emit("asyncData", { first: "first" });
  }
}

describe("Emitter", () => {
  let emitter: MyEmitter;
  beforeEach(() => {
    emitter = new MyEmitter();
  });

  it("should be defined", () => {
    expect(emitter).toBeDefined();
  });

  it("should be able to add listeners", () => {
    emitter.on("data", ({ first, second }) => {
      expect(first).toBe("first");
      expect(second).toBe("second");
    });

    expect(emitter.listenersCount("data")).toBe(1);
  });

  it("should be able to emit events", () => {
    let firstListenerCalled = false;
    let secondListenerCalled = false;

    emitter.on("data", ({ first, second }) => {
      expect(first).toBe("first");
      expect(second).toBe("second");

      firstListenerCalled = true;
    });

    emitter.on("data", ({ first, second }) => {
      expect(first).toBe("first");
      expect(second).toBe("second");

      secondListenerCalled = true;
    });

    expect(emitter.listenersCount("data")).toBe(2);

    emitter.onData();

    expect(firstListenerCalled).toBe(true);
    expect(secondListenerCalled).toBe(true);
  });

  it("should be able to add async listeners", () => {
    emitter.on("asyncData", async ({ first }) => {
      expect(first).toBe("first");
    });

    expect(emitter.listenersCount("asyncData")).toBe(1);
  });

  it("should be able to emit async events", () => {
    let firstListenerCalled = false;
    let secondListenerCalled = false;

    emitter.on("asyncData", async ({ first }) => {
      expect(first).toBe("first");

      firstListenerCalled = true;
    });

    emitter.on("asyncData", async ({ first }) => {
      expect(first).toBe("first");

      secondListenerCalled = true;
    });

    expect(emitter.listenersCount("asyncData")).toBe(2);

    emitter.onAsyncData();

    expect(firstListenerCalled).toBe(true);
    expect(secondListenerCalled).toBe(true);
  });

  it("should be able to remove listeners", () => {
    const firstListener = emitter.on("data", ({ first, second }) => {
      expect(first).toBe("first");
      expect(second).toBe("second");
    });
    const secondListener = emitter.on("data", ({ first, second }) => {
      expect(first).toBe("first");
      expect(second).toBe("second");
    });

    expect(emitter.listenersCount("data")).toBe(2);

    emitter.off("data", firstListener);

    expect(emitter.listenersCount("data")).toBe(1);

    emitter.off("data", secondListener);

    expect(emitter.listenersCount("data")).toBe(0);
  });

  it("should be possible to remove all listeners", () => {
    emitter.on("data", ({ first, second }) => {
      expect(first).toBe("first");
      expect(second).toBe("second");
    });
    emitter.on("data", ({ first, second }) => {
      expect(first).toBe("first");
      expect(second).toBe("second");
    });
    emitter.on("asyncData", async ({ first }) => {
      expect(first).toBe("first");
    });
    emitter.on("asyncData", async ({ first }) => {
      expect(first).toBe("first");
    });

    expect(emitter.listenersCount("data")).toBe(2);
    expect(emitter.listenersCount("asyncData")).toBe(2);

    emitter.removeAllListeners();

    expect(emitter.listenersCount("data")).toBe(0);
    expect(emitter.listenersCount("asyncData")).toBe(0);
  });
});
