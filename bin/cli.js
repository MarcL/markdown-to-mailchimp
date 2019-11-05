#!/usr/bin/env node
const yargs = require('yargs')
const markdownToHtmlEmail = require('../src/markdownToHtmlEmail')

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
        describe: 'Keep MailChimp merge tags',
        type: 'boolean',
    })
    .help('h')
    .alias('h', 'help')

markdownToHtmlEmail(argv).then(data => console.log(data))
