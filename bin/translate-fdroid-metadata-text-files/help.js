const help = `
translate-fdroid-metadata-text-files <options>

options:
========
"-h"
"--help"
  Print a help message describing all command-line options.

"-v"
"--version"
  Display the version.

"-s" <service>
"--api-service" <service>
    [required] Name of language translation service API.
    enum: "libre", "deepl"

"-k" <key>
"--api-key" <key>
    [optional] API key.
    Fallback for "libre" service: Value of the "LIBRE_TRANSLATE_API_KEY" environment variable, if one exists.
    Fallback for "deepl" service: Value of the "DEEPL_TRANSLATE_API_KEY" environment variable, if one exists.

"-u" <url>
"--api-url" <url>
    [optional] API URL.
    Fallback for "libre" service: Value of the "LIBRE_TRANSLATE_API_URL" environment variable, if one exists.
    Fallback for "deepl" service: Value of the "DEEPL_TRANSLATE_API_URL" environment variable, if one exists.
    Default for "libre" service: "https://libretranslate.com"
    Default for "deepl" service for free accounts: "https://api-free.deepl.com/v2"
    Default for "deepl" service for paid accounts: "https://api.deepl.com/v2"

"-i" <language>
"--input-language" <language>
  [required] Language code for input locale directory.

"-o" <language>
"--output-language" <language>
  [optional] Language code for output locale directory.
  Note: This flag can be repeated to output multiple locales.
  Note: Input language is ignored.
  Default: Produce output for all supported language codes.

"-d" <dirpath>
"--metadata-directory" <dirpath>
  [required] Directory path to F-Droid metadata.

"-c" <filename>
"--copy-file" <filename>
  [optional] File name of a non-translated asset to copy
  from the input locale directory to all output locale directories.
  Note: This flag can be repeated to copy multiple files.

"-f"
"--force-overwrite"
  [optional] Boolean flag to force the overwriting
  of files that already exist in output locale directories.
  Default: Pre-existing files are not modified.

"-p" <filepath>
"--plugin" <filepath>
  [optional] File path to a custom plugin.
  Note: This flag can be repeated to chain multiple plugins.

"--html-entities"
  [optional] Boolean flag to apply an embedded post-processor plugin,
  which converts limited markdown to html entities in "description.txt"
  for all locales after translation.
  Note: This plugin is applied before all post-processor plugins.

"--marked"
  [optional] Boolean flag to apply an embedded post-processor plugin,
  which converts markdown to html in "description.txt"
  for all locales after translation.
  Note: This plugin is applied before custom post-processor plugins.

"--nb"
"--no-break"
"--no-break-on-error"
  [optional] When translating multiple output languages and one encounters an error,
  print a log statement and continue processing the remaining output languages.
  Default: Disabled. The library throws an error, and the command-line utility exits with code.

"--debug"
  [optional] Saves raw translation string dump files for all locales.
`

module.exports = help
