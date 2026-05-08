const $ = (sel, root = document) => root.querySelector(sel);

function showToast(text) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = text;
  el.classList.add("toast--show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => el.classList.remove("toast--show"), 2600);
}

async function loadData() {
  const res = await fetch("./room.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`room.json: ${res.status}`);
  return res.json();
}

function renderHeader(h) {
  $("#hdrBrand").textContent = (h.brandLines || []).join("\n");
  $("#hdrCta").textContent = h.cta || "БРОНИРОВАТЬ";
  $("#hdrCta").addEventListener("click", () => showToast("Бронирование (демо)."));

  const left = $("#hdrLeft");
  left.innerHTML = "";
  (h.itemsLeft || []).forEach((it) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "hdr__item";
    a.textContent = it.label;
    if (it.hasPlus) {
      const plus = document.createElement("span");
      plus.className = "hdr__plus";
      plus.setAttribute("aria-hidden", "true");
      a.appendChild(plus);
    }
    left.appendChild(a);
  });

  const right = $("#hdrRight");
  right.innerHTML = "";
  (h.itemsRight || []).forEach((it) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "hdr__item";
    a.textContent = it.label;
    if (it.hasPlus) {
      const plus = document.createElement("span");
      plus.className = "hdr__plus";
      plus.setAttribute("aria-hidden", "true");
      a.appendChild(plus);
    }
    right.appendChild(a);
  });

  const lang = $("#hdrLang");
  lang.innerHTML = "";
  const ru = document.createElement("span");
  ru.className = "muted";
  ru.textContent = `${h.lang?.secondary || "ru"} `;
  const bar = document.createElement("span");
  bar.className = "bar";
  bar.textContent = "|";
  const en = document.createElement("span");
  en.className = "prim";
  en.textContent = ` ${h.lang?.primary || "EN"}`;
  lang.append(ru, bar, en);
}

function renderCrumbs(items) {
  const host = $("#crumbs");
  host.innerHTML = "";
  items.forEach((t, idx) => {
    if (idx > 0) {
      const sep = document.createElement("span");
      sep.className = "crumbs__sep";
      sep.textContent = "/";
      host.appendChild(sep);
    }
    if (idx < items.length - 1) {
      const a = document.createElement("a");
      a.className = "crumbs__a";
      a.href = "#";
      a.textContent = t;
      host.appendChild(a);
    } else {
      const cur = document.createElement("span");
      cur.className = "crumbs__cur";
      cur.textContent = t;
      host.appendChild(cur);
    }
  });
}

function renderParams(params) {
  const host = $("#params");
  if (!host) return;
  host.innerHTML = "";
  (params || []).forEach((p) => {
    const box = document.createElement("div");
    box.className = "param";
    const k = document.createElement("div");
    k.className = "param__k";
    k.textContent = p.label;
    const v = document.createElement("div");
    v.className = "param__v";
    v.textContent = p.value;
    box.append(k, v);
    host.appendChild(box);
  });
}

function renderGallery(urls) {
  const host = $("#gallery");
  host.innerHTML = "";
  (urls || []).slice(0, 6).forEach((src) => {
    const wrap = document.createElement("div");
    wrap.className = "photo";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.loading = "lazy";
    wrap.appendChild(img);
    host.appendChild(wrap);
  });
}

function renderCards(cards) {
  const c1 = cards?.[0];
  const c2 = cards?.[1];
  if (c1) {
    $("#card1Text").textContent = c1.text || "";
    $("#card1Img").src = c1.image || "";
    $("#card1Link").textContent = c1.link || "Подробнее";
  }
  if (c2) {
    $("#card2Text").textContent = c2.text || "";
    $("#card2Img").src = c2.image || "";
    $("#card2Link").textContent = c2.link || "Подробнее";
  }
}

function renderStats(stats) {
  const host = $("#stats");
  host.innerHTML = "";
  (stats || []).slice(0, 4).forEach((s) => {
    const box = document.createElement("div");
    box.className = "stat";

    const top = document.createElement("div");
    top.className = "stat__top";
    const n = document.createElement("div");
    n.className = "stat__n";
    n.textContent = s.number || "—";
    top.appendChild(n);

    if (s.suffix) {
      const suf = document.createElement("div");
      suf.className = "stat__suf";
      suf.textContent = s.suffix;
      top.appendChild(suf);
    }

    const txt = document.createElement("div");
    txt.className = "stat__txt";
    txt.textContent = s.text || "";

    box.append(top, txt);
    host.appendChild(box);
  });
}

function renderFooter(f) {
  $("#footerTitle").textContent = f.title || "";
  $("#subTitle").textContent = f.subscribeTitle || "Рассылка";
  $("#subText").textContent = f.subscribeText || "";
  $("#socTitle").textContent = f.socialTitle || "СОЦ. СЕТИ";

  $("#subBtn").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Подписка (демо).");
  });

  const cols = $("#footerCols");
  cols.innerHTML = "";
  (f.columns || []).forEach((c) => {
    const col = document.createElement("div");
    col.className = "ftrCol";
    const t = document.createElement("div");
    t.className = "ftr__cap ftrCol__t";
    t.textContent = c.title || "";
    col.appendChild(t);
    (c.items || []).forEach((label) => {
      const a = document.createElement("a");
      a.className = "ftrCol__a";
      a.href = "#";
      a.textContent = label;
      col.appendChild(a);
    });
    cols.appendChild(col);
  });
}

function renderRightPanel(rp) {
  if (!rp) return;

  $("#rpAreaN").textContent = String(rp.areaM2 ?? "—");
  $("#rpAreaU").textContent = "м²";
  $("#rpGuestsPre").textContent = "до";
  $("#rpGuestsN").textContent = String(rp.guestsMax ?? "—");
  $("#rpGuestsSuf").textContent = "гостей";

  $("#rpBeds").textContent = rp.beds ?? "—";
  $("#rpView").textContent = rp.view ?? "—";

  const desc = $("#rpDesc");
  desc.innerHTML = "";
  (Array.isArray(rp.description) ? rp.description : [])
    .filter(Boolean)
    .forEach((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      desc.appendChild(p);
    });

  $("#rpNote").textContent = rp.note ?? "";

  const groups = Array.isArray(rp.groups) ? rp.groups : [];
  const cols = [$("#rpCol1"), $("#rpCol2"), $("#rpCol3"), $("#rpCol4")];
  const titles = [$("#rpCol1T"), $("#rpCol2T"), $("#rpCol3T"), $("#rpCol4T")];

  cols.forEach((c) => (c.innerHTML = ""));
  groups.slice(0, 4).forEach((g, idx) => {
    if (titles[idx]) titles[idx].textContent = g.title ?? "";
    const host = cols[idx];
    (Array.isArray(g.items) ? g.items : []).forEach((it) => {
      const div = document.createElement("div");
      div.className = "rpItem";
      div.textContent = it;
      host.appendChild(div);
    });
  });

  $("#rpSrvTitle").textContent = rp.servicesTitle ?? "Услуги по запросу";
  $("#rpSrvClose").addEventListener("click", () =>
    showToast("Услуги по запросу (демо)."),
  );

  const srv = $("#rpSrv");
  srv.innerHTML = "";
  (Array.isArray(rp.services) ? rp.services : []).slice(0, 4).forEach((it) => {
    const div = document.createElement("div");
    div.className = "rpBullet";
    div.textContent = it;
    srv.appendChild(div);
  });
}

async function main() {
  $("#year").textContent = String(new Date().getFullYear());

  $("#bookBtn").addEventListener("click", () =>
    showToast("Проверка доступности (демо)."),
  );
  $("#variantsBtn").addEventListener("click", () =>
    showToast("Варианты номера (демо)."),
  );

  try {
    const data = await loadData();
    renderHeader(data.header || {});
    $("#badge").textContent = data.page?.badge || "";
    $("#title").textContent = data.page?.title || "";
    $("#panelTitle").textContent = data.page?.rightTitle || "";
    $("#variantsTxt").textContent = data.page?.variantsBtn || "Варианты номера";
    $("#bookBtn").textContent = data.page?.bookBtn || "Проверить доступность";
    renderCrumbs(data.page?.breadcrumbs || []);
    renderRightPanel(data.page?.rightPanel || {});
    renderGallery(data.gallery || []);
    renderCards(data.infoCards || []);
    renderStats(data.stats || []);
    renderFooter(data.footer || {});
    document.title = data.page?.title || "Номер";
  } catch (e) {
    showToast("Ошибка загрузки `room.json` (нужен локальный сервер).");
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

main();

