const fs = require('fs').promises
const handlebars = require('handlebars')

const renderHandlebars = ({ filename, context }) => {
    return fs.readFile(filename, 'utf8').then(fileContent => {
        const template = handlebars.compile(fileContent, {
            noEscape: true,
        })

        return template(context)
    })
}

module.exports = renderHandlebars
