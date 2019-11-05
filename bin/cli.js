#!/usr/bin/env node
const yargs = require('yargs')

const {argv} = yargs
    .usage('Usage: $0 [options]')
    .example('$0 --md ./test.md --t ./template.mjml --o ./test.html')
    .option('m', {
        alias: 'markdown',
        demandOption: true,
        describe: 'Email content in markdown format',
        type: 'string',
    })
    .option('t', {
        alias: 'template',
        demandOption: true,
        describe: 'Email template in MJML format',
        type: 'string',
    })
    .option('o', {
        alias: 'output',
        describe: 'Optional file to write HTML email to',
        type: 'string',
    })
    .option('a', {
        alias: 'apikey',
        describe: 'Mailchimp API key',
        type: 'string',
    })
    .option('l', {
        alias: 'listid',
        describe: 'Mailchimp list identifier',
        type: 'string',
    })
    .help('h')
    .alias('h', 'help')

console.log(argv)
