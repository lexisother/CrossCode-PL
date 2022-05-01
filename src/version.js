/// <reference path="../global.d.ts" />

ig.module('cc-pl.version')
  .requires(
    'game.feature.gui.base.text',
    'game.feature.gui.screen.title-screen',
    'game.feature.gui.screen.pause-screen',
    'ccloader-runtime.ui.version-display',
  )
  .defines(() => {
    const VERSION_TEXT_STR = `PL v${modloader.loadedMods.get('CrossCode-PL').version}`;

    function attachVersionTextGui(self) {
      if (self.modVersionGuis == null) {
        self.modVersionGuis = [self.ccloaderVersionGui];
      }
      let prevGui = self.modVersionGuis.last();
      let newGui = new sc.TextGui(VERSION_TEXT_STR, { font: sc.fontsystem.tinyFont });
      newGui.setAlign(prevGui.hook.align.x, prevGui.hook.align.y);
      newGui.setPos(prevGui.hook.pos.x, prevGui.hook.pos.y + prevGui.hook.size.y);
      self.versionGui.addChildGui(newGui);
      self.modVersionGuis.push(newGui);
    }

    sc.TitleScreenGui.inject({
      init(...args) {
        this.parent(...args);
        attachVersionTextGui(this);
      },
    });

    sc.PauseScreenGui.inject({
      init(...args) {
        this.parent(...args);
        attachVersionTextGui(this);
      },
    });
  });
