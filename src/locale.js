/// <reference path="../global.d.ts" />

// Based on <https://github.com/CCDirectLink/crosscode-ru/blob/ab765a9a658a5e08bd9c522542980f9fde125ce7/src/locale.ts>

const ORIGINAL_LOCALE = 'en_US';
const TRANSLATION_LOCALE = 'pl_PL';

const LOCALIZE_ME_PACKS_DIR = 'mod://CrossCode-PL/packs/';
const LOCALIZE_ME_MAPPING_FILE = 'mod://CrossCode-PL/packs-mapping.json';

const PATCHED_FONT_CHARACTERS = 'ĄĆĘŁŃÓŚŻŹąćęłńóśżź';
const PATCHED_FONT_URLS = ['media/font/pl_PL/hall-fetica-bold.png'];

const IGNORED_LABELS = new Set([
  '',
  'en_US',
  'LOL, DO NOT TRANSLATE THIS!',
  'LOL, DO NOT TRANSLATE THIS! (hologram)',
  '\\c[1][DO NOT TRANSLATE THE FOLLOWING]\\c[0]',
  '\\c[1][DO NOT TRANSLATE FOLLOWING TEXTS]\\c[0]',
]);

localizeMe.add_locale(TRANSLATION_LOCALE, {
  from_locale: ORIGINAL_LOCALE,
  map_file: LOCALIZE_ME_MAPPING_FILE,
  url_prefix: LOCALIZE_ME_PACKS_DIR,
  language: {
    en_US: 'Polish',
    pl_PL: 'Polski',
  },
  flag: `media/font/${TRANSLATION_LOCALE}/flag.png`,

  missing_cb: (langLabelOrString, dictPath) => {
    if (typeof langLabelOrString === 'string') {
      langLabelOrString = { [ORIGINAL_LOCALE]: langLabelOrString };
    }
    let original = langLabelOrString[ORIGINAL_LOCALE];
    let translated = langLabelOrString[TRANSLATION_LOCALE];

    if (translated) return translated;
    if (original === ORIGINAL_LOCALE) return TRANSLATION_LOCALE;

    if (IGNORED_LABELS.has(original.trim())) {
      return original;
    }

    if (/^credits\/[^/]+\.json\/entries\/[^/]+\/names\/[^/]+$/.test(dictPath)) {
      return original;
    }

    // return `--${original}`; // debug mode
    return original;
  },

  pre_patch_font: async (context) => {
    let url = PATCHED_FONT_URLS[context.size_index];
    if (url != null) {
      context.polishFont = await sc.ui2.waitForLoadable(new ig.Font(url, context.char_height));
    }
  },

  patch_base_font: (canvas, context) => {
    let { polishFont } = context;
    if (polishFont != null) {
      let ctx2d = canvas.getContext('2d');
      for (let i = 0; i < PATCHED_FONT_CHARACTERS.length; i++) {
        let char = PATCHED_FONT_CHARACTERS[i];
        let width = polishFont.widthMap[i] + 1;
        let rect = context.reserve_char(canvas, width);
        context.set_char_pos(char, rect);
        let srcX = polishFont.indicesX[i];
        let srcY = polishFont.indicesY[i];
        ctx2d.drawImage(
          polishFont.data,
          srcX,
          srcY,
          width,
          polishFont.charHeight,
          rect.x,
          rect.y,
          rect.width,
          rect.height,
        );
      }
    }
    return canvas;
  },
});
