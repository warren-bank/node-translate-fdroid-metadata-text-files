#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# declare variables "DEEPL_TRANSLATE_API_KEY" and "DEEPL_TRANSLATE_API_URL"
source "${DIR}/../DEEPL_TRANSLATE_API_CREDENTIALS.sh"

output_dir="${DIR}/output"
log_file="${output_dir}/test.log"

function scaffold_repo {
  repo_name="$1"
  repo_dir="${output_dir}/${repo_name}"
  [ -d "$repo_dir" ] && rm -rf "$repo_dir"
  cp -r "${DIR}/../data/repo_template" "$repo_dir"
}

function scaffold_repos {
  scaffold_repo 'repo_01'
  scaffold_repo 'repo_02'
  scaffold_repo 'repo_03'
}

function translate-fdroid-metadata-text-files {
  node "${DIR}/../../bin/translate-fdroid-metadata-text-files.js" -s 'deepl' "$@"
}

[ -d "$output_dir" ] && rm -rf "$output_dir"
mkdir "$output_dir"

scaffold_repos

metadata_dir="${output_dir}/repo_01/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -o 'zh-Hans' -o 'zh-Hant' -d "$metadata_dir" -c 'icon.png' --nb --debug --html-entities >>"$log_file" 2>&1

metadata_dir="${output_dir}/repo_02/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -o 'zh-Hans' -o 'zh-Hant' -d "$metadata_dir" -c 'icon.png' --nb --debug --marked >>"$log_file" 2>&1

metadata_dir="${output_dir}/repo_03/metadata"
translate-fdroid-metadata-text-files -i 'en' -o 'de' -o 'es' -o 'fr' -o 'zh' -o 'zh-TW' -o 'zh-Hans' -o 'zh-Hant' -d "$metadata_dir" -c 'icon.png' --nb --debug --html-entities --marked >>"$log_file" 2>&1
