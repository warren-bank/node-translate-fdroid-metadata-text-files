### [translate-fdroid-metadata-text-files](https://github.com/warren-bank/node-translate-fdroid-metadata-text-files)

Command-line utility to use an online language translation service to automate the localization of F-Droid metadata text files.

#### Requirements:

* access to a server hosting one of the supported language translation service APIs
  - [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate#mirrors)
    * API key
    * API URL
  - [DeepL](https://www.deepl.com/en/pro-api)
    * API key

#### Supported Languages

* the list of supported input and output languages depends upon the chosen API
  - [LibreTranslate](https://github.com/warren-bank/node-libre-language-translator#supported-languages)
    * there is no guarantee for consistency, either between server instances or over time
    * to obtain a real-time list of supported languages from a specific server instance, directly query its `<API URL>/languages` [API](https://libretranslate.com/docs) endpoint
  - [DeepL](https://github.com/warren-bank/node-deepl-language-translator#supported-input-languages)

#### Installation:

```bash
npm install --global @warren-bank/translate-fdroid-metadata-text-files
```

#### Usage:

```bash
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
```

#### Structure of F-Droid Metadata Directory:

```text
  <repository-root>
  └─ metadata
     └─ <package-id>
        └─ <locale>
           ├─ icon.png
           ├─ ...
           ├─ title.txt
           ├─ summary.txt
           └─ description.txt
```

#### F-Droid Documentation

* relevent:
  - [All About Descriptions, Graphics, and Screenshots: In repository build metadata](https://f-droid.org/docs/All_About_Descriptions_Graphics_and_Screenshots/#in-the-apps-build-metadata-in-an-fdroiddata-collection)
* related:
  - [Build Metadata Reference](https://f-droid.org/docs/Build_Metadata_Reference)

#### Behavior of App

* walks the directory tree, starting in the `metadata` directory
* for each `<package-id>`
  - look for a `<locale>` directory named: `<input-language>`
  - if found:
    * for each file named: [`title.txt`, `summary.txt`, `description.txt`]
      - read contents of file
      - for each `<output-language>`
        * perform translation
        * save to file path:<br>`metadata/<package-id>/<output-language>/<filename>`

#### Example:

```bash
  source ~/LIBRE_TRANSLATE_API_CREDENTIALS.sh

  translate-fdroid-metadata-text-files -s 'libre' -i 'en' -d '/path/to/my-fdroid-repo/metadata' -c 'icon.png'
```

#### Plugins:

* each plugin is a CommonJS module that exports a single function
* the signature of this function is:
  ```javascript
    (processing_stage, file_name, strings_array) => undefined
  ```
* where:
  - when `processing_stage === 'pre'`
    * `strings_array` contains all of the strings to translate in the input locale
    * `strings_array` can be modified before it is translated
  - when `processing_stage === 'post'`
    * `strings_array` contains translations in an output locale
    * `strings_array` can be modified before it is saved to file
* for examples, please refer to the embedded plugins:
  - pre-processors:
    * [`--html-entities`](./plugins/html-entities/pre/index.js)
  - post-processors:
    * [`--html-entities`](./plugins/html-entities/post/index.js)
    * [`--marked`](./plugins/marked/post/index.js)

#### Embedded Plugins:

`--html-entities` encodes the following:

* leading whitespace
  - indentation is preserved
* markdown list syntax
  - "*" is replaced by a unicode black circle
  - "-" is replaced by a unicode white circle
  - ordered list numbering is preserved
  - when possible, list items are wrapped and indented;
    so each line contains a maximum of 40 characters

comparison of test results:

* HTML entities and unicode characters __are__ rendered correctly by f-droid clients
  - as produced by: `--html-entities`
* HTML tags __are NOT__ rendered correctly by f-droid clients,<br>and look really bad
  - as produced by: `--marked`

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
