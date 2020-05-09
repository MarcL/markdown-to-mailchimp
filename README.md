# Markdown To Mailchimp

> Create Mailchimp newsletters using Markdown

**Note: This is still a Work In Progress**

## Why?

Writing emails in Mailchimp's WYSIWYG editor can be a pain. This library allows you to write Mailchimp campaign emails using [Markdown](https://en.wikipedia.org/wiki/Markdown) and format your emails using [MJML](https://mjml.io/) to create beautiful HTML emails. It offers both a command line (CLI) tool and a Node.js library.

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
    // The Mailchimp list ID can also be set as frontmatter in your markdown email
    apikey: 'mailchimp-api-key',
    listid: 'mailchimp-list-id',
};

// Returns a promise so you can use async/await or promises
// to wait for a response
const data = await markdownToMailChimp(options);
```

### Emails in Markdown

Your email should be created using Markdown in either the [CommonMark](https://spec.commonmark.org/0.29/) or [GitHub Flavoured](https://github.github.com/gfm/) markdown.

The parser allows for YAML frontmatter to be added to your markdown file, as you would when using a tool like [Jekyl](https://jekyllrb.com/docs/front-matter/). This frontmatter can contain any data you want to inject into your MJML template.

If you plan to create the Mailchimp campaign in addition to rendering an HTML template, you'll need the following frontmatter set in your markdown:

* **subject** - The email campaign subject
* **preview** - The email preview text
* **title** - The title of the campaign
* **fromName** - The name of the person that is sending the email
* **replyTo** - The email address to reply to
* **listId** - (Optional) Mailchimp List (Audience) identifier. If this is not set then the list ID should be passed in the `options` or as the `MAILCHIMP_LIST_ID` environment variable.

You can use [Mailchimp merge tags](https://mailchimp.com/help/all-the-merge-tags-cheat-sheet/) in your markdown but ensure that you set the `keeptags` option when converting. This allows you to keep a tag such as `*|MC:DATE|*` without it being converted to italic text.

See an example [here](./examples/markdown/test.md).

### MJML Templates

Once the markdown is converted to HTML, it's injected into an MJML template. This template is converted using the [Handlebars](https://handlebarsjs.com/) templating language. This allows you to pass through any of your frontmatter variables using the `{{frontmatter.yourVariable}}` format. The markdown HTML content is given as the `{{content}}` variable.

See an example [here](./examples/templates/testTemplate.mjml).

## Mailchimp Campaigns

This library will create a new campaign for you if no campaign already exists with the same title and subject. If it already exists then it updates with the new HTML, unless the campaign has either the `sent` (already delivered) or `sending` (for automations) status.

## TODO

* Ensure conversion allows all use of Mailchimp tags
* Validate expected frontmatter for Mailchimp
* Allow different campaign types
* Sanitise output of Markdown conversion - use [Sanitize](https://github.com/apostrophecms/sanitize-html)?
* Tests!
