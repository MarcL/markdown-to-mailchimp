const fs = require('fs').promises;
const frontmatter = require('frontmatter');
const marked = require('marked');

// https://mailchimp.com/help/all-the-merge-tags-cheat-sheet/
const isMailChimpTag = text => /\|(.+?)\|/.test(text);

const createHtmlFromMarkdown = (content, keepMailChimpTags = true) => {
    const newRenderer = new marked.Renderer();
    newRenderer.em = text =>
        keepMailChimpTags && isMailChimpTag(text)
            ? `*${text}*`
            : `<em>${text}</em>`;

    return marked(content, {
        renderer: newRenderer,
    });
};

const parseMarkdownFile = async (
    markdownFilename,
    keepMailChimpTags = true
) => {
    const fileContent = await fs.readFile(markdownFilename, 'utf8');

    const { content, data } = frontmatter(fileContent);
    const html = createHtmlFromMarkdown(content, keepMailChimpTags);

    return {
        html,
        markdown: content,
        frontmatter: data,
    };
};

module.exports = parseMarkdownFile;
