/// <reference path="../global.d.ts" />

ig.module('cc-pl.social')
  .requires('game.feature.gui.screen.title-screen', 'dom.ready', 'localize-me.final-locale.ready')
  .defines(() => {
    if (ig.currentLang !== 'pl_PL') return;

    sc.TitleScreenButtonGui.inject({
      init() {
        this.parent();

        let languageIndex = ig.LANG_DETAILS.pl_PL.localizeme_global_index;
        let btn = this.followButton;
        btn.textChild.setText(`\\i[language-${languageIndex}]`);
        btn.textChild.setPos(btn.textChild.hook.pos.x + 1, btn.textChild.hook.pos.y - 1);
      },
    });
  });
