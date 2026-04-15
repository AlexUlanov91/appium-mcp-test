import assert from 'node:assert/strict';

import GuestPassPage from '../pageobjects/guestPass.page.js';

describe('thinkorswim guest pass registration', () => {
    it('should reach the enter security code step for a non-US resident signup', async () => {
        try {
            await GuestPassPage.activateApp();
            await GuestPassPage.openGuestPass();
            await GuestPassPage.openCreateGuestPass();
            await GuestPassPage.startEmailSignup();
            await GuestPassPage.fillPersonalInformation({
                firstName: 'Devexperts',
                lastName: 'Tos',
                email: 'test@devexperts.com'
            });
            await GuestPassPage.selectNonUsResident();
            await GuestPassPage.submitPersonalInformation();
            await GuestPassPage.waitForSecurityCode();

            assert.equal(await GuestPassPage.isSecurityCodeVisible(), true);
        } finally {
            await GuestPassPage.exitAndTerminate();
        }
    });
});