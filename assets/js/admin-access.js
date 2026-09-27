document.addEventListener("DOMContentLoaded", function () {
  const rows = [...document.querySelectorAll(".access-row")];
  const q = document.getElementById("accessSearch");
  const empty = document.getElementById("accessEmpty");
  const meta = document.getElementById("accessResultsMeta");
  const toast = document.getElementById("accessToast");
  let roleFilter = "all";
  let statusFilter = "";

  const n = (v) =>
    (v || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک");

  function render() {
    const query = n(q?.value || "");
    let c = 0;
    rows.forEach((row) => {
      const hay = n(
        [row.dataset.name, row.dataset.username, row.dataset.mobile, row.dataset.role].join(" ")
      );
      let ok = !query || hay.includes(query);
      if (roleFilter && roleFilter !== "all") ok &&= row.dataset.role === roleFilter;
      if (statusFilter) ok &&= row.dataset.status === statusFilter;
      row.classList.toggle("d-none", !ok);
      if (ok) c++;
    });
    if (meta) meta.textContent = `${c} کاربر از ${rows.length} کاربر نمایش داده می‌شود`;
    if (empty) empty.classList.toggle("d-none", c !== 0);
  }

  function showToast(msg, ok) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("d-none", "ok", "err");
    toast.classList.add(ok ? "ok" : "err");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add("d-none"), 2800);
  }

  function refreshStats() {
    const visible = rows; // all sample users
    const total = visible.length;
    const agents = visible.filter((r) => r.dataset.role === "agent").length;
    const admins = visible.filter((r) => r.dataset.role === "admin" || r.dataset.role === "manager").length;
    const limited = visible.filter((r) => r.dataset.priceMin !== "" || r.dataset.priceMax !== "").length;
    const el = (id) => document.getElementById(id);
    if (el("statUsersTotal")) el("statUsersTotal").textContent = String(total);
    if (el("statAgents")) el("statAgents").textContent = String(agents);
    if (el("statAdmins")) el("statAdmins").textContent = String(admins);
    if (el("statLimited")) el("statLimited").textContent = String(limited);
  }

  document.querySelectorAll("[data-access-role]").forEach((btn) => {
    btn.addEventListener("click", () => {
      roleFilter = btn.getAttribute("data-access-role") || "all";
      statusFilter = "";
      document.querySelectorAll("[data-access-role],[data-access-status]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });
  });

  document.querySelectorAll("[data-access-status]").forEach((btn) => {
    btn.addEventListener("click", () => {
      statusFilter = btn.getAttribute("data-access-status") || "";
      roleFilter = "all";
      document.querySelectorAll("[data-access-role],[data-access-status]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });
  });

  q?.addEventListener("input", render);
  document.getElementById("accessSearchBtn")?.addEventListener("click", render);

  document.querySelectorAll(".access-save").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".access-row");
      if (!row) return;
      const role = row.querySelector(".access-role")?.value || "agent";
      const pmin = row.querySelector(".access-price-min")?.value ?? "";
      const pmax = row.querySelector(".access-price-max")?.value ?? "";

      if (pmin !== "" && pmax !== "" && +pmin > +pmax) {
        showToast("حداقل قیمت نمی‌تواند از حداکثر بیشتر باشد.", false);
        return;
      }

      row.dataset.role = role;
      row.dataset.priceMin = pmin;
      row.dataset.priceMax = pmax;

      /* Demo: در لاراول → PATCH /api/admin/users/{id} با role, price_min, price_max */
      btn.disabled = true;
      const oldHtml = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check2-all ms-1"></i> ذخیره شد';
      showToast("دسترسی «" + (row.dataset.name || "") + "» به‌روز شد (نمایشی).", true);
      refreshStats();
      render();
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = oldHtml;
      }, 1500);
    });
  });

  // همگام‌سازی data-role هنگام تغییر select (قبل از ذخیره برای فیلتر)
  document.querySelectorAll(".access-role").forEach((sel) => {
    sel.addEventListener("change", () => {
      const row = sel.closest(".access-row");
      if (row) row.dataset.role = sel.value;
    });
  });

  refreshStats();
  render();
});
