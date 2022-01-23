ig.module('cc-pl.fixes.main-menu')
  .requires('game.feature.menu.gui.main-menu', 'localize-me.final-locale.ready')
  .defines(() => {
    if (ig.currentLang !== 'pl_PL') return;

    sc.TitleScreenButtonGui.inject({
      init(...args) {
        this.parent(...args);
        this.gameCodeButton.setWidth(sc.BUTTON_DEFAULT_WIDTH);
      },
    });
  });
