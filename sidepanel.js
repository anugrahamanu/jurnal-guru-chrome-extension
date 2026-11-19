// Side Panel script untuk Chrome Extension Jurnal Guru Digital

const DEFAULT_SERVER_URL = "http://localhost/Jurnal Guru";
const ONLINE_SERVER_URL = "https://gurugenz.my.id";

document.addEventListener("DOMContentLoaded", async () => {
  const iframe = document.getElementById("mainFrame");
  const loader = document.getElementById("frameLoader");
  const loaderText = document.getElementById("loaderText");
  const iframeFallback = document.getElementById("iframeFallback");
  const btnFallbackOpenTab = document.getElementById("btnFallbackOpenTab");
  const btnFallbackRetry = document.getElementById("btnFallbackRetry");
  const btnReload = document.getElementById("btnReload");
  const btnOpenTab = document.getElementById("btnOpenTab");
  const btnToggleSettings = document.getElementById("btnToggleSettings");
  const settingsPanel = document.getElementById("settingsPanel");
  const inputUrl = document.getElementById("sidepanelServerUrl");
  const btnSaveUrl = document.getElementById("btnSaveSidepanelUrl");
  const btnPresetOnlineSide = document.getElementById("btnPresetOnlineSide");
  const btnPresetLocalSide = document.getElementById("btnPresetLocalSide");
  const tabButtons = document.querySelectorAll(".tab-btn");

  let currentServerUrl = DEFAULT_SERVER_URL;
  let currentPath = "app.html";
  let loadTimeoutId = null;

  // Normalisasi URL: pastikan selalu memiliki protokol https:// atau http:// dan tanpa akhiran file html
  function normalizeUrl(url) {
    let clean = (url || "").trim().replace(/\/+$/, "");
    if (!clean) return clean;
    if (!/^https?:\/\//i.test(clean)) {
      if (clean.toLowerCase().startsWith("localhost") || clean.startsWith("127.0.0.1")) {
        clean = "http://" + clean;
      } else {
        clean = "https://" + clean;
      }
    }
    // Jika ada akhiran /app.html atau /index.html di server URL, hapus agar path tidak double
    clean = clean.replace(/\/(app|index|siswa|kelola-soal|administrasi)\.html.*$/i, "");
    return clean;
  }

  // Muat URL yang tersimpan
  try {
    const data = await chrome.storage.local.get("serverUrl");
    if (data && data.serverUrl) {
      currentServerUrl = normalizeUrl(data.serverUrl);
    }
  } catch (e) {
    console.warn("Storage error:", e);
  }

  if (inputUrl) {
    inputUrl.value = currentServerUrl;
  }

  // Dapatkan Full URL yang valid
  function getTargetUrl(path) {
    const base = normalizeUrl(currentServerUrl);
    return `${base}/${path}`;
  }

  // Sembunyikan fallback
  function hideFallback() {
    if (iframeFallback) iframeFallback.style.display = "none";
  }

  // Tampilkan fallback
  function showFallback() {
    if (loader) loader.classList.add("hidden");
    if (iframeFallback) iframeFallback.style.display = "flex";
  }

  // Muat halaman ke iframe
  function loadPage(path) {
    currentPath = path;
    const target = getTargetUrl(path);

    hideFallback();
    if (loader) {
      if (loaderText) loaderText.textContent = "Memuat Jurnal Guru...";
      loader.classList.remove("hidden");
    }

    if (loadTimeoutId) clearTimeout(loadTimeoutId);

    try {
      iframe.src = target;
    } catch (err) {
      console.warn("Gagal set iframe src:", err);
      showFallback();
      return;
    }

    // Timeout pengaman loader
    loadTimeoutId = setTimeout(() => {
      if (loader) loader.classList.add("hidden");
    }, 3500);
  }

  // Saat iframe selesai termuat
  iframe.addEventListener("load", () => {
    if (loader) loader.classList.add("hidden");
    if (loadTimeoutId) clearTimeout(loadTimeoutId);
    hideFallback();
  });

  // Tombol Pilihan Navigasi Tab
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const path = btn.getAttribute("data-path") || "app.html";
      loadPage(path);
    });
  });

  // Tombol Muat Ulang (Reload)
  if (btnReload) {
    btnReload.addEventListener("click", () => {
      loadPage(currentPath);
    });
  }

  // Tombol Buka di Tab Baru
  function openCurrentInTab() {
    const target = getTargetUrl(currentPath);
    chrome.tabs.create({ url: target });
  }

  if (btnOpenTab) {
    btnOpenTab.addEventListener("click", openCurrentInTab);
  }

  if (btnFallbackOpenTab) {
    btnFallbackOpenTab.addEventListener("click", openCurrentInTab);
  }

  if (btnFallbackRetry) {
    btnFallbackRetry.addEventListener("click", () => {
      loadPage(currentPath);
    });
  }

  // Tombol Toggle Pengaturan URL
  if (btnToggleSettings && settingsPanel) {
    btnToggleSettings.addEventListener("click", () => {
      settingsPanel.classList.toggle("show");
    });
  }

  // Preset Online
  if (btnPresetOnlineSide && inputUrl) {
    btnPresetOnlineSide.addEventListener("click", () => {
      inputUrl.value = ONLINE_SERVER_URL;
    });
  }

  // Preset Localhost
  if (btnPresetLocalSide && inputUrl) {
    btnPresetLocalSide.addEventListener("click", () => {
      inputUrl.value = DEFAULT_SERVER_URL;
    });
  }

  // Tombol Simpan URL Server
  if (btnSaveUrl && inputUrl) {
    btnSaveUrl.addEventListener("click", async () => {
      let newUrl = normalizeUrl(inputUrl.value);
      if (!newUrl) {
        newUrl = DEFAULT_SERVER_URL;
      }
      inputUrl.value = newUrl;

      await chrome.storage.local.set({ serverUrl: newUrl });
      currentServerUrl = newUrl;

      btnSaveUrl.textContent = "Tersimpan!";
      btnSaveUrl.style.background = "#059669";

      setTimeout(() => {
        btnSaveUrl.textContent = "Simpan";
        btnSaveUrl.style.background = "";
        settingsPanel.classList.remove("show");
      }, 1200);

      // Muat ulang halaman dengan URL server baru
      loadPage(currentPath);
    });
  }

  // Dengarkan jika ada perubahan serverUrl dari popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.serverUrl) {
      currentServerUrl = normalizeUrl(changes.serverUrl.newValue);
      if (inputUrl) inputUrl.value = currentServerUrl;
      loadPage(currentPath);
    }
  });

  // Muat halaman awal
  loadPage(currentPath);
});
