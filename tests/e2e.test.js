import GuestPassPage from '../pageobjects/guestPass.page.js';

describe('thinkorswim Guest Pass E2E', () => {
  it('should sign up with email and reach Enter Security Code page', async () => {
    try {
      await GuestPassPage.openThinkorswim();
      await GuestPassPage.goToGuestPass();
      await GuestPassPage.goToCreatePage();
      await GuestPassPage.signUpWithEmail();

      await GuestPassPage.fillPersonalInfo({
        firstName: 'Devexperts',
        lastName: 'Rules',
        email: 'test@devexperts.com'
      });

      await GuestPassPage.selectNonUsResident();
      await GuestPassPage.continueToSecurityCode();

      const title = await GuestPassPage.verifyEnterSecurityCode();
      await expect(title).toContain('Enter Security Code');
    } catch (error) {
      console.error('Guest Pass E2E flow failed:', error);
      throw error;
    } finally {
      await GuestPassPage.exitAndKillApp();
    }
  });
});
