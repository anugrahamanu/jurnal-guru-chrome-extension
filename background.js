// Background Service Worker untuk Ekstensi Chrome Jurnal Guru Digital (Manifest V3)

const DEFAULT_SERVER_URL = "https://gurugenz.my.id";
const ONLINE_SERVER_URL = "https://gurugenz.my.id";

// Fungsi normalisasi URL
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
  clean = clean.replace(/\/(app|index|siswa|kelola-soal|administrasi)\.html.*$/i, "");
  return clean;
}

// Pastikan aturan DNR (Declarative Net Request) selalu aktif untuk menghapus X-Frame-Options
async function ensureDnrRules() {
  if (!chrome.declarativeNetRequest || !chrome.declarativeNetRequest.updateDynamicRules) return;
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(r => r.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds,
      addRules: [
        {
          id: 101,
          priority: 2,
          action: {
            type: "modifyHeaders",
            responseHeaders: [
              { header: "X-Frame-Options", operation: "remove" },
              { header: "x-frame-options", operation: "remove" },
              { header: "Frame-Options", operation: "remove" },
              { header: "frame-options", operation: "remove" },
              { header: "Content-Security-Policy", operation: "remove" },
              { header: "content-security-policy", operation: "remove" }
            ]
          },
          condition: {
            requestDomains: ["gurugenz.my.id", "localhost", "127.0.0.1"],
            resourceTypes: ["sub_frame"]
          }
        }
      ]
    });
  } catch (err) {
    console.warn("DNR Dynamic rules error:", err);
  }
}

// Buka Side Panel secara aman (mendukung windowId dan fallback tabId)
async function openSidePanelSafely(tab) {
  if (!chrome.sidePanel || !chrome.sidePanel.open) return;

  try {
    // Cari tab / window aktif jika tab belum terdefinisi
    let currentTab = tab;
    if (!currentTab || !currentTab.id) {
      const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      currentTab = activeTab;
    }

    if (currentTab?.windowId) {
      await chrome.sidePanel.open({ windowId: currentTab.windowId });
      return;
    }

    if (currentTab?.id) {
      await chrome.sidePanel.open({ tabId: currentTab.id });
    }
  } catch (err) {
    // Jika windowId gagal, fallback ke tabId
    if (tab?.id) {
      try {
        await chrome.sidePanel.open({ tabId: tab.id });
      } catch (e) {
        console.warn("Gagal membuka side panel:", e);
      }
    }
  }
}

// Inisialisasi saat ekstensi dipasang / diperbarui
chrome.runtime.onInstalled.addListener(async () => {
  await ensureDnrRules();

  // Set default server URL jika belum ada
  const data = await chrome.storage.local.get("serverUrl");
  if (!data.serverUrl) {
    await chrome.storage.local.set({ serverUrl: DEFAULT_SERVER_URL });
  } else {
    // Normalisasi serverUrl yang sudah ada
    const clean = normalizeUrl(data.serverUrl);
    if (clean !== data.serverUrl) {
      await chrome.storage.local.set({ serverUrl: clean });
    }
  }

  // Buat menu klik kanan (Context Menus)
  try {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "menu-sidepanel",
        title: "📖 Buka Jurnal Guru di Side Panel (Alt+J)",
        contexts: ["all"]
      });
      chrome.contextMenus.create({
        id: "menu-app",
        title: "📊 Dashboard Guru (Tab Baru)",
        contexts: ["all"]
      });
      chrome.contextMenus.create({
        id: "menu-lms",
        title: "📚 LMS & Tugas Kelas",
        contexts: ["all"]
      });
      chrome.contextMenus.create({
        id: "menu-siswa",
        title: "🎓 Portal Siswa",
        contexts: ["all"]
      });
    });
  } catch (err) {
    console.warn("Context menu init error:", err);
  }

  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
  }
});

// Panggil pastikan aturan DNR saat service worker hidup
ensureDnrRules();

// Tangani klik menu Context Menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const data = await chrome.storage.local.get({ serverUrl: DEFAULT_SERVER_URL });
  const base = normalizeUrl(data.serverUrl);

  if (info.menuItemId === "menu-sidepanel") {
    openSidePanelSafely(tab);
  } else if (info.menuItemId === "menu-app") {
    chrome.tabs.create({ url: `${base}/app.html` });
  } else if (info.menuItemId === "menu-lms") {
    chrome.tabs.create({ url: `${base}/app.html#tugas` });
  } else if (info.menuItemId === "menu-siswa") {
    chrome.tabs.create({ url: `${base}/siswa.html` });
  }
});

// Tangani shortcut keyboard (Alt+J)
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "open-sidepanel") {
    openSidePanelSafely(tab);
  }
});

// Tangani pesan dari popup jika ingin membuka side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_side_panel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      openSidePanelSafely(activeTab).then(() => {
        sendResponse({ success: true });
      }).catch(() => {
        sendResponse({ success: false });
      });
    });
    return true; // async
  }
});
