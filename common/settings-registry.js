/**
 * LD Settings Registry - ld-crimson-theme
 * Keep setting name/hint as i18n keys; Foundry localizes them when the settings UI opens.
 */

export const SETTINGS_REGISTRY = {
  "ld-crimson-theme": {
    enableRandomBackgrounds: {
      name: "RNKCT.Settings.EnableRandomBackgrounds.Name",
      hint: "RNKCT.Settings.EnableRandomBackgrounds.Hint",
      scope: "client",
      config: true,
      type: Boolean,
      default: true
    }
  }
};

/**
 * Register a game setting with error handling.
 * @returns {boolean}
 */
export function safeRegisterSetting(moduleId, settingName, settingConfig) {
  try {
    if (!game?.settings?.register) return false;
    // Do not pre-localize - pass keys so Foundry resolves them at display time.
    game.settings.register(moduleId, settingName, { ...settingConfig });
    return true;
  } catch (err) {
    console.warn(`[${moduleId}] Failed to register setting "${settingName}"`, err);
    return false;
  }
}

/** Register all known settings for this package (init hook). */
export function registerAllSettings() {
  for (const [moduleId, settings] of Object.entries(SETTINGS_REGISTRY)) {
    for (const [settingName, settingConfig] of Object.entries(settings)) {
      safeRegisterSetting(moduleId, settingName, settingConfig);
    }
  }
}

export function getSetting(moduleId, settingKey) {
  return game.settings.get(moduleId, settingKey);
}

export function setSetting(moduleId, settingKey, value) {
  return game.settings.set(moduleId, settingKey, value);
}
