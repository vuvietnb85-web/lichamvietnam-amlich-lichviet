import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  CloudUpload,
  Download,
  LayoutGrid,
  PenLine,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { Drawer } from "vaul";
import {
  CHI,
  CON_GIAP,
  WEEK_HEAD,
  WEEKDAYS_UP,
  buildBrief,
  holidaysOf,
  lifePath,
  lifePathLine,
  lunarMonthTitle,
  nextLunar,
  nextTet,
  nextWhere,
  parseJump,
  pillarName,
  relationLabel,
  shareLines,
  tuviLines,
  upcomingFestivals,
  type DayBrief,
} from "@/lib/almanac";
import {
  addDays,
  civilFromDate,
  iso,
  lunarToSolar,
  monthCells,
  sameDay,
  solarToLunar,
  validCivil,
  weekday,
  type Civil,
} from "@/lib/lunar";
import { parseBackup, useLichStore } from "@/lib/notes";
import { Meadow, Sky } from "@/components/meadow";

type View = "ngay" | "thang" | "ghichu" | "tuvi" | "tienich";
type Sheet = null | "detail" | "search" | "backup" | "jump";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function vnClock(date: Date): string {
  const h = date.getHours();
  const h12 = h % 12 || 12;
  const tag = h < 12 ? "SA" : h < 18 ? "CH" : "Tối";
  return `${h12}:${pad(date.getMinutes())} ${tag}`;
}

function Taiji({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="var(--color-paper)" />
      <path fill="var(--color-holiday)" d="M16 1a15 15 0 0 1 0 30 7.5 7.5 0 0 1 0-15 7.5 7.5 0 0 0 0-15z" />
      <circle cx="16" cy="8.5" r="2.1" fill="var(--color-holiday)" />
      <circle cx="16" cy="23.5" r="2.1" fill="var(--color-paper)" />
    </svg>
  );
}

function SheetFrame({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[86dvh] w-full max-w-[480px] flex-col rounded-t-3xl bg-paper outline-none">
          <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-line" />
          <Drawer.Title className="px-5 pt-3 text-lg font-extrabold text-ink">{title}</Drawer.Title>
          <Drawer.Description className="px-5 text-sm text-muted">{description}</Drawer.Description>
          <div className="min-h-0 overflow-y-auto px-5 pt-3 pb-8">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function LichApp() {
  const [now, setNow] = useState(() => new Date());
  const today = civilFromDate(now);
  const [selected, setSelected] = useState<Civil>(today);
  const [visible, setVisible] = useState<Civil>(today);
  const [view, setView] = useState<View>("ngay");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [weather, setWeather] = useState<{ temp: number; place: string } | null>(null);
  const [conv, setConv] = useState({ d: String(today.d), m: String(today.m), y: String(today.y), mode: "duong" as "duong" | "am", leap: false });

  const notes = useLichStore((s) => s.notes);
  const tuoi = useLichStore((s) => s.tuoi);
  const sinh = useLichStore((s) => s.sinh);
  const addNote = useLichStore((s) => s.addNote);
  const removeNote = useLichStore((s) => s.removeNote);
  const setTuoi = useLichStore((s) => s.setTuoi);
  const setSinh = useLichStore((s) => s.setSinh);
  const replaceAll = useLichStore((s) => s.replaceAll);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const clockHour = now.getHours();
  const brief = useMemo(() => buildBrief(selected, clockHour), [selected, clockHour]);
  const dayNotes = notes.filter((n) => n.iso === iso(selected));

  function go(c: Civil) {
    setSelected(c);
    setVisible(c);
  }

  function nudge(delta: number) {
    if (view === "thang") {
      const dt = new Date(visible.y, visible.m - 1 + delta, 1);
      setVisible({ y: dt.getFullYear(), m: dt.getMonth() + 1, d: 1 });
      return;
    }
    go(addDays(selected, delta));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
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
        await navigator.share({ title: "Lịch Âm Việt", text });
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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        void fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`,
        )
          .then((r) => r.json())
          .then((data: { current?: { temperature_2m?: number } }) => {
            const temp = data.current?.temperature_2m;
            if (typeof temp === "number") setWeather({ temp, place: "Gần bạn" });
          })
          .catch(() => setToast("Không lấy được thời tiết"));
      },
      () => setToast("Chưa được phép dùng vị trí. Vẫn xem Hà Nội."),
    );
  }

  function downloadBackup() {
    const blob = new Blob(
      [JSON.stringify({ app: "lich-am-viet", version: 1, exportedAt: new Date().toISOString(), tuoi, sinh, notes }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lich-am-viet.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Đã tải tệp sao lưu");
  }

  function onImport(file: File) {
    void file.text().then((text) => {
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

  return (
    <main className="sky-bg relative min-h-dvh overflow-hidden">
      {view === "ngay" ? <Sky className="pointer-events-none absolute inset-x-0 top-0 z-0 h-52 w-full" /> : null}
      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-[480px] flex-col">
        <header className="topbar relative z-10 flex items-center gap-1 px-2 pb-1">
          <button
            type="button"
            className="press grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink"
            onClick={locate}
            aria-label={weather ? `Thời tiết ${weather.place} ${Math.round(weather.temp)} độ. Chạm để dùng vị trí của bạn` : "Xem thời tiết nơi bạn đứng"}
          >
            <CloudSun className="h-6 w-6" />
            {weather ? <span className="sr-only">{Math.round(weather.temp)} độ</span> : null}
          </button>
          <button type="button" className="press flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center" onClick={() => setSheet("jump")}>
            <span className="flex max-w-full items-center gap-1 text-base font-extrabold text-ink">
              <span className="truncate">Tháng {titleDate.m} năm {titleDate.y}</span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </span>
            <span className="truncate text-xs font-semibold text-muted">
              {titleDate.d} Th{titleDate.m} · {vnClock(now)}
              {!sameDay(selected, today) ? " · khác hôm nay" : ""}
            </span>
          </button>
          {!sameDay(selected, today) ? (
            <button type="button" className="press min-h-11 shrink-0 rounded-full px-1 text-sm font-bold text-leaf" onClick={() => go(today)}>
              Nay
            </button>
          ) : null}
          <button
            type="button"
            className="press relative grid h-11 w-11 shrink-0 place-items-center text-ink"
            aria-label="Mở lịch tháng"
            onClick={() => setView("thang")}
          >
            <Calendar className="h-6 w-6" />
            <Star className="absolute right-1 bottom-1.5 h-3 w-3 fill-gold text-gold" />
          </button>
          <button type="button" className="press grid h-11 w-11 shrink-0 place-items-center text-ink" aria-label="Tìm ngày" onClick={() => setSheet("search")}>
            <Search className="h-6 w-6" />
          </button>
        </header>

        <div className="min-h-0 flex-1">
          {view === "ngay" ? (
            <DayView
              brief={brief}
              noteCount={dayNotes.length}
              tuoi={tuoi}
              onPrev={() => go(addDays(selected, -1))}
              onNext={() => go(addDays(selected, 1))}
              onBackup={() => setSheet("backup")}
              onShare={() => void share()}
              onDetail={() => setSheet("detail")}
              onTuvi={() => setView("tuvi")}
              clock={`${pad(now.getHours())}:${pad(now.getMinutes())}`}
              todayView={sameDay(selected, today)}
            />
          ) : null}
          {view === "thang" ? (
            <MonthView
              visible={visible}
              selected={selected}
              today={today}
              notes={notes.map((n) => n.iso)}
              onPick={(c) => {
                go(c);
                setView("ngay");
              }}
              onShift={(d) => nudge(d)}
            />
          ) : null}
          {view === "ghichu" ? (
            <section className="flex h-full min-h-0 flex-col overflow-y-auto bg-paper px-4 pt-4 pb-6">
              <h2 className="text-lg font-extrabold">Ghi chú {selected.d}/{selected.m}/{selected.y}</h2>
              <form
                className="mt-3 flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  addNote(iso(selected), draft);
                  setDraft("");
                }}
              >
                <label className="text-sm font-semibold text-muted" htmlFor="note">
                  Một dòng cho ngày này
                </label>
                <textarea
                  id="note"
                  value={draft}
                  maxLength={500}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-line bg-cloud px-3 py-2 text-base text-ink"
                  placeholder="Ví dụ: giỗ, họp, ngày rảnh…"
                />
                <button type="submit" className="press min-h-11 rounded-full bg-ink px-4 font-bold text-paper">
                  Lưu ghi chú
                </button>
              </form>
              <ul className="mt-4 flex flex-col gap-2">
                {notes.length === 0 ? <li className="text-sm text-muted">Chưa có ghi chú nào.</li> : null}
                {notes.map((n) => (
                  <li key={n.id} className="rounded-2xl border border-line bg-cloud px-3 py-2">
                    <button type="button" className="text-left text-sm font-bold text-leaf" onClick={() => {
                      const [y, m, d] = n.iso.split("-").map(Number);
                      if (y && m && d) {
                        go({ y, m, d });
                        setView("ngay");
                      }
                    }}>
                      {n.iso.split("-").reverse().join("/")}
                    </button>
                    <p className="mt-1 text-sm text-ink">{n.text}</p>
                    <button type="button" className="press mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-holiday" onClick={() => removeNote(n.id)}>
                      <Trash2 className="h-4 w-4" /> Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {view === "tuvi" ? (
            <Tuvi
              brief={brief}
              tuoi={tuoi}
              sinh={sinh}
              onTuoi={setTuoi}
              onSinh={setSinh}
            />
          ) : null}
          {view === "tienich" ? (
            <Tools
              today={today}
              brief={brief}
              tet={tet}
              fest={fest}
              conv={conv}
              setConv={setConv}
              onJump={go}
              onBackup={() => setSheet("backup")}
              onShare={() => void share()}
            />
          ) : null}
        </div>

        <nav className="dock relative z-10" aria-label="Mục lịch">
          <DockButton active={view === "ngay"} label="Ngày" onClick={() => setView("ngay")} icon={<Calendar className="h-5 w-5" />} />
          <DockButton active={view === "thang"} label="Tháng" onClick={() => setView("thang")} icon={<CalendarDays className="h-5 w-5" />} />
          <DockButton active={view === "ghichu"} label="Ghi chú" onClick={() => setView("ghichu")} icon={<PenLine className="h-5 w-5" />} />
          <DockButton active={view === "tuvi"} label="Tử vi" onClick={() => setView("tuvi")} icon={<Sparkles className="h-5 w-5" />} />
          <DockButton active={view === "tienich"} label="Tiện ích" onClick={() => setView("tienich")} icon={<LayoutGrid className="h-5 w-5" />} />
        </nav>
      </div>

      {toast ? (
        <p className="fixed bottom-24 left-1/2 z-50 max-w-xs -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-paper" role="status">
          {toast}
        </p>
      ) : null}

      <SheetFrame open={sheet === "detail"} title="Chi tiết ngày" description="Can chi, hoàng đạo, tiết khí và giờ tốt theo lịch vạn niên." onClose={() => setSheet(null)}>
        <Detail brief={brief} />
      </SheetFrame>
      <SheetFrame open={sheet === "search"} title="Tìm ngày" description="Dương lịch hoặc âm lịch." onClose={() => setSheet(null)}>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
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
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="23/10/2026 hoặc 14/9 âm"
            className="min-h-11 w-full rounded-2xl border border-line bg-cloud px-3 text-base"
            aria-label="Ngày cần tìm"
          />
          <button type="submit" className="press min-h-11 rounded-full bg-ink font-bold text-paper">Đến ngày</button>
          <div className="flex flex-wrap gap-2">
            <JumpChip label="Hôm nay" onClick={() => { go(today); setView("ngay"); setSheet(null); }} />
            <JumpChip label="Tết" onClick={() => { go(tet.civil); setView("ngay"); setSheet(null); }} />
            <JumpChip label="Rằm tới" onClick={() => {
              const c = nextWhere(today, (l) => l.day === 15 && !l.leap);
              if (c) { go(c); setView("ngay"); setSheet(null); }
            }} />
            <JumpChip label="Trung thu" onClick={() => {
              const c = nextLunar(today, 8, 15);
              if (c) { go(c); setView("ngay"); setSheet(null); }
            }} />
            <JumpChip label="Giỗ Tổ" onClick={() => {
              const c = nextLunar(today, 3, 10);
              if (c) { go(c); setView("ngay"); setSheet(null); }
            }} />
          </div>
        </form>
      </SheetFrame>
      <SheetFrame open={sheet === "backup"} title="Sao lưu" description="Ghi chú và tuổi đã chọn nằm trên máy này." onClose={() => setSheet(null)}>
        <p className="text-sm text-muted">{notes.length} ghi chú đang lưu trên máy.</p>
        <button type="button" className="press mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink font-bold text-paper" onClick={downloadBackup}>
          <Download className="h-4 w-4" /> Tải tệp sao lưu
        </button>
        <label className="press mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-line font-bold text-ink">
          <Upload className="h-4 w-4" /> Khôi phục từ tệp
          <input
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
              e.target.value = "";
            }}
          />
        </label>
      </SheetFrame>
      <SheetFrame open={sheet === "jump"} title="Chọn tháng" description="Nhảy nhanh trong năm dương lịch." onClose={() => setSheet(null)}>
        <div className="mb-3 flex items-center justify-between">
          <button type="button" className="press grid h-11 w-11 place-items-center" aria-label="Năm trước" onClick={() => setVisible({ ...visible, y: visible.y - 1 })}>
            <ChevronLeft />
          </button>
          <p className="text-lg font-extrabold">{visible.y}</p>
          <button type="button" className="press grid h-11 w-11 place-items-center" aria-label="Năm sau" onClick={() => setVisible({ ...visible, y: visible.y + 1 })}>
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <button
              key={m}
              type="button"
              className={`press min-h-11 rounded-2xl font-bold ${m === visible.m ? "bg-ink text-paper" : "bg-meadow text-ink"}`}
              onClick={() => {
                const last = new Date(visible.y, m, 0).getDate();
                const d = Math.min(selected.d, last);
                go({ y: visible.y, m, d });
                setView("thang");
                setSheet(null);
              }}
            >
              Tháng {m}
            </button>
          ))}
        </div>
      </SheetFrame>
    </main>
  );
}

function DockButton({ active, label, onClick, icon }: { active: boolean; label: string; onClick: () => void; icon: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-current={active ? "page" : undefined} className={`press flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-bold ${active ? "text-ink" : "text-muted"}`}>
      {icon}
      {label}
    </button>
  );
}

function JumpChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="press min-h-11 rounded-full bg-meadow px-3 text-sm font-bold text-ink">
      {label}
    </button>
  );
}

function Tuvi({
  brief,
  tuoi,
  sinh,
  onTuoi,
  onSinh,
}: {
  brief: DayBrief;
  tuoi: number | null;
  sinh: string | null;
  onTuoi: (i: number) => void;
  onSinh: (iso: string | null) => void;
}) {
  const parts = sinh?.split("-") ?? [];
  const [year, setYear] = useState(parts[0] ?? "");
  const [month, setMonth] = useState(parts[1] ? String(Number(parts[1])) : "");
  const [day, setDay] = useState(parts[2] ? String(Number(parts[2])) : "");
  const path = lifePath(Number(day), Number(month), Number(year));

  function commit(next: { d: string; m: string; y: string }) {
    const d = Number(next.d);
    const m = Number(next.m);
    const y = Number(next.y);
    if (validCivil(d, m, y)) onSinh(iso({ y, m, d }));
    else if (!next.d && !next.m && !next.y) onSinh(null);
  }

  return (
    <section className="h-full min-h-0 overflow-y-auto bg-paper px-4 pt-4 pb-6">
      <h2 className="text-lg font-extrabold">Tử vi và thần số</h2>
      <p className="mt-1 text-sm text-muted">Chọn con giáp. Lịch đối chiếu với ngày {pillarName(brief.day)}.</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {CON_GIAP.map((g, i) => (
          <button
            key={CHI[i]}
            type="button"
            onClick={() => onTuoi(i)}
            className={`press min-h-16 rounded-2xl border px-1 py-2 text-center ${tuoi === i ? "border-leaf bg-leaf text-paper" : "border-line bg-cloud text-ink"}`}
          >
            <span className="block text-sm font-extrabold">{CHI[i]}</span>
            <span className="block text-xs font-semibold">{g.thu}</span>
          </button>
        ))}
      </div>
      {tuoi !== null ? (
        <div className="mt-4 rounded-2xl bg-meadow px-3 py-3">
          {tuviLines(tuoi, brief).map((line) => (
            <p key={line} className="mt-2 text-sm text-ink first:mt-0">{line}</p>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Chọn một tuổi để xem ngày hợp hay xung.</p>
      )}
      <h3 className="mt-5 font-extrabold">Thần số học</h3>
      <p className="mt-1 text-sm text-muted">Nhập ngày sinh dương lịch. Số đường đời giữ 11, 22 và 33.</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <input
          inputMode="numeric"
          aria-label="Ngày sinh"
          placeholder="Ngày"
          value={day}
          onChange={(e) => {
            setDay(e.target.value);
            commit({ d: e.target.value, m: month, y: year });
          }}
          className="min-h-11 rounded-xl border border-line bg-cloud px-2 text-center text-base"
        />
        <input
          inputMode="numeric"
          aria-label="Tháng sinh"
          placeholder="Tháng"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            commit({ d: day, m: e.target.value, y: year });
          }}
          className="min-h-11 rounded-xl border border-line bg-cloud px-2 text-center text-base"
        />
        <input
          inputMode="numeric"
          aria-label="Năm sinh"
          placeholder="Năm"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            commit({ d: day, m: month, y: e.target.value });
          }}
          className="min-h-11 rounded-xl border border-line bg-cloud px-2 text-center text-base"
        />
      </div>
      {path !== null ? (
        <p className="mt-3 rounded-2xl bg-meadow px-3 py-3 text-sm font-semibold text-ink">{lifePathLine(path)}</p>
      ) : (
        <p className="mt-3 text-sm text-muted">Điền đủ ngày, tháng, năm để xem số đường đời.</p>
      )}
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Theo cách xem lịch dân gian và thần số phổ thông. Không phải tư vấn tài chính, sức khỏe hay quyết định pháp lý.
      </p>
    </section>
  );
}

function DayView({
  brief,
  noteCount,
  tuoi,
  onPrev,
  onNext,
  onBackup,
  onShare,
  onDetail,
  onTuvi,
  clock,
  todayView,
}: {
  brief: DayBrief;
  noteCount: number;
  tuoi: number | null;
  onPrev: () => void;
  onNext: () => void;
  onBackup: () => void;
  onShare: () => void;
  onDetail: () => void;
  onTuvi: () => void;
  clock: string;
  todayView: boolean;
}) {
  const major = brief.holidays.find((h) => h.major) ?? brief.holidays[0];
  const [touchX, setTouchX] = useState<number | null>(null);
  return (
    <div
      className="flex h-full min-h-0 flex-col"
      onPointerDown={(e) => setTouchX(e.clientX)}
      onPointerUp={(e) => {
        if (touchX === null) return;
        const dx = e.clientX - touchX;
        setTouchX(null);
        if (dx > 56) onPrev();
        else if (dx < -56) onNext();
      }}
    >
      <div className="relative z-10 shrink-0 px-3 pt-1 text-center">
        <div className="relative">
          <p className="day-figure">{brief.civil.d}</p>
          <button type="button" className="backup-pill press absolute top-0 left-1/2 -translate-x-1/2" onClick={onBackup}>
            <CloudUpload className="h-4 w-4" />
            Sao lưu ngay
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <button type="button" className="press grid h-11 w-11 place-items-center" aria-label="Ngày trước" onClick={onPrev}>
            <ChevronLeft />
          </button>
          <h1 className="weekday-label">{WEEKDAYS_UP[brief.weekday]}</h1>
          <button type="button" className="press grid h-11 w-11 place-items-center" aria-label="Ngày sau" onClick={onNext}>
            <ChevronRight />
          </button>
        </div>
        {major ? <p className="text-sm font-bold text-holiday">{major.name}</p> : null}
        {brief.term.entersToday ? <p className="text-sm font-bold text-gold-ink">Hôm nay lập tiết {brief.term.name}</p> : null}
        {noteCount > 0 ? <p className="text-sm font-semibold text-leaf">{noteCount} ghi chú</p> : null}
      </div>
      <div className="relative min-h-24 flex-1 overflow-hidden">
        <Meadow className="pointer-events-none absolute inset-0 h-full w-full" />
        <button type="button" className="press absolute top-2 left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-paper/80 text-ink" aria-label="Chia sẻ ngày này" onClick={onShare}>
          <Share2 className="h-5 w-5" />
        </button>
        <button type="button" className="speech press absolute bottom-1 left-3 right-[38%] z-10" onClick={onTuvi}>
          {tuoi === null
            ? "Chạm vào ta để xem tử vi, thần số học… của mình"
            : `Tuổi ${CON_GIAP[tuoi]?.thu}: ${relationLabel(tuoi, brief.day.branch)}. Chạm để xem.`}
        </button>
      </div>
      <p className="relative z-10 line-clamp-2 shrink-0 px-5 pt-1 pb-1 text-center text-sm font-medium text-ink">{brief.quote}</p>
      <button type="button" className="lunar-bar relative z-10 w-full shrink-0 px-2 py-1.5 text-left" onClick={onDetail} aria-label="Xem chi tiết can chi và giờ hoàng đạo">
        <span className="flex flex-col items-center justify-center border-r border-dashed border-line">
          <span className="text-2xl font-black tabular-nums">{clock}</span>
          <Taiji className="my-0.5 h-4 w-4" />
          <span className="text-center text-sm font-bold">{brief.hour ? pillarName(brief.hour) : ""}</span>
          {todayView ? null : <span className="text-xs font-semibold text-muted">cùng giờ hôm nay</span>}
        </span>
        <span className="flex flex-col items-center justify-center border-r border-dashed border-line">
          <span className="text-4xl leading-none font-black">{brief.lunar.day}</span>
          <span className="text-sm font-bold">{brief.lunar.leap ? `Th. ${brief.lunar.month} nhuận` : `Tháng ${brief.lunar.month}`}</span>
        </span>
        <span className="flex flex-col justify-center px-2 text-sm leading-snug font-semibold">
          <span>Ng. {pillarName(brief.day)}</span>
          <span>Th. {pillarName(brief.month)}</span>
          <span>Năm {pillarName(brief.year)}</span>
        </span>
      </button>
    </div>
  );
}

function MonthView({
  visible,
  selected,
  today,
  notes,
  onPick,
  onShift,
}: {
  visible: Civil;
  selected: Civil;
  today: Civil;
  notes: string[];
  onPick: (c: Civil) => void;
  onShift: (delta: number) => void;
}) {
  const cells = monthCells(visible.y, visible.m);
  const noted = new Set(notes);
  return (
    <section className="flex h-full min-h-0 flex-col bg-paper">
      <div className="flex items-center justify-between px-2 pt-1">
        <button type="button" className="press grid h-11 w-11 place-items-center" aria-label="Tháng trước" onClick={() => onShift(-1)}>
          <ChevronLeft />
        </button>
        <p className="font-extrabold">Tháng {visible.m} năm {visible.y}</p>
        <button type="button" className="press grid h-11 w-11 place-items-center" aria-label="Tháng sau" onClick={() => onShift(1)}>
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 px-1 text-center text-xs font-bold text-muted">
        {WEEK_HEAD.map((d, i) => (
          <div key={d} className={`py-1 ${i === 6 ? "text-holiday" : ""}`}>{d}</div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 content-start px-1">
        {cells.map((c) => {
          const lunar = solarToLunar(c.d, c.m, c.y);
          const jdMark = buildBrief(c, null);
          const sun = weekday(c) === 0;
          const holiday = holidaysOf(c).some((h) => h.major);
          const isToday = sameDay(c, today);
          const isSel = sameDay(c, selected);
          const inMonth = c.m === visible.m;
          return (
            <button
              key={iso(c)}
              type="button"
              onClick={() => onPick(c)}
              className={`press relative flex min-h-14 flex-col items-center rounded-xl py-0.5 ${inMonth ? "" : "opacity-35"} ${isSel && !isToday ? "bg-meadow" : ""}`}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-full text-sm font-extrabold ${isToday ? "bg-ink text-paper" : holiday || sun ? "text-holiday" : "text-ink"}`}>
                {c.d}
              </span>
              <span className={`text-xs font-bold ${jdMark.god.good ? "text-gold-ink" : "text-muted"}`}>
                {lunar.day === 1 ? `1/${lunar.month}${lunar.leap ? "n" : ""}` : lunar.day}
              </span>
              {noted.has(iso(c)) ? <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-leaf" /> : null}
            </button>
          );
        })}
      </div>
      <p className="px-3 pb-2 text-center text-xs text-muted">Số âm vàng là ngày hoàng đạo. Số đỏ là Chủ nhật hoặc ngày lễ.</p>
    </section>
  );
}

function Detail({ brief }: { brief: DayBrief }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="text-base font-extrabold">
        {brief.lunar.day} {lunarMonthTitle(brief.lunar.month, brief.lunar.leap)} · năm {pillarName(brief.year)}
      </p>
      <dl className="grid grid-cols-1 gap-2">
        <Row k="Ngày" v={`${pillarName(brief.day)} · ${brief.napDay}`} />
        <Row k="Tháng" v={`${pillarName(brief.month)} · ${brief.napMonth}`} />
        <Row k="Năm" v={`${pillarName(brief.year)} · ${brief.napYear}`} />
        <Row k="Thần" v={brief.god.good ? `${brief.god.name} hoàng đạo` : `${brief.god.name} hắc đạo`} />
        <Row k="Trực" v={`${brief.truc.name}. ${brief.truc.note}`} />
        <Row k="Tiết khí" v={brief.term.entersToday ? `Hôm nay bước sang ${brief.term.name}` : `Đang trong tiết ${brief.term.name}`} />
      </dl>
      {brief.holidays.length > 0 ? (
        <p className="font-semibold text-holiday">{brief.holidays.map((h) => h.name).join(" · ")}</p>
      ) : null}
      <h3 className="font-extrabold">Giờ hoàng đạo</h3>
      <ul className="grid grid-cols-3 gap-2">
        {brief.hours.map((h) => (
          <li key={h.branch} className={`rounded-2xl px-2 py-2 ${h.good ? "bg-leaf/10 text-leaf" : "bg-meadow text-muted"} ${h.now ? "ring-2 ring-ink" : ""}`}>
            <p className="font-extrabold">{h.name}</p>
            <p className="text-xs">{h.range}</p>
            <p className="text-xs font-semibold">{h.good ? "Hoàng đạo" : "Hắc đạo"}{h.now ? " · giờ này" : ""}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">Giờ tính theo đồng hồ máy, can chi theo múi giờ Việt Nam. Đây là phong tục chọn ngày, không phải quy tắc bắt buộc.</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-meadow px-3 py-2">
      <dt className="text-xs font-bold text-muted">{k}</dt>
      <dd className="font-semibold text-ink">{v}</dd>
    </div>
  );
}

function Tools({
  today,
  brief,
  tet,
  fest,
  conv,
  setConv,
  onJump,
  onBackup,
  onShare,
}: {
  today: Civil;
  brief: DayBrief;
  tet: { civil: Civil; days: number };
  fest: { civil: Civil; name: string; days: number }[];
  conv: { d: string; m: string; y: string; mode: "duong" | "am"; leap: boolean };
  setConv: (v: { d: string; m: string; y: string; mode: "duong" | "am"; leap: boolean }) => void;
  onJump: (c: Civil) => void;
  onBackup: () => void;
  onShare: () => void;
}) {
  const d = Number(conv.d);
  const m = Number(conv.m);
  const y = Number(conv.y);
  let result = "";
  if (conv.mode === "duong" && validCivil(d, m, y)) {
    const l = solarToLunar(d, m, y);
    const year = buildBrief({ y, m, d }, null);
    result = `${l.day} ${lunarMonthTitle(l.month, l.leap).toLowerCase()}, năm ${pillarName(year.year)}`;
  } else if (conv.mode === "am") {
    const civil = lunarToSolar(d, m, y, conv.leap);
    result = civil ? `${civil.d}/${civil.m}/${civil.y}` : "Không đổi được ngày này";
  } else result = "Nhập ngày hợp lệ";

  return (
    <section className="h-full min-h-0 overflow-y-auto bg-paper px-4 pt-4 pb-6">
      <h2 className="text-lg font-extrabold">Tiện ích</h2>
      <button type="button" className="press mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink font-bold text-paper" onClick={onShare}>
        <Share2 className="h-4 w-4" /> Chia sẻ ngày đang xem
      </button>
      <article className="mt-3 rounded-2xl bg-meadow px-3 py-3">
        <p className="text-xs font-bold text-muted">Tết Nguyên Đán</p>
        <p className="text-base font-extrabold">
          {tet.days === 0 ? "Hôm nay là Mùng Một Tết" : `Còn ${tet.days} ngày tới Tết ${tet.civil.y}`}
        </p>
        <button type="button" className="press mt-1 text-sm font-bold text-leaf" onClick={() => onJump(tet.civil)}>
          Mở ngày {tet.civil.d}/{tet.civil.m}/{tet.civil.y}
        </button>
      </article>
      <article className="mt-3 rounded-2xl border border-line px-3 py-3">
        <p className="text-xs font-bold text-muted">Lễ sắp tới</p>
        <ul className="mt-1">
          {fest.map((f) => (
            <li key={`${f.name}-${f.days}`}>
              <button type="button" className="press flex min-h-11 w-full items-center justify-between text-left text-sm" onClick={() => onJump(f.civil)}>
                <span className="font-semibold">{f.name}</span>
                <span className="text-muted">{f.days === 0 ? "Hôm nay" : `${f.days} ngày`}</span>
              </button>
            </li>
          ))}
        </ul>
      </article>
      <article className="mt-3 rounded-2xl border border-line px-3 py-3">
        <p className="text-xs font-bold text-muted">Đổi dương ↔ âm</p>
        <div className="mt-2 flex gap-2">
          <button type="button" className={`press min-h-11 flex-1 rounded-full font-bold ${conv.mode === "duong" ? "bg-ink text-paper" : "bg-meadow"}`} onClick={() => setConv({ ...conv, mode: "duong" })}>Dương ra âm</button>
          <button type="button" className={`press min-h-11 flex-1 rounded-full font-bold ${conv.mode === "am" ? "bg-ink text-paper" : "bg-meadow"}`} onClick={() => setConv({ ...conv, mode: "am" })}>Âm ra dương</button>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["d", "m", "y"] as const).map((key) => (
            <input
              key={key}
              inputMode="numeric"
              aria-label={key === "d" ? "Ngày" : key === "m" ? "Tháng" : "Năm"}
              value={conv[key]}
              onChange={(e) => setConv({ ...conv, [key]: e.target.value })}
              className="min-h-11 rounded-xl border border-line bg-cloud px-2 text-center text-base"
            />
          ))}
        </div>
        {conv.mode === "am" ? (
          <label className="mt-2 flex min-h-11 items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={conv.leap} onChange={(e) => setConv({ ...conv, leap: e.target.checked })} />
            Tháng nhuận
          </label>
        ) : null}
        <p className="mt-2 font-extrabold">{result}</p>
        <p className="text-xs text-muted">Hôm nay đang trong tiết {brief.term.name}.</p>
      </article>
      <button type="button" className="press mt-3 min-h-11 w-full rounded-full border border-line font-bold" onClick={onBackup}>
        Sao lưu ghi chú
      </button>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Âm lịch tính theo thuật toán Hồ Ngọc Đức, múi giờ Việt Nam (UTC+7). Hoàng đạo, trực và giờ tốt là phong tục lịch vạn niên.
      </p>
    </section>
  );
}
