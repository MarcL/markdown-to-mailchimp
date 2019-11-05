const fs = require('fs').promises
const frontmatter = require('frontmatter')
const marked = require('marked')

// https://mailchimp.com/help/all-the-merge-tags-cheat-sheet/
const isMailChimpTag = text => /\|(.+?)\|/.test(text)

// TODO: Flag to decide whether to keep MailChimp tags or not
const createHtmlFromMarkdown = content => {
    const newRenderer = new marked.Renderer()
    newRenderer.em = text =>
        isMailChimpTag(text) ? `*${text}*` : `<em>${text}</em>`

    return marked(content, {
        renderer: newRenderer,
    })
}

const parseMarkdownFile = markdownFilename => {
    return fs
        .readFile(markdownFilename, 'utf8')
        .then(fileContent => frontmatter(fileContent))
        .then(parsedFile => {
            const { content, data } = parsedFile
            const html = createHtmlFromMarkdown(content)
            return {
                html,
                markdown: content,
                frontmatter: data,
            }
        })
}

module.exports = parseMarkdownFile
