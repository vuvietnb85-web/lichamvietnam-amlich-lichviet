/** Âm lịch Việt Nam, múi giờ UTC+7.
 *  Thuật toán Hồ Ngọc Đức (2006), kinh độ Mặt Trời theo Jean Meeus.
 */

const PI = Math.PI;
const TZ = 7;

function INT(d: number): number {
  return Math.floor(d);
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export type Civil = { y: number; m: number; d: number };

export type LunarDate = {
  day: number;
  month: number;
  year: number;
  leap: boolean;
};

export function civilFromDate(date: Date): Civil {
  return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate() };
}

export function addDays(c: Civil, n: number): Civil {
  const dt = new Date(c.y, c.m - 1, c.d);
  dt.setDate(dt.getDate() + n);
  return civilFromDate(dt);
}

export function iso(c: Civil): string {
  const m = String(c.m).padStart(2, "0");
  const d = String(c.d).padStart(2, "0");
  return `${c.y}-${m}-${d}`;
}

export function sameDay(a: Civil, b: Civil): boolean {
  return a.y === b.y && a.m === b.m && a.d === b.d;
}

export function diffDays(a: Civil, b: Civil): number {
  const ua = Date.UTC(a.y, a.m - 1, a.d);
  const ub = Date.UTC(b.y, b.m - 1, b.d);
  return Math.round((ub - ua) / 86400000);
}

export function weekday(c: Civil): number {
  return new Date(c.y, c.m - 1, c.d).getDay();
}

export function validCivil(d: number, m: number, y: number): boolean {
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return false;
  return d <= new Date(y, m, 0).getDate();
}

export function monthCells(y: number, m: number): Civil[] {
  const firstDow = new Date(y, m - 1, 1).getDay();
  const lead = (firstDow + 6) % 7;
  const start = new Date(y, m - 1, 1 - lead);
  let cells: Civil[] = [];
  for (let i = 0; i < 42; i++) {
    const dt = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push(civilFromDate(dt));
  }
  while (cells.length > 28 && cells.slice(-7).every((c) => c.m !== m)) {
    cells = cells.slice(0, -7);
  }
  return cells;
}

export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

function jdToDate(jd: number): Civil {
  let a: number;
  let b: number;
  let c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return { y: year, m: month, d: day };
}

function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L = L - PI * 2 * INT(L / (PI * 2));
  return L;
}

function getSunLongitude(dayNumber: number, timeZone: number): number {
  return INT(sunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6);
}

function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

function getNewMoonDay(k: number, timeZone: number): number {
  return INT(newMoon(k) + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) nm = getNewMoonDay(k - 1, timeZone);
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export function solarToLunar(dd: number, mm: number, yy: number): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, TZ);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, TZ);
  let a11 = getLunarMonth11(yy, TZ);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, TZ);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, TZ);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, TZ);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = 1;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap === 1 };
}

export function lunarToSolar(day: number, month: number, year: number, leap: boolean): Civil | null {
  if (month < 1 || month > 12 || day < 1 || day > 30) return null;
  let a11: number;
  let b11: number;
  if (month < 11) {
    a11 = getLunarMonth11(year - 1, TZ);
    b11 = getLunarMonth11(year, TZ);
  } else {
    a11 = getLunarMonth11(year, TZ);
    b11 = getLunarMonth11(year + 1, TZ);
  }
  let off = month - 11;
  if (off < 0) off += 12;
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, TZ);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (leap && month !== leapMonth) return null;
    if (leap || off >= leapOff) off += 1;
  } else if (leap) {
    return null;
  }
  const monthStart = getNewMoonDay(k + off, TZ);
  return jdToDate(monthStart + day - 1);
}

export function dayStemBranch(jd: number): { stem: number; branch: number } {
  return { stem: mod(jd + 9, 10), branch: mod(jd + 1, 12) };
}

export function yearStemBranch(lunarYear: number): { stem: number; branch: number } {
  return { stem: mod(lunarYear - 4, 10), branch: mod(lunarYear - 4, 12) };
}

export function monthStemBranch(lunarMonth: number, yearStem: number): { stem: number; branch: number } {
  const branch = mod(lunarMonth + 1, 12);
  const start = [2, 4, 6, 8, 0][yearStem % 5] ?? 2;
  const stem = mod(start + lunarMonth - 1, 10);
  return { stem, branch };
}

export function hourBranch(hour: number): number {
  if (hour >= 23) return 0;
  return Math.floor((hour + 1) / 2);
}

export function hourStem(dayStem: number, branch: number): number {
  return mod((dayStem % 5) * 2 + branch, 10);
}

const TERMS = [
  "Lập xuân",
  "Vũ thủy",
  "Kinh trập",
  "Xuân phân",
  "Thanh minh",
  "Cốc vũ",
  "Lập hạ",
  "Tiểu mãn",
  "Mang chủng",
  "Hạ chí",
  "Tiểu thử",
  "Đại thử",
  "Lập thu",
  "Xử thử",
  "Bạch lộ",
  "Thu phân",
  "Hàn lộ",
  "Sương giáng",
  "Lập đông",
  "Tiểu tuyết",
  "Đại tuyết",
  "Đông chí",
  "Tiểu hàn",
  "Đại hàn",
];

function sunDeg(jd: number): number {
  return mod((sunLongitude(jd) * 180) / PI, 360);
}

function termIndex(deg: number): number {
  return Math.floor(mod(deg - 315, 360) / 15);
}

export function solarTerm(c: Civil): { name: string; entersToday: boolean } {
  const jd = jdFromDate(c.d, c.m, c.y);
  const start = jd - 0.5 - TZ / 24;
  const end = start + 1;
  const before = termIndex(sunDeg(start));
  const after = termIndex(sunDeg(end - 1e-4));
  return { name: TERMS[after] ?? TERMS[0], entersToday: before !== after };
}
