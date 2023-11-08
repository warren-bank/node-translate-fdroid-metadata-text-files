const state = {
  line_prefixes: {}
}

const split_lines = (file_content) => file_content.split(/\r?\n/)

const line_prefix_regex = /^([ ]+)?((?:[\*\-]|\d+\.) )?/

const get_line_prefix_matches = (line) => line_prefix_regex.exec(line)

// performed once for 'description.txt' of input locale
const strip_line_prefixes = (file_name, input_strings_array) => {
  state.line_prefixes[file_name] = []
  const line_prefixes = state.line_prefixes[file_name]

  let line, matches, prefix

  for (let i=0; i < input_strings_array.length; i++) {
    line = input_strings_array[i]

    matches = get_line_prefix_matches(line)

    if (matches && matches.length && matches[0].length) {
      prefix = matches[0]
      line   = line.substring(prefix.length, line.length)

      input_strings_array[i] = line
    }
    else {
      prefix = ''
    }

    line_prefixes.push(prefix)
  }
}

// perform for 'description.txt' of each output locale
const prepend_line_prefixes = (file_name, translated_strings_array) => {
  const line_prefixes = state.line_prefixes[file_name]

  // sanity check
  if (!Array.isArray(line_prefixes) || !Array.isArray(translated_strings_array) || (translated_strings_array.length !== line_prefixes.length))
    throw new Error('Error: Length of translated strings array is incorrect. File name: ' + file_name + '. Expected: ' + line_prefixes.length + '. Received: ' + translated_strings_array.length + '.')

  for (let i=0; i < translated_strings_array.length; i++) {
    translated_strings_array[i] = line_prefixes[i] + translated_strings_array[i]
  }
}

module.exports = {
  split_lines,
  get_line_prefix_matches,
  strip_line_prefixes,
  prepend_line_prefixes
}
