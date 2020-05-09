const mailchimp = require('../src/mailchimp');

describe('Mailchimp', () => {
    describe('isCampaignSent', () => {
        it('should return true if campaign is sent', () => {
            const campaign = {
                status: 'sent',
            };

            expect(mailchimp.isCampaignSent(campaign)).toBe(true);
        });

        it('should return true if campaign is sending', () => {
            const campaign = {
                status: 'sending',
            };

            expect(mailchimp.isCampaignSent(campaign)).toBe(true);
        });

        it('should return false if campaign is save', () => {
            const campaign = {
                status: 'save',
            };

            expect(mailchimp.isCampaignSent(campaign)).toBe(false);
        });

        it('should return false if campaign is paused', () => {
            const campaign = {
                status: 'paused',
            };

            expect(mailchimp.isCampaignSent(campaign)).toBe(false);
        });

        it('should return false if campaign is schedule', () => {
            const campaign = {
                status: 'schedule',
            };

            expect(mailchimp.isCampaignSent(campaign)).toBe(false);
        });
    });
});
