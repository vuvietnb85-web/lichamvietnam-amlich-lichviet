import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as CalendarDays, a as Sparkles, c as PenLine, d as CloudUpload, f as CloudSun, g as Calendar, h as ChevronDown, i as Star, l as LayoutGrid, m as ChevronLeft, o as Share2, p as ChevronRight, r as Trash2, s as Search, t as Upload, u as Download } from "../_libs/lucide-react.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CH2qhT9H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Âm lịch Việt Nam, múi giờ UTC+7.
*  Thuật toán Hồ Ngọc Đức (2006), kinh độ Mặt Trời theo Jean Meeus.
*/
var PI = Math.PI;
var TZ = 7;
function INT(d) {
	return Math.floor(d);
}
function mod$1(n, m) {
	return (n % m + m) % m;
}
function civilFromDate(date) {
	return {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate()
	};
}
function addDays(c, n) {
	const dt = new Date(c.y, c.m - 1, c.d);
	dt.setDate(dt.getDate() + n);
	return civilFromDate(dt);
}
function iso(c) {
	const m = String(c.m).padStart(2, "0");
	const d = String(c.d).padStart(2, "0");
	return `${c.y}-${m}-${d}`;
}
function sameDay(a, b) {
	return a.y === b.y && a.m === b.m && a.d === b.d;
}
function diffDays(a, b) {
	const ua = Date.UTC(a.y, a.m - 1, a.d);
	const ub = Date.UTC(b.y, b.m - 1, b.d);
	return Math.round((ub - ua) / 864e5);
}
function weekday(c) {
	return new Date(c.y, c.m - 1, c.d).getDay();
}
function validCivil(d, m, y) {
	if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return false;
	return d <= new Date(y, m, 0).getDate();
}
function monthCells(y, m) {
	const lead = (new Date(y, m - 1, 1).getDay() + 6) % 7;
	const start = new Date(y, m - 1, 1 - lead);
	let cells = [];
	for (let i = 0; i < 42; i++) {
		const dt = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
		cells.push(civilFromDate(dt));
	}
	while (cells.length > 28 && cells.slice(-7).every((c) => c.m !== m)) cells = cells.slice(0, -7);
	return cells;
}
function jdFromDate(dd, mm, yy) {
	const a = INT((14 - mm) / 12);
	const y = yy + 4800 - a;
	const m = mm + 12 * a - 3;
	let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
	if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
	return jd;
}
function jdToDate(jd) {
	let a;
	let b;
	let c;
	if (jd > 2299160) {
		a = jd + 32044;
		b = INT((4 * a + 3) / 146097);
		c = a - INT(b * 146097 / 4);
	} else {
		b = 0;
		c = jd + 32082;
	}
	const d = INT((4 * c + 3) / 1461);
	const e = c - INT(1461 * d / 4);
	const m = INT((5 * e + 2) / 153);
	const day = e - INT((153 * m + 2) / 5) + 1;
	const month = m + 3 - 12 * INT(m / 10);
	return {
		y: b * 100 + d - 4800 + INT(m / 10),
		m: month,
		d: day
	};
}
function sunLongitude(jdn) {
	const T = (jdn - 2451545) / 36525;
	const T2 = T * T;
	const dr = PI / 180;
	const M = 357.5291 + 35999.0503 * T - 1559e-7 * T2 - 48e-8 * T * T2;
	const L0 = 280.46645 + 36000.76983 * T + 3032e-7 * T2;
	let DL = (1.9146 - .004817 * T - 14e-6 * T2) * Math.sin(dr * M);
	DL = DL + (.019993 - 101e-6 * T) * Math.sin(dr * 2 * M) + 29e-5 * Math.sin(dr * 3 * M);
	let L = (L0 + DL) * dr;
	L = L - PI * 2 * INT(L / (PI * 2));
	return L;
}
function getSunLongitude(dayNumber, timeZone) {
	return INT(sunLongitude(dayNumber - .5 - timeZone / 24) / PI * 6);
}
function newMoon(k) {
	const T = k / 1236.85;
	const T2 = T * T;
	const T3 = T2 * T;
	const dr = PI / 180;
	let Jd1 = 2415020.75933 + 29.53058868 * k + 1178e-7 * T2 - 155e-9 * T3;
	Jd1 = Jd1 + 33e-5 * Math.sin((166.56 + 132.87 * T - .009173 * T2) * dr);
	const M = 359.2242 + 29.10535608 * k - 333e-7 * T2 - 347e-8 * T3;
	const Mpr = 306.0253 + 385.81691806 * k + .0107306 * T2 + 1236e-8 * T3;
	const F = 21.2964 + 390.67050646 * k - .0016528 * T2 - 239e-8 * T3;
	let C1 = (.1734 - 393e-6 * T) * Math.sin(M * dr) + .0021 * Math.sin(2 * dr * M);
	C1 = C1 - .4068 * Math.sin(Mpr * dr) + .0161 * Math.sin(dr * 2 * Mpr);
	C1 = C1 - 4e-4 * Math.sin(dr * 3 * Mpr);
	C1 = C1 + .0104 * Math.sin(dr * 2 * F) - .0051 * Math.sin(dr * (M + Mpr));
	C1 = C1 - .0074 * Math.sin(dr * (M - Mpr)) + 4e-4 * Math.sin(dr * (2 * F + M));
	C1 = C1 - 4e-4 * Math.sin(dr * (2 * F - M)) - 6e-4 * Math.sin(dr * (2 * F + Mpr));
	C1 = C1 + .001 * Math.sin(dr * (2 * F - Mpr)) + 5e-4 * Math.sin(dr * (2 * Mpr + M));
	let deltat;
	if (T < -11) deltat = .001 + 839e-6 * T + 2261e-7 * T2 - 845e-8 * T3 - 81e-9 * T * T3;
	else deltat = -278e-6 + 265e-6 * T + 262e-6 * T2;
	return Jd1 + C1 - deltat;
}
function getNewMoonDay(k, timeZone) {
	return INT(newMoon(k) + .5 + timeZone / 24);
}
function getLunarMonth11(yy, timeZone) {
	const k = INT((jdFromDate(31, 12, yy) - 2415021) / 29.530588853);
	let nm = getNewMoonDay(k, timeZone);
	if (getSunLongitude(nm, timeZone) >= 9) nm = getNewMoonDay(k - 1, timeZone);
	return nm;
}
function getLeapMonthOffset(a11, timeZone) {
	const k = INT((a11 - 2415021.076998695) / 29.530588853 + .5);
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
function solarToLunar(dd, mm, yy) {
	const dayNumber = jdFromDate(dd, mm, yy);
	const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
	let monthStart = getNewMoonDay(k + 1, TZ);
	if (monthStart > dayNumber) monthStart = getNewMoonDay(k, TZ);
	let a11 = getLunarMonth11(yy, TZ);
	let b11 = a11;
	let lunarYear;
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
	return {
		day: lunarDay,
		month: lunarMonth,
		year: lunarYear,
		leap: lunarLeap === 1
	};
}
function lunarToSolar(day, month, year, leap) {
	if (month < 1 || month > 12 || day < 1 || day > 30) return null;
	let a11;
	let b11;
	if (month < 11) {
		a11 = getLunarMonth11(year - 1, TZ);
		b11 = getLunarMonth11(year, TZ);
	} else {
		a11 = getLunarMonth11(year, TZ);
		b11 = getLunarMonth11(year + 1, TZ);
	}
	let off = month - 11;
	if (off < 0) off += 12;
	const k = INT(.5 + (a11 - 2415021.076998695) / 29.530588853);
	if (b11 - a11 > 365) {
		const leapOff = getLeapMonthOffset(a11, TZ);
		let leapMonth = leapOff - 2;
		if (leapMonth < 0) leapMonth += 12;
		if (leap && month !== leapMonth) return null;
		if (leap || off >= leapOff) off += 1;
	} else if (leap) return null;
	return jdToDate(getNewMoonDay(k + off, TZ) + day - 1);
}
function dayStemBranch(jd) {
	return {
		stem: mod$1(jd + 9, 10),
		branch: mod$1(jd + 1, 12)
	};
}
function yearStemBranch(lunarYear) {
	return {
		stem: mod$1(lunarYear - 4, 10),
		branch: mod$1(lunarYear - 4, 12)
	};
}
function monthStemBranch(lunarMonth, yearStem) {
	const branch = mod$1(lunarMonth + 1, 12);
	return {
		stem: mod$1(([
			2,
			4,
			6,
			8,
			0
		][yearStem % 5] ?? 2) + lunarMonth - 1, 10),
		branch
	};
}
function hourBranch(hour) {
	if (hour >= 23) return 0;
	return Math.floor((hour + 1) / 2);
}
function hourStem(dayStem, branch) {
	return mod$1(dayStem % 5 * 2 + branch, 10);
}
var TERMS = [
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
	"Đại hàn"
];
function sunDeg(jd) {
	return mod$1(sunLongitude(jd) * 180 / PI, 360);
}
function termIndex(deg) {
	return Math.floor(mod$1(deg - 315, 360) / 15);
}
function solarTerm(c) {
	const start = jdFromDate(c.d, c.m, c.y) - .5 - TZ / 24;
	const end = start + 1;
	const before = termIndex(sunDeg(start));
	const after = termIndex(sunDeg(end - 1e-4));
	return {
		name: TERMS[after] ?? TERMS[0],
		entersToday: before !== after
	};
}
var CAN = [
	"Giáp",
	"Ất",
	"Bính",
	"Đinh",
	"Mậu",
	"Kỷ",
	"Canh",
	"Tân",
	"Nhâm",
	"Quý"
];
var CHI = [
	"Tý",
	"Sửu",
	"Dần",
	"Mão",
	"Thìn",
	"Tỵ",
	"Ngọ",
	"Mùi",
	"Thân",
	"Dậu",
	"Tuất",
	"Hợi"
];
var CON_GIAP = [
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
	{ thu: "Lợn" }
];
var WEEKDAYS_UP = [
	"CHỦ NHẬT",
	"THỨ HAI",
	"THỨ BA",
	"THỨ TƯ",
	"THỨ NĂM",
	"THỨ SÁU",
	"THỨ BẢY"
];
var WEEK_HEAD = [
	"T2",
	"T3",
	"T4",
	"T5",
	"T6",
	"T7",
	"CN"
];
var LUNAR_MONTH = [
	"",
	"Giêng",
	"Hai",
	"Ba",
	"Tư",
	"Năm",
	"Sáu",
	"Bảy",
	"Tám",
	"Chín",
	"Mười",
	"Mười một",
	"Chạp"
];
var NAP_AM = [
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
	"Đại Hải Thủy"
];
var GODS = [
	{
		name: "Thanh Long",
		good: true
	},
	{
		name: "Minh Đường",
		good: true
	},
	{
		name: "Thiên Hình",
		good: false
	},
	{
		name: "Chu Tước",
		good: false
	},
	{
		name: "Kim Quỹ",
		good: true
	},
	{
		name: "Kim Đường",
		good: true
	},
	{
		name: "Bạch Hổ",
		good: false
	},
	{
		name: "Ngọc Đường",
		good: true
	},
	{
		name: "Thiên Lao",
		good: false
	},
	{
		name: "Nguyên Vũ",
		good: false
	},
	{
		name: "Tư Mệnh",
		good: true
	},
	{
		name: "Câu Trần",
		good: false
	}
];
var TRUC = [
	"Kiến",
	"Trừ",
	"Mãn",
	"Bình",
	"Định",
	"Chấp",
	"Phá",
	"Nguy",
	"Thành",
	"Thu",
	"Khai",
	"Bế"
];
var TRUC_NOTE = [
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
	"Nên lấp hố, xây mộ. Kỵ khai trương, cưới hỏi."
];
var HOUR_META = [
	{
		name: "Tý",
		range: "23–01"
	},
	{
		name: "Sửu",
		range: "01–03"
	},
	{
		name: "Dần",
		range: "03–05"
	},
	{
		name: "Mão",
		range: "05–07"
	},
	{
		name: "Thìn",
		range: "07–09"
	},
	{
		name: "Tỵ",
		range: "09–11"
	},
	{
		name: "Ngọ",
		range: "11–13"
	},
	{
		name: "Mùi",
		range: "13–15"
	},
	{
		name: "Thân",
		range: "15–17"
	},
	{
		name: "Dậu",
		range: "17–19"
	},
	{
		name: "Tuất",
		range: "19–21"
	},
	{
		name: "Hợi",
		range: "21–23"
	}
];
var GIO_HD = [
	[
		0,
		1,
		3,
		6,
		8,
		9
	],
	[
		2,
		3,
		5,
		8,
		10,
		11
	],
	[
		0,
		1,
		4,
		5,
		7,
		10
	],
	[
		2,
		4,
		6,
		7,
		9,
		11
	],
	[
		2,
		3,
		5,
		8,
		9,
		11
	],
	[
		1,
		4,
		6,
		7,
		10,
		11
	]
];
var SOLAR_FEST = {
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
	"12-22": "Ngày thành lập Quân đội Nhân dân Việt Nam"
};
var LUNAR_FEST = {
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
	"12-23": "Ông Táo chầu trời"
};
var QUOTES = [
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
	"Khôn ngoan đối đáp người ngoài, gà cùng một mẹ chớ hoài đá nhau."
];
function mod(n, m) {
	return (n % m + m) % m;
}
function pillarName(p) {
	return `${CAN[p.stem]} ${CHI[p.branch]}`;
}
function napAm(p) {
	let i = p.stem;
	while (i < 70 && i % 12 !== p.branch) i += 10;
	return NAP_AM[Math.floor(i / 2)] ?? NAP_AM[0];
}
function lunarMonthTitle(month, leap) {
	return `Tháng ${LUNAR_MONTH[month] ?? String(month)}${leap ? " nhuận" : ""}`;
}
function quoteFor(c) {
	if (c.m === 10 && c.d === 23) return "Chân lý không có tuổi. Thời gian của chân lý là bây giờ, là mãi mãi.";
	return QUOTES[mod(diffDays({
		y: c.y,
		m: 1,
		d: 1
	}, c), QUOTES.length)] ?? QUOTES[0];
}
function holidaysOf(c) {
	const lunar = solarToLunar(c.d, c.m, c.y);
	const list = [];
	const solar = SOLAR_FEST[`${c.m}-${c.d}`];
	if (solar) list.push({
		name: solar,
		major: true
	});
	const fest = LUNAR_FEST[`${lunar.month}-${lunar.day}`];
	if (fest && !lunar.leap) list.push({
		name: fest,
		major: true
	});
	else if (lunar.day === 1) list.push({
		name: lunar.leap ? "Mùng Một tháng nhuận" : "Mùng Một",
		major: false
	});
	else if (lunar.day === 15) list.push({
		name: lunar.leap ? "Rằm tháng nhuận" : "Rằm",
		major: false
	});
	return list;
}
function dayGod(lunarMonth, branch) {
	return GODS[mod(branch - ([
		0,
		2,
		4,
		6,
		8,
		10
	][(lunarMonth - 1) % 6] ?? 0), 12)] ?? GODS[0];
}
function buildBrief(c, clockHour) {
	const lunar = solarToLunar(c.d, c.m, c.y);
	const day = dayStemBranch(jdFromDate(c.d, c.m, c.y));
	const year = yearStemBranch(lunar.year);
	const month = monthStemBranch(lunar.month, year.stem);
	const god = dayGod(lunar.month, day.branch);
	const monthBranch = mod(lunar.month + 1, 12);
	const trucIndex = mod(day.branch - monthBranch, 12);
	const goodHours = new Set(GIO_HD[day.branch % 6] ?? []);
	const nowBranch = clockHour === null ? -1 : hourBranch(clockHour);
	const hour = clockHour === null ? null : {
		stem: hourStem(day.stem, nowBranch),
		branch: nowBranch
	};
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
		truc: {
			name: TRUC[trucIndex] ?? "Kiến",
			note: TRUC_NOTE[trucIndex] ?? ""
		},
		term: solarTerm(c),
		holidays: holidaysOf(c),
		quote: quoteFor(c),
		hours: HOUR_META.map((meta, branch) => ({
			branch,
			name: meta.name,
			range: meta.range,
			good: goodHours.has(branch),
			now: branch === nowBranch
		}))
	};
}
var LUC_HOP = {
	0: 1,
	1: 0,
	2: 11,
	11: 2,
	3: 10,
	10: 3,
	4: 9,
	9: 4,
	5: 8,
	8: 5,
	6: 7,
	7: 6
};
var TAM = [
	[
		8,
		0,
		4
	],
	[
		2,
		6,
		10
	],
	[
		11,
		3,
		7
	],
	[
		5,
		9,
		1
	]
];
function relationOf(tuoi, dayBranch) {
	if (tuoi === dayBranch) return "tuoi";
	if (mod(tuoi + 6, 12) === dayBranch) return "xung";
	if (LUC_HOP[tuoi] === dayBranch) return "hop";
	if (TAM.some((g) => g.includes(tuoi) && g.includes(dayBranch))) return "tam";
	return "binh";
}
var REL_LABEL = {
	tuoi: "trùng chi tuổi",
	hop: "lục hợp",
	tam: "tam hợp",
	xung: "xung tuổi",
	binh: "bình hòa"
};
var REL_TEXT = {
	tuoi: "Hôm nay gặp đúng chi tuổi. Dân gian khuyên làm việc đã quen, tránh quyết định ồn ào.",
	hop: "Ngày lục hợp với tuổi. Thuận gặp mặt, bàn việc, kết giao.",
	tam: "Ngày tam hợp với tuổi. Dễ được người khác nâng đỡ.",
	xung: "Ngày xung tuổi. Nếu đang chọn ngày, nên hoãn ký kết lớn, động thổ và đi xa.",
	binh: "Ngày bình hòa với tuổi. Cứ làm việc thường, không cần chọn giờ gấp."
};
function relationLabel(tuoi, dayBranch) {
	return REL_LABEL[relationOf(tuoi, dayBranch)];
}
function tuviLines(tuoi, brief) {
	const rel = relationOf(tuoi, brief.day.branch);
	const god = brief.god.good ? `${brief.god.name} hoàng đạo — lịch vạn niên coi là thuận cho cưới hỏi, khai trương, xuất hành.` : `${brief.god.name} hắc đạo — lịch vạn niên khuyên hoãn việc lớn. Việc thường nhật vẫn làm được.`;
	return [
		`Tuổi ${CHI[tuoi]} (${CON_GIAP[tuoi]?.thu}), ngày ${pillarName(brief.day)}.`,
		REL_TEXT[rel],
		god,
		`Trực ${brief.truc.name}: ${brief.truc.note}`
	];
}
function nextTet(from) {
	const lunar = solarToLunar(from.d, from.m, from.y);
	if (lunar.month === 1 && lunar.day === 1 && !lunar.leap) return {
		civil: from,
		days: 0
	};
	const civil = lunarToSolar(1, 1, lunar.year + 1, false) ?? from;
	return {
		civil,
		days: diffDays(from, civil)
	};
}
function nextLunar(from, month, day) {
	const lunar = solarToLunar(from.d, from.m, from.y);
	for (let y = lunar.year; y <= lunar.year + 2; y++) {
		const c = lunarToSolar(day, month, y, false);
		if (c && diffDays(from, c) >= 0) return c;
	}
	return null;
}
function nextWhere(from, pred, limit = 45) {
	for (let i = 0; i <= limit; i++) {
		const c = addDays(from, i);
		if (pred(solarToLunar(c.d, c.m, c.y))) return c;
	}
	return null;
}
function upcomingFestivals(from, count = 4) {
	const out = [];
	for (let i = 0; i <= 400 && out.length < count; i++) {
		const c = addDays(from, i);
		const major = holidaysOf(c).find((h) => h.major);
		if (major) out.push({
			civil: c,
			name: major.name,
			days: i
		});
	}
	return out;
}
function parseJump(raw, today) {
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
		return {
			y,
			m,
			d
		};
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
var PATH_MEANING = {
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
	33: "Số 33 — nâng người khác. Hợp dạy, chăm, dẫn một nhóm nhỏ."
};
function lifePath(d, m, y) {
	if (!validCivil(d, m, y)) return null;
	let n = `${d}${m}${y}`.split("").reduce((sum, ch) => sum + Number(ch), 0);
	while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = String(n).split("").reduce((sum, ch) => sum + Number(ch), 0);
	return n;
}
function lifePathLine(n) {
	return PATH_MEANING[n] ?? PATH_MEANING[n % 9 || 9] ?? "";
}
function shareLines(b) {
	const fest = b.holidays.map((h) => h.name).join(" · ");
	return [
		`${WEEKDAYS_UP[b.weekday]}, ${b.civil.d} tháng ${b.civil.m} năm ${b.civil.y}`,
		`Âm lịch: ${b.lunar.day} ${lunarMonthTitle(b.lunar.month, b.lunar.leap).toLowerCase()} năm ${pillarName(b.year)}`,
		`Ngày ${pillarName(b.day)} · Tháng ${pillarName(b.month)}`,
		b.god.good ? `${b.god.name} hoàng đạo` : `${b.god.name} hắc đạo`,
		b.term.entersToday ? `Tiết ${b.term.name}` : `Đang trong tiết ${b.term.name}`,
		fest,
		b.quote,
		"Lịch Âm Việt"
	].filter(Boolean).join("\n");
}
var useLichStore = create()(persist((set) => ({
	notes: [],
	tuoi: null,
	sinh: null,
	addNote: (iso, text) => {
		const clean = text.trim().slice(0, 500);
		if (!clean) return;
		set((s) => ({ notes: [{
			id: crypto.randomUUID(),
			iso,
			text: clean,
			at: Date.now()
		}, ...s.notes].slice(0, 300) }));
	},
	removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
	setTuoi: (tuoi) => set({ tuoi }),
	setSinh: (sinh) => set({ sinh }),
	replaceAll: (notes, tuoi, sinh = null) => set({
		notes: notes.slice(0, 300),
		tuoi,
		sinh
	})
}), {
	name: "lich-am-viet",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true
}));
function parseBackup(raw) {
	if (!raw || typeof raw !== "object") return null;
	const o = raw;
	if (!Array.isArray(o.notes)) return null;
	const notes = [];
	for (const item of o.notes) {
		if (!item || typeof item !== "object") continue;
		const n = item;
		if (typeof n.iso !== "string" || typeof n.text !== "string") continue;
		if (!/^\d{4}-\d{2}-\d{2}$/.test(n.iso)) continue;
		const text = n.text.trim().slice(0, 500);
		if (!text) continue;
		notes.push({
			id: typeof n.id === "string" ? n.id.slice(0, 80) : crypto.randomUUID(),
			iso: n.iso,
			text,
			at: typeof n.at === "number" ? n.at : Date.now()
		});
	}
	const tuoi = typeof o.tuoi === "number" && o.tuoi >= 0 && o.tuoi <= 11 ? Math.floor(o.tuoi) : null;
	const sinh = typeof o.sinh === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.sinh) ? o.sinh : null;
	return {
		notes: notes.slice(0, 300),
		tuoi,
		sinh
	};
}
function Sky({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 400 240",
		preserveAspectRatio: "xMaxYMin meet",
		className,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			fill: "#fff",
			opacity: "0.9",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "46",
					cy: "36",
					rx: "28",
					ry: "14"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "70",
					cy: "32",
					rx: "22",
					ry: "16"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "24",
					cy: "34",
					rx: "16",
					ry: "11"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "168",
					cy: "22",
					rx: "22",
					ry: "10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "190",
					cy: "18",
					rx: "16",
					ry: "11"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: "translate(250 0)",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M18 118 C70 78 108 48 168 18",
					fill: "none",
					stroke: "#2f8a52",
					strokeWidth: "5",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M18 118 C40 96 58 108 72 92",
					fill: "none",
					stroke: "#246b40",
					strokeWidth: "3.5",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "78",
					cy: "70",
					rx: "22",
					ry: "11",
					fill: "#3aaa62",
					transform: "rotate(-32 78 70)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "108",
					cy: "48",
					rx: "20",
					ry: "10",
					fill: "#2f9154",
					transform: "rotate(-24 108 48)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "136",
					cy: "30",
					rx: "18",
					ry: "9",
					fill: "#49b86c",
					transform: "rotate(-16 136 30)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "58",
					cy: "92",
					rx: "16",
					ry: "8",
					fill: "#237a45",
					transform: "rotate(-48 58 92)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "96",
					cy: "62",
					rx: "14",
					ry: "7",
					fill: "#67c484",
					transform: "rotate(-20 96 62)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "150",
					cy: "22",
					rx: "13",
					ry: "6",
					fill: "#8fd49a",
					transform: "rotate(-8 150 22)"
				})
			]
		})]
	});
}
function Meadow({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 40 400 300",
		preserveAspectRatio: "xMidYMax meet",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "sand",
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0",
					stopColor: "#f7e7c4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "1",
					stopColor: "#efd3a0"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 118 C80 96 140 150 220 128 C290 110 340 156 400 132 L400 340 L0 340 Z",
				fill: "#f4e4bf"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 168 C90 150 160 196 250 176 C310 162 360 198 400 178 L400 340 L0 340 Z",
				fill: "url(#sand)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "none",
				stroke: "#e4c98a",
				strokeWidth: "2.4",
				opacity: "0.9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "22",
						y: "188",
						width: "28",
						height: "22",
						rx: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "22",
						y: "214",
						width: "28",
						height: "22",
						rx: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "54",
						y: "214",
						width: "28",
						height: "22",
						rx: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "22",
						y: "240",
						width: "60",
						height: "22",
						rx: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "22",
						y: "266",
						width: "28",
						height: "22",
						rx: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "54",
						y: "266",
						width: "28",
						height: "22",
						rx: "3"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "#d7c48a",
				opacity: "0.55",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "70",
						cy: "312",
						rx: "26",
						ry: "7"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "150",
						cy: "300",
						rx: "18",
						ry: "5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "210",
						cy: "318",
						rx: "22",
						ry: "6"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grass, {
				x: 118,
				y: 196
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grass, {
				x: 188,
				y: 168
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grass, {
				x: 300,
				y: 150
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: "translate(18 78)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "52",
						cy: "214",
						rx: "34",
						ry: "7",
						fill: "#e7d2a4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M34 132 Q22 168 18 196",
						stroke: "#234a96",
						strokeWidth: "13",
						strokeLinecap: "round",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M50 132 Q68 150 86 118",
						stroke: "#234a96",
						strokeWidth: "13",
						strokeLinecap: "round",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "16",
						cy: "204",
						rx: "9",
						ry: "5",
						fill: "#f3c2a2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "90",
						cy: "112",
						rx: "8",
						ry: "5",
						fill: "#f3c2a2",
						transform: "rotate(-20 90 112)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M28 78 Q22 118 40 136 L66 136 Q78 108 68 76 Z",
						fill: "#f07830"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M30 108 Q48 118 68 100",
						stroke: "#14915c",
						strokeWidth: "7",
						strokeLinecap: "round",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M62 92 Q86 100 102 78",
						stroke: "#f07830",
						strokeWidth: "11",
						strokeLinecap: "round",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M34 96 Q12 108 4 128",
						stroke: "#f07830",
						strokeWidth: "11",
						strokeLinecap: "round",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "14",
						cy: "132",
						r: "6",
						fill: "#f3c2a2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "104",
						cy: "74",
						r: "6",
						fill: "#f3c2a2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "50",
						cy: "58",
						r: "24",
						fill: "#f6c7a8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M28 56 Q30 28 52 26 Q76 28 74 58 Q66 38 50 34 Q36 36 28 56",
						fill: "#6b4228"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M34 40 Q50 32 66 42",
						stroke: "#6b4228",
						strokeWidth: "6",
						fill: "none",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "42",
						cy: "58",
						r: "2.2",
						fill: "#24155f"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "58",
						cy: "58",
						r: "2.2",
						fill: "#24155f"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "36",
						cy: "64",
						rx: "4",
						ry: "2.2",
						fill: "#e88998",
						opacity: "0.8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "64",
						cy: "64",
						rx: "4",
						ry: "2.2",
						fill: "#e88998",
						opacity: "0.8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M44 68 Q50 74 57 68",
						stroke: "#c4484a",
						strokeWidth: "1.8",
						fill: "none",
						strokeLinecap: "round"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: "translate(228 96)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "48",
						cy: "168",
						rx: "36",
						ry: "7",
						fill: "#e7d2a4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M28 96 L24 150",
						stroke: "#d46a7c",
						strokeWidth: "12",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M46 98 L50 150",
						stroke: "#d46a7c",
						strokeWidth: "12",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "22",
						cy: "156",
						rx: "8",
						ry: "4.5",
						fill: "#f3c2a2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "52",
						cy: "156",
						rx: "8",
						ry: "4.5",
						fill: "#f3c2a2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M16 62 Q18 100 34 112 L54 112 Q70 96 64 60 Z",
						fill: "#e07b8c"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M58 78 Q74 70 78 54",
						stroke: "#e07b8c",
						strokeWidth: "9",
						strokeLinecap: "round",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "80",
						cy: "50",
						r: "5.5",
						fill: "#f3c2a2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "40",
						cy: "46",
						r: "20",
						fill: "#f6c7a8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M22 44 Q24 22 42 20 Q62 22 60 46 Q52 30 40 26 Q28 28 22 44",
						fill: "#6b4228"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M58 28 Q72 8 66 30",
						stroke: "#6b4228",
						strokeWidth: "5",
						fill: "none",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "70",
						cy: "12",
						r: "5",
						fill: "#d23b45"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "34",
						cy: "46",
						r: "1.8",
						fill: "#24155f"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "47",
						cy: "46",
						r: "1.8",
						fill: "#24155f"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "30",
						cy: "52",
						rx: "3.2",
						ry: "1.8",
						fill: "#e88998",
						opacity: "0.75"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M35 54 Q40 58 46 54",
						stroke: "#c4484a",
						strokeWidth: "1.5",
						fill: "none",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: "translate(78 18)",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M22 70 L20 118",
								stroke: "#a56a3a",
								strokeWidth: "11",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M38 72 L42 118",
								stroke: "#a56a3a",
								strokeWidth: "11",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
								cx: "18",
								cy: "124",
								rx: "7",
								ry: "4",
								fill: "#f3c2a2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
								cx: "44",
								cy: "124",
								rx: "7",
								ry: "4",
								fill: "#f3c2a2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M12 42 Q14 74 28 86 L46 84 Q58 66 50 40 Z",
								fill: "#c9844a"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "32",
								cy: "30",
								r: "16",
								fill: "#f6c7a8"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M18 28 Q20 12 34 12 Q50 14 48 30 Q40 18 32 16 Q22 18 18 28",
								fill: "#5c3824"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M22 30 Q32 36 42 28",
								stroke: "#c4484a",
								strokeWidth: "2",
								fill: "none",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M24 26 Q28 22 26 28",
								stroke: "#24155f",
								strokeWidth: "1.6",
								fill: "none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M38 26 Q42 22 40 28",
								stroke: "#24155f",
								strokeWidth: "1.6",
								fill: "none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
								cx: "32",
								cy: "34",
								rx: "3",
								ry: "2",
								fill: "#e88998",
								opacity: "0.5"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: "translate(250 188)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "62",
						cy: "118",
						rx: "46",
						ry: "12",
						fill: "#b4232c"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "62",
						cy: "112",
						rx: "40",
						ry: "9",
						fill: "#e23b3b"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "62",
						cy: "108",
						rx: "28",
						ry: "6",
						fill: "#f0c14a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "62",
						cy: "86",
						rx: "30",
						ry: "22",
						fill: "#fffaf4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M40 78 Q36 96 48 100",
						stroke: "#e7b4c4",
						strokeWidth: "2",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "52",
						cy: "90",
						r: "3.2",
						fill: "#e07b8c"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "52",
						cy: "90",
						r: "1.2",
						fill: "#f0c14a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M78 70 Q88 84 84 98",
						stroke: "#3aaa62",
						strokeWidth: "2",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "74",
						cy: "78",
						r: "4",
						fill: "#e07b8c"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "62",
						cy: "58",
						r: "22",
						fill: "#fffaf4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M44 50 L34 28 L56 44 Z",
						fill: "#fffaf4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M80 50 L90 28 L68 44 Z",
						fill: "#fffaf4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M46 46 L40 32 L54 42 Z",
						fill: "#f3b6c4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M78 46 L84 32 L70 42 Z",
						fill: "#f3b6c4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M50 56 Q62 62 74 56",
						stroke: "#c4484a",
						strokeWidth: "2.2",
						fill: "none",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M46 54 Q62 66 78 54",
						stroke: "#e07b8c",
						strokeWidth: "1.4",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "54",
						cy: "54",
						r: "1.7",
						fill: "#24155f"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "70",
						cy: "54",
						r: "1.7",
						fill: "#24155f"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M40 58 H28",
						stroke: "#c8b49a",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M40 62 H26",
						stroke: "#c8b49a",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M84 58 H96",
						stroke: "#c8b49a",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M84 62 H98",
						stroke: "#c8b49a",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M86 62 Q108 48 112 22",
						stroke: "#fffaf4",
						strokeWidth: "8",
						fill: "none",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "114",
						cy: "16",
						r: "7",
						fill: "#d23b45"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "114",
						cy: "16",
						r: "3",
						fill: "#f0c14a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "104",
						cy: "30",
						r: "6",
						fill: "#d23b45"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "104",
						cy: "30",
						r: "2.6",
						fill: "#f0c14a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "96",
						cy: "42",
						r: "5",
						fill: "#d23b45"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "96",
						cy: "42",
						r: "2.2",
						fill: "#f0c14a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "46",
						y: "78",
						width: "10",
						height: "16",
						rx: "1.5",
						fill: "#c23b3b",
						transform: "rotate(18 51 86)"
					})
				]
			})
		]
	});
}
function Grass({ x, y }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x} ${y})`,
		fill: "#3aaa62",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 22 Q2 8 0 0 Q4 10 6 22 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 22 Q12 6 16 2 Q12 12 10 22 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 22 Q6 10 10 4 Q14 12 14 22 Z" })
		]
	});
}
function pad(n) {
	return String(n).padStart(2, "0");
}
function vnClock(date) {
	const h = date.getHours();
	const h12 = h % 12 || 12;
	const tag = h < 12 ? "SA" : h < 18 ? "CH" : "Tối";
	return `${h12}:${pad(date.getMinutes())} ${tag}`;
}
function Taiji({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "15",
				fill: "var(--color-paper)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "var(--color-holiday)",
				d: "M16 1a15 15 0 0 1 0 30 7.5 7.5 0 0 1 0-15 7.5 7.5 0 0 0 0-15z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "8.5",
				r: "2.1",
				fill: "var(--color-holiday)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "23.5",
				r: "2.1",
				fill: "var(--color-paper)"
			})
		]
	});
}
function SheetFrame({ open, title, description, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Portal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, { className: "fixed inset-0 z-40 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
			className: "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[86dvh] w-full max-w-[480px] flex-col rounded-t-3xl bg-paper outline-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
					className: "px-5 pt-3 text-lg font-extrabold text-ink",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Description, {
					className: "px-5 text-sm text-muted",
					children: description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 overflow-y-auto px-5 pt-3 pb-8",
					children
				})
			]
		})] })
	});
}
function LichApp() {
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const today = civilFromDate(now);
	const [selected, setSelected] = (0, import_react.useState)(today);
	const [visible, setVisible] = (0, import_react.useState)(today);
	const [view, setView] = (0, import_react.useState)("ngay");
	const [sheet, setSheet] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)("");
	const [weather, setWeather] = (0, import_react.useState)(null);
	const [conv, setConv] = (0, import_react.useState)({
		d: String(today.d),
		m: String(today.m),
		y: String(today.y),
		mode: "duong",
		leap: false
	});
	const notes = useLichStore((s) => s.notes);
	const tuoi = useLichStore((s) => s.tuoi);
	const sinh = useLichStore((s) => s.sinh);
	const addNote = useLichStore((s) => s.addNote);
	const removeNote = useLichStore((s) => s.removeNote);
	const setTuoi = useLichStore((s) => s.setTuoi);
	const setSinh = useLichStore((s) => s.setSinh);
	const replaceAll = useLichStore((s) => s.replaceAll);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 3e4);
		return () => window.clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!toast) return;
		const t = window.setTimeout(() => setToast(""), 2400);
		return () => window.clearTimeout(t);
	}, [toast]);
	const clockHour = now.getHours();
	const brief = (0, import_react.useMemo)(() => buildBrief(selected, clockHour), [selected, clockHour]);
	const dayNotes = notes.filter((n) => n.iso === iso(selected));
	function go(c) {
		setSelected(c);
		setVisible(c);
	}
	function nudge(delta) {
		if (view === "thang") {
			const dt = new Date(visible.y, visible.m - 1 + delta, 1);
			setVisible({
				y: dt.getFullYear(),
				m: dt.getMonth() + 1,
				d: 1
			});
			return;
		}
		go(addDays(selected, delta));
	}
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.key === "Escape") setSheet(null);
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				nudge(view === "thang" ? -1 : -1);
			}
			if (e.key === "ArrowRight") {
				e.preventDefault();
				nudge(view === "thang" ? 1 : 1);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	async function share() {
		const text = shareLines(brief);
		try {
			if (navigator.share) {
				await navigator.share({
					title: "Lịch Âm Việt",
					text
				});
				return;
			}
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") return;
		}
		try {
			await navigator.clipboard.writeText(text);
			setToast("Đã chép ngày này để chia sẻ");
		} catch {
			setToast("Trình duyệt không cho chia sẻ");
		}
	}
	function locate() {
		if (!navigator.geolocation) {
			setToast("Máy không có định vị");
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => {
			const { latitude, longitude } = pos.coords;
			fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`).then((r) => r.json()).then((data) => {
				const temp = data.current?.temperature_2m;
				if (typeof temp === "number") setWeather({
					temp,
					place: "Gần bạn"
				});
			}).catch(() => setToast("Không lấy được thời tiết"));
		}, () => setToast("Chưa được phép dùng vị trí. Vẫn xem Hà Nội."));
	}
	function downloadBackup() {
		const blob = new Blob([JSON.stringify({
			app: "lich-am-viet",
			version: 1,
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			tuoi,
			sinh,
			notes
		}, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "lich-am-viet.json";
		a.click();
		URL.revokeObjectURL(url);
		setToast("Đã tải tệp sao lưu");
	}
	function onImport(file) {
		file.text().then((text) => {
			try {
				const parsed = parseBackup(JSON.parse(text));
				if (!parsed) {
					setToast("Tệp không phải bản sao lưu của lịch");
					return;
				}
				replaceAll(parsed.notes, parsed.tuoi, parsed.sinh);
				setToast(`Đã khôi phục ${parsed.notes.length} ghi chú`);
				setSheet(null);
			} catch {
				setToast("Không đọc được tệp");
			}
		});
	}
	const titleDate = view === "thang" ? visible : selected;
	const fest = upcomingFestivals(today, 4);
	const tet = nextTet(today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "sky-bg relative min-h-dvh overflow-hidden",
		children: [
			view === "ngay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { className: "pointer-events-none absolute inset-x-0 top-0 z-0 h-52 w-full" }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex h-dvh w-full max-w-[480px] flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "topbar relative z-10 flex items-center gap-1 px-2 pb-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "press grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink",
								onClick: locate,
								"aria-label": weather ? `Thời tiết ${weather.place} ${Math.round(weather.temp)} độ. Chạm để dùng vị trí của bạn` : "Xem thời tiết nơi bạn đứng",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, { className: "h-6 w-6" }), weather ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sr-only",
									children: [Math.round(weather.temp), " độ"]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "press flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center",
								onClick: () => setSheet("jump"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex max-w-full items-center gap-1 text-base font-extrabold text-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate",
										children: [
											"Tháng ",
											titleDate.m,
											" năm ",
											titleDate.y
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate text-xs font-semibold text-muted",
									children: [
										titleDate.d,
										" Th",
										titleDate.m,
										" · ",
										vnClock(now),
										!sameDay(selected, today) ? " · khác hôm nay" : ""
									]
								})]
							}),
							!sameDay(selected, today) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press min-h-11 shrink-0 rounded-full px-1 text-sm font-bold text-leaf",
								onClick: () => go(today),
								children: "Nay"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "press relative grid h-11 w-11 shrink-0 place-items-center text-ink",
								"aria-label": "Mở lịch tháng",
								onClick: () => setView("thang"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "absolute right-1 bottom-1.5 h-3 w-3 fill-gold text-gold" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press grid h-11 w-11 shrink-0 place-items-center text-ink",
								"aria-label": "Tìm ngày",
								onClick: () => setSheet("search"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-6 w-6" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-0 flex-1",
						children: [
							view === "ngay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayView, {
								brief,
								noteCount: dayNotes.length,
								tuoi,
								onPrev: () => go(addDays(selected, -1)),
								onNext: () => go(addDays(selected, 1)),
								onBackup: () => setSheet("backup"),
								onShare: () => void share(),
								onDetail: () => setSheet("detail"),
								onTuvi: () => setView("tuvi"),
								clock: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
								todayView: sameDay(selected, today)
							}) : null,
							view === "thang" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthView, {
								visible,
								selected,
								today,
								notes: notes.map((n) => n.iso),
								onPick: (c) => {
									go(c);
									setView("ngay");
								},
								onShift: (d) => nudge(d)
							}) : null,
							view === "ghichu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "flex h-full min-h-0 flex-col overflow-y-auto bg-paper px-4 pt-4 pb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-lg font-extrabold",
										children: [
											"Ghi chú ",
											selected.d,
											"/",
											selected.m,
											"/",
											selected.y
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "mt-3 flex flex-col gap-2",
										onSubmit: (e) => {
											e.preventDefault();
											addNote(iso(selected), draft);
											setDraft("");
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-sm font-semibold text-muted",
												htmlFor: "note",
												children: "Một dòng cho ngày này"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												id: "note",
												value: draft,
												maxLength: 500,
												onChange: (e) => setDraft(e.target.value),
												rows: 3,
												className: "w-full resize-none rounded-2xl border border-line bg-cloud px-3 py-2 text-base text-ink",
												placeholder: "Ví dụ: giỗ, họp, ngày rảnh…"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "submit",
												className: "press min-h-11 rounded-full bg-ink px-4 font-bold text-paper",
												children: "Lưu ghi chú"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "mt-4 flex flex-col gap-2",
										children: [notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "text-sm text-muted",
											children: "Chưa có ghi chú nào."
										}) : null, notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "rounded-2xl border border-line bg-cloud px-3 py-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "text-left text-sm font-bold text-leaf",
													onClick: () => {
														const [y, m, d] = n.iso.split("-").map(Number);
														if (y && m && d) {
															go({
																y,
																m,
																d
															});
															setView("ngay");
														}
													},
													children: n.iso.split("-").reverse().join("/")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-sm text-ink",
													children: n.text
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													className: "press mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-holiday",
													onClick: () => removeNote(n.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Xóa"]
												})
											]
										}, n.id))]
									})
								]
							}) : null,
							view === "tuvi" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tuvi, {
								brief,
								tuoi,
								sinh,
								onTuoi: setTuoi,
								onSinh: setSinh
							}) : null,
							view === "tienich" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tools, {
								today,
								brief,
								tet,
								fest,
								conv,
								setConv,
								onJump: go,
								onBackup: () => setSheet("backup"),
								onShare: () => void share()
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "dock relative z-10",
						"aria-label": "Mục lịch",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
								active: view === "ngay",
								label: "Ngày",
								onClick: () => setView("ngay"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
								active: view === "thang",
								label: "Tháng",
								onClick: () => setView("thang"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
								active: view === "ghichu",
								label: "Ghi chú",
								onClick: () => setView("ghichu"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
								active: view === "tuvi",
								label: "Tử vi",
								onClick: () => setView("tuvi"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
								active: view === "tienich",
								label: "Tiện ích",
								onClick: () => setView("tienich"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-5 w-5" })
							})
						]
					})
				]
			}),
			toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "fixed bottom-24 left-1/2 z-50 max-w-xs -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-paper",
				role: "status",
				children: toast
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetFrame, {
				open: sheet === "detail",
				title: "Chi tiết ngày",
				description: "Can chi, hoàng đạo, tiết khí và giờ tốt theo lịch vạn niên.",
				onClose: () => setSheet(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, { brief })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetFrame, {
				open: sheet === "search",
				title: "Tìm ngày",
				description: "Dương lịch hoặc âm lịch.",
				onClose: () => setSheet(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						const found = parseJump(query, today);
						if ("error" in found) {
							setToast(found.error);
							return;
						}
						go(found);
						setView("ngay");
						setSheet(null);
						setQuery("");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "23/10/2026 hoặc 14/9 âm",
							className: "min-h-11 w-full rounded-2xl border border-line bg-cloud px-3 text-base",
							"aria-label": "Ngày cần tìm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "press min-h-11 rounded-full bg-ink font-bold text-paper",
							children: "Đến ngày"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JumpChip, {
									label: "Hôm nay",
									onClick: () => {
										go(today);
										setView("ngay");
										setSheet(null);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JumpChip, {
									label: "Tết",
									onClick: () => {
										go(tet.civil);
										setView("ngay");
										setSheet(null);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JumpChip, {
									label: "Rằm tới",
									onClick: () => {
										const c = nextWhere(today, (l) => l.day === 15 && !l.leap);
										if (c) {
											go(c);
											setView("ngay");
											setSheet(null);
										}
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JumpChip, {
									label: "Trung thu",
									onClick: () => {
										const c = nextLunar(today, 8, 15);
										if (c) {
											go(c);
											setView("ngay");
											setSheet(null);
										}
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JumpChip, {
									label: "Giỗ Tổ",
									onClick: () => {
										const c = nextLunar(today, 3, 10);
										if (c) {
											go(c);
											setView("ngay");
											setSheet(null);
										}
									}
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetFrame, {
				open: sheet === "backup",
				title: "Sao lưu",
				description: "Ghi chú và tuổi đã chọn nằm trên máy này.",
				onClose: () => setSheet(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [notes.length, " ghi chú đang lưu trên máy."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "press mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink font-bold text-paper",
						onClick: downloadBackup,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Tải tệp sao lưu"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "press mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-line font-bold text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
							" Khôi phục từ tệp",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "application/json",
								className: "sr-only",
								onChange: (e) => {
									const file = e.target.files?.[0];
									if (file) onImport(file);
									e.target.value = "";
								}
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetFrame, {
				open: sheet === "jump",
				title: "Chọn tháng",
				description: "Nhảy nhanh trong năm dương lịch.",
				onClose: () => setSheet(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "press grid h-11 w-11 place-items-center",
							"aria-label": "Năm trước",
							onClick: () => setVisible({
								...visible,
								y: visible.y - 1
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-extrabold",
							children: visible.y
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "press grid h-11 w-11 place-items-center",
							"aria-label": "Năm sau",
							onClick: () => setVisible({
								...visible,
								y: visible.y + 1
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2",
					children: Array.from({ length: 12 }, (_, i) => i + 1).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `press min-h-11 rounded-2xl font-bold ${m === visible.m ? "bg-ink text-paper" : "bg-meadow text-ink"}`,
						onClick: () => {
							const last = new Date(visible.y, m, 0).getDate();
							const d = Math.min(selected.d, last);
							go({
								y: visible.y,
								m,
								d
							});
							setView("thang");
							setSheet(null);
						},
						children: ["Tháng ", m]
					}, m))
				})]
			})
		]
	});
}
function DockButton({ active, label, onClick, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-current": active ? "page" : void 0,
		className: `press flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-bold ${active ? "text-ink" : "text-muted"}`,
		children: [icon, label]
	});
}
function JumpChip({ label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: "press min-h-11 rounded-full bg-meadow px-3 text-sm font-bold text-ink",
		children: label
	});
}
function Tuvi({ brief, tuoi, sinh, onTuoi, onSinh }) {
	const parts = sinh?.split("-") ?? [];
	const [year, setYear] = (0, import_react.useState)(parts[0] ?? "");
	const [month, setMonth] = (0, import_react.useState)(parts[1] ? String(Number(parts[1])) : "");
	const [day, setDay] = (0, import_react.useState)(parts[2] ? String(Number(parts[2])) : "");
	const path = lifePath(Number(day), Number(month), Number(year));
	function commit(next) {
		const d = Number(next.d);
		const m = Number(next.m);
		const y = Number(next.y);
		if (validCivil(d, m, y)) onSinh(iso({
			y,
			m,
			d
		}));
		else if (!next.d && !next.m && !next.y) onSinh(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "h-full min-h-0 overflow-y-auto bg-paper px-4 pt-4 pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-extrabold",
				children: "Tử vi và thần số"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					"Chọn con giáp. Lịch đối chiếu với ngày ",
					pillarName(brief.day),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-4 gap-2",
				children: CON_GIAP.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onTuoi(i),
					className: `press min-h-16 rounded-2xl border px-1 py-2 text-center ${tuoi === i ? "border-leaf bg-leaf text-paper" : "border-line bg-cloud text-ink"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-extrabold",
						children: CHI[i]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-semibold",
						children: g.thu
					})]
				}, CHI[i]))
			}),
			tuoi !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-2xl bg-meadow px-3 py-3",
				children: tuviLines(tuoi, brief).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink first:mt-0",
					children: line
				}, line))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Chọn một tuổi để xem ngày hợp hay xung."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-5 font-extrabold",
				children: "Thần số học"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Nhập ngày sinh dương lịch. Số đường đời giữ 11, 22 và 33."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						inputMode: "numeric",
						"aria-label": "Ngày sinh",
						placeholder: "Ngày",
						value: day,
						onChange: (e) => {
							setDay(e.target.value);
							commit({
								d: e.target.value,
								m: month,
								y: year
							});
						},
						className: "min-h-11 rounded-xl border border-line bg-cloud px-2 text-center text-base"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						inputMode: "numeric",
						"aria-label": "Tháng sinh",
						placeholder: "Tháng",
						value: month,
						onChange: (e) => {
							setMonth(e.target.value);
							commit({
								d: day,
								m: e.target.value,
								y: year
							});
						},
						className: "min-h-11 rounded-xl border border-line bg-cloud px-2 text-center text-base"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						inputMode: "numeric",
						"aria-label": "Năm sinh",
						placeholder: "Năm",
						value: year,
						onChange: (e) => {
							setYear(e.target.value);
							commit({
								d: day,
								m: month,
								y: e.target.value
							});
						},
						className: "min-h-11 rounded-xl border border-line bg-cloud px-2 text-center text-base"
					})
				]
			}),
			path !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-2xl bg-meadow px-3 py-3 text-sm font-semibold text-ink",
				children: lifePathLine(path)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Điền đủ ngày, tháng, năm để xem số đường đời."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs leading-relaxed text-muted",
				children: "Theo cách xem lịch dân gian và thần số phổ thông. Không phải tư vấn tài chính, sức khỏe hay quyết định pháp lý."
			})
		]
	});
}
function DayView({ brief, noteCount, tuoi, onPrev, onNext, onBackup, onShare, onDetail, onTuvi, clock, todayView }) {
	const major = brief.holidays.find((h) => h.major) ?? brief.holidays[0];
	const [touchX, setTouchX] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		onPointerDown: (e) => setTouchX(e.clientX),
		onPointerUp: (e) => {
			if (touchX === null) return;
			const dx = e.clientX - touchX;
			setTouchX(null);
			if (dx > 56) onPrev();
			else if (dx < -56) onNext();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 shrink-0 px-3 pt-1 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "day-figure",
							children: brief.civil.d
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "backup-pill press absolute top-0 left-1/2 -translate-x-1/2",
							onClick: onBackup,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }), "Sao lưu ngay"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press grid h-11 w-11 place-items-center",
								"aria-label": "Ngày trước",
								onClick: onPrev,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "weekday-label",
								children: WEEKDAYS_UP[brief.weekday]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press grid h-11 w-11 place-items-center",
								"aria-label": "Ngày sau",
								onClick: onNext,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
							})
						]
					}),
					major ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-holiday",
						children: major.name
					}) : null,
					brief.term.entersToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold text-gold-ink",
						children: ["Hôm nay lập tiết ", brief.term.name]
					}) : null,
					noteCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-leaf",
						children: [noteCount, " ghi chú"]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-24 flex-1 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meadow, { className: "pointer-events-none absolute inset-0 h-full w-full" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press absolute top-2 left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-paper/80 text-ink",
						"aria-label": "Chia sẻ ngày này",
						onClick: onShare,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "speech press absolute bottom-1 left-3 right-[38%] z-10",
						onClick: onTuvi,
						children: tuoi === null ? "Chạm vào ta để xem tử vi, thần số học… của mình" : `Tuổi ${CON_GIAP[tuoi]?.thu}: ${relationLabel(tuoi, brief.day.branch)}. Chạm để xem.`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative z-10 line-clamp-2 shrink-0 px-5 pt-1 pb-1 text-center text-sm font-medium text-ink",
				children: brief.quote
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "lunar-bar relative z-10 w-full shrink-0 px-2 py-1.5 text-left",
				onClick: onDetail,
				"aria-label": "Xem chi tiết can chi và giờ hoàng đạo",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex flex-col items-center justify-center border-r border-dashed border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl font-black tabular-nums",
								children: clock
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Taiji, { className: "my-0.5 h-4 w-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-center text-sm font-bold",
								children: brief.hour ? pillarName(brief.hour) : ""
							}),
							todayView ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-muted",
								children: "cùng giờ hôm nay"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex flex-col items-center justify-center border-r border-dashed border-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-4xl leading-none font-black",
							children: brief.lunar.day
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold",
							children: brief.lunar.leap ? `Th. ${brief.lunar.month} nhuận` : `Tháng ${brief.lunar.month}`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex flex-col justify-center px-2 text-sm leading-snug font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Ng. ", pillarName(brief.day)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Th. ", pillarName(brief.month)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Năm ", pillarName(brief.year)] })
						]
					})
				]
			})
		]
	});
}
function MonthView({ visible, selected, today, notes, onPick, onShift }) {
	const cells = monthCells(visible.y, visible.m);
	const noted = new Set(notes);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full min-h-0 flex-col bg-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-2 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press grid h-11 w-11 place-items-center",
						"aria-label": "Tháng trước",
						onClick: () => onShift(-1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-extrabold",
						children: [
							"Tháng ",
							visible.m,
							" năm ",
							visible.y
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press grid h-11 w-11 place-items-center",
						"aria-label": "Tháng sau",
						onClick: () => onShift(1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 px-1 text-center text-xs font-bold text-muted",
				children: WEEK_HEAD.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `py-1 ${i === 6 ? "text-holiday" : ""}`,
					children: d
				}, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid flex-1 grid-cols-7 content-start px-1",
				children: cells.map((c) => {
					const lunar = solarToLunar(c.d, c.m, c.y);
					const jdMark = buildBrief(c, null);
					const sun = weekday(c) === 0;
					const holiday = holidaysOf(c).some((h) => h.major);
					const isToday = sameDay(c, today);
					const isSel = sameDay(c, selected);
					const inMonth = c.m === visible.m;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onPick(c),
						className: `press relative flex min-h-14 flex-col items-center rounded-xl py-0.5 ${inMonth ? "" : "opacity-35"} ${isSel && !isToday ? "bg-meadow" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-7 w-7 place-items-center rounded-full text-sm font-extrabold ${isToday ? "bg-ink text-paper" : holiday || sun ? "text-holiday" : "text-ink"}`,
								children: c.d
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xs font-bold ${jdMark.god.good ? "text-gold-ink" : "text-muted"}`,
								children: lunar.day === 1 ? `1/${lunar.month}${lunar.leap ? "n" : ""}` : lunar.day
							}),
							noted.has(iso(c)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-leaf" }) : null
						]
					}, iso(c));
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 pb-2 text-center text-xs text-muted",
				children: "Số âm vàng là ngày hoàng đạo. Số đỏ là Chủ nhật hoặc ngày lễ."
			})
		]
	});
}
function Detail({ brief }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-base font-extrabold",
				children: [
					brief.lunar.day,
					" ",
					lunarMonthTitle(brief.lunar.month, brief.lunar.leap),
					" · năm ",
					pillarName(brief.year)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-1 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Ngày",
						v: `${pillarName(brief.day)} · ${brief.napDay}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Tháng",
						v: `${pillarName(brief.month)} · ${brief.napMonth}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Năm",
						v: `${pillarName(brief.year)} · ${brief.napYear}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Thần",
						v: brief.god.good ? `${brief.god.name} hoàng đạo` : `${brief.god.name} hắc đạo`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Trực",
						v: `${brief.truc.name}. ${brief.truc.note}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Tiết khí",
						v: brief.term.entersToday ? `Hôm nay bước sang ${brief.term.name}` : `Đang trong tiết ${brief.term.name}`
					})
				]
			}),
			brief.holidays.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-holiday",
				children: brief.holidays.map((h) => h.name).join(" · ")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-extrabold",
				children: "Giờ hoàng đạo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-3 gap-2",
				children: brief.hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `rounded-2xl px-2 py-2 ${h.good ? "bg-leaf/10 text-leaf" : "bg-meadow text-muted"} ${h.now ? "ring-2 ring-ink" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-extrabold",
							children: h.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: h.range
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold",
							children: [h.good ? "Hoàng đạo" : "Hắc đạo", h.now ? " · giờ này" : ""]
						})
					]
				}, h.branch))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Giờ tính theo đồng hồ máy, can chi theo múi giờ Việt Nam. Đây là phong tục chọn ngày, không phải quy tắc bắt buộc."
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-meadow px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs font-bold text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-semibold text-ink",
			children: v
		})]
	});
}
function Tools({ today, brief, tet, fest, conv, setConv, onJump, onBackup, onShare }) {
	const d = Number(conv.d);
	const m = Number(conv.m);
	const y = Number(conv.y);
	let result = "";
	if (conv.mode === "duong" && validCivil(d, m, y)) {
		const l = solarToLunar(d, m, y);
		const year = buildBrief({
			y,
			m,
			d
		}, null);
		result = `${l.day} ${lunarMonthTitle(l.month, l.leap).toLowerCase()}, năm ${pillarName(year.year)}`;
	} else if (conv.mode === "am") {
		const civil = lunarToSolar(d, m, y, conv.leap);
		result = civil ? `${civil.d}/${civil.m}/${civil.y}` : "Không đổi được ngày này";
	} else result = "Nhập ngày hợp lệ";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "h-full min-h-0 overflow-y-auto bg-paper px-4 pt-4 pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-extrabold",
				children: "Tiện ích"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "press mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink font-bold text-paper",
				onClick: onShare,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4" }), " Chia sẻ ngày đang xem"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-3 rounded-2xl bg-meadow px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-muted",
						children: "Tết Nguyên Đán"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-extrabold",
						children: tet.days === 0 ? "Hôm nay là Mùng Một Tết" : `Còn ${tet.days} ngày tới Tết ${tet.civil.y}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "press mt-1 text-sm font-bold text-leaf",
						onClick: () => onJump(tet.civil),
						children: [
							"Mở ngày ",
							tet.civil.d,
							"/",
							tet.civil.m,
							"/",
							tet.civil.y
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-3 rounded-2xl border border-line px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold text-muted",
					children: "Lễ sắp tới"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1",
					children: fest.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "press flex min-h-11 w-full items-center justify-between text-left text-sm",
						onClick: () => onJump(f.civil),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: f.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: f.days === 0 ? "Hôm nay" : `${f.days} ngày`
						})]
					}) }, `${f.name}-${f.days}`))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-3 rounded-2xl border border-line px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-muted",
						children: "Đổi dương ↔ âm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `press min-h-11 flex-1 rounded-full font-bold ${conv.mode === "duong" ? "bg-ink text-paper" : "bg-meadow"}`,
							onClick: () => setConv({
								...conv,
								mode: "duong"
							}),
							children: "Dương ra âm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `press min-h-11 flex-1 rounded-full font-bold ${conv.mode === "am" ? "bg-ink text-paper" : "bg-meadow"}`,
							onClick: () => setConv({
								...conv,
								mode: "am"
							}),
							children: "Âm ra dương"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid grid-cols-3 gap-2",
						children: [
							"d",
							"m",
							"y"
						].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "numeric",
							"aria-label": key === "d" ? "Ngày" : key === "m" ? "Tháng" : "Năm",
							value: conv[key],
							onChange: (e) => setConv({
								...conv,
								[key]: e.target.value
							}),
							className: "min-h-11 rounded-xl border border-line bg-cloud px-2 text-center text-base"
						}, key))
					}),
					conv.mode === "am" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-2 flex min-h-11 items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: conv.leap,
							onChange: (e) => setConv({
								...conv,
								leap: e.target.checked
							})
						}), "Tháng nhuận"]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-extrabold",
						children: result
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"Hôm nay đang trong tiết ",
							brief.term.name,
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "press mt-3 min-h-11 w-full rounded-full border border-line font-bold",
				onClick: onBackup,
				children: "Sao lưu ghi chú"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs leading-relaxed text-muted",
				children: "Âm lịch tính theo thuật toán Hồ Ngọc Đức, múi giờ Việt Nam (UTC+7). Hoàng đạo, trực và giờ tốt là phong tục lịch vạn niên."
			})
		]
	});
}
function Home() {
	const [on, setOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let live = true;
		const done = () => {
			if (live) setOn(true);
		};
		try {
			Promise.resolve(useLichStore.persist.rehydrate()).then(done, done);
		} catch {
			done();
		}
		return () => {
			live = false;
		};
	}, []);
	if (!on) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "sky-bg flex h-dvh items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-2xl font-extrabold text-ink",
			children: "Lịch Âm Việt"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LichApp, {});
}
//#endregion
export { Home as component };
