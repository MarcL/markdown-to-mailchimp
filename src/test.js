const parseMarkdownFile = require('./markdown')

parseMarkdownFile('./emails/03-11-2019.md').then(data => console.log(data))
