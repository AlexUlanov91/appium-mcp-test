# thinkorswim Mobile E2E (Appium + WebdriverIO + AI via Appium MCP)

This repository contains end-to-end mobile UI automation framework using WebdriverIO, Appium, and Mocha, with AI-assisted execution via Appium MCP.

The main purpose of this project is to automate mobile UI testing with AI so test creation, execution, and debugging are faster and more repeatable.

## Project Overview

- Primary purpose: automate mobile UI testing with AI using the Appium MCP workflow.
- Uses Page Object Model + WebdriverIO for maintainable, repeatable test automation.
- Captures debugging artifacts on failures (screenshot and screen recording) to support fast AI-assisted triage.
- Workflow-first execution model:
  - Start MCP tools
  - Start Appium server
  - Prepare Android emulator/device
  - Ask Copilot to execute flows and generate or update tests

This workflow allows AI to:
- Drive the app through Appium commands exposed by MCP tools
- Collect page source, screenshots, and recordings for debugging
- Help generate and refine automated test cases

Current implemented scenario:
- `tests/guestPassRegistration.test.js`
  - Validates the non-US resident signup path reaches the "Enter Security Code" step.

This Guest Pass flow was automated using the AI + Appium MCP workflow described above.

## Stack

- Node.js (ES modules)
- WebdriverIO v9
- Appium
- Appium-MCP
- Mocha test framework
- UiAutomator2 driver (Android)

## Dependencies

Defined in `package.json`:

- `@wdio/appium-service`
- `@wdio/cli`
- `@wdio/local-runner`
- `@wdio/mocha-framework`
- `@wdio/spec-reporter`
- `appium-uiautomator2-driver`

Script:

- `npm run wdio` -> runs `wdio run ./wdio.conf.js`

## Repository Structure

- `wdio.conf.js` - WDIO runner config, capabilities, hooks, artifact handling
- `tests/` - test specs
- `pageobjects/` - page objects and flow helpers
- `media/screenshots/` - failure screenshots
- `media/videos/` - failure videos
- `capabilities.json` - alternative/sample Android capabilities profile

## Prerequisites

1. Node.js 18+ installed
2. Android SDK and emulator/device available
3. Appium 2 available from CLI
4. UiAutomator2 driver installed for Appium
5. Target app installed on device/emulator, or capability values adjusted for your environment

## Installation

```bash
npm install
```

## Appium Setup

If Appium is not installed globally, install it:

```bash
npm install -g appium
```

Install UiAutomator2 driver (if needed):

```bash
appium driver install uiautomator2
```

Verify installation:

```bash
appium -v
appium driver list --installed
```

## Running Tests

For AI-assisted execution, make sure Appium MCP server is started through are available  in your editor session before starting Appium and running tests.

1. To start Appium MCP:
```bash
npx appium-mcp@latest
```

2. Start Appium server in one terminal:

```bash
appium
```

3. Run Android emulator

4. Ask copilot to execute and generate tests based on the provided steps, for example:

```bash
Execute following steps:

Launch already installed thinkorswim app on an Android Emulator.
Go to Guest Pass
Go to create page
Proceed with signin up with email
Fill the form with following data:
First name - qweerty
Last name - trwer
Email - test@google.com
Chose that I am not a US Resident
Continue on the next page and wait for it to load
Verify "Enter Security Code" text is present on the page
Exit the app and kill it in background

Follow guidelines in copilot-instructions.md
```


5. Run existing tests (in another terminal):

```bash
npm run wdio
```

Or to run a single spec:

```bash
npx wdio run wdio.conf.js --spec ./tests/guestPassRegistration.test.js
```

## Configuration Notes

Default capability values in `wdio.conf.js` are set for local Android execution, including:

- `platformName: Android`
- `appium:automationName: UiAutomator2`
- `appium:platformVersion: 15`
- App package: `com.devexperts.tdmobile.platform.android.thinkorswim`
- Startup activity: `com.devexperts.tdmobile.android.ui.StartupActivity`

Update these values if your emulator/device or app build differs.

## Artifacts and Debugging

The WDIO hooks in `wdio.conf.js` do the following:

- Start recording before each test (`beforeTest`)
- Stop recording after each test (`afterTest`)
- Save artifacts only when test fails:
  - `media/screenshots/<test name>/failure.png`
  - `media/videos/<test name>/run.mp4`

## Troubleshooting

- Appium command not found:
  - Install Appium globally or run with `npx appium`.
- Session creation fails:
  - Confirm emulator/device is running and visible via ADB.
  - Verify package/activity values in capabilities.
  - Ensure UiAutomator2 driver is installed.
- Test cannot find elements:
  - Re-check app screen state and selector strategy.
  - Validate that coordinate-based interactions still match current UI layout.
