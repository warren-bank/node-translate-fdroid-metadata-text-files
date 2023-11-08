const {marked} = require('./lib/marked.min')

const plugin = (processing_stage, file_name, translated_strings_array) => {
  if ((processing_stage === 'post') && (file_name === 'description.txt')) {
    if (translated_strings_array.length === 1)
      parse_block(translated_strings_array)

    if (translated_strings_array.length > 1)
      parse_lines(translated_strings_array)
  }
}

const parse_block = (translated_strings_array) => {
  let file_content

  file_content = translated_strings_array[0]

  file_content = marked.parse(file_content)
    .replace(/\r/g,    '')
    .replace(/<p>/g,   "\n")
    .replace(/<\/p>/g, "\n")

  translated_strings_array[0] = file_content
}

const parse_lines = (translated_strings_array) => {
  for (let i=0; i < translated_strings_array.length; i++) {
    let translated_string

    translated_string = translated_strings_array[i]
    translated_string = marked.parseInline(translated_string)
    translated_string = translated_string.trim()

    translated_strings_array[i] = translated_string
  }
}

module.exports = plugin
