#!/usr/bin/env bash

# declare variables "IBM_TRANSLATOR_API_KEY" and "IBM_TRANSLATOR_API_URL"
source "${HOME}/IBM_TRANSLATOR_API_CREDENTIALS.sh"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function translate-fdroid-metadata-text-files {
  node "${DIR}/../bin/translate-fdroid-metadata-text-files.js" "$@"
}

metadata_dir="${DIR}/my-fdroid-repo/metadata"
log_file="${DIR}/test.log"

translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -d "$metadata_dir" -c 'icon.png' >"$log_file" 2>&1
