/**
 * @license Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Constants for the VAST Redirect Signal Inspector.
 * @author mbordihn@google.com (Markus Bordihn)
 */

export const IMPLEMENTATION_TYPE = {
  WEB: 'web',
  MOBILE_APP: 'mobileApp',
  CONNECTED_TV: 'connectedTV',
  AUDIO: 'audio',
  DIGITAL_OUT_OF_HOME: 'digitalOutOfHome',
};

export const TAG_TYPE = {
  IMA_SDK: 'IMA SDK',
  PAL: 'PAL',
  PAL_LEGACY: 'PAL (legacy)',
  PAI: 'PAI',
  PAI_PAL: 'PAI + PAL',
  STANDARD: 'Standard',
  UNKNOWN: 'Unknown',
};

export const EXAMPLE_VAST_URLS = {
  [TAG_TYPE.IMA_SDK]:
    'https://pagead2.googlesyndication.com/gampad/ads?iu=%2F21775744923%2Fexternal%2Fsingle_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=fluid%7C728x90%2Cfluid%7C300x250%2Cfluid%7C180x150%2Cfluid%7C120x60%2Cfluid%7C88x31%2Cfluid%7C300x60%2Cfluid%7C300x100%2Cfluid%7C320x50%2Cfluid%7C468x60%2Cfluid%7C300x600%2Cfluid%7C160x600&gdfp_req=1&output=xml_vast4&unviewed_position_start=1&env=vp&correlator=2920090807217010&sdkv=h.3.688.0&osd=2&frm=0&vis=1&sdr=1&hl=en&afvsz=200x200%2C250x250%2C300x250%2C450x50%2C468x60%2C480x70&is_amp=0&uach=WyJtYWNPUyIsIjE1LjMuMSIsImFybSIsIiIsIjEzMy4wLjY5NDMuMTQzIixudWxsLDAsbnVsbCwiNjQiLFtbIk5vdChBOkJyYW5kIiwiOTkuMC4wLjAiXSxbIkdvb2dsZSBDaHJvbWUiLCIxMzMuMC42OTQzLjE0MyJdLFsiQ2hyb21pdW0iLCIxMzMuMC42OTQzLjE0MyJdXSwwXQ..&u_so=l&ctv=0&mpt=h5_vsi&sdki=445&ptt=20&adk=1083529519&sdk_apis=2%2C7%2C8&omid_p=Google1%2Fh.3.688.0&media_url=https%3A%2F%2Fs0.2mdn.net%2F4253510%2Fgoogle_ddm_animation_480P.mp4&sid=143B1AB4-F655-425F-B5C2-D49BC807C875&nel=1&td=1&eid=95322027%2C95326337%2C95331589%2C95332046%2C95351091&ref=https%3A%2F%2Fwww.google.com%2F&url=https%3A%2F%2Fgoogleads.github.io%2Fgoogleads-ima-html5%2Fvsi%2F&dlt=1741201107292&idt=496&dt=1741201112814&pvsid=342258371105668&scor=768096627554145',
  [TAG_TYPE.PAL]:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&givn=AQzzBGQEVGjRW4svCeU1wKejaeWhATJKF8aSNC5L1tYtef8HbnrkSGMNeJ_9T2TlaiR1_a3raO06REP-0GXOufeAFhKUqEGb1jr_GnFF2JPkIb2XSoHFulgoqv_LT-eSbtLoyvth8twEDkitZc_x5oG7ZeM5HG9p0uN7PsxNozcRzSKJ0YR8r3piDMICB0dHo3QinJJe8WbesSgoTC3sLMnSZPxyKr9HO_PNq01x6S9wdaoPSomG6yBt-zu19Sb-PmILZa4Pax0P_moNAZHLTo7RIaPHeCj3qTdLVplhhC2lWwFLrSiHXeDefaoi4sl4elyvItt6KKGoRjAAwQAuyDNFWxGMghrGF5Z0N7-BANG7dutg-K78XPB9m5SBCEYPU_lFrGjs9zii9QxKPpj7pkn-4FuEov6jXwuYG1TRHLjYFrHR4uYDgeIDwWFGyIxIpsFUESrjO2BqP5EZ7F_TOJ98-TkaoV4B0_da60y08VZZqOT0n_hxZDlPDzxCNFRWdBoFEN7PLR_4N-t0Tm0PuJgiWiye0W5_7HXyiTvIEgdFiiLwwmFsB5d72vUaKYJi1HOc9eJSEjC7YOG6ag0kqP1C61dW1BAVuAb0OFR5UJk0zA10cjgQULeHvC0BCIvLL5qcxBKEvUCHmV4RC6oe4bk3u3tVwe7lynNjFbNvAitgbbJum_38R_8V1dYNj-YGApbIuq4nfD9PWQpHodG2c9TfFhOufJ6MDeVaJPCFF9bprUf63MqPmGGjV4-sBW0GUizqRc6XMkdp3pt1cpVli6jqHqDV4tYvfXS9pLgXbdR9u3YaFK2rZQWphq5JClbWWvPAOsesmHTtRXQ6SlJR_dLd2GPfIR3HO3Y7qATwiRiYXkFFTw..&correlator=',
  [TAG_TYPE.PAL_LEGACY]:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&paln=AQzzBGQEVGjRW4svCeU1wKejaeWhATJKF8aSNC5L1tYtef8HbnrkSGMNeJ_9T2TlaiR1_a3raO06REP-0GXOufeAFhKUqEGb1jr_GnFF2JPkIb2XSoHFulgoqv_LT-eSbtLoyvth8twEDkitZc_x5oG7ZeM5HG9p0uN7PsxNozcRzSKJ0YR8r3piDMICB0dHo3QinJJe8WbesSgoTC3sLMnSZPxyKr9HO_PNq01x6S9wdaoPSomG6yBt-zu19Sb-PmILZa4Pax0P_moNAZHLTo7RIaPHeCj3qTdLVplhhC2lWwFLrSiHXeDefaoi4sl4elyvItt6KKGoRjAAwQAuyDNFWxGMghrGF5Z0N7-BANG7dutg-K78XPB9m5SBCEYPU_lFrGjs9zii9QxKPpj7pkn-4FuEov6jXwuYG1TRHLjYFrHR4uYDgeIDwWFGyIxIpsFUESrjO2BqP5EZ7F_TOJ98-TkaoV4B0_da60y08VZZqOT0n_hxZDlPDzxCNFRWdBoFEN7PLR_4N-t0Tm0PuJgiWiye0W5_7HXyiTvIEgdFiiLwwmFsB5d72vUaKYJi1HOc9eJSEjC7YOG6ag0kqP1C61dW1BAVuAb0OFR5UJk0zA10cjgQULeHvC0BCIvLL5qcxBKEvUCHmV4RC6oe4bk3u3tVwe7lynNjFbNvAitgbbJum_38R_8V1dYNj-YGApbIuq4nfD9PWQpHodG2c9TfFhOufJ6MDeVaJPCFF9bprUf63MqPmGGjV4-sBW0GUizqRc6XMkdp3pt1cpVli6jqHqDV4tYvfXS9pLgXbdR9u3YaFK2rZQWphq5JClbWWvPAOsesmHTtRXQ6SlJR_dLd2GPfIR3HO3Y7qATwiRiYXkFFTw..&correlator=',
  [TAG_TYPE.PAI]:
    'https://serverside.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&ssss=vast_url_validator_test&ip=203.0.113.1&correlator=',
  [TAG_TYPE.PAI_PAL]:
    'https://serverside.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&ssss=vast_url_validator_test&ip=203.0.113.1&givn=AQzzBGQEVGjRW4svCeU1wKejaeWhATJKF8aSNC5L1tYtef8HbnrkSGMNeJ_9T2TlaiR1_a3raO06REP-0GXOufeAFhKUqEGb1jr_GnFF2JPkIb2XSoHFulgoqv_LT-eSbtLoyvth8twEDkitZc_x5oG7ZeM5HG9p0uN7PsxNozcRzSKJ0YR8r3piDMICB0dHo3QinJJe8WbesSgoTC3sLMnSZPxyKr9HO_PNq01x6S9wdaoPSomG6yBt-zu19Sb-PmILZa4Pax0P_moNAZHLTo7RIaPHeCj3qTdLVplhhC2lWwFLrSiHXeDefaoi4sl4elyvItt6KKGoRjAAwQAuyDNFWxGMghrGF5Z0N7-BANG7dutg-K78XPB9m5SBCEYPU_lFrGjs9zii9QxKPpj7pkn-4FuEov6jXwuYG1TRHLjYFrHR4uYDgeIDwWFGyIxIpsFUESrjO2BqP5EZ7F_TOJ98-TkaoV4B0_da60y08VZZqOT0n_hxZDlPDzxCNFRWdBoFEN7PLR_4N-t0Tm0PuJgiWiye0W5_7HXyiTvIEgdFiiLwwmFsB5d72vUaKYJi1HOc9eJSEjC7YOG6ag0kqP1C61dW1BAVuAb0OFR5UJk0zA10cjgQULeHvC0BCIvLL5qcxBKEvUCHmV4RC6oe4bk3u3tVwe7lynNjFbNvAitgbbJum_38R_8V1dYNj-YGApbIuq4nfD9PWQpHodG2c9TfFhOufJ6MDeVaJPCFF9bprUf63MqPmGGjV4-sBW0GUizqRc6XMkdp3pt1cpVli6jqHqDV4tYvfXS9pLgXbdR9u3YaFK2rZQWphq5JClbWWvPAOsesmHTtRXQ6SlJR_dLd2GPfIR3HO3Y7qATwiRiYXkFFTw..&correlator=',
  [TAG_TYPE.STANDARD]:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
};
