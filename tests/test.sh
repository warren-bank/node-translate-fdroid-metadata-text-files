#!/usr/bin/env bash

# declare variables "IBM_TRANSLATOR_API_KEY" and "IBM_TRANSLATOR_API_URL"
source "${HOME}/IBM_TRANSLATOR_API_CREDENTIALS.sh"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function translate-fdroid-metadata-text-files {
  node "${DIR}/../bin/translate-fdroid-metadata-text-files.js" "$@"
}

log_file="${DIR}/test.log"
[ -e "$log_file" ] && rm -f "$log_file"

metadata_dir="${DIR}/repo_01/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -d "$metadata_dir" -c 'icon.png' --debug --html-entities >>"$log_file" 2>&1

metadata_dir="${DIR}/repo_02/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -d "$metadata_dir" -c 'icon.png' --debug --marked >>"$log_file" 2>&1

metadata_dir="${DIR}/repo_03/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -d "$metadata_dir" -c 'icon.png' --debug --html-entities --marked >>"$log_file" 2>&1
