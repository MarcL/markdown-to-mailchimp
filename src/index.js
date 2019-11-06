const markdownToHtmlEmail = require('./markdownToHtmlEmail');
const createMailchimpCampaign = require('./createMailchimpCampaign');

const convertAndCreateCampaign = async args => {
    try {
        const emailData = await markdownToHtmlEmail(args);

        const { apikey: apiKey, listid: listId } = args;
        const options = {
            apiKey,
            listId,
            ...emailData,
        };

        const campaignData = await createMailchimpCampaign(options);

        return {
            email: emailData,
            campaign: campaignData,
        };
    } catch (error) {
        return {
            error: error.toString(),
        };
    }
};

module.exports = convertAndCreateCampaign;
