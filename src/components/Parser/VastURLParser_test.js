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
import { TAG_TYPE, EXAMPLE_VAST_URLS } from '../../constants';

const custParams = 'cust_params=section%3Dblog%26anotherKey%3Dvalue1%2Cvalue2';
const ppsjParam =
  'ppsj=eyJQdWJsaXNoZXJQcm92aWRlZFRheG9ub215U2lnbmFscyI6W3sidGF4b25vbXkiOiJJQUJfQ09OVEVOVF8yXzIiLCJ2YWx1ZXMiOlsidjlpM09uIiwiMTg2IiwiNDMyIiwiSkxCQ1U3Il19XX0=';

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
    const parser = new VastURLParser(EXAMPLE_VAST_URLS[TAG_TYPE.STANDARD]);
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
    const parser = new VastURLParser(EXAMPLE_VAST_URLS[TAG_TYPE.PAL]);
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

  it('Should correctly parse a legacy PAL VAST URL', () => {
    const parser = new VastURLParser(EXAMPLE_VAST_URLS[TAG_TYPE.PAL_LEGACY]);
    const result = parser.parse();
    console.log(result);
    expect(result.success).toBe(true);
    expect(result.params.cust_params).toEqual({ sample_ct: 'linear' });
    expect(result.params.ciu_szs).toBe('300x250,728x90');
    expect(result.params.gdfp_req).toBe('1');
    expect(result.params.output).toBe('vast');
    expect(result.params.unviewed_position_start).toBe('1');
    expect(result.params.env).toBe('vp');
    expect(result.params.impl).toBe('s');
    expect(result.params.paln.startsWith('AQzzBGQ'));
    expect(result.params.paln.endsWith('FFTw..'));
  });

  it('Should correctly parse a PAI VAST URL', () => {
    const parser = new VastURLParser(EXAMPLE_VAST_URLS[TAG_TYPE.PAI]);
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
    const parser = new VastURLParser(EXAMPLE_VAST_URLS[TAG_TYPE.IMA_SDK]);
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
});
