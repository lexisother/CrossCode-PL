/// <reference path="../global.d.ts" />

ig.module('cc-pl.fixes.main-menu')
  .requires('game.feature.menu.gui.main-menu', 'localize-me.final-locale.ready')
  .defines(() => {
    if (ig.currentLang !== 'pl_PL') return;

    sc.TitleScreenButtonGui.inject({
      plCreditsButton: null,
      plCreditsGui: null,
      init() {
        this.parent();
        this.gameCodeButton.setWidth(sc.BUTTON_DEFAULT_WIDTH);

        this.plCreditsButton = new sc.ButtonGui('PL Credits', null, true, sc.BUTTON_TYPE.EQUIP);
        this.plCreditsButton.hook.transitions = {
          DEFAULT: { state: {}, time: 0.2, timeFunction: KEY_SPLINES.EASE },
          HIDDEN: {
            state: { offsetX: -(this.plCreditsButton.hook.size.x + 2) },
            time: 0.2,
            timeFunction: KEY_SPLINES.LINEAR,
          },
        };
        this.plCreditsButton.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP);
        this.plCreditsButton.setHeight(26);
        this.plCreditsButton.textChild.setPos(0, -1);
        this.plCreditsButton.setPos(2, 2);
        this.plCreditsButton.doStateTransition('HIDDEN');
        this.plCreditsButton.onButtonPress = () => {
          this.plCreditsGui.show();
        };
        this.buttonGroup.addFocusGui(this.plCreditsButton, 15, 9);
        this.addChildGui(this.plCreditsButton);
      },
      postInit() {
        this.parent();
        this.plCreditsGui = new sc.PLGui();
        this.addChildGui(this.plCreditsGui);
      },
      show() {
        this.parent();
        this.plCreditsButton.doStateTransition('DEFAULT');
      },
      hide(skipTransition) {
        this.parent(skipTransition);
        this.plCreditsButton.doStateTransition('HIDDEN');
      },
    });
  });
