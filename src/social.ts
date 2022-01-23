// credit where credit is due, of course: <https://github.com/CCDirectLink/crosscode-ru/blob/cce868439f014f2a329de6a358c1ca8faba62e1e/src/ru-social-button.ts>

// TODO: Translate the text
// TODO: Re-add the CrossCode developer Twitter links
// TODO: Leverage NW.js to open the links in an external browser, see line 77 of /game/page/game-base.js:w

ig.module('cc-pl.social')
  .requires('game.feature.gui.screen.title-screen', 'dom.ready', 'localize-me.final-locale.ready')
  .defines(() => {
    if (ig.currentLang !== 'pl_PL') return;

    const links = [
      {
        url: 'https://github.com/lexisother/CrossCode-PL',
        description: 'Nasze repozytorium Github',
      },
      {
        url: 'https://discord.gg/MHZ7vKzcfc',
        description: 'Nasz Serwer Discord',
      },
    ];

    function showSocialDialog() {
      let container = document.createElement('div');
      container.classList.add('gameOverlayBox', 'twitterMessage');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      requestAnimationFrame(() => {
        container.classList.add('shown');
      });

      let scrollContainer = document.createElement('div');
      scrollContainer.style.alignSelf = 'stretch';
      scrollContainer.style.marginBottom = '8px';
      scrollContainer.style.overflow = 'auto';

      let plHeader = document.createElement('h3');
      plHeader.textContent = 'CrossCode-PL / Polskie Tłumaczenie CrossCode';
      scrollContainer.appendChild(plHeader);

      let plList = document.createElement('ul');
      for (let { url, description } of links) {
        let a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.textContent = url;

        let li = document.createElement('li');
        li.append(a, ` - ${description}`);
        plList.append(li);
      }
      scrollContainer.append(plList);

      let closeBtnContainer = document.createElement('div');
      let closeBtn = document.createElement('input');
      closeBtn.type = 'button';
      closeBtn.value = 'Close';
      closeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        ig.system.regainFocus();
      });
      closeBtnContainer.append(closeBtn);

      container.append(scrollContainer, closeBtnContainer);

      document.body.append(container);
      ig.system.setFocusLost();

      const callback = () => {
        container.remove();
        ig.system.removeFocusListener(callback);
      };
      ig.system.addFocusListener(callback);
      closeBtn.focus();
    }

    sc.TitleScreenButtonGui.inject({
      init() {
        this.parent();

        let languageIndex = ig.LANG_DETAILS.pl_PL.localizeme_global_index;
        let btn = this.followButton;
        btn.textChild.setText(`\\i[language-${languageIndex}]`);
        btn.textChild.setPos(btn.textChild.hook.pos.x + 1, btn.textChild.hook.pos.y - 1);
        btn.onButtonPress = showSocialDialog;
      },
    });
  });
