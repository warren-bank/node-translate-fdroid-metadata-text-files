@echo off

rem :: declare variables "IBM_TRANSLATOR_API_KEY" and "IBM_TRANSLATOR_API_URL"
call "%USERPROFILE%\IBM_TRANSLATOR_API_CREDENTIALS.bat"

set DIR=%~dp0.
goto :start

:translate-fdroid-metadata-text-files
  call node "%DIR%\..\bin\translate-fdroid-metadata-text-files.js" %*
  goto :eof

:start
set metadata_dir=%DIR%\my-fdroid-repo\metadata
set log_file=%DIR%\test.log

call :translate-fdroid-metadata-text-files -i "en" -o "de" -o "es" -o "fr" -o "zh" -o "zh-TW" -d "%metadata_dir%" -c "icon.png" --marked >"%log_file%" 2>&1
