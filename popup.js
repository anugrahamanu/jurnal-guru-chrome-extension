// Popup script untuk Chrome Extension Jurnal Guru Digital

const DEFAULT_SERVER_URL = "http://localhost/Jurnal Guru";

document.addEventListener("DOMContentLoaded", async () => {
  const statusBadge = document.getElementById("serverStatusBadge");
  const statusText = statusBadge ? statusBadge.querySelector(".status-text") : null;
  const btnOpenSidePanel = document.getElementById("btnOpenSidePanel");
  const btnToggleSettings = document.getElementById("btnToggleSettings");
  const settingsChevron = document.getElementById("settingsChevron");
  const settingsBody = document.getElementById("settingsBody");
  const inputServerUrl = document.getElementById("inputServerUrl");
  const btnSetLocalhost = document.getElementById("btnSetLocalhost");
  const btnSaveUrl = document.getElementById("btnSaveUrl");
  const shortcutCards = document.querySelectorAll(".shortcut-card");

  // Ambil serverUrl yang tersimpan
  let currentServerUrl = DEFAULT_SERVER_URL;
  try {
    const data = await chrome.storage.local.get("serverUrl");
    if (data && data.serverUrl) {
      currentServerUrl = data.serverUrl;
    }
  } catch (err) {
    console.warn("Gagal membaca storage:", err);
  }

  if (inputServerUrl) {
    inputServerUrl.value = currentServerUrl;
  }

  // Fungsi normalize URL (hapus trailing slash)
  function normalizeUrl(url) {
    return (url || "").trim().replace(/\/+$/, "");
  }

  // Cek status server
  async function checkServerStatus(url) {
    const base = normalizeUrl(url);
    if (!statusBadge || !statusText) return;

    statusBadge.className = "status-pill";
    statusText.textContent = "Memeriksa...";

    try {
      // Coba fetch ringan dengan no-cors atau HEAD
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${base}/app.html`, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      statusBadge.className = "status-pill";
      statusText.textContent = "Tersambung";
    } catch (e) {
      statusBadge.className = "status-pill offline";
      statusText.textContent = "Offline / Cek XAMPP";
    }
  }

  // Jalankan cek status awal
  checkServerStatus(currentServerUrl);

  // Buka Side Panel
  if (btnOpenSidePanel) {
    btnOpenSidePanel.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "open_side_panel" }, (response) => {
        // Tutup popup agar side panel terlihat jelas
        setTimeout(() => window.close(), 150);
      });
    });
  }

  // Buka Shortcut di Tab Baru
  shortcutCards.forEach((card) => {
    card.addEventListener("click", async () => {
      const path = card.getAttribute("data-path") || "app.html";
      const base = normalizeUrl(inputServerUrl ? inputServerUrl.value : currentServerUrl);
      const targetUrl = `${base}/${path}`;
      
      chrome.tabs.create({ url: targetUrl });
      window.close();
    });
  });

  // Toggle Pengaturan
  if (btnToggleSettings && settingsBody) {
    btnToggleSettings.addEventListener("click", () => {
      const isVisible = settingsBody.style.display === "block";
      settingsBody.style.display = isVisible ? "none" : "block";
      if (settingsChevron) {
        settingsChevron.className = isVisible ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-up";
      }
    });
  }

  // Tombol Cepat Set Localhost
  if (btnSetLocalhost && inputServerUrl) {
    btnSetLocalhost.addEventListener("click", () => {
      inputServerUrl.value = DEFAULT_SERVER_URL;
    });
  }

  // Simpan Alamat Server
  if (btnSaveUrl && inputServerUrl) {
    btnSaveUrl.addEventListener("click", async () => {
      let newUrl = normalizeUrl(inputServerUrl.value);
      if (!newUrl) {
        newUrl = DEFAULT_SERVER_URL;
        inputServerUrl.value = newUrl;
      }

      await chrome.storage.local.set({ serverUrl: newUrl });
      currentServerUrl = newUrl;

      // Beri feedback visual
      const oldHtml = btnSaveUrl.innerHTML;
      btnSaveUrl.innerHTML = '<i class="fa-solid fa-check"></i> Tersimpan!';
      btnSaveUrl.style.background = "#059669";
      
      checkServerStatus(newUrl);

      setTimeout(() => {
        btnSaveUrl.innerHTML = oldHtml;
        btnSaveUrl.style.background = "";
      }, 1500);
    });
  }
});
