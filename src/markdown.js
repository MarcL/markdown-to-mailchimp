const fs = require('fs').promises;
const url = require('url');
const querystring = require('querystring');
const frontmatter = require('frontmatter');
const marked = require('marked');

const isMailchimpTag = text => /\|(.+?)\|/.test(text);

const createMailchimpRenderer = originalRenderer => {
    const mailchimpRenderer = new marked.Renderer();

    mailchimpRenderer.em = text =>
        isMailchimpTag(text) ? `*${text}*` : originalRenderer.em(text);

    mailchimpRenderer.link = (href, text, title) => {
        const { hostname, pathname, protocol, query } = url.parse(href);

        const queryParameters = querystring.parse(query);

        const newQueryParameters = Object.keys(queryParameters)
            .map(key => {
                const value = queryParameters[key];
                const encodedValue = isMailchimpTag(value)
                    ? value
                    : encodeURIComponent(value);
                return `${key}=${encodedValue}`;
            })
            .join('&amp;');

        const newBaseUrl = `${protocol}//${hostname}${pathname}`;

        const newHref =
            newQueryParameters.length > 0
                ? `${newBaseUrl}?${newQueryParameters}`
                : newBaseUrl;
        return `<a href="${newHref}">${title}</a>`;
    };

    return mailchimpRenderer;
};

const createRenderer = (keepMailChimpTags = true) => {
    const originalRenderer = new marked.Renderer();
    return keepMailChimpTags
        ? createMailchimpRenderer(originalRenderer)
        : originalRenderer;
};

const createHtmlFromMarkdown = (content, keepMailChimpTags = true) => {
    return marked(content, {
        renderer: createRenderer(keepMailChimpTags),
    });
};

const parseMarkdownFile = async (
    markdownFilename,
    keepMailChimpTags = true
) => {
    let fileContent;

    try {
        fileContent = await fs.readFile(markdownFilename, 'utf8');
    } catch (error) {
        return {
            errors: [error.toString()],
        };
    }

    const { content, data } = frontmatter(fileContent);
    const html = createHtmlFromMarkdown(content, keepMailChimpTags);

    return {
        html,
        markdown: content,
        frontmatter: data,
    };
};

module.exports = parseMarkdownFile;
