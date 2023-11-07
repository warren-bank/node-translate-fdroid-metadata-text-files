const {marked} = require('./lib/marked.min')

const plugin = (file_name, file_content) => {
  if (file_name === 'description.txt') {
    file_content = marked.parse(file_content)
      .replace(/\r/g,     '')
      .replace(/<p>/g,    "\n")
      .replace(/<\/p>/g,  "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  }

  return file_content
}

module.exports = plugin
