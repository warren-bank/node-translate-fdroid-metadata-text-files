@echo off

set DIR=%~dp0.

rem :: declare variables "DEEPL_TRANSLATE_API_KEY" and "DEEPL_TRANSLATE_API_URL"
call "%DIR%\..\DEEPL_TRANSLATE_API_CREDENTIALS.bat"

set output_dir=%DIR%\output
set log_file=%output_dir%\test.log

goto :start

:scaffold_repo
  set repo_name=%~1
  set repo_dir="%output_dir%\%repo_name%"
  if exist %repo_dir% rmdir /Q /S %repo_dir%
  xcopy "%DIR%\..\data\repo_template" %repo_dir% /Q /I /S /E
  goto :eof

:scaffold_repos
  call :scaffold_repo "repo_01"
  call :scaffold_repo "repo_02"
  call :scaffold_repo "repo_03"
  goto :eof

:translate-fdroid-metadata-text-files
  call node "%DIR%\..\..\bin\translate-fdroid-metadata-text-files.js" -s "deepl" %*
  goto :eof

:start
if exist "%output_dir%" rmdir /Q /S "%output_dir%"
mkdir "%output_dir%"

call :scaffold_repos

set metadata_dir=%output_dir%\repo_01\metadata
call :translate-fdroid-metadata-text-files -i "en" -o "de" -o "es" -o "fr" -o "zh" -o "zh-TW" -o "zh-Hans" -o "zh-Hant" -d "%metadata_dir%" -c "icon.png" --nb --debug --html-entities >>"%log_file%" 2>&1

set metadata_dir=%output_dir%\repo_02\metadata
call :translate-fdroid-metadata-text-files -i "en" -o "de" -o "es" -o "fr" -o "zh" -o "zh-TW" -o "zh-Hans" -o "zh-Hant" -d "%metadata_dir%" -c "icon.png" --nb --debug --marked >>"%log_file%" 2>&1

set metadata_dir=%output_dir%\repo_03\metadata
call :translate-fdroid-metadata-text-files -i "en" -o "de" -o "es" -o "fr" -o "zh" -o "zh-TW" -o "zh-Hans" -o "zh-Hant" -d "%metadata_dir%" -c "icon.png" --nb --debug --html-entities --marked >>"%log_file%" 2>&1
