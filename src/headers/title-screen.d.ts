declare namespace sc {
  interface TitleScreenButtonGui {
    plCreditsButton: sc.ButtonGui;

    _createButton: (
      id: string,
      pos: number,
      buttonListLength: number,
      callback: () => void,
      name: string,
    ) => void;
  }
}
