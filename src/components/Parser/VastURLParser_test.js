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
 * @fileoverview VAST URL Parser Test
 * @author mbordihn@google.com (Markus Bordihn)
 */

import VastURLParser from './VastURLParser';

const defaultVastUrl =
  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
const PALVastUrl =
  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&givn=AQzzBGQEVGjRW4svCeU1wKejaeWhATJKF8aSNC5L1tYtef8HbnrkSGMNeJ_9T2TlaiR1_a3raO06REP-0GXOufeAFhKUqEGb1jr_GnFF2JPkIb2XSoHFulgoqv_LT-eSbtLoyvth8twEDkitZc_x5oG7ZeM5HG9p0uN7PsxNozcRzSKJ0YR8r3piDMICB0dHo3QinJJe8WbesSgoTC3sLMnSZPxyKr9HO_PNq01x6S9wdaoPSomG6yBt-zu19Sb-PmILZa4Pax0P_moNAZHLTo7RIaPHeCj3qTdLVplhhC2lWwFLrSiHXeDefaoi4sl4elyvItt6KKGoRjAAwQAuyDNFWxGMghrGF5Z0N7-BANG7dutg-K78XPB9m5SBCEYPU_lFrGjs9zii9QxKPpj7pkn-4FuEov6jXwuYG1TRHLjYFrHR4uYDgeIDwWFGyIxIpsFUESrjO2BqP5EZ7F_TOJ98-TkaoV4B0_da60y08VZZqOT0n_hxZDlPDzxCNFRWdBoFEN7PLR_4N-t0Tm0PuJgiWiye0W5_7HXyiTvIEgdFiiLwwmFsB5d72vUaKYJi1HOc9eJSEjC7YOG6ag0kqP1C61dW1BAVuAb0OFR5UJk0zA10cjgQULeHvC0BCIvLL5qcxBKEvUCHmV4RC6oe4bk3u3tVwe7lynNjFbNvAitgbbJum_38R_8V1dYNj-YGApbIuq4nfD9PWQpHodG2c9TfFhOufJ6MDeVaJPCFF9bprUf63MqPmGGjV4-sBW0GUizqRc6XMkdp3pt1cpVli6jqHqDV4tYvfXS9pLgXbdR9u3YaFK2rZQWphq5JClbWWvPAOsesmHTtRXQ6SlJR_dLd2GPfIR3HO3Y7qATwiRiYXkFFTw..&correlator=';
const PAIVastUrl =
  'https://serverside.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&ssss=vast_url_validator_test&ip=1.2.3.4&correlator=';
const IMASdkVastUrl =
  'https://pagead2.googlesyndication.com/gampad/ads?iu=%2F21775744923%2Fexternal%2Fsingle_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=fluid%7C728x90%2Cfluid%7C300x250%2Cfluid%7C180x150%2Cfluid%7C120x60%2Cfluid%7C88x31%2Cfluid%7C300x60%2Cfluid%7C300x100%2Cfluid%7C320x50%2Cfluid%7C468x60%2Cfluid%7C300x600%2Cfluid%7C160x600&gdfp_req=1&output=xml_vast4&unviewed_position_start=1&env=vp&correlator=2920090807217010&sdkv=h.3.688.0&osd=2&frm=0&vis=1&sdr=1&hl=en&afvsz=200x200%2C250x250%2C300x250%2C450x50%2C468x60%2C480x70&is_amp=0&uach=WyJtYWNPUyIsIjE1LjMuMSIsImFybSIsIiIsIjEzMy4wLjY5NDMuMTQzIixudWxsLDAsbnVsbCwiNjQiLFtbIk5vdChBOkJyYW5kIiwiOTkuMC4wLjAiXSxbIkdvb2dsZSBDaHJvbWUiLCIxMzMuMC42OTQzLjE0MyJdLFsiQ2hyb21pdW0iLCIxMzMuMC42OTQzLjE0MyJdXSwwXQ..&u_so=l&ctv=0&mpt=h5_vsi&sdki=445&ptt=20&adk=1083529519&sdk_apis=2%2C7%2C8&omid_p=Google1%2Fh.3.688.0&media_url=https%3A%2F%2Fs0.2mdn.net%2F4253510%2Fgoogle_ddm_animation_480P.mp4&sid=143B1AB4-F655-425F-B5C2-D49BC807C875&nel=1&td=1&eid=95322027%2C95326337%2C95331589%2C95332046%2C95351091&ref=https%3A%2F%2Fwww.google.com%2F&url=https%3A%2F%2Fgoogleads.github.io%2Fgoogleads-ima-html5%2Fvsi%2F&dlt=1741201107292&idt=496&dt=1741201112814&pvsid=342258371105668&scor=768096627554145';
const custParams = 'cust_params=section%3Dblog%26anotherKey%3Dvalue1%2Cvalue2';
const ppsjParam =
  'ppsj=eyJQdWJsaXNoZXJQcm92aWRlZFRheG9ub215U2lnbmFscyI6W3sidGF4b25vbXkiOiJJQUJfQ09OVEVOVF8yXzIiLCJ2YWx1ZXMiOlsidjlpM09uIiwiMTg2IiwiNDMyIiwiSkxCQ1U3Il19XX0=';
const slotnameAliasVastUrl =
  'https://pubads.g.doubleclick.net/gampad/ads?slotname=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
const palnAliasVastUrl =
  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&paln=AQzzBGQEVGjRW4svCeU1wKejaeWhATJKF8aSNC5L1tYtef8HbnrkSGMNeJ_9T2TlaiR1_a3raO06REP-0GXOufeAFhKUqEGb1jr_GnFF2JPkIb2XSoHFulgoqv_LT-eSbtLoyvth8twEDkitZc_x5oG7ZeM5HG9p0uN7PsxNozcRzSKJ0YR8r3piDMICB0dHo3QinJJe8WbesSgoTC3sLMnSZPxyKr9HO_PNq01x6S9wdaoPSomG6yBt-zu19Sb-PmILZa4Pax0P_moNAZHLTo7RIaPHeCj3qTdLVplhhC2lWwFLrSiHXeDefaoi4sl4elyvItt6KKGoRjAAwQAuyDNFWxGMghrGF5Z0N7-BANG7dutg-K78XPB9m5SBCEYPU_lFrGjs9zii9QxKPpj7pkn-4FuEov6jXwuYG1TRHLjYFrHR4uYDgeIDwWFGyIxIpsFUESrjO2BqP5EZ7F_TOJ98-TkaoV4B0_da60y08VZZqOT0n_hxZDlPDzxCNFRWdBoFEN7PLR_4N-t0Tm0PuJgiWiye0W5_7HXyiTvIEgdFiiLwwmFsB5d72vUaKYJi1HOc9eJSEjC7YOG6ag0kqP1C61dW1BAVuAb0OFR5UJk0zA10cjgQULeHvC0BCIvLL5qcxBKEvUCHmV4RC6oe4bk3u3tVwe7lynNjFbNvAitgbbJum_38R_8V1dYNj-YGApbIuq4nfD9PWQpHodG2c9TfFhOufJ6MDeVaJPCFF9bprUf63MqPmGGjV4-sBW0GUizqRc6XMkdp3pt1cpVli6jqHqDV4tYvfXS9pLgXbdR9u3YaFK2rZQWphq5JClbWWvPAOsesmHTtRXQ6SlJR_dLd2GPfIR3HO3Y7qATwiRiYXkFFTw..&correlator=';

describe('VastURLParser', () => {
  it('Should return an error for an empty URL', () => {
    const parser = new VastURLParser('');
    const result = parser.parse();
    expect(result.success).toBe(false);
    expect(result.error).toBe(VastURLParser.ErrorCode.URL_EMPTY);
  });

  it('Should correctly parse a URL without parameters', () => {
    const parser = new VastURLParser('https://example.com');
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params).toEqual({});
  });

  it('Should correctly parse a standard VAST URL', () => {
    const parser = new VastURLParser(defaultVastUrl);
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params.cust_params).toEqual({ sample_ct: 'linear' });
    expect(result.params.ciu_szs).toBe('300x250,728x90');
    expect(result.params.gdfp_req).toBe('1');
    expect(result.params.output).toBe('vast');
    expect(result.params.unviewed_position_start).toBe('1');
    expect(result.params.env).toBe('vp');
    expect(result.params.impl).toBe('s');
  });

  it('Should correctly parse a PAL VAST URL', () => {
    const parser = new VastURLParser(PALVastUrl);
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params.cust_params).toEqual({ sample_ct: 'linear' });
    expect(result.params.ciu_szs).toBe('300x250,728x90');
    expect(result.params.gdfp_req).toBe('1');
    expect(result.params.output).toBe('vast');
    expect(result.params.unviewed_position_start).toBe('1');
    expect(result.params.env).toBe('vp');
    expect(result.params.impl).toBe('s');
    expect(result.params.givn.startsWith('AQzzBGQ'));
    expect(result.params.givn.endsWith('FFTw..'));
  });

  it('Should correctly parse a PAI VAST URL', () => {
    const parser = new VastURLParser(PAIVastUrl);
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params.cust_params).toEqual({ sample_ct: 'linear' });
    expect(result.params.ciu_szs).toBe('300x250,728x90');
    expect(result.params.gdfp_req).toBe('1');
    expect(result.params.output).toBe('vast');
    expect(result.params.unviewed_position_start).toBe('1');
    expect(result.params.env).toBe('vp');
    expect(result.params.impl).toBe('s');
    expect(result.params.ssss).toBe('vast_url_validator_test');
    expect(result.params.ip).toBe('1.2.3.4');
  });

  it('Should correctly parse an IMA SDK VAST URL', () => {
    const parser = new VastURLParser(IMASdkVastUrl);
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params.cust_params).toEqual({ sample_ct: 'linear' });
    expect(result.params.ciu_szs).toBe(
      'fluid|728x90,fluid|300x250,fluid|180x150,fluid|120x60,fluid|88x31,fluid|300x60,fluid|300x100,fluid|320x50,fluid|468x60,fluid|300x600,fluid|160x600',
    );
    expect(result.params.gdfp_req).toBe('1');
    expect(result.params.output).toBe('xml_vast4');
    expect(result.params.unviewed_position_start).toBe('1');
    expect(result.params.env).toBe('vp');
    expect(result.params.correlator).toBe('2920090807217010');
  });

  it('Should correctly parse an cust_params value', () => {
    const parser = new VastURLParser(
      `https://example.com?${custParams}&output=vast`,
    );
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params.cust_params).toEqual({
      section: 'blog',
      anotherKey: 'value1,value2',
    });
    expect(result.params.output).toBe('vast');
  });

  it('Should correctly parse an ppjs value', () => {
    const parser = new VastURLParser(
      `https://example.com?${ppsjParam}&output=vast`,
    );
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params.ppsj).toEqual({
      PublisherProvidedTaxonomySignals: [
        {
          taxonomy: 'IAB_CONTENT_2_2',
          values: ['v9i3On', '186', '432', 'JLBCU7'],
        },
      ],
    });
    expect(result.params.output).toBe('vast');
  });

  it('Should fail parse an invalid ppjs value', () => {
    const parser = new VastURLParser(
      'https://example.com?ppsj=invalid&output=vast',
    );
    const result = parser.parse();
    expect(result.params.ppsj).toBe('invalid');
    expect(result.error).toBe(VastURLParser.ErrorCode.PPSJ_PARSE_ERROR);
    expect(result.params.output).toBe('vast');
  });

  it('Should correctly parse a VAST URL using slotname alias instead of iu', () => {
    const parser = new VastURLParser(slotnameAliasVastUrl);
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params.iu).toBe('/21775744923/external/single_ad_samples');
  });

  it('Should correctly parse a PAL VAST URL using paln alias instead of givn', () => {
    const parser = new VastURLParser(palnAliasVastUrl);
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.params.cust_params).toEqual({ sample_ct: 'linear' });
    expect(result.params.ciu_szs).toBe('300x250,728x90');
    expect(result.params.gdfp_req).toBe('1');
    expect(result.params.output).toBe('vast');
    expect(result.params.unviewed_position_start).toBe('1');
    expect(result.params.env).toBe('vp');
    expect(result.params.impl).toBe('s');
    expect(result.params.givn.startsWith('AQzzBGQ'));
    expect(result.params.givn.endsWith('FFTw..'));
  });
});
