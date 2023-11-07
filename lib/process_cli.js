const translate = require('@warren-bank/ibm-watson-language-translator')

const path = require('path')
const fs   = require('fs')

// -----------------------------------------------------------------------------

const state = {
  "metadata-directory": null,
  "package-id":         null,
  "input-language":     null,
  "output-language":    null,
  "filename":           null,
  "did-copy-files":     null
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
      state["package-id"]     = metadir_entry.name
      state["did-copy-files"] = false

      const input_dirpath = path.join(
        state["metadata-directory"],
        state["package-id"],
        state["input-language"]
      )

      const filenames = find_input_text_files(input_dirpath)

      for (const filename of filenames) {
        state["filename"] = filename

        const input_filepath    = path.join(input_dirpath, state["filename"])
        const input_filecontent = fs.readFileSync(input_filepath, {encoding: "utf8"})

        if (input_filecontent) {
          apply_plugins_to_input(argv_vals["--plugin"], state["filename"], input_filecontent, input_filepath)

          for (const output_language of argv_vals["--output-language"]) {
            state["output-language"] = output_language

            const output_dirpath = path.join(
              state["metadata-directory"],
              state["package-id"],
              state["output-language"]
            )

            if (!state["did-copy-files"]) {
              if (!fs.existsSync(output_dirpath))
                fs.mkdirSync(output_dirpath)

              copy_files(input_dirpath, output_dirpath, argv_vals["--copy-file"], argv_vals["--force-overwrite"])
            }

            const output_filepath = path.join(output_dirpath, state["filename"])

            if (fs.existsSync(output_filepath) && !argv_vals["--force-overwrite"])
              continue

            const translated_strings_array = await translate(
              argv_vals["--api-key"],
              argv_vals["--api-url"],
              argv_vals["--input-language"],
              output_language,
              [input_filecontent]
            )

            if (Array.isArray(translated_strings_array) && (translated_strings_array.length === 1) && translated_strings_array[0]) {
              apply_plugins_to_output(argv_vals["--plugin"], state["filename"], translated_strings_array[0], output_filepath)
            }
          }

          state["did-copy-files"] = true
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

const copy_files = function(input_dirpath, output_dirpath, filenames, force_overwrite) {
  if (!Array.isArray(filenames)) return

  for (const filename of filenames) {
    const input_filepath  = path.join(input_dirpath,  filename)
    const output_filepath = path.join(output_dirpath, filename)

    if (fs.existsSync(input_filepath) && (force_overwrite || !fs.existsSync(output_filepath)))
      fs.copyFileSync(input_filepath, output_filepath)
  }
}

// -----------------------------------------------------------------------------

const apply_plugins_to_input = function(plugins, input_filename, input_filecontent, input_filepath) {
  const updated_filecontent = apply_plugins(plugins, input_filename, input_filecontent)

  if (updated_filecontent !== input_filecontent) {
    // overwrite
    fs.writeFileSync(
      input_filepath,
      updated_filecontent,
      {encoding: "utf8"}
    )
  }
}

const apply_plugins_to_output = function(plugins, output_filename, output_filecontent, output_filepath) {
  output_filecontent = apply_plugins(plugins, output_filename, output_filecontent)

  if (output_filecontent) {
    // save
    fs.writeFileSync(
      output_filepath,
      output_filecontent,
      {encoding: "utf8"}
    )
  }
}

const apply_plugins = function(plugins, file_name, file_content) {
  if (Array.isArray(plugins) && plugins.length) {
    for (const plugin of plugins) {
      file_content = plugin(file_name, file_content)
    }
  }

  return file_content
}

// -----------------------------------------------------------------------------

module.exports = process_cli
