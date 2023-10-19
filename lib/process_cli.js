const translate = require('@warren-bank/ibm-watson-language-translator')

const path = require('path')
const fs   = require('fs')

// -----------------------------------------------------------------------------

const state = {
  "metadata-directory": null,
  "package-id":         null,
  "input-language":     null,
  "output-language":    null,
  "filename":           null
}

const process_cli = async function(argv_vals) {
  state["metadata-directory"] = argv_vals["--metadata-directory"]
  state["input-language"]     = argv_vals["--input-language"]

  const metadir_contents = fs.readdirSync(
    state["metadata-directory"],
    {encoding: "utf8", withFileTypes: true}
  )

  for (const metadir_entry of metadir_contents) {
    if (metadir_entry.isDirectory()) {
      state["package-id"] = metadir_entry.name

      const input_dirpath = path.join(
        state["metadata-directory"],
        state["package-id"],
        state["input-language"]
      )

      const filenames = find_input_text_files(input_dirpath)

      for (filename of filenames) {
        state["filename"] = filename

        const input_filepath    = path.join(input_dirpath, state["filename"])
        const input_filecontent = fs.readFileSync(input_filepath, {encoding: "utf8"})

        if (input_filecontent) {
          for (const output_language of argv_vals["--output-language"]) {
            state["output-language"] = output_language

            const output_dirpath = path.join(
              state["metadata-directory"],
              state["package-id"],
              state["output-language"]
            )

            const output_filepath = path.join(output_dirpath, state["filename"])

            const translated_strings_array = await translate(
              argv_vals["--api-key"],
              argv_vals["--api-url"],
              argv_vals["--input-language"],
              output_language,
              [input_filecontent]
            )

            if (Array.isArray(translated_strings_array) && (translated_strings_array.length === 1) && translated_strings_array[0]) {
              if (!fs.existsSync(output_dirpath)) {
                fs.mkdirSync(output_dirpath)
              }

              fs.writeFileSync(
                output_filepath,
                translated_strings_array[0],
                {encoding: "utf8"}
              )
            }
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------

const find_input_text_files = function(input_dirpath) {
  const all_text_files = [
    "title.txt",
    "summary.txt",
    "description.txt"
  ]

  const found_text_files = all_text_files.filter(
    filename => fs.existsSync( path.join(input_dirpath, filename) )
  )

  return found_text_files
}

// -----------------------------------------------------------------------------

module.exports = process_cli
