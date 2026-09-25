
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("panelSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const openBtn = document.querySelector("[data-panel-sidebar-open]");
    const closeBtns = document.querySelectorAll("[data-panel-sidebar-close]");

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add("show");
        if (overlay) overlay.classList.add("show");
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove("show");
        if (overlay) overlay.classList.remove("show");
    }

    // Toggle sidebar with hamburger button
    openBtn?.addEventListener("click", function () {
        if (sidebar?.classList.contains("show")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    closeBtns.forEach(btn => btn.addEventListener("click", closeSidebar));
    overlay?.addEventListener("click", closeSidebar);



    // Persistent light / dark theme
    const themeToggles = document.querySelectorAll("[data-theme-toggle]");
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("panel-theme", theme);
        themeToggles.forEach(themeToggle => {
            themeToggle.innerHTML = theme === "dark"
                ? '<i class="bi bi-sun"></i>'
                : '<i class="bi bi-moon-stars"></i>';
            themeToggle.setAttribute("aria-label", theme === "dark" ? "فعال کردن تم روشن" : "فعال کردن تم تیره");
            themeToggle.title = theme === "dark" ? "تم روشن" : "تم تیره";
        });
    }
    const savedTheme = localStorage.getItem("panel-theme") || "light";
    applyTheme(savedTheme);
    themeToggles.forEach(btn => {
        btn.addEventListener("click", () => {
            applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
        });
    });

    // Close the mobile sidebar after navigating.
    document.querySelectorAll("#panelSidebar a.nav-link").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth < 768) closeSidebar();
        });
    });

    // Sale / rent form switch
    document.querySelectorAll("[data-property-mode]").forEach(btn => {
        btn.addEventListener("click", function () {
            const mode = this.dataset.propertyMode;

            document.querySelectorAll("[data-property-mode]").forEach(b => {
                b.classList.remove("active");
            });

            this.classList.add("active");

            document.querySelectorAll("[data-mode-section]").forEach(section => {
                section.classList.toggle(
                    "d-none",
                    section.dataset.modeSection !== mode
                );
            });

            const modeInput = document.querySelector("#transaction_type");

            if (modeInput) {
                modeInput.value = mode;
            }
        });
    });


    // Simple demo search/sort for the static frontend.
    const search = document.querySelector("[data-property-search]");
    const sort = document.querySelector("[data-property-sort]");
    const rows = [...document.querySelectorAll("[data-property-row]")];

    function refreshRows() {
        if (!rows.length) return;

        const q = (search?.value || "").trim().toLowerCase();

        let visible = rows.filter(row =>
            row.innerText.toLowerCase().includes(q)
        );

        rows.forEach(row => row.classList.add("d-none"));
        visible.forEach(row => row.classList.remove("d-none"));

        if (sort?.value) {
            const tbody = document.querySelector("[data-property-tbody]");

            if (!tbody) return;

            const sorted = [...visible].sort((a, b) => {
                const av = (
                    a.dataset[sort.value] || a.innerText
                ).toString();

                const bv = (
                    b.dataset[sort.value] || b.innerText
                ).toString();

                return av.localeCompare(bv, "fa");
            });

            sorted.forEach(row => tbody.appendChild(row));
        }
    }

    search?.addEventListener("input", refreshRows);
    sort?.addEventListener("change", refreshRows);
});


/* Prevent negative values on all number inputs site-wide */
(function () {
  function clampNumberInput(el) {
    if (!el || el.type !== "number") return;
    if (!el.hasAttribute("min")) el.setAttribute("min", "0");
    const min = parseFloat(el.getAttribute("min"));
    const val = parseFloat(el.value);
    if (el.value !== "" && !isNaN(val) && !isNaN(min) && val < min) {
      el.value = String(min);
    }
  }
  document.addEventListener("input", function (e) {
    const t = e.target;
    if (t && t.matches && t.matches('input[type="number"]')) clampNumberInput(t);
  }, true);
  document.addEventListener("change", function (e) {
    const t = e.target;
    if (t && t.matches && t.matches('input[type="number"]')) clampNumberInput(t);
  }, true);
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('input[type="number"]').forEach(clampNumberInput);
  });
})();


/* Allow decimal values on all number inputs (HTML5 step default is 1 = integer only) */
(function () {
  function allowDecimals(el) {
    if (!el || el.type !== "number") return;
    if (!el.hasAttribute("step")) el.setAttribute("step", "any");
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('input[type="number"]').forEach(allowDecimals);
  });
})();
