### [translate-fdroid-metadata-text-files](https://github.com/warren-bank/node-translate-fdroid-metadata-text-files)

Command-line utility to use the IBM Watson&trade; Language Translator service to translate F-Droid metadata text files.

#### Requirements:

* an [IBM Cloud account](https://github.com/warren-bank/node-ibm-watson-language-translator/blob/master/.etc/docs/IBM-Cloud-account.md)
  - API key
  - API URL

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

"-k" <key>
"--api-key" <key>
    [optional] IBM Cloud account API key.
    Default: Value is read from "IBM_TRANSLATOR_API_KEY" environment variable.

"-u" <url>
"--api-url" <url>
    [optional] IBM Cloud account API URL.
    Default: Value is read from "IBM_TRANSLATOR_API_URL" environment variable.

"-i" <language>
"--input-language" <language>
    [required] Language code for input locale directory.

"-o" <language>
"--output-language" <language>
    [optional] Language code for output file.
    note: This flag can be repeated to produce multiple output files.
    note: Input language is ignored.
    Default: Produce output files for all languages.

"-d" <dirpath>
"--metadata-directory" <dirpath>
    [required] Directory path to F-Droid metadata.

language codes:
===============
  "ar"    Arabic
  "eu"    Basque [1]
  "bn"    Bengali
  "bs"    Bosnian
  "bg"    Bulgarian
  "ca"    Catalan [1]
  "zh"    Chinese (Simplified)
  "zh-TW" Chinese (Traditional)
  "hr"    Croatian
  "cs"    Czech
  "da"    Danish
  "nl"    Dutch
  "en"    English
  "et"    Estonian
  "fi"    Finnish
  "fr"    French
  "fr-CA" French (Canadian)
  "de"    German
  "el"    Greek
  "gu"    Gujarati
  "he"    Hebrew
  "hi"    Hindi
  "hu"    Hungarian
  "ga"    Irish
  "id"    Indonesian
  "it"    Italian
  "ja"    Japanese
  "ko"    Korean
  "lv"    Latvian
  "lt"    Lithuanian
  "ms"    Malay
  "ml"    Malayalam
  "mt"    Maltese
  "cnr"   Montenegrin
  "ne"    Nepali
  "nb"    Norwegian Bokmål
  "pl"    Polish
  "pt"    Portuguese
  "ro"    Romanian
  "ru"    Russian
  "sr"    Serbian
  "si"    Sinhala
  "sk"    Slovak
  "sl"    Slovenian
  "es"    Spanish
  "sv"    Swedish
  "ta"    Tamil
  "te"    Telugu
  "th"    Thai
  "tr"    Turkish
  "uk"    Ukrainian
  "ur"    Urdu
  "vi"    Vietnamese
  "cy"    Welsh

[1] Basque and Catalan are supported only for translation to and from Spanish.
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
  source ~/IBM_TRANSLATOR_API_CREDENTIALS.sh

  translate-fdroid-metadata-text-files -i 'en' -d '/path/to/my-fdroid-repo/metadata'
```

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
