#!/usr/bin/env node
const yargs = require('yargs');
const chalk = require('chalk');
const markdownToHtmlEmail = require('../src/markdownToHtmlEmail');
const createMailchimpCampaign = require('../src/createMailchimpCampaign');

const logError = error => console.error(chalk.bold.red(`❌ ${error}`));
const logSuccess = message => console.log(chalk.green(`✅ ${message}`));

const { argv } = yargs
    .usage('Usage: $0 [options]')
    .example('$0 --md ./test.md --t ./template.mjml --o ./test.html')
    .option('m', {
        alias: 'markdown',
        demandOption: true,
        describe: 'File containing email content in markdown format',
        type: 'string',
    })
    .option('t', {
        alias: 'template',
        demandOption: true,
        describe: 'File containing email template in MJML format',
        type: 'string',
    })
    .option('o', {
        alias: 'output',
        describe:
            'Optional directory to write HTML email to. Filename matches markdown name.',
        type: 'string',
    })
    .option('a', {
        alias: 'apikey',
        default: process.env.MAILCHIMP_API_KEY,
        describe: 'Mailchimp API key',
        type: 'string',
    })
    .option('l', {
        alias: 'listid',
        default: process.env.MAILCHIMP_LIST_ID,
        describe: 'Mailchimp list identifier',
        type: 'string',
    })
    .option('k', {
        alias: 'keeptags',
        default: true,
        describe: 'Keep Mailchimp merge tags',
        type: 'boolean',
    })
    .help('h')
    .alias('h', 'help');

const convertAndCreateCampaign = async args => {
    try {
        const emailData = await markdownToHtmlEmail(args);

        const { apikey: apiKey, listid: listId } = args;
        const options = {
            apiKey,
            listId,
            ...emailData,
        };

        logSuccess('Created email data');

        const campaignData = await createMailchimpCampaign(options);
        if (!campaignData) {
            logError('No Mailchimp campaign created');
        } else {
            const { web_id: id } = campaignData;
            const editUrl = 'https://admin.mailchimp.com/campaigns/edit';

            logSuccess(`Mailchimp campaign created - ${editUrl}?id=${id}`);
        }
    } catch (error) {
        console.error(error.toString());
    }
};

convertAndCreateCampaign(argv);
