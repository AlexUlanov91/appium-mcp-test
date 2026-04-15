const APP_PACKAGE = 'com.devexperts.tdmobile.platform.android.thinkorswim';

class GuestPassPage {
    get guestPassCard() {
        return $('id=com.devexperts.tdmobile.platform.android.thinkorswim:id/guestPass');
    }

    get createGuestPassText() {
        return $('//android.widget.TextView[@text="CREATE A GUEST PASS"]');
    }

    get signUpWithEmailText() {
        return $('//android.widget.TextView[@text="Sign up with your email"]');
    }

    get firstNameInput() {
        return $('android=new UiSelector().className("android.widget.EditText").instance(0)');
    }

    get lastNameInput() {
        return $('android=new UiSelector().className("android.widget.EditText").instance(1)');
    }

    get emailInput() {
        return $('android=new UiSelector().className("android.widget.EditText").instance(2)');
    }

    get nonUsResidentRadio() {
        return $('//android.widget.RadioButton[@text="No (will not impact Guest Pass access)"]');
    }

    get continueButton() {
        return $('//android.widget.Button[@text="Continue"]');
    }

    async activateApp() {
        await browser.activateApp(APP_PACKAGE);
        await this.guestPassCard.waitForDisplayed({ timeout: 30000 });
    }

    async openGuestPass() {
        await this.guestPassCard.click();
        await this.createGuestPassText.waitForDisplayed({ timeout: 15000 });
    }

    async openCreateGuestPass() {
        await this.tapByRatio(0.5, 0.42);
        await this.signUpWithEmailText.waitForDisplayed({ timeout: 15000 });
    }

    async startEmailSignup() {
        await this.tapByRatio(0.5, 0.344);
        await this.firstNameInput.waitForDisplayed({ timeout: 20000 });
    }

    async fillPersonalInformation({ firstName, lastName, email }) {
        await this.firstNameInput.setValue(firstName);
        await this.lastNameInput.setValue(lastName);
        await this.emailInput.setValue(email);
    }

    async selectNonUsResident() {
        await this.nonUsResidentRadio.click();
    }

    async submitPersonalInformation() {
        await this.scrollUntilContinueVisible();
        await this.continueButton.click();
    }

    async waitForSecurityCode() {
        await browser.waitUntil(async () => {
            const pageSource = await browser.getPageSource();
            return pageSource.includes('Enter Security Code');
        }, {
            timeout: 30000,
            timeoutMsg: 'Expected the Enter Security Code page to load.'
        });
    }

    async isSecurityCodeVisible() {
        const pageSource = await browser.getPageSource();
        return pageSource.includes('Enter Security Code');
    }

    async exitAndTerminate() {
        try {
            await browser.execute('mobile: pressKey', { keycode: 3 });
        } catch {
            // Continue to termination even if HOME is unavailable.
        }

        await browser.terminateApp(APP_PACKAGE);
    }

    async scrollUntilContinueVisible(maxAttempts = 3) {
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            if (await this.continueButton.isDisplayed()) {
                return;
            }

            await this.swipeUp();
        }

        await this.continueButton.waitForDisplayed({ timeout: 10000 });
    }

    async tapByRatio(xRatio, yRatio) {
        const { width, height } = await browser.getWindowSize();
        await browser.execute('mobile: clickGesture', {
            x: Math.round(width * xRatio),
            y: Math.round(height * yRatio)
        });
    }

    async swipeUp() {
        const { width, height } = await browser.getWindowSize();
        await browser.execute('mobile: swipeGesture', {
            left: Math.round(width * 0.1),
            top: Math.round(height * 0.2),
            width: Math.round(width * 0.8),
            height: Math.round(height * 0.65),
            direction: 'up',
            percent: 0.7
        });
    }
}

export default new GuestPassPage();