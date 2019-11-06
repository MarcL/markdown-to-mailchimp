const mailchimp = require('./mailchimp');

const createMailchimpCampaign = async options => {
    const { apiKey, listId, frontmatter, html } = options;

    if (!apiKey || !listId) {
        return false;
    }

    const campaignOptions = {
        apiKey,
        listId,
        ...frontmatter,
        html,
    };

    let campaign = await mailchimp.findCampaignIdByMetaData(campaignOptions);

    if (!campaign) {
        campaign = await mailchimp.createCampaign(campaignOptions);
    } else {
        await mailchimp.updateCampaignHtml({
            ...campaignOptions,
            id: campaign.id,
        });
    }

    return campaign;
};

module.exports = createMailchimpCampaign;
