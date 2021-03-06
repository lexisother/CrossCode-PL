/// <reference path="../../global.d.ts" />

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
    scrollContainer: null,
    header: null,
    buttonInteract: null,
    buttonGroup: null,
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
      this.createCreditsList();
      this.doStateTransition('DEFAULT');
    },
    hide: function () {
      ig.interact.removeEntry(this.buttonInteract);
      ig.interact.setBlockDelay(0.2);
      this.doStateTransition('HIDDEN');
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
    createCreditsList: function () {
      let users = this.credits.data.slice();
      users.sort((a, b) => b.change_count - a.change_count);
      let guiElement = new ig.GuiElementBase();
      guiElement.hook.size.x = 296;
      let content = 0;
      for (let user of users) {
        content = this.createHeaderEntry(guiElement, content, user.full_name, sc.FONT_COLORS.GREEN);
        content = this.createTextEntry(guiElement, content, `${user.change_count} translations`);
      }
      guiElement.hook.size.y = content;
      this.scrollContainer.setElement(guiElement);
    },
    createHeaderEntry: function (guiElement, yOffset, text, color, isCentered) {
      text = new sc.TextGui('\\c[' + color + ']' + text + '\\c[0]');
      if (isCentered) text.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
      let colorGui = new ig.ColorGui('#7E7E7E', 296, 1);
      text.setPos(2, yOffset);
      yOffset += text.hook.size.y + 2 - 2;
      colorGui.setPos(0, yOffset);
      yOffset += 3;
      guiElement.addChildGui(text);
      guiElement.addChildGui(colorGui);
      return yOffset;
    },
    createTextEntry: function (guiElement, yOffset, text) {
      text = new sc.TextGui('\\c[0]' + text + '\\c[0]', { maxWidth: 280 });
      text.setPos(15, yOffset);
      guiElement.addChildGui(text);
      return (yOffset += text.hook.size.y);
    },
    createContent: function () {
      var scrollBar = new sc.LineGui(300),
        yOffset = 2;
      this.header = new sc.TextGui('CrossCode-PL Credits');
      this.header.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
      this.header.setPos(0, yOffset);
      this.content.addChildGui(this.header);
      yOffset += this.header.hook.size.y + 2;
      scrollBar.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
      scrollBar.setPos(0, yOffset);
      this.content.addChildGui(scrollBar);
      yOffset++;
      // Re-using extisting material because yes
      this.scrollContainer = new sc.DLCScrollContainer();
      this.scrollContainer.setPos(0, yOffset);
      this.scrollContainer.setSize(301, 202);
      yOffset += this.scrollContainer.hook.size.y;
      scrollBar = new sc.LineGui(300);
      scrollBar.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
      scrollBar.setPos(0, yOffset);
      this.content.addChildGui(scrollBar);
      this.content.addChildGui(this.scrollContainer);
    },
  });
});
