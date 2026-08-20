/**
 * CrimsonTheme - dark crimson UI theme for Foundry VTT (v13/v14).
 */
export class CrimsonTheme {
  static soundPlayed = false;
  static pauseObserver = null;
  static _soundClickBound = false;

  /** Themed art used for optional window backgrounds (paths may contain spaces). */
  static backgroundImages = [
    "modules/ld-crimson-theme/assets/icons/windows.jpg",
    "modules/ld-crimson-theme/assets/icons/pause banner.jpg",
    "modules/ld-crimson-theme/assets/icons/right control buttons.png",
    "modules/ld-crimson-theme/assets/icons/hot buttons.png",
    "modules/ld-crimson-theme/assets/icons/scene control button.jpg"
  ];

  /**
   * Initialize the theme (call from Hooks.once("init")).
   */
  static initialize() {
    Hooks.on("renderApplication", this._onRenderApplication.bind(this));
    Hooks.on("renderApplicationV2", this._onRenderApplicationV2.bind(this));
    Hooks.on("closeApplication", this._onCloseApplication.bind(this));
    Hooks.on("closeApplicationV2", this._onCloseApplication.bind(this));
    Hooks.on("renderSceneControls", this._watchPauseControl.bind(this));
    this._applyGlobalStyles();
    this._addSoundEffects();
  }

  static onReady() {
    this._watchPauseControl();
  }

  /**
   * Keep the pause banner figcaption on the themed string.
   * Scoped MutationObserver only (no document-wide polling).
   * @private
   */
  static _watchPauseControl() {
    requestAnimationFrame(() => {
      const pauseElement = document.getElementById("pause");
      if (!pauseElement) return;

      const applyPauseText = () => {
        const figcaption = pauseElement.querySelector("figcaption");
        if (!figcaption) return;
        const pauseText = game.i18n?.localize?.("RNKCT.PauseText") ?? "Vespera Is Coming For You";
        if (figcaption.textContent !== pauseText) figcaption.textContent = pauseText;
      };

      applyPauseText();

      this.pauseObserver?.disconnect();
      this.pauseObserver = new MutationObserver(() => applyPauseText());
      this.pauseObserver.observe(pauseElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
    });
  }

  /** @private */
  static _applyGlobalStyles() {
    document.body.classList.add("ld-crimson-theme-theme");
  }

  /**
   * ApplicationV2 render hook - element is an HTMLElement (or rarely jQuery-like).
   * @private
   */
  static _onRenderApplicationV2(app, element) {
    if (!this.soundPlayed) {
      this._playSound("window opening.mp3");
      this.soundPlayed = true;
    }
    this._applyBackground(app, this._asElement(element));
  }

  /**
   * Legacy Application / ApplicationV1 render hook.
   * @private
   */
  static _onRenderApplication(app, html) {
    if (!this.soundPlayed) {
      this._playSound("window opening.mp3");
      this.soundPlayed = true;
    }
    this._applyBackground(app, this._asElement(html));
  }

  /**
   * @param {*} node
   * @returns {HTMLElement|null}
   * @private
   */
  static _asElement(node) {
    if (!node) return null;
    if (node instanceof HTMLElement) return node;
    if (node?.[0] instanceof HTMLElement) return node[0];
    if (typeof node?.jquery === "string" && node[0] instanceof HTMLElement) return node[0];
    // ApplicationV2 sometimes passes the app root via app.element
    return null;
  }

  /**
   * True when a window should receive a themed background.
   * AppV1: options.resizable
   * AppV2: options.window.resizable (or position/window flags)
   * @private
   */
  static _isResizableApp(app) {
    if (!app) return false;
    const opts = app.options ?? {};
    if (opts.resizable === true) return true;
    if (opts.window?.resizable === true) return true;
    // AppV2 class-level defaults when instance options omit the flag
    const defaults = app.constructor?.DEFAULT_OPTIONS;
    if (defaults?.window?.resizable === true) return true;
    if (defaults?.resizable === true) return true;
    return false;
  }

  /** @private */
  static _applyBackground(app, element) {
    try {
      if (!game.settings.get("ld-crimson-theme", "enableRandomBackgrounds")) return;
    } catch (_err) {
      return;
    }
    if (!element || !(element instanceof HTMLElement)) {
      // Fallback: AppV2 app.element
      element = this._asElement(app?.element) ?? app?.element ?? null;
      if (!(element instanceof HTMLElement)) return;
    }
    if (!this._isResizableApp(app)) return;

    const backgroundUrl = this._getRandomBackground();
    if (!backgroundUrl) return;

    element.style.backgroundImage = `url("${backgroundUrl}")`;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
  }

  /**
   * Encode path segments so spaces/special chars are valid in CSS url().
   * @returns {string|null}
   * @private
   */
  static _getRandomBackground() {
    if (!this.backgroundImages.length) return null;
    const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
    const raw = this.backgroundImages[randomIndex];
    try {
      return raw
        .split("/")
        .map((segment, i) => (i === 0 ? segment : encodeURIComponent(segment).replace(/%2F/g, "/")))
        .join("/");
    } catch (_err) {
      return raw.replace(/ /g, "%20");
    }
  }

  /** @private */
  static _onCloseApplication() {
    this._playSound("window closing.mp3");
  }

  /** @private */
  static _addSoundEffects() {
    if (this._soundClickBound) return;
    this._soundClickBound = true;
    document.addEventListener(
      "click",
      (event) => {
        if (event.target?.tagName === "BUTTON" || event.target?.closest?.("button")) {
          this._playSound("button is clicked.mp3");
        }
      },
      { passive: true }
    );
  }

  /**
   * Play a theme SFX (client-only, non-blocking).
   * @param {string} soundFile
   * @private
   */
  static _playSound(soundFile) {
    const src = `modules/ld-crimson-theme/assets/sounds/${encodeURIComponent(soundFile).replace(/%20/g, "%20")}`;
    // Prefer modern Foundry audio helper, fall back to legacy AudioHelper.
    const helper =
      foundry?.audio?.AudioHelper ??
      globalThis.AudioHelper ??
      null;

    try {
      if (helper?.play) {
        const result = helper.play(
          { src, volume: 0.3, autoplay: true, loop: false },
          false
        );
        if (result?.catch) result.catch(() => {});
        return;
      }
      if (game?.audio?.play) {
        const result = game.audio.play(src, { volume: 0.3, loop: false });
        if (result?.catch) result.catch(() => {});
      }
    } catch (_err) {
      /* ignore missing audio assets / autoplay policy */
    }
  }
}
