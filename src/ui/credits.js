/// <reference path="../../global.d.ts" />

// TODO: REMOVE SINGLE-LETTER VARS
// TODO: REMOVE UNUSED FUNCTIONS AND CLASS MEMBERS

ig.module('cc-pl.ui.credits').defines(() => {
  // Add our own loadable so we can load the credits
  ig.PLCreditsLoadable = ig.JsonLoadable.extend({
    cacheType: 'PLCreditsLoadable',
    init() {
      this.parent('data/credits-pl.json');
    },
    onload(a) {
      this.data = a;
    },
    getJsonPath() {
      return ig.root + this.path + ig.getCacheSuffix();
    },
  });

  sc.PLGui = ig.GuiElementBase.extend({
    transitions: {
      DEFAULT: {
        state: { alpha: 1 },
        time: 0.2,
        timeFunction: KEY_SPLINES.EASE_OUT,
      },
      HIDDEN: {
        state: { alpha: 0 },
        time: 0.3,
        timeFunction: KEY_SPLINES.EASE_IN,
      },
    },
    msgBox: null,
    content: null,
    back: null,
    browseLeft: null,
    browserRight: null,
    scrollContainer: null,
    header: null,
    compiledButton: null,
    buttonInteract: null,
    buttonGroup: null,
    compiledMode: false,
    compileList: [],
    compileEntry: null,
    logs: [],
    currentIndex: null,
    credits: new ig.PLCreditsLoadable(),
    init: function () {
      this.parent();
      this.hook.localAlpha = 0.8;
      this.hook.size.x = ig.system.width;
      this.hook.size.y = ig.system.height;
      this.buttonInteract = new ig.ButtonInteractEntry();
      this.buttonGroup = new sc.ButtonGroup(false, ig.BUTTON_GROUP_SELECT_TYPE.HORIZONTAL);
      this.buttonInteract.pushButtonGroup(this.buttonGroup);
      this.content = new ig.GuiElementBase();
      this.content.setSize(300, 240);
      this.createContent();
      this.msgBox = new sc.CenterBoxGui(this.content);
      this.msgBox.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);
      this.msgBox.setPos(0, -10);
      this.addChildGui(this.msgBox);
      this.back = new sc.ButtonGui(
        '\\i[back]' + ig.lang.get('sc.gui.dlc-list.back'),
        sc.BUTTON_DEFAULT_WIDTH,
      );
      this.back.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);
      this.back.setPos(0, 122 + this.back.hook.size.y - 10);
      this.back.submitSound = sc.BUTTON_SOUND.back;
      this.back.onButtonPress = function () {
        this.hide();
      }.bind(this);
      this.addChildGui(this.back);
      this.buttonInteract.addGlobalButton(this.back, this.onBackButtonCheck.bind(this));
      this.doStateTransition('HIDDEN', true);
    },
    show: function () {
      ig.interact.addEntry(this.buttonInteract);
      ig.interact.setBlockDelay(0.2);
      this.createDLCList();
      this.doStateTransition('DEFAULT');
    },
    hide: function () {
      ig.interact.removeEntry(this.buttonInteract);
      ig.interact.setBlockDelay(0.2);
      this.doStateTransition('HIDDEN');
    },
    clearLogs: function () {
      this.compileEntry = null;
      this.scrollContainer.clear();
    },
    update: function () {
      if (!ig.interact.isBlocked()) {
        sc.control.menuScrollUp()
          ? this.scrollContainer.scroll(-20)
          : sc.control.menuScrollDown() && this.scrollContainer.scroll(20);
        sc.control.downDown()
          ? this.scrollContainer.scroll(200 * ig.system.tick)
          : sc.control.upDown() && this.scrollContainer.scroll(-200 * ig.system.tick);
      }
    },
    updateDrawables: function (guiRenderer) {
      guiRenderer.addColor('#000', 0, 0, this.hook.size.x, this.hook.size.y);
    },
    onBackButtonCheck: function () {
      return sc.control.menuBack();
    },
    createDLCList: function () {
      // TODO: CLEANUP
      var users = this.credits.data.people.sort((a, b) => b.change_count - a.change_count),
        guiElement = new ig.GuiElementBase();
      guiElement.hook.size.x = 296;
      let content = 0;
      for (let user of users) {
        content = this.createHeaderEntry(guiElement, content, user.full_name, sc.FONT_COLORS.GREEN);
        content = this.createTextEntry(
          guiElement,
          content,
          `${user.change_count} translations`,
          true,
        );
      }
      guiElement.hook.size.y = content;
      this.scrollContainer.setElement(guiElement);
    },
    createHeaderEntry: function (b, a, d, c, e) {
      d = new sc.TextGui('\\c[' + c + ']' + d + '\\c[0]');
      e && d.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
      e = new ig.ColorGui('#7E7E7E', 296, 1);
      d.setPos(2, a);
      a = a + (d.hook.size.y + 2 - 2);
      e.setPos(0, a);
      a = a + 3;
      b.addChildGui(d);
      b.addChildGui(e);
      return a;
    },
    createTextEntry: function (b, a, d) {
      d = new sc.TextGui('\\c[0]' + d + '\\c[0]', { maxWidth: 280 });
      d.setPos(15, a);
      b.addChildGui(d);
      return (a = a + d.hook.size.y);
    },
    createContent: function () {
      var b = 2;
      this.logs = sc.version.changelog;
      this.header = new sc.TextGui('CrossCode-PL Credits');
      this.header.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
      this.header.setPos(0, b);
      this.content.addChildGui(this.header);
      var b = b + (this.header.hook.size.y + 2),
        a = new sc.LineGui(300);
      a.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
      a.setPos(0, b);
      this.content.addChildGui(a);
      b = b + 1;
      this.scrollContainer = new sc.DLCScrollContainer();
      this.scrollContainer.setPos(0, b);
      this.scrollContainer.setSize(301, 202);
      b = b + this.scrollContainer.hook.size.y;
      a = new sc.LineGui(300);
      a.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
      a.setPos(0, b);
      this.content.addChildGui(a);
      this.content.addChildGui(this.scrollContainer);
    },
  });
});
