/// <reference path="../global.d.ts" />

ig.module('cc-pl.version')
  .requires(
    'game.feature.gui.base.text',
    'game.feature.gui.screen.title-screen',
    'game.feature.gui.screen.pause-screen',
    'ccloader-runtime.ui.version-display',
  )
  .defines(() => {
    sc.TitleScreenGui.inject({
      crosscodePLItem: null,
      init() {
        this.parent();

        let version = modloader.loadedMods.get('CrossCode-PL').version.toString();
        let versionGui = new sc.TextGui(`PL v${version}`, {
          font: sc.fontsystem.tinyFont,
        });
        let displayPos = this.ccloaderVersionGui.hook.size.y;
        versionGui.setAlign(
          this.ccloaderVersionGui.hook.align.x,
          this.ccloaderVersionGui.hook.align.y,
        );

        // TODO: Make a PR to `ccloader-version-display` that adds an API for
        // standardising addition of version display items Hardcoding a list like
        // this is stupid and should be avoided at all costs, but well, it's not
        // like I have another option right now
        const verMods = [
          modloader.loadedMods.get('crosscode-ru'),
          modloader.loadedMods.get('CrossCode-Esp'),
          modloader.loadedMods.get('autumns-genesis'),
        ];
        // for (let mod of verMods) {
        //   if (mod === undefined) continue;
        //   displayPos += 8;
        // }

        versionGui.setPos(0, displayPos);
        this.ccloaderVersionGui.addChildGui(versionGui);
      },
    });
  });
