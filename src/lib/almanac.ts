import {
  addDays,
  dayStemBranch,
  diffDays,
  hourBranch,
  hourStem,
  jdFromDate,
  lunarToSolar,
  monthStemBranch,
  type Civil,
  type LunarDate,
  solarTerm,
  solarToLunar,
  validCivil,
  weekday,
  yearStemBranch,
} from "./lunar";

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"] as const;

export const CON_GIAP = [
  { thu: "Chuột" },
  { thu: "Trâu" },
  { thu: "Hổ" },
  { thu: "Mèo" },
  { thu: "Rồng" },
  { thu: "Rắn" },
  { thu: "Ngựa" },
  { thu: "Dê" },
  { thu: "Khỉ" },
  { thu: "Gà" },
  { thu: "Chó" },
  { thu: "Lợn" },
] as const;

export const WEEKDAYS_UP = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"] as const;
export const WEEK_HEAD = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

const LUNAR_MONTH = ["", "Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười một", "Chạp"];

const NAP_AM = [
  "Hải Trung Kim",
  "Lư Trung Hỏa",
  "Đại Lâm Mộc",
  "Lộ Bàng Thổ",
  "Kiếm Phong Kim",
  "Sơn Đầu Hỏa",
  "Giản Hạ Thủy",
  "Thành Đầu Thổ",
  "Bạch Lạp Kim",
  "Dương Liễu Mộc",
  "Tuyền Trung Thủy",
  "Ốc Thượng Thổ",
  "Tích Lịch Hỏa",
  "Tùng Bách Mộc",
  "Trường Lưu Thủy",
  "Sa Trung Kim",
  "Sơn Hạ Hỏa",
  "Bình Địa Mộc",
  "Bích Thượng Thổ",
  "Kim Bạch Kim",
  "Phúc Đăng Hỏa",
  "Thiên Hà Thủy",
  "Đại Trạch Thổ",
  "Thoa Xuyến Kim",
  "Tang Đố Mộc",
  "Đại Khê Thủy",
  "Sa Trung Thổ",
  "Thiên Thượng Hỏa",
  "Thạch Lựu Mộc",
  "Đại Hải Thủy",
] as const;

const GODS = [
  { name: "Thanh Long", good: true },
  { name: "Minh Đường", good: true },
  { name: "Thiên Hình", good: false },
  { name: "Chu Tước", good: false },
  { name: "Kim Quỹ", good: true },
  { name: "Kim Đường", good: true },
  { name: "Bạch Hổ", good: false },
  { name: "Ngọc Đường", good: true },
  { name: "Thiên Lao", good: false },
  { name: "Nguyên Vũ", good: false },
  { name: "Tư Mệnh", good: true },
  { name: "Câu Trần", good: false },
] as const;

const TRUC = ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thu", "Khai", "Bế"] as const;
const TRUC_NOTE = [
  "Nên khởi sự, nhận việc. Kỵ động thổ, an táng.",
  "Nên chữa bệnh, dọn dẹp. Kỵ cưới hỏi.",
  "Nên cầu tài, tế tự. Kỵ kiện tụng.",
  "Nên sửa nhà, mở đường. Kỵ đào giếng.",
  "Nên cưới hỏi, giao dịch. Kỵ chữa mắt.",
  "Nên thu giữ. Kỵ xuất hành, dời nhà.",
  "Nên phá dỡ. Kỵ khởi công, cưới hỏi.",
  "Nên cầu phúc. Kỵ leo cao, đi thuyền.",
  "Nên khai trương, cưới hỏi, nhập trạch.",
  "Nên thu hoạch, nhận của. Kỵ đi xa.",
  "Nên khai trương, xuất hành, cưới hỏi.",
  "Nên lấp hố, xây mộ. Kỵ khai trương, cưới hỏi.",
] as const;

const HOUR_META = [
  { name: "Tý", range: "23–01" },
  { name: "Sửu", range: "01–03" },
  { name: "Dần", range: "03–05" },
  { name: "Mão", range: "05–07" },
  { name: "Thìn", range: "07–09" },
  { name: "Tỵ", range: "09–11" },
  { name: "Ngọ", range: "11–13" },
  { name: "Mùi", range: "13–15" },
  { name: "Thân", range: "15–17" },
  { name: "Dậu", range: "17–19" },
  { name: "Tuất", range: "19–21" },
  { name: "Hợi", range: "21–23" },
] as const;

const GIO_HD = [
  [0, 1, 3, 6, 8, 9],
  [2, 3, 5, 8, 10, 11],
  [0, 1, 4, 5, 7, 10],
  [2, 4, 6, 7, 9, 11],
  [2, 3, 5, 8, 9, 11],
  [1, 4, 6, 7, 10, 11],
];

const SOLAR_FEST: Record<string, string> = {
  "1-1": "Tết Dương lịch",
  "3-8": "Quốc tế Phụ nữ",
  "4-30": "Ngày Giải phóng miền Nam",
  "5-1": "Quốc tế Lao động",
  "5-19": "Sinh nhật Chủ tịch Hồ Chí Minh",
  "6-1": "Quốc tế Thiếu nhi",
  "7-27": "Ngày Thương binh Liệt sĩ",
  "9-2": "Quốc khánh",
  "10-20": "Ngày Phụ nữ Việt Nam",
  "11-20": "Ngày Nhà giáo Việt Nam",
  "12-22": "Ngày thành lập Quân đội Nhân dân Việt Nam",
};

const LUNAR_FEST: Record<string, string> = {
  "1-1": "Mùng Một Tết Nguyên Đán",
  "1-2": "Mùng Hai Tết",
  "1-3": "Mùng Ba Tết",
  "1-15": "Tết Nguyên Tiêu",
  "3-3": "Tết Hàn Thực",
  "3-10": "Giỗ Tổ Hùng Vương",
  "4-15": "Lễ Phật Đản",
  "5-5": "Tết Đoan Ngọ",
  "7-15": "Lễ Vu Lan",
  "8-15": "Tết Trung Thu",
  "9-9": "Tết Trùng Cửu",
  "10-15": "Tết Hạ Nguyên",
  "12-23": "Ông Táo chầu trời",
};

const QUOTES = [
  "Có công mài sắt, có ngày nên kim.",
  "Ăn quả nhớ kẻ trồng cây.",
  "Uống nước nhớ nguồn.",
  "Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao.",
  "Đi một ngày đàng, học một sàng khôn.",
  "Thương người như thể thương thân.",
  "Lá lành đùm lá rách.",
  "Tốt gỗ hơn tốt nước sơn.",
  "Có chí thì nên.",
  "Chớ thấy sóng cả mà ngã tay chèo.",
  "Một điều nhịn, chín điều lành.",
  "Ăn ngay ở thẳng.",
  "Tấc đất tấc vàng.",
  "Đói cho sạch, rách cho thơm.",
  "Lời nói chẳng mất tiền mua, lựa lời mà nói cho vừa lòng nhau.",
  "Việc hôm nay chớ để ngày mai.",
  "Cây ngay không sợ chết đứng.",
  "Ở hiền gặp lành.",
  "Trăm hay không bằng tay quen.",
  "Học thầy không tày học bạn.",
  "Gần mực thì đen, gần đèn thì rạng.",
  "Thuận vợ thuận chồng, tát biển Đông cũng cạn.",
  "Một miếng khi đói bằng một gói khi no.",
  "Muốn sang thì bắc cầu kiều, muốn con hay chữ phải yêu lấy thầy.",
  "Người có chí thì nên, nhà có nền thì vững.",
  "Kính trên nhường dưới.",
  "Bạn bè là nghĩa tương giao.",
  "Khôn ngoan đối đáp người ngoài, gà cùng một mẹ chớ hoài đá nhau.",
];

export type Pillar = { stem: number; branch: number };
export type Holiday = { name: string; major: boolean };
export type HourSlot = { branch: number; name: string; range: string; good: boolean; now: boolean };

export type DayBrief = {
  civil: Civil;
  weekday: number;
  lunar: LunarDate;
  day: Pillar;
  month: Pillar;
  year: Pillar;
  hour: Pillar | null;
  napDay: string;
  napMonth: string;
  napYear: string;
  god: { name: string; good: boolean };
  truc: { name: string; note: string };
  term: { name: string; entersToday: boolean };
  holidays: Holiday[];
  quote: string;
  hours: HourSlot[];
};

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function pillarName(p: Pillar): string {
  return `${CAN[p.stem]} ${CHI[p.branch]}`;
}

export function napAm(p: Pillar): string {
  let i = p.stem;
  while (i < 70 && i % 12 !== p.branch) i += 10;
  return NAP_AM[Math.floor(i / 2)] ?? NAP_AM[0];
}

export function lunarMonthTitle(month: number, leap: boolean): string {
  const name = LUNAR_MONTH[month] ?? String(month);
  return `Tháng ${name}${leap ? " nhuận" : ""}`;
}

export function quoteFor(c: Civil): string {
  if (c.m === 10 && c.d === 23) {
    return "Chân lý không có tuổi. Thời gian của chân lý là bây giờ, là mãi mãi.";
  }
  const doy = diffDays({ y: c.y, m: 1, d: 1 }, c);
  return QUOTES[mod(doy, QUOTES.length)] ?? QUOTES[0];
}

export function holidaysOf(c: Civil): Holiday[] {
  const lunar = solarToLunar(c.d, c.m, c.y);
  const list: Holiday[] = [];
  const solar = SOLAR_FEST[`${c.m}-${c.d}`];
  if (solar) list.push({ name: solar, major: true });
  const fest = LUNAR_FEST[`${lunar.month}-${lunar.day}`];
  if (fest && !lunar.leap) list.push({ name: fest, major: true });
  else if (lunar.day === 1) list.push({ name: lunar.leap ? "Mùng Một tháng nhuận" : "Mùng Một", major: false });
  else if (lunar.day === 15) list.push({ name: lunar.leap ? "Rằm tháng nhuận" : "Rằm", major: false });
  return list;
}

function dayGod(lunarMonth: number, branch: number): { name: string; good: boolean } {
  const start = [0, 2, 4, 6, 8, 10][(lunarMonth - 1) % 6] ?? 0;
  return GODS[mod(branch - start, 12)] ?? GODS[0];
}

export function buildBrief(c: Civil, clockHour: number | null): DayBrief {
  const lunar = solarToLunar(c.d, c.m, c.y);
  const day = dayStemBranch(jdFromDate(c.d, c.m, c.y));
  const year = yearStemBranch(lunar.year);
  const month = monthStemBranch(lunar.month, year.stem);
  const god = dayGod(lunar.month, day.branch);
  const monthBranch = mod(lunar.month + 1, 12);
  const trucIndex = mod(day.branch - monthBranch, 12);
  const goodHours = new Set(GIO_HD[day.branch % 6] ?? []);
  const nowBranch = clockHour === null ? -1 : hourBranch(clockHour);
  const hour = clockHour === null ? null : { stem: hourStem(day.stem, nowBranch), branch: nowBranch };
  return {
    civil: c,
    weekday: weekday(c),
    lunar,
    day,
    month,
    year,
    hour,
    napDay: napAm(day),
    napMonth: napAm(month),
    napYear: napAm(year),
    god,
    truc: { name: TRUC[trucIndex] ?? "Kiến", note: TRUC_NOTE[trucIndex] ?? "" },
    term: solarTerm(c),
    holidays: holidaysOf(c),
    quote: quoteFor(c),
    hours: HOUR_META.map((meta, branch) => ({
      branch,
      name: meta.name,
      range: meta.range,
      good: goodHours.has(branch),
      now: branch === nowBranch,
    })),
  };
}

export type Relation = "tuoi" | "hop" | "tam" | "xung" | "binh";

const LUC_HOP: Record<number, number> = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };
const TAM = [
  [8, 0, 4],
  [2, 6, 10],
  [11, 3, 7],
  [5, 9, 1],
];

export function relationOf(tuoi: number, dayBranch: number): Relation {
  if (tuoi === dayBranch) return "tuoi";
  if (mod(tuoi + 6, 12) === dayBranch) return "xung";
  if (LUC_HOP[tuoi] === dayBranch) return "hop";
  if (TAM.some((g) => g.includes(tuoi) && g.includes(dayBranch))) return "tam";
  return "binh";
}

const REL_LABEL: Record<Relation, string> = {
  tuoi: "trùng chi tuổi",
  hop: "lục hợp",
  tam: "tam hợp",
  xung: "xung tuổi",
  binh: "bình hòa",
};

const REL_TEXT: Record<Relation, string> = {
  tuoi: "Hôm nay gặp đúng chi tuổi. Dân gian khuyên làm việc đã quen, tránh quyết định ồn ào.",
  hop: "Ngày lục hợp với tuổi. Thuận gặp mặt, bàn việc, kết giao.",
  tam: "Ngày tam hợp với tuổi. Dễ được người khác nâng đỡ.",
  xung: "Ngày xung tuổi. Nếu đang chọn ngày, nên hoãn ký kết lớn, động thổ và đi xa.",
  binh: "Ngày bình hòa với tuổi. Cứ làm việc thường, không cần chọn giờ gấp.",
};

export function relationLabel(tuoi: number, dayBranch: number): string {
  return REL_LABEL[relationOf(tuoi, dayBranch)];
}

export function tuviLines(tuoi: number, brief: DayBrief): string[] {
  const rel = relationOf(tuoi, brief.day.branch);
  const god = brief.god.good
    ? `${brief.god.name} hoàng đạo — lịch vạn niên coi là thuận cho cưới hỏi, khai trương, xuất hành.`
    : `${brief.god.name} hắc đạo — lịch vạn niên khuyên hoãn việc lớn. Việc thường nhật vẫn làm được.`;
  return [
    `Tuổi ${CHI[tuoi]} (${CON_GIAP[tuoi]?.thu}), ngày ${pillarName(brief.day)}.`,
    REL_TEXT[rel],
    god,
    `Trực ${brief.truc.name}: ${brief.truc.note}`,
  ];
}

export function nextTet(from: Civil): { civil: Civil; days: number } {
  const lunar = solarToLunar(from.d, from.m, from.y);
  if (lunar.month === 1 && lunar.day === 1 && !lunar.leap) return { civil: from, days: 0 };
  const civil = lunarToSolar(1, 1, lunar.year + 1, false) ?? from;
  return { civil, days: diffDays(from, civil) };
}

export function nextLunar(from: Civil, month: number, day: number): Civil | null {
  const lunar = solarToLunar(from.d, from.m, from.y);
  for (let y = lunar.year; y <= lunar.year + 2; y++) {
    const c = lunarToSolar(day, month, y, false);
    if (c && diffDays(from, c) >= 0) return c;
  }
  return null;
}

export function nextWhere(from: Civil, pred: (lunar: LunarDate) => boolean, limit = 45): Civil | null {
  for (let i = 0; i <= limit; i++) {
    const c = addDays(from, i);
    if (pred(solarToLunar(c.d, c.m, c.y))) return c;
  }
  return null;
}

export function upcomingFestivals(from: Civil, count = 4): { civil: Civil; name: string; days: number }[] {
  const out: { civil: Civil; name: string; days: number }[] = [];
  for (let i = 0; i <= 400 && out.length < count; i++) {
    const c = addDays(from, i);
    const major = holidaysOf(c).find((h) => h.major);
    if (major) out.push({ civil: c, name: major.name, days: i });
  }
  return out;
}

export function parseJump(raw: string, today: Civil): Civil | { error: string } {
  const s = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!s) return { error: "Nhập ngày muốn xem." };
  if (s === "hôm nay" || s === "hom nay" || s === "nay") return today;
  const lunarTag = /âm|am|al|nhuận|nhuan/.test(s);
  const nums = s.match(/\d+/g);
  if (!lunarTag && nums && nums.length >= 3) {
    const d = Number(nums[0]);
    const m = Number(nums[1]);
    const y = Number(nums[2]);
    if (!validCivil(d, m, y)) return { error: "Ngày dương không hợp lệ. Thử 23/10/2026." };
    return { y, m, d };
  }
  if (lunarTag && nums && nums.length >= 2) {
    const d = Number(nums[0]);
    const m = Number(nums[1]);
    const y = nums.length >= 3 ? Number(nums[2]) : solarToLunar(today.d, today.m, today.y).year;
    const leap = /nhuận|nhuan/.test(s);
    const civil = lunarToSolar(d, m, y, leap);
    if (!civil) return { error: leap ? "Năm đó không có tháng nhuận này." : "Ngày âm không hợp lệ." };
    return civil;
  }
  return { error: "Thử 23/10/2026 hoặc 14/9 âm." };
}

const PATH_MEANING: Record<number, string> = {
  1: "Số 1 — tự chủ, thích mở đường. Hợp việc mình đứng ra quyết.",
  2: "Số 2 — hòa nhịp, biết nghe. Hợp việc đôi và chăm người nhà.",
  3: "Số 3 — lời nói sáng. Hợp kể chuyện, dạy, bàn bạc.",
  4: "Số 4 — chắc tay, thích nền nếp. Hợp việc cần bền.",
  5: "Số 5 — hay đổi, thích đi. Hợp việc linh hoạt, tránh cam kết cứng.",
  6: "Số 6 — thương nhà, có trách. Hợp chăm sóc và giữ nhịp gia đình.",
  7: "Số 7 — thích hiểu cho rõ. Hợp học, đọc, làm một mình một lúc.",
  8: "Số 8 — nhìn việc lớn. Hợp sắp xếp tiền bạc và kế hoạch dài.",
  9: "Số 9 — rộng lòng. Hợp việc chung, chia sẻ, khép lại chuyện cũ.",
  11: "Số 11 — nhạy. Nghe được điều người khác bỏ qua, nên chậm lại trước khi quyết.",
  22: "Số 22 — dựng việc bền. Hợp kế hoạch nhiều năm, không phải việc một sớm.",
  33: "Số 33 — nâng người khác. Hợp dạy, chăm, dẫn một nhóm nhỏ.",
};

export function lifePath(d: number, m: number, y: number): number | null {
  if (!validCivil(d, m, y)) return null;
  let n = `${d}${m}${y}`.split("").reduce((sum, ch) => sum + Number(ch), 0);
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((sum, ch) => sum + Number(ch), 0);
  }
  return n;
}

export function lifePathLine(n: number): string {
  return PATH_MEANING[n] ?? PATH_MEANING[n % 9 || 9] ?? "";
}

export function shareLines(b: DayBrief): string {
  const fest = b.holidays.map((h) => h.name).join(" · ");
  return [
    `${WEEKDAYS_UP[b.weekday]}, ${b.civil.d} tháng ${b.civil.m} năm ${b.civil.y}`,
    `Âm lịch: ${b.lunar.day} ${lunarMonthTitle(b.lunar.month, b.lunar.leap).toLowerCase()} năm ${pillarName(b.year)}`,
    `Ngày ${pillarName(b.day)} · Tháng ${pillarName(b.month)}`,
    b.god.good ? `${b.god.name} hoàng đạo` : `${b.god.name} hắc đạo`,
    b.term.entersToday ? `Tiết ${b.term.name}` : `Đang trong tiết ${b.term.name}`,
    fest,
    b.quote,
    "Lịch Âm Việt",
  ]
    .filter(Boolean)
    .join("\n");
}
