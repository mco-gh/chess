// The piece styles to choose from in Settings. Each is a set of SVG drawings
// that take their colors from the theme: shapes are filled with the piece color
// and outlined with its line color. Class "d" is a detail line (no fill), "s" a
// solid dot in the line color, "h" a highlight and "sh" a shadow.

const SLIM_BASE = '<rect x="22" y="80" width="56" height="11" rx="5.500"/>';
const SLIM_FOOT = '<path d="M33 64C37 70 33 76 28 80H72C67 76 63 70 67 64Z"/>';

// The original style, from before there was a choice.
const slim = {
  viewBox: '0 0 100 100',
  stroke: 3.2,
  art: {
    p: `<path d="M41 46C44 60 35 70 29 80H71C65 70 56 60 59 46Z"/><circle cx="50" cy="32" r="14"/><rect x="35" y="43" width="30" height="7" rx="3.500"/>${SLIM_BASE}`,
    r: `<path d="M27 16H39V25H44V16H56V25H61V16H73V36L66 44V68L74 80H26L34 68V44L27 36Z"/><path class="d" d="M34 44H66"/>${SLIM_BASE}`,
    n: `<path d="M32 80C33 66 46 58 45 45C39 50 33 55 26 53L19 46C22 38 30 31 34 23L32 11L44 18C63 17 76 36 71 80Z"/><circle class="s" cx="39" cy="31" r="3"/><path class="d" d="M56 27C63 36 65 50 62 64"/>${SLIM_BASE}`,
    b: `<path d="M40 58C44 68 36 74 29 80H71C64 74 56 68 60 58Z"/><path d="M50 14C63 26 69 37 64 48C62 54 56 58 50 58C44 58 38 54 36 48C31 37 37 26 50 14Z"/><circle cx="50" cy="11" r="5"/><path class="d" d="M56 26L47 39"/><rect x="35" y="55" width="30" height="7" rx="3.500"/>${SLIM_BASE}`,
    q: `<path d="M19 30L32 64H68L81 30L66 47L65 21L57 45L50 17L43 45L35 21L34 47Z"/>${SLIM_FOOT}<circle cx="19" cy="27" r="5"/><circle cx="35" cy="18" r="5"/><circle cx="50" cy="13" r="5"/><circle cx="65" cy="18" r="5"/><circle cx="81" cy="27" r="5"/><rect x="29" y="61" width="42" height="7" rx="3.500"/>${SLIM_BASE}`,
    k: `<path d="M46 5H54V11H61V19H54V28H46V19H39V11H46Z"/><path d="M50 27C41 27 37 34 39 41C29 33 16 40 21 54L32 66H68L79 54C84 40 71 33 61 41C63 34 59 27 50 27Z"/>${SLIM_FOOT}<rect x="29" y="61" width="42" height="7" rx="3.500"/>${SLIM_BASE}`,
  },
};

// Bold: the same family, broader and heavier, with a thick outline.
const BOLD_BASE = '<rect x="15" y="78" width="70" height="15" rx="7.500"/>';
const BOLD_FOOT = '<path d="M30 62C34 69 30 74 24 78H76C70 74 66 69 70 62Z"/>';
const boldArt = {
  p: `<path d="M37 52C39 64 30 72 23 78H77C70 72 61 64 63 52Z"/><circle cx="50" cy="29" r="17"/><rect x="30" y="44" width="40" height="10" rx="5"/>${BOLD_BASE}`,
  r: `<path d="M21 11H36V21H43V11H57V21H64V11H79V36L70 45V64L81 78H19L30 64V45L21 36Z"/><path class="d" d="M30 45H70M30 64H70"/>${BOLD_BASE}`,
  n: `<path d="M27 78C27 62 42 56 42 46C35 51 27 55 19 51L11 42C15 33 25 25 30 17L28 5L42 13C66 12 84 32 77 78Z"/><circle class="s" cx="35" cy="27" r="4.500"/><path class="d" d="M58 22C67 35 69 51 66 66"/>${BOLD_BASE}`,
  b: `<path d="M38 64C40 72 31 76 23 78H77C69 76 60 72 62 64Z"/><path d="M50 15C67 28 75 41 68 53C65 59 58 62 50 62C42 62 35 59 32 53C25 41 33 28 50 15Z"/><circle cx="50" cy="11" r="7"/><path class="d" d="M58 28L46 44"/><rect x="29" y="58" width="42" height="10" rx="5"/>${BOLD_BASE}`,
  q: `<path d="M13 29L28 62H72L87 29L68 46L66 19L57 44L50 13L43 44L34 19L32 46Z"/>${BOLD_FOOT}<circle cx="13" cy="26" r="7"/><circle cx="33" cy="16" r="7"/><circle cx="50" cy="10" r="7"/><circle cx="67" cy="16" r="7"/><circle cx="87" cy="26" r="7"/><rect x="25" y="58" width="50" height="10" rx="5"/>${BOLD_BASE}`,
  k: `<path d="M44 2H56V9H64V20H56V28H44V20H36V9H44Z"/><path d="M50 27C39 27 35 34 37 41C25 32 9 39 15 55L28 64H72L85 55C91 39 75 32 63 41C65 34 61 27 50 27Z"/>${BOLD_FOOT}<rect x="25" y="59" width="50" height="10" rx="5"/>${BOLD_BASE}`,
};
const bold = { viewBox: '0 0 100 100', stroke: 5.5, art: boldArt };

// Glossy: the bold shapes with a shine on the left and a shade on the right,
// for a rounded, toy-like look.
const shine = {
  p: '<ellipse class="h" cx="43" cy="22" rx="6" ry="4.500" transform="rotate(-30 43 22)"/><path class="sh" d="M58 54C59 64 64 71 70 76H60C55 70 53 62 53 54Z"/>',
  r: '<path class="h" d="M34 47H40V62H34Z"/><path class="sh" d="M60 47H67V64H60Z"/>',
  n: '<path class="h" d="M45 17C55 18 62 24 64 31C58 25 52 22 45 17Z"/><path class="sh" d="M68 45C72 56 73 66 72 76H64C66 64 67 54 68 45Z"/>',
  b: '<ellipse class="h" cx="42" cy="36" rx="5" ry="9" transform="rotate(20 42 36)"/><path class="sh" d="M63 42C64 50 61 56 55 59C60 52 62 47 63 42Z"/>',
  q: '<ellipse class="h" cx="47" cy="7" rx="2.500" ry="2"/><path class="sh" d="M66 50L69 61H63Z"/>',
  k: '<ellipse class="h" cx="25" cy="44" rx="4" ry="6" transform="rotate(-25 25 44)"/><path class="sh" d="M74 48C78 52 79 54 76 57L70 61Z"/>',
};
const glossy = {
  viewBox: '0 0 100 100',
  stroke: 5,
  art: Object.fromEntries(Object.entries(boldArt).map(([type, art]) => [type, art + shine[type]])),
};

// Classic: the Staunton-style pieces by Colin M.L. Burnett ("Cburnett"), the set
// used by Wikipedia and Lichess. © Colin M.L. Burnett, used under the 3-clause
// BSD license; see LICENSE-pieces.txt.
const classic = {
  viewBox: '2 2 41 41',             // cropped a little, to match the other sets' size
  stroke: 1.5,
  art: {
    p: '<path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.030.94 3.840 2.410 5.030C15.410 27.090 11 31.580 11 39.500H34C34 31.580 29.590 27.090 26.590 26.030 28.060 24.840 29 23.030 29 21c0-2.410-1.330-4.500-3.280-5.620.49-.67.78-1.490.78-2.380 0-2.210-1.790-4-4-4z"/>',
    r: '<g transform="translate(0 .3)"><path d="M9 39H36V36H9Z"/><path d="M12 36V32H33V36Z"/><path d="M11 14V9H15V11H20V9H25V11H30V9H34V14"/><path d="M34 14L31 17H14L11 14"/><path d="M31 17V29.500H14V17"/><path d="M31 29.500L32.500 32H12.500L14 29.500"/><path class="d" d="M11 14H34"/></g>',
    n: '<g transform="translate(0 .3)"><path d="M22 10C32.500 11 38.500 18 38 39H15C15 30 25 32.500 23 18"/><path d="M24 18C24.380 20.910 18.450 25.370 16 27 13 29 13.180 31.340 11 31 9.958 30.060 12.410 27.960 11 28 10 28 11.190 29.230 10 30 9 30 5.997 31 6 26 6 24 12 14 12 14S13.890 12.100 14 10.500C13.270 9.506 13.500 8.500 13.500 7.500 14.500 6.500 16.500 10 16.500 10H18.500S19.280 8.008 21 7C22 7 22 10 22 10"/><circle class="s" cx="9" cy="25.500" r="1.250"/><ellipse class="s" cx="14.500" cy="15.500" rx="1.250" ry="2.250" transform="rotate(30 14.500 15.500)"/></g>',
    b: '<g transform="translate(0 .6)"><path d="M9 36C12.390 35.030 19.110 36.430 22.500 34 25.890 36.430 32.610 35.030 36 36 36 36 37.650 36.540 39 38 38.320 38.970 37.350 38.990 36 38.500 32.610 37.530 25.890 38.960 22.500 37.500 19.110 38.960 12.390 37.530 9 38.500 7.650 38.990 6.680 38.970 6 38 7.350 36.540 9 36 9 36Z"/><path d="M15 32C17.500 34.500 27.500 34.500 30 32 30.500 30.500 30 30 30 30 30 27.500 27.500 26 27.500 26 33 24.500 33.500 14.500 22.500 10.500 11.500 14.500 12 24.500 17.500 26 17.500 26 15 27.500 15 30 15 30 14.500 30.500 15 32Z"/><circle cx="22.500" cy="8" r="2.500"/><path class="d" d="M17.500 26H27.500M15 30H30M22.500 15.500V20.500M20 18H25"/></g>',
    q: '<path d="M9 26C17.500 24.500 30 24.500 36 26L38.500 13.500 31 25 30.700 10.900 25.500 24.500 22.500 10 19.500 24.500 14.300 10.900 14 25 6.500 13.500Z"/><path d="M9 26C9 28 10.500 28 11.500 30 12.500 31.500 12.500 31 12 33.500 10.500 34.500 11 36 11 36 9.500 37.500 11 38.500 11 38.500 17.500 39.500 27.500 39.500 34 38.500 34 38.500 35.500 37.500 34 36 34 36 34.500 34.500 33 33.500 32.500 31 32.500 31.500 33.500 30 34.500 28 36 28 36 26 27.500 24.500 17.500 24.500 9 26Z"/><path class="d" d="M11.500 30C15 29 30 29 33.500 30M12 33.500C18 32.500 27 32.500 33 33.500"/><circle cx="6" cy="12" r="2"/><circle cx="14" cy="9" r="2"/><circle cx="22.500" cy="8" r="2"/><circle cx="31" cy="9" r="2"/><circle cx="39" cy="12" r="2"/>',
    k: '<path class="d" d="M22.500 11.630V6M20 8H25"/><path d="M22.500 25S27 17.500 25.500 14.500C25.500 14.500 24.500 12 22.500 12S19.500 14.500 19.500 14.500C18 17.500 22.500 25 22.500 25"/><path d="M12.500 37C18 40.500 27 40.500 32.500 37V30S41.500 25.500 38.500 19.500C34.500 13 25 16 22.500 23.500V27 23.500C20 16 10.500 13 6.500 19.500 3.500 25.500 12.500 30 12.500 30V37"/><path class="d" d="M12.500 30C18 27 27 27 32.500 30M12.500 33.500C18 30.500 27 30.500 32.500 33.500M12.500 37C18 34 27 34 32.500 37"/>',
  },
};

export const PIECE_STYLES = [
  { id: 'classic', name: 'Classic', set: classic },
  { id: 'bold', name: 'Bold', set: bold },
  { id: 'glossy', name: 'Glossy', set: glossy },
  { id: 'slim', name: 'Slim', set: slim },
];

let current = PIECE_STYLES.find((s) => s.id === 'classic');

export function setPieceStyle(id) {
  current = PIECE_STYLES.find((s) => s.id === id) ?? current;
  return current.id;
}

export const pieceStyle = () => current.id;

/** One piece drawing, in the chosen style (or the one named). */
export function pieceSVG(type, styleId = current.id) {
  const { set } = PIECE_STYLES.find((s) => s.id === styleId) ?? current;
  return `<svg viewBox="${set.viewBox}" style="--sw:${set.stroke}" aria-hidden="true">${set.art[type]}</svg>`;
}
