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

        const input_filepath      = path.join(input_dirpath, state["filename"])
        const input_strings_array = []

        {
          const input_filecontent = fs.readFileSync(input_filepath, {encoding: "utf8"})

          if (input_filecontent)
            input_strings_array.push(input_filecontent.trim())
        }

        if (input_strings_array.length) {
          // opportunity for plugins to modify input_strings_array

          apply_pre_plugins_to_input(argv_vals["--plugin"], state["filename"], input_strings_array, input_filepath)
        }

        if (input_strings_array.length) {
          debug_strings_array(argv_vals["--debug"], input_strings_array, input_filepath)

          apply_post_plugins_to_input(argv_vals["--plugin"], state["filename"], input_strings_array, input_filepath)

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
              input_strings_array
            )

            if (Array.isArray(translated_strings_array) && translated_strings_array.length) {
              debug_strings_array(argv_vals["--debug"], translated_strings_array, output_filepath)

              apply_post_plugins_to_output(argv_vals["--plugin"], state["filename"], translated_strings_array, output_filepath)
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

const apply_pre_plugins_to_input = function(plugins, input_filename, input_strings_array, input_filepath) {
  const input_filecontent = input_strings_array.join("\n").trim()

  apply_plugins(plugins, 'pre', input_filename, input_strings_array)
  const updated_filecontent = input_strings_array.join("\n").trim()

  if (updated_filecontent !== input_filecontent) {
    // overwrite
    fs.writeFileSync(
      input_filepath,
      updated_filecontent,
      {encoding: "utf8"}
    )

    // backup
    {
      const backup_filepath = input_filepath + '.backup.pre'

      if (!fs.existsSync(backup_filepath)) {
        // backup original markdown
        fs.writeFileSync(
          backup_filepath,
          input_filecontent,
          {encoding: "utf8"}
        )
      }
    }
  }
}

const apply_post_plugins_to_input = function(plugins, input_filename, input_strings_array, input_filepath) {
  // input_strings_array are now immutable.
  // make a shallow copy to prevent changes by plugins.
  const translated_strings_array = [...input_strings_array]

  const input_filecontent = translated_strings_array.join("\n").trim()

  apply_plugins(plugins, 'post', input_filename, translated_strings_array)
  const updated_filecontent = translated_strings_array.join("\n").trim()

  if (updated_filecontent !== input_filecontent) {
    // overwrite
    fs.writeFileSync(
      input_filepath,
      updated_filecontent,
      {encoding: "utf8"}
    )

    // backup
    {
      const backup_filepath = input_filepath + '.backup.post'

      if (!fs.existsSync(backup_filepath)) {
        // backup original markdown
        fs.writeFileSync(
          backup_filepath,
          input_filecontent,
          {encoding: "utf8"}
        )
      }
    }
  }
}

const apply_post_plugins_to_output = function(plugins, output_filename, translated_strings_array, output_filepath) {
  apply_plugins(plugins, 'post', output_filename, translated_strings_array)
  const output_filecontent = translated_strings_array.join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  if (output_filecontent) {
    // save
    fs.writeFileSync(
      output_filepath,
      output_filecontent,
      {encoding: "utf8"}
    )
  }
}

const apply_plugins = function(plugins, processing_stage, file_name, strings_array) {
  if (Array.isArray(plugins) && plugins.length) {
    for (const plugin of plugins) {
      plugin(processing_stage, file_name, strings_array)
    }
  }
}

// -----------------------------------------------------------------------------

const debug_strings_array = function(do_debug, strings_array, file_path) {
  if (!do_debug) return

  const debug_filepath = file_path + '.debug.json'
  const debug_json     = JSON.stringify(strings_array, null, 2)

  // save
  fs.writeFileSync(
    debug_filepath,
    debug_json,
    {encoding: "utf8"}
  )
}

// -----------------------------------------------------------------------------

module.exports = process_cli
