// require("dotenv").config();
const fs = require('fs').promises
const mjml = require('mjml')

const mailchimp = require('./mailchimp')
const parseMarkdownFile = require('./markdown')
const renderHandlebars = require('./renderHandlebars')

const createHtmlEmailFromTemplate = mjmlContent => {
    return mjml(mjmlContent, {
        minify: true,
    })
}

const convertMarkdownEmail = ({
    markdownFilename,
    templateFilename,
    outputDirectory,
}) => {
    return parseMarkdownFile(markdownFilename)
        .then(data => {
            const {
                frontmatter: { preview },
                html,
            } = data

            return renderHandlebars({
                filename: templateFilename,
                context: {
                    preview,
                    content: html,
                },
            }).then(mjmlContent => {
                return {
                    mjml: mjmlContent,
                    ...data,
                }
            })
        })
        .then(data => {
            const email = createHtmlEmailFromTemplate(data.mjml)
            return {
                emailHtml: email.html,
                emailErrors: email.errors,
                ...data,
            }
        })
        .then(data => {
            const {
                emailHtml: { html },
            } = data
            const fileParts = markdownFilename.split('/')
            const baseFilename = fileParts[fileParts.length - 1].split('.md')[0]
            const outputFilename = `${outputDirectory}/${baseFilename}.html`

            return fs.writeFile(outputFilename, html, 'utf8').then(() => data)
        })
        .catch(error => console.error(error.toString()))
}

convertMarkdownEmail({
    markdownFilename: './emails/03-11-2019.md',
    templateFilename: './templates/botMailingList.mjml',
    outputDirectory: './output',
})
    .then(data => {
        const shouldCreateCampaign = true
        console.log(data)
        if (shouldCreateCampaign) {
            const {
                emailHtml,
                frontmatter: { subject, preview, title },
            } = data
            const {
                MAILCHIMP_API_KEY: apiKey,
                MAILCHIMP_LIST_ID: listId,
            } = process.env

            return mailchimp
                .findCampaignIdByMetaData({
                    apiKey,
                    listId,
                    title,
                    subject,
                })
                .then(campaign => {
                    return (
                        campaign ||
                        mailchimp.createCampaign({
                            apiKey,
                            listId,
                            subject,
                            preview,
                            title,
                            fromName: 'Marc Littlemore',
                            replyTo: 'marc@marclittlemore.com',
                        })
                    )
                })
                .then(campaignResponse => {
                    const { id: campaignId } = campaignResponse
                    return mailchimp.updateCampaignHtml({
                        apiKey,
                        campaignId,
                        html: emailHtml,
                    })
                })
        }

        return false
    })
    .catch(error => console.log(error))
