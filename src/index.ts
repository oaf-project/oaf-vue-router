import {
  createOafRouter,
  defaultSettings as oafRoutingDefaultSettings,
  RouterSettings,
} from "oaf-routing";
import VueRouter, { Route } from "vue-router";

// tslint:disable-next-line: no-commented-code
// tslint:disable: no-expression-statement
// tslint:disable: object-literal-sort-keys
// tslint:disable: no-if-statement

export { RouterSettings } from "oaf-routing";

export const defaultSettings: RouterSettings<Route> = {
  ...oafRoutingDefaultSettings,
  // TODO support pop page state restoration.
  restorePageStateOnPop: false,
  // We're not restoring page state ourselves so leave this enabled.
  disableAutoScrollRestoration: false,
};

export const wrapRouter = (
  router: VueRouter,
  settingsOverrides?: Partial<RouterSettings<Route>>,
): (() => void) => {
  const settings: RouterSettings<Route> = {
    ...defaultSettings,
    ...settingsOverrides,
  };

  const oafRouter = createOafRouter(settings, location => location.hash);

  const unregister = router.afterEach((to, from) => {
    if (from.name === null) {
      // HACK Allow DOM updates to happen before we repair focus.
      setTimeout(() => {
        oafRouter.handleFirstPageLoad(to);
      }, settings.renderTimeout);
    } else {
      // HACK Allow DOM updates to happen before we repair focus.
      setTimeout(() => {
        oafRouter.handleLocationChanged(from, to, undefined, undefined);
      }, settings.renderTimeout);
    }
  });

  return () => {
    oafRouter.resetAutoScrollRestoration();
    unregister();
  };
};
