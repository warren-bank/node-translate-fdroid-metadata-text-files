const worker = require('../worker')

const plugin = (processing_stage, file_name, translated_strings_array) => {
  if ((processing_stage === 'post') && (file_name === 'description.txt')) {
    worker.prepend_line_prefixes(file_name, translated_strings_array)

    replace_with_html_entities(translated_strings_array)
  }
}

const replace_with_html_entities = (translated_strings_array, max_chars_per_line = 40) => {
  let line, matches, new_lines, next_line

  for (let i=0; i < translated_strings_array.length; i++) {
    line = translated_strings_array[i]
    matches = worker.get_line_prefix_matches(line)

    if (matches && (matches.length >= 3)) {
      const L0 = matches[0].length

      if (L0) {
        const R0 = line.substring(L0, line.length)
        const L1 = matches[1] ? matches[1].length : 0
        const L2 = matches[2] ? matches[2].length : 0

        const words = R0.split(/([ ]+)/)
        const initial_line_length = L1 + L2

        new_lines = []
        next_line = initialize_next_line(L1, matches[2])

        let line_length = initial_line_length
        let next_word

        advance_to_next_word(words)

        while (words.length) {
          if ((line_length > initial_line_length) && ((line_length + words[0].length) > max_chars_per_line)) {
            new_lines.push(next_line.trim())
            next_line = initialize_next_line(L1 + L2, '')
            line_length = initial_line_length

            advance_to_next_word(words)

            if (!words.length) {
              next_line = ''
              break
            }
          }

          next_word = words.shift()
          next_line   += next_word
          line_length += next_word.length
        }

        if (next_line)
          new_lines.push(next_line.trim())

        translated_strings_array[i] = new_lines.join("\n")
      }
    }
  }
}

const initialize_next_line = (L1, M2) => {
  let next_line = ''

  if (L1) {
    next_line += ('&nbsp;').repeat(L1)
  }

  if (M2) {
    switch(M2[0]) {
      case '*':
        next_line += '● '
        break
      case '-':
        next_line += '○ '
        break
      default:
        next_line += M2
    }
  }

  return next_line
}

const advance_to_next_word = (words) => {
  while(words.length && words[0].trim() === '')
    words.shift()
}

module.exports = plugin
