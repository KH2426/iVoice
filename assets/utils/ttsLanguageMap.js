// utils/ttsLanguageMap.js
// Map 3-letter language codes to BCP‑47 locales supported by react-native-tts.
// Extend this object as you discover new supported voices.

export const ttsLanguageMap = {
    cmn: 'zh-CN',   // Mandarin Chinese
    spa: 'es-ES',   // Spanish
    eng: 'en-US',   // English
    hin: 'hi-IN',   // Hindi
    ben: 'bn-IN',   // Bengali
    por: 'pt-PT',   // Portuguese
    rus: 'ru-RU',   // Russian
    jpn: 'ja-JP',   // Japanese
    pan: 'pa-IN',   // Punjabi
    mar: 'mr-IN',   // Marathi
    tel: 'te-IN',   // Telugu
    tur: 'tr-TR',   // Turkish
    kor: 'ko-KR',   // Korean
    fra: 'fr-FR',   // French
    deu: 'de-DE',   // German
    vie: 'vi-VN',   // Vietnamese
    tam: 'ta-IN',   // Tamil
    yue: 'zh-HK',   // Cantonese
    urd: 'ur-PK',   // Urdu
    jav: 'jv-ID',   // Javanese
    ita: 'it-IT',   // Italian
    pes: 'fa-IR',   // Persian
    guj: 'gu-IN',   // Gujarati
    arb: 'ar-SA',   // Arabic
    pol: 'pl-PL',   // Polish
    ukr: 'uk-UA',   // Ukrainian
    ron: 'ro-RO',   // Romanian
    hau: 'ha-NG',   // Hausa
    kan: 'kn-IN',   // Kannada
    zsm: 'ms-MY',   // Malay
    bho: 'hi-IN',   // Bhojpuri (fallback to Hindi)
    min: 'zh-CN',   // Min Nan Chinese (fallback to Mandarin)
    yor: 'yo-NG',   // Yoruba
    mal: 'ml-IN',   // Malayalam
    ory: 'or-IN',   // Odia
    mya: 'my-MM',   // Burmese
    sun: 'su-ID',   // Sundanese
    amh: 'am-ET',   // Amharic
    ind: 'id-ID',   // Indonesian
    swh: 'sw-KE',   // Swahili
  
    // Fallback: if a code isn't listed here, getTTSLanguage() will default to 'en-US'.
  };
  