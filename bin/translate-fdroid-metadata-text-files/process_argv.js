const process_argv = require('@warren-bank/node-process-argv')

const argv_flags = {
  "--help":               {bool: true},
  "--version":            {bool: true},
  "--api-key":            {},
  "--api-url":            {},
  "--input-language":     {},
  "--output-language":    {many: true},
  "--metadata-directory": {file: "path-dirname-exists"},
  "--copy-file":          {many: true},
  "--force-overwrite":    {bool: true},
  "--plugin":             {file: "module", many: true},
  "--html-entities":      {bool: true},
  "--marked":             {bool: true},
  "--no-break-on-error":  {bool: true},
  "--debug":              {bool: true}
}

const argv_flag_aliases = {
  "--help":               ["-h"],
  "--version":            ["-v"],
  "--api-key":            ["-k"],
  "--api-url":            ["-u"],
  "--input-language":     ["-i"],
  "--output-language":    ["-o"],
  "--metadata-directory": ["-d"],
  "--copy-file":          ["-c"],
  "--force-overwrite":    ["-f"],
  "--plugin":             ["-p"],
  "--no-break-on-error":  ["--nb", "--no-break"]
}

let argv_vals = {}

try {
  argv_vals = process_argv(argv_flags, argv_flag_aliases)
}
catch(e) {
  console.log('ERROR: ' + e.message)
  process.exit(1)
}

if (argv_vals["--help"]) {
  const help = require('./help')
  console.log(help)
  process.exit(0)
}

if (argv_vals["--version"]) {
  const data = require('../../package.json')
  console.log(data.version)
  process.exit(0)
}

argv_vals["--api-key"] = argv_vals["--api-key"] || process.env["LIBRE_TRANSLATE_API_KEY"]
argv_vals["--api-url"] = argv_vals["--api-url"] || process.env["LIBRE_TRANSLATE_API_URL"]

if (!argv_vals["--api-key"]) {
  argv_vals["--api-key"] = null
}

if (!argv_vals["--api-url"]) {
  argv_vals["--api-url"] = 'https://libretranslate.com'
}

if (!argv_vals["--input-language"]) {
  console.log('ERROR: Language code for input file is required')
  process.exit(1)
}

if (!argv_vals["--output-language"] || !argv_vals["--output-language"].length) {
  // library will populate an array of all supported output languages
  argv_vals["--output-language"] = null
}

if (!argv_vals["--metadata-directory"]) {
  console.log('ERROR: Path to metadata directory is required')
  process.exit(1)
}

if (!Array.isArray(argv_vals["--plugin"])) {
  argv_vals["--plugin"] = []
}

if (argv_vals["--marked"]) {
  const plugin = require('../../plugins/marked/post')
  argv_vals["--plugin"].unshift(plugin)
}

if (argv_vals["--html-entities"]) {
  let plugin

  plugin = require('../../plugins/html-entities/post')
  argv_vals["--plugin"].unshift(plugin)

  plugin = require('../../plugins/html-entities/pre')
  argv_vals["--plugin"].unshift(plugin)
}

module.exports = argv_vals
