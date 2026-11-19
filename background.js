// Background Service Worker untuk Ekstensi Chrome Jurnal Guru Digital (Manifest V3)

const DEFAULT_SERVER_URL = "http://localhost/Jurnal Guru";

// Saat ekstensi pertama kali dipasang atau diperbarui
chrome.runtime.onInstalled.addListener(async () => {
  // Set default server URL jika belum ada
  const data = await chrome.storage.local.get("serverUrl");
  if (!data.serverUrl) {
    await chrome.storage.local.set({ serverUrl: DEFAULT_SERVER_URL });
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

  // Atur agar klik icon toolbar tetap membuka popup.html
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
  }
});

// Tangani klik menu Context Menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const data = await chrome.storage.local.get({ serverUrl: DEFAULT_SERVER_URL });
  const base = data.serverUrl.replace(/\/+$/, "");

  if (info.menuItemId === "menu-sidepanel") {
    if (tab?.id && chrome.sidePanel && chrome.sidePanel.open) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
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
  if (command === "open-sidepanel" && tab?.id) {
    if (chrome.sidePanel && chrome.sidePanel.open) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  }
});

// Tangani pesan dari popup jika ingin membuka side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_side_panel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id && chrome.sidePanel && chrome.sidePanel.open) {
        chrome.sidePanel.open({ tabId: tabs[0].id });
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false });
      }
    });
    return true; // async
  }
});
