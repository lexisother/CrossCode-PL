ig.module('cc-pl.fixes.main-menu')
  .requires('game.feature.menu.gui.main-menu', 'localize-me.final-locale.ready')
  .defines(() => {
    if (ig.currentLang !== 'pl_PL') return;

    sc.TitleScreenButtonGui.inject({
      plCreditsButton: null,
      init(...args) {
        this.parent(...args);
        this.gameCodeButton.setWidth(sc.BUTTON_DEFAULT_WIDTH);

        this.plCreditsButton = new sc.ButtonGui('Credits', sc.BUTTON_DEFAULT_WIDTH);
        this.plCreditsButton.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_BOTTOM);
        this.plCreditsButton.setPos(-20, this.gameCodeButton.hook.pos.y + 28);
        this.plCreditsButton.onButtonPress = function () {
          console.log('hi!');
        };
        this.plCreditsButton.hook.transitions = {
          DEFAULT: { state: {}, time: 0.2, timeFunction: KEY_SPLINES.EASE },
          HIDDEN: {
            state: { offsetY: -40, alpha: 0 },
            time: 0.2,
            timeFunction: KEY_SPLINES.LINEAR,
          },
        };
        this.plCreditsButton.doStateTransition('HIDDEN', true);
        this.buttonGroup.addFocusGui(this.plCreditsButton, 1, 4);
        this.addChildGui(this.plCreditsButton);
      },
      show(...args) {
        this.parent(...args);
        this.plCreditsButton.doStateTransition('DEFAULT');
      },
      hide(...args) {
        this.parent(...args);
        this.plCreditsButton.doStateTransition('HIDDEN');
      },
    });
  });
