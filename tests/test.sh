#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# declare variables "LIBRE_TRANSLATE_API_KEY" and "LIBRE_TRANSLATE_API_URL"
source "${DIR}/LIBRE_TRANSLATE_API_CREDENTIALS.sh"

function translate-fdroid-metadata-text-files {
  node "${DIR}/../bin/translate-fdroid-metadata-text-files.js" "$@"
}

log_file="${DIR}/test.log"
[ -e "$log_file" ] && rm -f "$log_file"

metadata_dir="${DIR}/repo_01/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -o 'zh-Hans' -o 'zh-Hant' -d "$metadata_dir" -c 'icon.png' --nb --debug --html-entities >>"$log_file" 2>&1

metadata_dir="${DIR}/repo_02/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -o 'zh-Hans' -o 'zh-Hant' -d "$metadata_dir" -c 'icon.png' --nb --debug --marked >>"$log_file" 2>&1

metadata_dir="${DIR}/repo_03/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -o 'zh-Hans' -o 'zh-Hant' -d "$metadata_dir" -c 'icon.png' --nb --debug --html-entities --marked >>"$log_file" 2>&1
