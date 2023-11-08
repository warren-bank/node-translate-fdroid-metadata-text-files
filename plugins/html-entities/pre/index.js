const worker = require('../worker')

const plugin = (processing_stage, file_name, input_strings_array) => {
  if ((processing_stage === 'pre') && (file_name === 'description.txt') && (input_strings_array.length === 1)) {
    const file_content = input_strings_array.shift()

    input_strings_array.push(
      ...worker.split_lines(file_content)
    )

    worker.strip_line_prefixes(file_name, input_strings_array)
  }
}

module.exports = plugin
