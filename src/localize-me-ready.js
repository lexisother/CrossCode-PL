/// <reference path="../global.d.ts" />

// what the fuck Dziurwa
const MODULE_NAME = 'localize-me.final-locale.ready';
if (ig.modules[MODULE_NAME] == null) {
  ig.modules[MODULE_NAME] = { requires: [], loaded: false, body: null };
  ig._waitForOnload++;

  localizeMe.register_locale_chosen(() => {
    ig.modules[MODULE_NAME].loaded = true;
    ig._waitForOnload--;
    ig._execModules();
  });
}
