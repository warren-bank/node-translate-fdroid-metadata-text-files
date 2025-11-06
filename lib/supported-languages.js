/* -----------------------------------------------------------------------------
 * https://f-droid.org/docs/All_About_Descriptions_Graphics_and_Screenshots/
 * https://f-droid.org/docs/Translation_and_Localization/
 * https://gitlab.com/fdroid/fdroiddata-localizations
 *
 * https://forum.f-droid.org/t/fdroid-localisation-rules-list-of-supported-locales/1615
 *   ???
 * -----------------------------------------------------------------------------
 */

const get_fdroid_locale_directory_name = (output_language_code) => {
  // enforce the convention:
  //   - lowercase language code
  //   - uppercase region code
  let [lcode, rcode] = output_language_code.split('-')

  if (!lcode)
    throw new Error('invalid output language code')

  lcode = lcode.toLowerCase()

  switch(lcode) {
    case 'zt':
      lcode = 'zh'
      rcode = 'TW'
      break
  }

  if (rcode) {
    rcode = rcode.toUpperCase()

    if (lcode === 'zh') {
      switch(rcode) {
        case 'HANS':
          rcode = null
          break
        case 'HANT':
          rcode = 'TW'
          break
      }
    }

    if (lcode === 'es') {
      switch(rcode) {
        case '419':
          rcode = 'MX'
          break
      }
    }
  }

  return rcode
    ? `${lcode}-${rcode}`
    : lcode
}

module.exports = get_fdroid_locale_directory_name
