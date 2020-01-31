// tslint:disable:no-expression-statement no-object-mutation no-duplicate-string no-empty

import { createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import { wrapRouter } from ".";

// HACK: wait for router wrapper to update DOM.
const waitForDomUpdate = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve));

beforeEach(() => {
  // Clear previous test's DOM.
  window.document.body.innerHTML = "";
  window.document.title = "";
  document.location.hash = "";
});

describe("oaf-vue-router", () => {
  test("doesn't throw when wrapping and unwrapping router", () => {
    const Vue = createLocalVue();
    Vue.use(VueRouter);
    const router = new VueRouter({ mode: "hash" });
    const app = new Vue({ router });
    const unwrap = wrapRouter(router);

    unwrap();
    app.$destroy();
  });

  test("sets the document title after initial render", async () => {
    const Vue = createLocalVue();
    Vue.use(VueRouter);
    const router = new VueRouter({
      mode: "hash",
      routes: [{ path: "/" }, { path: "/foo" }],
    });
    const app = new Vue({ router });
    const unwrap = wrapRouter(router, {
      setPageTitle: true,
      documentTitle: () => "test title",
    });

    expect(document.title).toBe("");

    await waitForDomUpdate();

    expect(document.title).toBe("test title");

    unwrap();
    app.$destroy();
  });

  test("sets the document title after a navigation", async () => {
    const Vue = createLocalVue();
    Vue.use(VueRouter);
    const router = new VueRouter({
      mode: "hash",
      routes: [{ path: "/" }, { path: "/foo" }],
    });
    const app = new Vue({ router });
    const unwrap = wrapRouter(router, {
      setPageTitle: true,
      documentTitle: () => "test title",
    });

    expect(document.title).toBe("");

    await router.push("/foo");

    await waitForDomUpdate();

    expect(document.title).toBe("test title");

    unwrap();
    app.$destroy();
  });

  test("does not set the document title when setPageTitle is false", async () => {
    const Vue = createLocalVue();
    Vue.use(VueRouter);
    const router = new VueRouter({
      mode: "hash",
      routes: [{ path: "/" }, { path: "/foo" }],
    });
    const app = new Vue({ router });
    const unwrap = wrapRouter(router, {
      setPageTitle: false,
      documentTitle: () => "test title",
    });

    expect(document.title).toBe("");

    await router.push("/foo");

    await waitForDomUpdate();

    expect(document.title).toBe("");

    unwrap();
    app.$destroy();
  });

  test("leaves focus alone when repairFocus is false", async () => {
    const Vue = createLocalVue();
    Vue.use(VueRouter);
    const router = new VueRouter({
      mode: "hash",
      routes: [{ path: "/" }, { path: "/foo" }],
    });
    const app = new Vue({ router });
    const unwrap = wrapRouter(router, { repairFocus: false });

    const main = document.createElement("main");
    const mainH1 = document.createElement("h1");
    main.append(mainH1);
    const randomButton = document.createElement("button");
    main.append(randomButton);
    document.body.append(main);

    randomButton.focus();
    expect(document.activeElement).toBe(randomButton);

    await router.push("/foo");

    await waitForDomUpdate();

    expect(document.activeElement).toBe(randomButton);

    unwrap();
    app.$destroy();
  });

  test("moves focus to body when primary focus target cannot be focused", async () => {
    const Vue = createLocalVue();
    Vue.use(VueRouter);
    const router = new VueRouter({
      mode: "hash",
      routes: [{ path: "/" }, { path: "/foo" }],
    });
    const app = new Vue({ router });
    const unwrap = wrapRouter(router);

    const main = document.createElement("main");
    const mainH1 = document.createElement("h1");
    mainH1.focus = () => {};
    main.append(mainH1);
    const randomButton = document.createElement("button");
    main.append(randomButton);
    document.body.append(main);

    randomButton.focus();
    expect(document.activeElement).toBe(randomButton);

    await router.push("/foo");

    await waitForDomUpdate();

    expect([document.body, document.documentElement]).toContain(
      document.activeElement,
    );

    unwrap();
    app.$destroy();
  });

  test("moves focus to the primary focus target", async () => {
    const Vue = createLocalVue();
    Vue.use(VueRouter);
    const router = new VueRouter({
      mode: "hash",
      routes: [{ path: "/" }, { path: "/foo" }],
    });
    const app = new Vue({ router });
    const unwrap = wrapRouter(router);

    const main = document.createElement("main");
    const mainH1 = document.createElement("h1");
    main.append(mainH1);
    document.body.append(main);

    expect([document.body, document.documentElement]).toContain(
      document.activeElement,
    );

    await router.push({ path: "/foo" });

    await waitForDomUpdate();

    expect(document.activeElement).toBe(mainH1);

    unwrap();
    app.$destroy();
  });
});
