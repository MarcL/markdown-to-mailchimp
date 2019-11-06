# Markdown To Mailchimp

> Create Mailchimp newsletters using Markdown

## Install

Use `npm` or `yarn` to install the package:

```bash
npm install markdown-to-mailchimp
```

_or_

```bash
yarn add markdown-to-mailchimp
```

## Usage

This library exposes a command line tool and a Node library.

### CLI

```bash
md2mc [options]
```

| Command | Description |
| ------- | ----------- |
| -m, --markdown | Path to markdown file to convert. |
| -t, --template | Path to MJML email template file. |
| -o, --output | _(Optional)_ Output directory to write HTML email to. |
| -a, --apikey | _(Optional)_ Mailchimp API key. Also uses `MAILCHIMP_API_KEY` environment variable if set. |
| -l, --listid | _(Optional)_ Mailchimp list ID. Also uses `MAILCHIMP_LIST_ID` environment variable if set. |
| -k, --keeptags | _(Optional)_ Keep Mailchimp merge tags when converting from markdown to HTML. Defaults to `true`. |
| -h, --help | _(Optional)_ Display help. |
| --version | _(Optional)_ Display version number. |


### Library

Import the library:

```js
// CommonJS
const markdownToMailchimp = require('markdown-to-mailchimp');

// OR for ESModules
import markdownToMailchimp from 'markdown-to-mailchimp';
```

Call the function with an object of expected parameters:

```js
const options = {
    // Mandatory
    markdown: './path/to/markdown/file.md',
    template: './path/to/mjml/template.mjml',

    // Optional
    keeptags: true,
    output: './directory/to/output/html/to/'

    // Optional if you want a Mailchimp campaign to be created
    apikey: 'mailchimp-api-key',
    listid: 'mailchimp-list-id',
};

// Returns a promise so you can use async/await or promises
// to wait for a response
const data = await markdownToMailChimp(options);
```
