const fs = require('fs').promises;
const handlebars = require('handlebars');

const renderHandlebars = async ({ filename, context }) => {
    const fileContent = await fs.readFile(filename, 'utf8');
    const template = handlebars.compile(fileContent, {
        noEscape: true,
    });
    return template(context);
};

module.exports = renderHandlebars;
