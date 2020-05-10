const Mailchimp = require('mailchimp-api-v3');
const mailchimp = require('../src/mailchimp');

jest.mock('mailchimp-api-v3');

describe('Mailchimp', () => {
    let mockMailchimpGet;
    let mockMailchimpPost;
    let mockMailchimpPut;

    beforeEach(() => {
        mockMailchimpGet = jest.fn();
        mockMailchimpPost = jest.fn();
        mockMailchimpPut = jest.fn();
        Mailchimp.mockImplementation(() => {
            return {
                get: mockMailchimpGet,
                post: mockMailchimpPost,
                put: mockMailchimpPut,
            };
        });
    });

    describe('isCampaignSent()', () => {
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

    describe('createCampaign()', () => {
        it('should create a Mailchimp client with the expected API key', async () => {
            expect.assertions(1);
            const expectedApiKey = 'expectedApiKey';
            const givenOptions = {
                apiKey: expectedApiKey,
            };

            await mailchimp.createCampaign(givenOptions);

            expect(Mailchimp).toHaveBeenCalledWith(expectedApiKey);
        });

        it('should call Mailchimp client post method with expected parameters', async () => {
            expect.assertions(1);
            const givenOptions = {
                type: 'expectedType',
                listId: 'expectedListId',
                subject: 'expectedSubject',
                preview: 'expectedPreview',
                title: 'expectedTitle',
                fromName: 'expectedFromName',
                replyTo: 'expectedReplyTo',
            };

            await mailchimp.createCampaign(givenOptions);

            expect(mockMailchimpPost).toHaveBeenCalledWith('/campaigns', {
                type: 'expectedType',
                recipients: {
                    list_id: 'expectedListId',
                },
                settings: {
                    subject_line: 'expectedSubject',
                    preview_text: 'expectedPreview',
                    title: 'expectedTitle',
                    from_name: 'expectedFromName',
                    reply_to: 'expectedReplyTo',
                    to_name: '*|FNAME|*',
                },
            });
        });

        it('should call Mailchimp client post method with regular type if none passed', async () => {
            expect.assertions(1);
            const givenOptions = {
                listId: 'expectedListId',
                subject: 'expectedSubject',
                preview: 'expectedPreview',
                title: 'expectedTitle',
                fromName: 'expectedFromName',
                replyTo: 'expectedReplyTo',
            };

            await mailchimp.createCampaign(givenOptions);

            expect(mockMailchimpPost).toHaveBeenCalledWith('/campaigns', {
                type: 'regular',
                recipients: {
                    list_id: 'expectedListId',
                },
                settings: {
                    subject_line: 'expectedSubject',
                    preview_text: 'expectedPreview',
                    title: 'expectedTitle',
                    from_name: 'expectedFromName',
                    reply_to: 'expectedReplyTo',
                    to_name: '*|FNAME|*',
                },
            });
        });
    });

    describe('updateCampaignHtml()', () => {
        it('should create a Mailchimp client with the expected API key', async () => {
            expect.assertions(1);
            const expectedApiKey = 'expectedApiKey';
            const givenOptions = {
                apiKey: expectedApiKey,
            };

            await mailchimp.updateCampaignHtml(givenOptions);

            expect(Mailchimp).toHaveBeenCalledWith(expectedApiKey);
        });

        it('should call Mailchimp client put method with expected parameters', async () => {
            expect.assertions(1);
            const givenOptions = {
                apiKey: 'expectedApiKey',
                id: 'expectedId',
                html: 'expectedHtml',
            };

            await mailchimp.updateCampaignHtml(givenOptions);

            expect(mockMailchimpPut).toHaveBeenCalledWith(
                '/campaigns/expectedId/content',
                {
                    html: 'expectedHtml',
                }
            );
        });
    });

    describe('findCampaignIdByMetaData()', () => {
        it('should create a Mailchimp client with the expected API key', async () => {
            expect.assertions(1);
            const expectedApiKey = 'expectedApiKey';
            const givenOptions = {
                apiKey: expectedApiKey,
            };

            mockMailchimpGet.mockResolvedValue({
                campaigns: [],
            });

            await mailchimp.findCampaignIdByMetaData(givenOptions);

            expect(Mailchimp).toHaveBeenCalledWith(expectedApiKey);
        });

        it('should call Mailchimp client get method with expected parameters', async () => {
            expect.assertions(1);
            const givenOptions = {
                apiKey: 'expectedApiKey',
                listId: 'expectedListId',
                title: 'expectedTitle',
                subject: 'expectedSubject',
            };

            mockMailchimpGet.mockResolvedValue({
                campaigns: [],
            });

            await mailchimp.findCampaignIdByMetaData(givenOptions);

            expect(mockMailchimpGet).toHaveBeenCalledWith('/campaigns', {
                count: 1000,
            });
        });

        it('should return undefined if no campaign is found', async () => {
            expect.assertions(1);
            const givenOptions = {
                apiKey: 'expectedApiKey',
                listId: 'expectedListId',
                title: 'expectedTitle',
                subject: 'expectedSubject',
            };

            mockMailchimpGet.mockResolvedValue({
                campaigns: [
                    {
                        recipients: {
                            list_id: 'notFoundListId',
                        },
                        settings: {
                            subject_line: 'notFoundSubjectLine',
                            title: 'notFoundTitle',
                        },
                    },
                ],
            });

            await expect(
                mailchimp.findCampaignIdByMetaData(givenOptions)
            ).resolves.toBeUndefined();
        });

        it('should return expected campaign if listId, subject and title match', async () => {
            expect.assertions(1);
            const givenOptions = {
                apiKey: 'expectedApiKey',
                listId: 'expectedListId',
                title: 'expectedTitle',
                subject: 'expectedSubject',
            };

            const fakeFoundCampaign = {
                recipients: {
                    list_id: 'expectedListId',
                },
                settings: {
                    subject_line: 'expectedSubject',
                    title: 'expectedTitle',
                },
            };

            mockMailchimpGet.mockResolvedValue({
                campaigns: [fakeFoundCampaign],
            });

            await expect(
                mailchimp.findCampaignIdByMetaData(givenOptions)
            ).resolves.toEqual(fakeFoundCampaign);
        });
    });
});
