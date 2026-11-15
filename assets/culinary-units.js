/* Culinary unit conversion primitives. US customary measures are explicit;
   no volume-to-weight conversion is possible without an ingredient density.
   See tools/CULINARY-UNITS.md for the conventions and supported units. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CookBookUnits = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  // Exact definitions where possible, relative to g, mL and mm.
  const units = Object.freeze({
    mg: ['mass', 0.001], g: ['mass', 1], kg: ['mass', 1000],
    oz: ['mass', 28.349523125], lb: ['mass', 453.59237],
    ml: ['volume', 1], l: ['volume', 1000],
    us_tsp: ['volume', 4.92892159375], us_tbsp: ['volume', 14.78676478125],
    us_fl_oz: ['volume', 29.5735295625], us_cup: ['volume', 236.5882365],
    us_pint: ['volume', 473.176473], us_quart: ['volume', 946.352946], us_gallon: ['volume', 3785.411784],
    metric_tsp: ['volume', 5], metric_tbsp: ['volume', 15], metric_cup: ['volume', 250],
    uk_fl_oz: ['volume', 28.4130625], uk_pint: ['volume', 568.26125],
    uk_quart: ['volume', 1136.5225], uk_gallon: ['volume', 4546.09],
    mm: ['length', 1], cm: ['length', 10], m: ['length', 1000],
    inch: ['length', 25.4], foot: ['length', 304.8],
    c: ['temperature', 1], f: ['temperature', 1], k: ['temperature', 1]
  });
  function convert(value, from, to) {
    if (!Number.isFinite(value)) throw new TypeError('Value must be finite');
    const a = units[from], b = units[to];
    if (!a || !b) throw new RangeError('Unknown unit');
    if (a[0] !== b[0]) throw new RangeError('Incompatible dimensions; density cannot be assumed');
    if (a[0] !== 'temperature') return value * a[1] / b[1];
    const c = from === 'f' ? (value - 32) * 5 / 9 : from === 'k' ? value - 273.15 : value;
    return to === 'f' ? c * 9 / 5 + 32 : to === 'k' ? c + 273.15 : c;
  }
  // Free-text ingredient quantities: only dimensioned numbers are touched.
  // Cup, tablespoon and teaspoon mean US customary unless metric is explicit.
  const aliases = {
    'mg':'mg','milligram':'mg','milligrams':'mg','میلی‌گرم':'mg',
    'g':'g','gr':'g','gram':'g','grams':'g','گرم':'g',
    'kg':'kg','kilogram':'kg','kilograms':'kg','کیلوگرم':'kg','کیلو':'kg',
    'oz':'oz','ounce':'oz','ounces':'oz','اونس':'oz',
    'lb':'lb','lbs':'lb','pound':'lb','pounds':'lb','پوند':'lb',
    'ml':'ml','milliliter':'ml','milliliters':'ml','millilitre':'ml','millilitres':'ml','میلی‌لیتر':'ml',
    'l':'l','liter':'l','liters':'l','litre':'l','litres':'l','لیتر':'l',
    'ق.چ':'us_tsp','ق چ':'us_tsp','tsp':'us_tsp','teaspoon':'us_tsp','teaspoons':'us_tsp','قاشق چای‌خوری':'us_tsp',
    'ق.غ':'us_tbsp','ق غ':'us_tbsp','tbsp':'us_tbsp','tablespoon':'us_tbsp','tablespoons':'us_tbsp','قاشق غذاخوری':'us_tbsp',
    'metric cup':'metric_cup','metric tablespoon':'metric_tbsp','metric teaspoon':'metric_tsp','uk fl oz':'uk_fl_oz','uk fluid ounce':'uk_fl_oz','imperial fluid ounce':'uk_fl_oz','uk pint':'uk_pint','imperial pint':'uk_pint','uk quart':'uk_quart','imperial quart':'uk_quart','uk gallon':'uk_gallon','imperial gallon':'uk_gallon','c':'us_cup','cup':'us_cup','cups':'us_cup','پیمانه':'us_cup',
    'fl. oz.':'us_fl_oz','fl oz':'us_fl_oz','fluid ounce':'us_fl_oz','fluid ounces':'us_fl_oz','اونس مایع':'us_fl_oz',
    'pint':'us_pint','pints':'us_pint','پینت':'us_pint',
    'quart':'us_quart','quarts':'us_quart','qt':'us_quart','کوارت':'us_quart',
    'us gal':'us_gallon','us gallon':'us_gallon','u.s. gallon':'us_gallon','u.s. gallons':'us_gallon','gallon':'us_gallon','gallons':'us_gallon','gal':'us_gallon','گالن آمریکایی':'us_gallon','گالن':'us_gallon','u.s. quart':'us_quart','کوارت آمریکایی':'us_quart'
  };
  const fractions = {'½':.5,'¼':.25,'¾':.75,'⅓':1/3,'⅔':2/3,'⅛':.125,'⅜':.375,'⅝':.625,'⅞':.875};
  const ascii = s => s.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/٫/g,'.');
  function number(s) {
    s = ascii(s).trim();
    const match = s.match(/^([\d.]+)?\s*([½¼¾⅓⅔⅛⅜⅝⅞])?$/);
    return match ? (Number(match[1] || 0) + (fractions[match[2]] || 0)) : NaN;
  }
  const unitRe = Object.keys(aliases).sort((a,b) => b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\$&')).join('|');
  const n = '(?:[0-9۰-۹]+(?:[.٫][0-9۰-۹]+)?\\s*[½¼¾⅓⅔⅛⅜⅝⅞]?|[½¼¾⅓⅔⅛⅜⅝⅞])';
  const pattern = new RegExp('('+n+')(?:\\s*([–—-]|to|تا)\\s*('+n+'))?\\s*('+unitRe+')(?![a-zA-Zآ-ی‌])', 'gi');
  function format(x, fa) {
    // Keep meaningful precision for very small quantities, not zero.
    const v = Number(x.toPrecision(4)).toString();
    return fa ? v.replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)]).replace(/\./g,'٫') : v;
  }
  function convertText(text, system, fa) {
    if (system !== 'metric' && system !== 'imperial') return text;
    text = text.replace(/(?:نصف|نیم)(?=\s)/g, '½').replace(/\bhalf(?=\s)/gi, '½');
    return text.replace(pattern, (all, first, separator, second, label) => {
      const from = aliases[label.toLowerCase()];
      if (!from) return all;
      const dimension = units[from][0];
      const metricSource = ['mg','g','kg','ml','l','metric_tsp','metric_tbsp','metric_cup'].includes(from);
      if ((system === 'metric') === metricSource) return all;
      const target = system === 'metric' ? (dimension === 'mass' ? 'g' : 'ml') : (dimension === 'mass' ? 'oz' : 'us_fl_oz');
      const v = number(first), w = second ? number(second) : null;
      if (!Number.isFinite(v) || (second && !Number.isFinite(w))) return all;
      const name = fa ? ({g:'گرم',ml:'میلی‌لیتر',oz:'اونس',us_fl_oz:'اونس مایع'}[target]) : ({g:'g',ml:'ml',oz:'oz',us_fl_oz:'fl oz'}[target]);
      const range = second ? '–' + format(convert(w,from,target),fa) : '';
      return '≈' + format(convert(v,from,target),fa) + range + ' ' + name;
    });
  }
  return Object.freeze({units, convert, convertText});
});
