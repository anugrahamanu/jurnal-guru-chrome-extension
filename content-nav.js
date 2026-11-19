// Content script untuk navigasi instan menu di Jurnal Guru Digital (Main World)

(function () {
  function getRequestedMenu() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const menu = urlParams.get("menu");
      if (menu) return menu.toLowerCase();

      if (window.location.hash) {
        const h = window.location.hash.replace("#", "").toLowerCase();
        if (h && h !== "!") return h;
      }
    } catch (e) {}
    return null;
  }

  function switchTo(menuName) {
    if (!menuName) return;

    // Cara 1: Akses instance Vue 3 langsung
    const appEl = document.getElementById("app");
    if (appEl && appEl.__vue_app__ && appEl.__vue_app__._instance) {
      try {
        const ctx = appEl.__vue_app__._instance.ctx;
        if (ctx && typeof ctx.switchMenu === "function") {
          ctx.switchMenu(menuName);
          return true;
        }
      } catch (err) {}
    }

    // Cara 2: Cari elemen link menu di sidebar dan klik
    const links = document.querySelectorAll("a, button");
    for (const el of links) {
      const href = (el.getAttribute("href") || "").toLowerCase();
      const clickAttr = (el.getAttribute("@click.prevent") || el.getAttribute("onclick") || "").toLowerCase();
      const text = (el.innerText || "").toLowerCase();

      if (menuName === "tugas") {
        if (clickAttr.includes("'tugas'") || text.includes("lms guru") || text.includes("modul & tugas")) {
          el.click();
          return true;
        }
      } else if (menuName === "dashboard") {
        if (clickAttr.includes("'dashboard'") || text.includes("dashboard")) {
          el.click();
          return true;
        }
      } else if (clickAttr.includes(`'${menuName}'`)) {
        el.click();
        return true;
      }
    }
    return false;
  }

  // Polling pintar sampai Vue ter-mount sempurna
  function pollAndApply(menuName) {
    if (!menuName) return;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const success = switchTo(menuName);
      if (success || attempts > 25) {
        clearInterval(interval);
      }
    }, 200);
  }

  // Jalankan saat load awal
  const initialMenu = getRequestedMenu();
  if (initialMenu) {
    pollAndApply(initialMenu);
  }

  // Dengarkan pesan pergantian menu secara real-time dari bilah samping
  window.addEventListener("message", (event) => {
    if (event.data && event.data.action === "SWITCH_MENU" && event.data.menu) {
      switchTo(event.data.menu);
    }
  });

  // Dengarkan hashchange
  window.addEventListener("hashchange", () => {
    const m = getRequestedMenu();
    if (m) switchTo(m);
  });
})();
