@echo off

set DIR=%~dp0.

rem :: declare variables "LIBRE_TRANSLATE_API_KEY" and "LIBRE_TRANSLATE_API_URL"
call "%DIR%\LIBRE_TRANSLATE_API_CREDENTIALS.bat"

goto :start

:translate-fdroid-metadata-text-files
  call node "%DIR%\..\bin\translate-fdroid-metadata-text-files.js" %*
  goto :eof

:start
set log_file=%DIR%\test.log
if exist "%log_file%" del "%log_file%"

set metadata_dir=%DIR%\repo_01\metadata
call :translate-fdroid-metadata-text-files -i "en" -o "de" -o "es" -o "fr" -o "zh" -o "zh-TW" -o "zh-Hans" -o "zh-Hant" -d "%metadata_dir%" -c "icon.png" --nb --debug --html-entities >>"%log_file%" 2>&1

set metadata_dir=%DIR%\repo_02\metadata
call :translate-fdroid-metadata-text-files -i "en" -o "de" -o "es" -o "fr" -o "zh" -o "zh-TW" -o "zh-Hans" -o "zh-Hant" -d "%metadata_dir%" -c "icon.png" --nb --debug --marked >>"%log_file%" 2>&1

set metadata_dir=%DIR%\repo_03\metadata
call :translate-fdroid-metadata-text-files -i "en" -o "de" -o "es" -o "fr" -o "zh" -o "zh-TW" -o "zh-Hans" -o "zh-Hant" -d "%metadata_dir%" -c "icon.png" --nb --debug --html-entities --marked >>"%log_file%" 2>&1
