const Mailchimp = require('mailchimp-api-v3');

const createCampaign = ({
    apiKey,
    listId,
    subject,
    preview,
    title,
    fromName,
    replyTo,
    type = 'regular',
}) => {
    const mailchimp = new Mailchimp(apiKey);

    return mailchimp.post('/campaigns', {
        type,
        recipients: {
            list_id: listId,
        },
        settings: {
            subject_line: subject,
            preview_text: preview,
            title,
            from_name: fromName,
            reply_to: replyTo,
            to_name: '*|FNAME|*',
        },
    });
};

const updateCampaignHtml = ({ apiKey, id, html }) => {
    const mailchimp = new Mailchimp(apiKey);
    return mailchimp.put(`/campaigns/${id}/content`, {
        html,
    });
};

const findCampaignIdByMetaData = ({ apiKey, listId, title, subject }) => {
    const mailchimp = new Mailchimp(apiKey);
    return mailchimp.get('/campaigns', { count: 1000 }).then((response) => {
        return response.campaigns.find((campaign) => {
            return (
                campaign.recipients.list_id === listId &&
                campaign.settings.subject_line === subject &&
                campaign.settings.title === title
            );
        });
    });
};

const isCampaignSent = (campaign) => {
    const { status } = campaign;

    return status === 'sent' || status === 'sending';
};

module.exports = {
    createCampaign,
    findCampaignIdByMetaData,
    isCampaignSent,
    updateCampaignHtml,
};
