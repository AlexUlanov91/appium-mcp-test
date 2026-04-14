class GuestPassPage {
  constructor() {
    this.appId = 'com.devexperts.tdmobile.platform.android.thinkorswim';
  }

  get guestPassCard() {
    return $('id=com.devexperts.tdmobile.platform.android.thinkorswim:id/guestPass');
  }

  get createGuestPassButton() {
    return $('android=new UiSelector().text("CREATE A GUEST PASS")');
  }

  get signUpWithEmailButton() {
    return $('~Sign up with your email');
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
    return $('android=new UiSelector().text("No (will not impact Guest Pass access)")');
  }

  get continueButton() {
    return $('android=new UiSelector().text("Continue")');
  }

  get securityCodeTitle() {
    return $('android=new UiSelector().textContains("Enter Security Code")');
  }

  async openThinkorswim() {
    await driver.activateApp(this.appId);
    await this.guestPassCard.waitForDisplayed({ timeout: 20000 });
  }

  async goToGuestPass() {
    await this.guestPassCard.click();
    await this.createGuestPassButton.waitForDisplayed({ timeout: 20000 });
  }

  async goToCreatePage() {
    await this.createGuestPassButton.click();
    await this.signUpWithEmailButton.waitForDisplayed({ timeout: 20000 });
  }

  async signUpWithEmail() {
    await this.signUpWithEmailButton.click();
    await this.firstNameInput.waitForDisplayed({ timeout: 20000 });
  }

  async fillPersonalInfo({ firstName, lastName, email }) {
    await this.firstNameInput.setValue(firstName);
    await this.lastNameInput.setValue(lastName);
    await this.emailInput.setValue(email);
  }

  async selectNonUsResident() {
    await this.nonUsResidentRadio.click();
  }

  async continueToSecurityCode() {
    for (let i = 0; i < 5; i += 1) {
      const displayed = await this.continueButton.isDisplayed().catch(() => false);
      const enabled = await this.continueButton.isEnabled().catch(() => false);

      if (displayed && enabled) {
        await this.continueButton.click();
        return;
      }

      await driver.execute('mobile: scrollGesture', {
        left: 80,
        top: 500,
        width: 920,
        height: 1400,
        direction: 'down',
        percent: 0.85
      });
    }

    throw new Error('Continue button was not enabled after scrolling and form input.');
  }

  async verifyEnterSecurityCode() {
    await this.securityCodeTitle.waitForDisplayed({ timeout: 30000 });
    return this.securityCodeTitle.getText();
  }

  async exitAndKillApp() {
    await driver.pressKeyCode(3);
    await driver.terminateApp(this.appId);
  }
}

export default new GuestPassPage();
