import { CrimsonTheme } from "./classes/CrimsonTheme.js";
import { registerAllSettings } from "../common/settings-registry.js";
import { migrateLegacyFlags } from "../ld-legacy-migrate.js";

/**
 * LD Crimson Theme entry
 */
Hooks.once("init", () => {
  console.log("ld-crimson-theme | init");
  registerAllSettings();
  CrimsonTheme.initialize();
});

Hooks.once("ready", () => {
  migrateLegacyFlags("ld-crimson-theme", "rnk-crimson-theme").catch(() => {});

  CrimsonTheme.onReady();
  console.log("ld-crimson-theme | ready");
});
