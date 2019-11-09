const fs = require('fs').promises;
const mjml = require('mjml');

const parseMarkdownFile = require('./markdown');
const renderHandlebars = require('./renderHandlebars');

const createHtmlEmailFromTemplate = mjmlContent => {
    return mjml(mjmlContent, {
        minify: true,
    });
};

const getFilenameWithoutExtension = filename => {
    const fileParts = filename.split('/');
    return fileParts[fileParts.length - 1].split('.md')[0];
};

const markdownToHtmlEmail = async options => {
    const {
        markdown: markdownFilename,
        template: mjmlTemplateFilename,
        output: outputDirectory,
        keeptags: keepMailChimpTags = true,
    } = options;

    const fileData = await parseMarkdownFile(
        markdownFilename,
        keepMailChimpTags
    );

    const mjmlRenderedTemplate = await renderHandlebars({
        filename: mjmlTemplateFilename,
        context: {
            frontmatter: fileData.frontmatter,
            content: fileData.html,
        },
    });

    const htmlEmail = createHtmlEmailFromTemplate(mjmlRenderedTemplate);

    if (outputDirectory) {
        const filename = getFilenameWithoutExtension(markdownFilename);
        const outputFilename = `${outputDirectory}/${filename}.html`;

        await fs.writeFile(outputFilename, htmlEmail.html, 'utf8');
    }

    return {
        ...fileData,
        ...htmlEmail,
        mjml: mjmlRenderedTemplate,
    };
};

module.exports = markdownToHtmlEmail;
