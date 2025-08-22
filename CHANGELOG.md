# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.3.0] - 2025-08-11

### Added

- added BigInt support

### Fixed

- replaced parseInt with BigInt

### Removed

- time tracking (found it useless)

## [4.2.0] - 2025-08-11

### Fixed

- fixed useDump and returned backward compatibility

## [4.1.0] - 2025-08-11

### Added

- time tracking for each update

### Fixed

- setting/getting string values which contain spaces

## [4.0.0] - 2025-06-25 (**Breaking changes!**)

### Added

- Returned Auto-Save Mechanism as more efficient;
- Added **writer** (boolean, default true) to options, this property enables auto-syncs

---

## [3.0.0] - 2025-06-20 (**Breaking changes!**)

### Removed

- Replaced Auto-Save Mechanism with Event Based Save Mechanism (triggers once you change data);
- Removed **mode** and **dumpInterval** from options

---

## [2.2.9] - 2025-06-20

### Added

- Added **mode** to options (writer|reader) that define the instance behavior

### Removed

- Removed **cancelAutoSave** from options;

## [2.2.8] - 2025-06-20

### Added

- Added **cancelAutoSave** to options;

## [2.2.7] - 2025-06-12

### Fixed

- Play with multiple items - fixed options setting in the constructor;

## [2.2.6] - 2025-05-26

### Added

- Added store method;

## [2.2.5] - 2025-05-22

### Fixed

- Removed icons from README.md

## [2.2.4] - 2025-05-20

### Fixed

- Updated property-accessor version

## [2.2.3] - 2025-05-19

### Fixed

- Updated property-accessor version

## [2.2.2] - 2025-05-19

### Fixed

- Updated property-accessor version

## [2.2.1] - 2025-05-17

### Fixed

- Refactor the data storing avoiding async functionality

---

## [2.2.0] - 2025-05-17

### Fixed

- Upgraded data storing functionality

---

## [2.1.1] - 2025-05-17

### Fixed

- Fixed events intersection and processes overflow

---

## [2.1.0] - 2025-05-17 (**Breaking changes!**)

### Fixed

- Reverted changes since 2.0.0 failed

---

## [2.0.0] - 2025-05-17 (**Breaking changes!**)

### Added

- Instead of background storing entire object store each key-value eventually
- Replaced dumpInterval from options

---

## [1.1.2] - 2025-05-17

### Fixed

- Non-blocking storing

---

## [1.1.1] - 2025-05-17

### Fixed

- Replaced fs usage with child_process

---

## [1.1.0] - 2025-05-17

### Fixed

- Fixed storing to avoid RangeError when JSON.parse/JSON.stringify

---

## [1.0.0] - 2025-05-02

### Added

Basic package implementation
