[![Build Status](https://travis-ci.org/oaf-project/oaf-vue-router.svg?branch=master)](https://travis-ci.org/oaf-project/oaf-vue-router)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Foaf-project%2Foaf-vue-router%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/oaf-project/oaf-vue-router/badge.svg?targetFile=package.json)](https://snyk.io/test/github/oaf-project/oaf-vue-router?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/oaf-project/oaf-vue-router.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/oaf-vue-router.svg)](https://www.npmjs.com/package/oaf-vue-router)

[![dependencies Status](https://david-dm.org/oaf-project/oaf-vue-router/status.svg)](https://david-dm.org/oaf-project/oaf-vue-router)
[![devDependencies Status](https://david-dm.org/oaf-project/oaf-vue-router/dev-status.svg)](https://david-dm.org/oaf-project/oaf-vue-router?type=dev)
[![peerDependencies Status](https://david-dm.org/oaf-project/oaf-vue-router/peer-status.svg)](https://david-dm.org/oaf-project/oaf-vue-router?type=peer)


# Oaf Vue Router
An accessible wrapper for [Vue Router](https://router.vuejs.org/).

Documentation at https://oaf-project.github.io/oaf-vue-router/

## Features

* Reset scroll and focus after page navigation
* Set the page title after navigation
* Announce navigation to users of screen readers
* Hash fragment support

In lieu of more details, see [Oaf React Router](https://github.com/oaf-project/oaf-react-router/blob/master/README.md#features) for now. The features are basically the same, with the caveat that Oaf Vue Router doesn't currently support focus and scroll restoration after POP navigation (see [issue #1](https://github.com/oaf-project/oaf-vue-router/issues/1)).

## Installation

```sh
# yarn
yarn add oaf-vue-router

# npm
npm install oaf-vue-router
```

## Basic Usage

```diff
import VueRouter from "vue-router";
+ import { wrapRouter } from "oaf-vue-router";

const router = new VueRouter({
  ...
  ...
  ...
});

+ wrapRouter(router);
```

## Advanced Usage

```typescript
const settings = {
  announcementsDivId: "announcements",
  primaryFocusTarget: "main h1, [role=main] h1",
  // This assumes you're setting the document title via some other means.
  // If you're not, you should return a unique and descriptive page title for each page
  // from this function and set `setPageTitle` to true.
  documentTitle: (route: Route) => document.title,
  // BYO localization
  navigationMessage: (title: string, route: Route): string => `Navigated to ${title}.`,
  shouldHandleAction: (previousRoute: Route, nextRoute: Route) => true,
  announcePageNavigation: true,
  setPageTitle: false,
  // Set this to true for smooth scrolling.
  // For browser compatibility you might want iamdustan's smoothscroll polyfill https://github.com/iamdustan/smoothscroll
  smoothScroll: false,
};

wrapRouter(router, settings);
```

### A note on focus outlines
You may see focus outlines around your `h1` elements (or elsewhere, per `primaryFocusTarget`) when using Oaf Vue Router.

You might be tempted to remove these focus outlines with something like the following:
```css
[tabindex="-1"]:focus {
  outline: 0 !important;
}
```

Don't do this! Focus outlines are important for accessibility. See for example:

* https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-visible.html
* https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/F78
* http://www.outlinenone.com/

Note that [Bootstrap 4 unfortunately removes these focus outlines](https://github.com/twbs/bootstrap/issues/28425). If you use Bootstrap, you can restore them with [Oaf Bootstrap 4](https://github.com/oaf-project/oaf-bootstrap-4).

All that said, if you absolutely _must_ remove focus outlines (stubborn client, stubborn boss, stubborn designer, whatever), consider using the [`:focus-visible` polyfill](https://github.com/WICG/focus-visible) so focus outlines are only hidden from mouse users, _not_ keyboard users.

## See also
* [Oaf Routing](https://github.com/oaf-project/oaf-routing)
* [Oaf Side Effects](https://github.com/oaf-project/oaf-side-effects)
