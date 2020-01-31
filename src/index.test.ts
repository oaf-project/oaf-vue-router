// tslint:disable:no-expression-statement no-object-mutation no-duplicate-string no-empty

import VueRouter from "vue-router";
import { wrapRouter } from ".";

// HACK: wait for router wrapper to update DOM.
const waitForDomUpdate = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve));

beforeEach(() => {
  // Clear previous test's DOM.
  window.document.body.innerHTML = "";
  window.document.title = "";
});

describe("oaf-vue-router", () => {
  test("doesn't throw when wrapping and unwrapping router", () => {
    const router = new VueRouter();
    const unwrap = wrapRouter(router);
    unwrap();
  });

  test("sets the document title", async () => {
    const router = new VueRouter();
    const unwrap = wrapRouter(router, {
      setPageTitle: true,
      documentTitle: () => "test title",
    });

    expect(document.title).toBe("");

    router.push("/foo");

    await waitForDomUpdate();

    expect(document.title).toBe("test title");

    unwrap();
  });

  test("does not set the document title when setPageTitle is false", async () => {
    const router = new VueRouter();
    const unwrap = wrapRouter(router, {
      setPageTitle: false,
      documentTitle: () => "test title",
    });

    expect(document.title).toBe("");

    router.push("/foo");

    await waitForDomUpdate();

    expect(document.title).toBe("");

    unwrap();
  });

  test("leaves focus alone when repairFocus is false", async () => {
    const router = new VueRouter();
    const unwrap = wrapRouter(router, { repairFocus: false });

    const main = document.createElement("main");
    const mainH1 = document.createElement("h1");
    main.append(mainH1);
    const randomButton = document.createElement("button");
    main.append(randomButton);
    document.body.append(main);

    randomButton.focus();
    expect(document.activeElement).toBe(randomButton);

    router.push("/foo");

    await waitForDomUpdate();

    expect(document.activeElement).toBe(randomButton);

    unwrap();
  });
});
