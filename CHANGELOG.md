# Changelog

## [Unreleased]

- Rebrand to Lisa's Dungeon (`ld-*` module ids).
- Copy actor flags from the retired `rnk-*` id on first ready.
- Add LICENSE, package.json, syntax and validate checks.
- Keep existing worlds working via `ld-legacy-migrate.js`.


All notable changes to **LD Crimson Theme** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-07-20

### Fixed
- ApplicationV2 resizable windows now receive themed backgrounds (`options.window.resizable` / `DEFAULT_OPTIONS`).
- Encode background and sound paths with spaces for valid CSS/audio URLs.
- Close-sound hook also listens for `closeApplicationV2`.
- Audio playback uses `foundry.audio.AudioHelper` with legacy fallbacks.
- Settings name/hint stay as i18n keys (no premature `localize` at init).
- Guard settings reads when settings are not yet registered.

### Changed
- Stripped package bloat: `node_modules`, `backups/`, and release zip copies (~93MB removed).
- Bumped module version to `1.0.4`.

## [1.0.3] - 2026-04-15

### Changed
- Verified compatibility against Foundry VTT 14.
- Updated manifest compatibility to `minimum: 13` and `verified: 14`.
- Bumped module version to `1.0.3`.

## [1.0.2] - 2026-04-01

### Changed
- Raised the standalone module compatibility floor to Foundry v13.
- Switched the package workflow to local validate and release-build scripts.
- Updated README and release metadata for the standalone deployment flow.

### Fixed
- Reworked the runtime entrypoint to use the shared settings registry cleanly.
- Removed duplicate pause observers so the pause banner text no longer accumulates watchers.
- Added ApplicationV2-safe background handling for resizable windows.
- Replaced empty background folder references with existing themed art assets.

### Changed
- Updated pause banner artwork to use the new `assets/icons/pause banner.jpg` image.
- Expanded pause banner to full viewport width for stronger visual presence.
- Added animated shimmer pass across the pause banner.

### Fixed
- Corrected pause banner theme styling so updated image assets are reflected after module update.

## [1.0.1] - 2026-03-12

## [1.0.0] - 2026-03-07

### Added
- Initial release of LD Crimson Theme
- Dark crimson color scheme with custom CSS properties
- Random background image application to application windows
- Client-side setting to enable/disable random backgrounds
- Full Foundry v13 compatibility
