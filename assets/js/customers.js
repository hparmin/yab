
document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("panelSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const openBtn = document.querySelector("[data-panel-sidebar-open]");
    const closeBtns = document.querySelectorAll("[data-panel-sidebar-close]");

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add("show");
        overlay?.classList.add("show");
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove("show");
        overlay?.classList.remove("show");
    }

    // Toggle: کلیک دوم روی همان دکمه منو را می‌بندد.
    openBtn?.addEventListener("click", function () {
        if (sidebar?.classList.contains("show")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    closeBtns.forEach(function (btn) {
        btn.addEventListener("click", closeSidebar);
    });

    overlay?.addEventListener("click", closeSidebar);


    // Customer search
    const searchInput = document.getElementById("customerSearch");
    const cards = [...document.querySelectorAll(".customer-card")];
    const emptyState = document.getElementById("emptyState");
    const filterButtons = [...document.querySelectorAll(".filter-chip")];

    let activeFilter = "all";

    function refreshCustomers() {
        const query = (searchInput?.value || "").trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(function (card) {

            const text = [
                card.dataset.name || "",
                card.dataset.phone || "",
                card.dataset.area || "",
                card.innerText || ""
            ].join(" ").toLowerCase();

            const matchesSearch = !query || text.includes(query);
            const matchesFilter =
                activeFilter === "all" ||
                card.dataset.type === activeFilter;

            const visible = matchesSearch && matchesFilter;

            card.classList.toggle("d-none", !visible);

            if (visible) {
                visibleCount++;
            }
        });

        emptyState?.classList.toggle("d-none", visibleCount !== 0);
    }

    searchInput?.addEventListener("input", refreshCustomers);

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");
            activeFilter = this.dataset.filter || "all";

            refreshCustomers();
        });
    });

});
