document.addEventListener("DOMContentLoaded", function () {
  /* ========== فهرست معاملات ========== */
  const list = document.getElementById("dealsList");
  if (list) {
    const cards = [...document.querySelectorAll(".deal-card")];
    const q = document.getElementById("dealSearch");
    const empty = document.getElementById("dealEmpty");
    const meta = document.getElementById("dealResultsMeta");
    const summary = document.getElementById("dealActiveFilters");
    let quick = "all";
    const $ = (id) => document.getElementById(id);
    const n = (v) => (v || "").toString().trim().toLowerCase().replace(/[يى]/g, "ی").replace(/ك/g, "ک");

    function filters() {
      return {
        type: $("dfType")?.value || "",
        status: $("dfStatus")?.value || "",
        agent: $("dfAgent")?.value || "",
        cmin: +$("dfCommMin")?.value || null,
        cmax: +$("dfCommMax")?.value || null
      };
    }

    function render() {
      const f = filters();
      const query = n(q?.value || "");
      let c = 0;
      cards.forEach((card) => {
        const hay = n([card.dataset.code, card.dataset.customer, card.dataset.property, card.dataset.agents, card.innerText].join(" "));
        let ok = !query || hay.includes(query);
        if (f.type) ok &&= card.dataset.type === f.type;
        if (f.status) ok &&= card.dataset.status === f.status;
        if (f.agent) ok &&= (card.dataset.agents || "").includes(f.agent);
        const comm = +card.dataset.commission || 0;
        if (f.cmin != null) ok &&= comm >= f.cmin;
        if (f.cmax != null) ok &&= comm <= f.cmax;
        if (quick === "sale" || quick === "rent") ok &&= card.dataset.type === quick;
        if (quick === "paid") ok &&= card.dataset.status === "paid";
        if (quick === "pending") ok &&= card.dataset.status === "pending" || card.dataset.status === "partial";
        card.classList.toggle("d-none", !ok);
        if (ok) c++;
      });
      const labels = [];
      if (f.type) labels.push(f.type === "sale" ? "فروش" : "رهن و اجاره");
      if (f.status) labels.push({ paid: "تسویه‌شده", partial: "بخشی پرداخت‌شده", pending: "در انتظار" }[f.status]);
      if (f.agent) labels.push("مشاور: " + f.agent);
      if (f.cmin || f.cmax) labels.push(`کمیسیون ${f.cmin || "۰"} تا ${f.cmax || "∞"}`);
      if (summary) summary.innerHTML = labels.length ? labels.map((v) => `<span class="active-filter">${v}</span>`).join("") : `<span class="active-filter">بدون فیلتر</span>`;
      if (meta) meta.textContent = `${c} معامله از ${cards.length} معامله نمونه`;
      if (empty) empty.classList.toggle("d-none", c !== 0);
    }

    function reset() {
      document.querySelectorAll("#advancedDealFilters input").forEach((el) => (el.value = ""));
      document.querySelectorAll("#advancedDealFilters select").forEach((el) => (el.value = ""));
      if (q) q.value = "";
      quick = "all";
      document.querySelectorAll("[data-deal-quick]").forEach((x) => x.classList.toggle("active", x.dataset.dealQuick === "all"));
      render();
    }

    document.querySelectorAll("[data-deal-quick]").forEach((b) =>
      b.addEventListener("click", () => {
        quick = b.dataset.dealQuick;
        document.querySelectorAll("[data-deal-quick]").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        render();
      })
    );
    q?.addEventListener("input", render);
    q?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        render();
      }
    });
    $("dealSearchBtn")?.addEventListener("click", render);
    $("applyDealFilters")?.addEventListener("click", render);
    $("clearDealSearch")?.addEventListener("click", reset);
    $("resetDealFilters")?.addEventListener("click", reset);
    $("emptyClearDeal")?.addEventListener("click", reset);
    render();
  }

  /* ========== فرم ثبت معامله ========== */
  const form = document.getElementById("dealForm");
  if (!form) return;

  const dealType = document.getElementById("dealType");
  const saleFields = document.querySelectorAll(".deal-sale-field");
  const rentFields = document.querySelectorAll(".deal-rent-field");
  const agentRows = document.getElementById("agentRows");
  const totalCommission = document.getElementById("totalCommission");
  const sharesSumEl = document.getElementById("sharesSum");
  const commissionRef = document.getElementById("commissionRef");
  const shareBalance = document.getElementById("shareBalance");
  let agentIndex = 1;

  function syncDealType() {
    const isRent = dealType?.value === "rent";
    saleFields.forEach((el) => el.classList.toggle("d-none", isRent));
    rentFields.forEach((el) => el.classList.toggle("d-none", !isRent));
  }
  dealType?.addEventListener("change", syncDealType);
  syncDealType();

  function updateShareSummary() {
    const shares = [...document.querySelectorAll(".agent-share")].map((i) => +i.value || 0);
    const sum = shares.reduce((a, b) => a + b, 0);
    const total = +totalCommission?.value || 0;
    if (sharesSumEl) sharesSumEl.textContent = String(sum);
    if (commissionRef) commissionRef.textContent = String(total);
    if (!shareBalance) return;
    const diff = Math.abs(sum - total);
    if (!total && !sum) {
      shareBalance.textContent = "متوازن";
      shareBalance.className = "share-balance ok";
    } else if (diff < 0.01) {
      shareBalance.textContent = "متوازن ✓";
      shareBalance.className = "share-balance ok";
    } else if (sum > total) {
      shareBalance.textContent = "بیش از کمیسیون کل (" + (sum - total).toFixed(1) + ")";
      shareBalance.className = "share-balance bad";
    } else {
      shareBalance.textContent = "کمتر از کمیسیون (" + (total - sum).toFixed(1) + " باقی‌مانده)";
      shareBalance.className = "share-balance warn";
    }
  }

  totalCommission?.addEventListener("input", updateShareSummary);
  agentRows?.addEventListener("input", (e) => {
    if (e.target.classList.contains("agent-share")) updateShareSummary();
  });

  function refreshRemoveButtons() {
    const rows = agentRows.querySelectorAll(".agent-share-row");
    rows.forEach((row) => {
      const btn = row.querySelector(".remove-agent-row");
      if (btn) btn.disabled = rows.length <= 1;
    });
  }

  document.getElementById("addAgentRow")?.addEventListener("click", () => {
    const i = agentIndex++;
    const div = document.createElement("div");
    div.className = "agent-share-row row g-2 align-items-end mb-2";
    div.innerHTML =
      '<div class="col-md-5">' +
      '<label class="form-label">نام مشاور</label>' +
      '<select class="form-select agent-name" name="agents[' + i + '][name]">' +
      '<option value="">انتخاب کنید</option>' +
      "<option>نازنین یحیی پور</option>" +
      "<option>آرمین حاجی پور</option>" +
      "<option>مهدی ایرانمنش</option>" +
      "<option>سایر</option>" +
      "</select></div>" +
      '<div class="col-md-3">' +
      '<label class="form-label">نقش</label>' +
      '<select class="form-select" name="agents[' + i + '][role]">' +
      "<option>معرف</option><option>پیگیری‌کننده</option><option>بستن قرارداد</option><option>همکار</option>" +
      "</select></div>" +
      '<div class="col-md-3">' +
      '<label class="form-label">سهم (میلیون تومان)</label>' +
      '<input type="number" step="any" min="0" class="form-control agent-share" name="agents[' + i + '][share]" placeholder="مثلاً ۸۰">' +
      "</div>" +
      '<div class="col-md-1">' +
      '<button type="button" class="btn btn-light-panel w-100 remove-agent-row" title="حذف"><i class="bi bi-trash"></i></button>' +
      "</div>";
    agentRows.appendChild(div);
    refreshRemoveButtons();
    updateShareSummary();
  });

  agentRows?.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-agent-row");
    if (!btn || btn.disabled) return;
    btn.closest(".agent-share-row")?.remove();
    refreshRemoveButtons();
    updateShareSummary();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateShareSummary();
    alert("در نسخه فرانت‌اند، معامله ذخیره نشد. این فرم برای اتصال به API لاراول آماده است.");
  });

  refreshRemoveButtons();
  updateShareSummary();
});
