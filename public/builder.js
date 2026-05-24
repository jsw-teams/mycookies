const langs = ["zh-CN", "zh-TW", "en"];
const labels = {
  "zh-CN": {
    bannerTitle: "隐私选择",
    bannerMessage: "非必要分析插件默认关闭。你可以仅保留最小必要项目、全部接受，或按类别管理偏好。",
    rejectAll: "仅最小必要",
    acceptAll: "全部接受",
    customize: "管理偏好",
    save: "保存选择",
    close: "关闭",
    preferences: "隐私偏好中心",
    settings: "隐私设置",
    required: "必要",
    optional: "可选",
    requiredServicesTitle: "必要项目",
    requiredServicesDescription: "这些项目用于提供你请求的服务、安全、会话、语言偏好或保存隐私选择，不能在此关闭。",
    gpc: "检测到浏览器全局隐私控制或 Do Not Track，非必要插件默认保持关闭；你仍可以管理偏好。",
    analyticsTitle: "分析",
    analyticsDescription: "帮助了解访问量和性能，不用于广告定向或跨站跟踪。"
  },
  "zh-TW": {
    bannerTitle: "隱私選擇",
    bannerMessage: "非必要分析外掛預設關閉。你可以僅保留最小必要項目、全部接受，或依類別管理偏好。",
    rejectAll: "僅最小必要",
    acceptAll: "全部接受",
    customize: "管理偏好",
    save: "儲存選擇",
    close: "關閉",
    preferences: "隱私偏好中心",
    settings: "隱私設定",
    required: "必要",
    optional: "可選",
    requiredServicesTitle: "必要項目",
    requiredServicesDescription: "這些項目用於提供你要求的服務、安全、工作階段、語言偏好或儲存隱私選擇，不能在此關閉。",
    gpc: "偵測到瀏覽器全域隱私控制或 Do Not Track，非必要外掛預設保持關閉；你仍可以管理偏好。",
    analyticsTitle: "分析",
    analyticsDescription: "幫助了解訪問量和效能，不用於廣告定向或跨站追蹤。"
  },
  en: {
    bannerTitle: "Privacy Choices",
    bannerMessage: "Optional analytics plugins are off by default. You can keep only required services, accept all, or manage preferences.",
    rejectAll: "Only necessary",
    acceptAll: "Accept all",
    customize: "Manage preferences",
    save: "Save choices",
    close: "Close",
    preferences: "Privacy Preference Center",
    settings: "Privacy settings",
    required: "Required",
    optional: "Optional",
    requiredServicesTitle: "Required services",
    requiredServicesDescription: "These services provide the requested site, security, session, language preference, or privacy-choice storage and cannot be turned off here.",
    gpc: "A browser Global Privacy Control or Do Not Track signal was detected, so optional plugins start off by default; you can still manage preferences.",
    analyticsTitle: "Analytics",
    analyticsDescription: "Helps understand visits and performance. It is not used for targeted advertising or cross-site tracking."
  }
};

const state = {
  activeLang: "zh-CN",
  ui: structuredClone(labels),
  requiredServices: [
    {
      id: "privacy-choice-storage",
      name: "Privacy choice storage",
      disclosure: {
        "zh-CN": "用于记住本浏览器中的仅最小必要、全部接受或自定义偏好，避免刷新后重复显示横幅。",
        "zh-TW": "用於記住本瀏覽器中的僅最小必要、全部接受或自訂偏好，避免重新整理後重複顯示橫幅。",
        en: "Remembers the only-necessary, accept-all, or custom preference in this browser so the banner does not repeat on every refresh."
      }
    },
    {
      id: "site-operation-security-session",
      name: "Site operation, security, and session",
      disclosure: {
        "zh-CN": "用于提供请求页面、账户登录状态、基础安全防护、语言偏好和服务连续性。",
        "zh-TW": "用於提供要求頁面、帳戶登入狀態、基礎安全防護、語言偏好與服務連續性。",
        en: "Supports requested pages, account login state, basic security protections, language preference, and service continuity."
      }
    }
  ],
  plugins: [
    {
      id: "cloudflare-web-analytics",
      name: "Cloudflare Web Analytics",
      src: "https://static.cloudflareinsights.com/beacon.min.js",
      category: "analytics",
      token: "YOUR_TOKEN",
      disclosure: {
        "zh-CN": "用于统计页面访问量和性能，不用于定向广告。",
        "zh-TW": "用於統計頁面訪問量和效能，不用於廣告定向。",
        en: "Measures page visits and performance. It is not used for targeted advertising."
      }
    }
  ]
};

const form = document.querySelector("#builder-form");
const requiredList = document.querySelector("#required-list");
const pluginList = document.querySelector("#plugin-list");
const output = document.querySelector("#config-json");
const snippet = document.querySelector("#snippet");
const importDialog = document.querySelector("#import-dialog");
const importSource = document.querySelector("#import-source");

function activeCopy() {
  return state.ui[state.activeLang];
}

function hydrateLanguageFields() {
  const copy = activeCopy();
  for (const field of ["bannerTitle", "bannerMessage", "rejectAll", "acceptAll", "gpc"]) {
    form.elements[field].value = copy[field] || "";
  }
}

function syncLanguageFields() {
  const copy = activeCopy();
  for (const field of ["bannerTitle", "bannerMessage", "rejectAll", "acceptAll", "gpc"]) {
    copy[field] = form.elements[field].value;
  }
  copy.customize ||= labels[state.activeLang].customize;
  copy.save ||= labels[state.activeLang].save;
  copy.close ||= labels[state.activeLang].close;
  copy.preferences ||= labels[state.activeLang].preferences;
  copy.settings ||= labels[state.activeLang].settings;
  copy.required ||= labels[state.activeLang].required;
  copy.optional ||= labels[state.activeLang].optional;
  copy.requiredServicesTitle ||= labels[state.activeLang].requiredServicesTitle;
  copy.requiredServicesDescription ||= labels[state.activeLang].requiredServicesDescription;
  copy.categories = {
    analytics: {
      title: copy.analyticsTitle || labels[state.activeLang].analyticsTitle,
      description: copy.analyticsDescription || labels[state.activeLang].analyticsDescription
    }
  };
}

function localized(value, lang = state.activeLang) {
  if (typeof value === "string") return value;
  return value?.[lang] || value?.en || value?.["zh-CN"] || "";
}

function rowTemplate(type, item, index) {
  if (type === "required") {
    return `
      <div class="row" data-kind="required" data-index="${index}">
        <div class="row-grid">
          <label><span>ID</span><input data-field="id" value="${escapeAttr(item.id)}" /></label>
          <label><span>Name</span><input data-field="name" value="${escapeAttr(item.name)}" /></label>
        </div>
        <label><span>Disclosure</span><textarea data-field="disclosure" rows="2">${escapeHtml(localized(item.disclosure))}</textarea></label>
        <button type="button" class="ghost" data-remove>删除</button>
      </div>
    `;
  }
  return `
    <div class="row" data-kind="plugin" data-index="${index}">
      <div class="row-grid">
        <label><span>ID</span><input data-field="id" value="${escapeAttr(item.id)}" /></label>
        <label><span>Name</span><input data-field="name" value="${escapeAttr(item.name)}" /></label>
        <label><span>Script URL</span><input data-field="src" value="${escapeAttr(item.src)}" /></label>
        <label><span>Category</span><input data-field="category" value="${escapeAttr(item.category)}" /></label>
      </div>
      <label><span>Cloudflare token / data-cf-beacon token</span><input data-field="token" value="${escapeAttr(item.token || "")}" /></label>
      <label><span>Disclosure</span><textarea data-field="disclosure" rows="2">${escapeHtml(localized(item.disclosure))}</textarea></label>
      <button type="button" class="ghost" data-remove>删除</button>
    </div>
  `;
}

function renderRows() {
  requiredList.innerHTML = state.requiredServices.map((item, index) => rowTemplate("required", item, index)).join("");
  pluginList.innerHTML = state.plugins.map((item, index) => rowTemplate("plugin", item, index)).join("");
}

function syncRows() {
  document.querySelectorAll("[data-kind]").forEach((row) => {
    const list = row.dataset.kind === "required" ? state.requiredServices : state.plugins;
    const item = list[Number(row.dataset.index)];
    if (!item) return;
    row.querySelectorAll("[data-field]").forEach((input) => {
      const field = input.dataset.field;
      if (field === "disclosure") {
        item.disclosure = { ...(typeof item.disclosure === "object" ? item.disclosure : {}), [state.activeLang]: input.value };
      } else {
        item[field] = input.value;
      }
    });
  });
}

function pluginToConfig(plugin) {
  const attributes = { defer: true };
  if (plugin.token) attributes["data-cf-beacon"] = JSON.stringify({ token: plugin.token });
  return {
    id: plugin.id,
    name: plugin.name,
    enabled: true,
    type: "script",
    src: plugin.src,
    attributes,
    disclosure: plugin.disclosure,
    policy: {
      category: plugin.category || "analytics",
      consentMode: "always-prompt"
    }
  };
}

function buildConfig() {
  syncLanguageFields();
  syncRows();
  const ui = {};
  for (const lang of langs) {
    const copy = { ...state.ui[lang] };
    copy.categories = {
      analytics: {
        title: copy.analyticsTitle || labels[lang].analyticsTitle,
        description: copy.analyticsDescription || labels[lang].analyticsDescription
      }
    };
    delete copy.analyticsTitle;
    delete copy.analyticsDescription;
    ui[lang] = copy;
  }
  return {
    version: 3,
    revision: new Date().toISOString().slice(0, 10),
    consent: {
      mode: "always-prompt",
      storageVersion: 4,
      globalDefault: "prompt-before-loading-optional-plugins"
    },
    ui,
    requiredServices: state.requiredServices,
    plugins: state.plugins.map(pluginToConfig)
  };
}

function renderPreview(config) {
  const copy = config.ui[state.activeLang];
  document.querySelector("#preview-title").textContent = copy.bannerTitle;
  document.querySelector("#preview-message").textContent = copy.bannerMessage;
  document.querySelector("#preview-gpc").textContent = copy.gpc;
  document.querySelector("#preview-reject").textContent = copy.rejectAll;
  document.querySelector("#preview-customize").textContent = copy.customize;
  document.querySelector("#preview-accept").textContent = copy.acceptAll;
  document.querySelector("#preference-preview").innerHTML = [
    `<div class="pref-row"><input type="checkbox" checked disabled /><div><strong>${escapeHtml(copy.requiredServicesTitle)}</strong><br /><small>${escapeHtml(copy.requiredServicesDescription)}</small></div><em>${escapeHtml(copy.required)}</em></div>`,
    ...config.plugins.map((plugin) => `<div class="pref-row"><input type="checkbox" /><div><strong>${escapeHtml(copy.categories.analytics.title)}</strong><br /><small>${escapeHtml(localized(plugin.disclosure))}</small></div><em>${escapeHtml(copy.optional)}</em></div>`)
  ].join("");
}

function refresh() {
  const config = buildConfig();
  output.value = JSON.stringify(config, null, 2);
  snippet.value = `<script src="https://privacy.js.gripe/privacy-plugin-loader.js?v=20260524v1" defer></script>`;
  renderPreview(config);
  localStorage.setItem("mycookies_builder_state_v1", JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function importConfig(config) {
  state.ui = structuredClone(labels);
  for (const lang of langs) {
    state.ui[lang] = { ...state.ui[lang], ...(config.ui?.[lang] || {}) };
    state.ui[lang].analyticsTitle = config.ui?.[lang]?.categories?.analytics?.title || labels[lang].analyticsTitle;
    state.ui[lang].analyticsDescription = config.ui?.[lang]?.categories?.analytics?.description || labels[lang].analyticsDescription;
  }
  state.requiredServices = Array.isArray(config.requiredServices) ? config.requiredServices : [];
  state.plugins = Array.isArray(config.plugins)
    ? config.plugins.map((plugin) => ({
        id: plugin.id || "",
        name: plugin.name || "",
        src: plugin.src || "",
        category: plugin.policy?.category || "analytics",
        token: parseBeaconToken(plugin.attributes?.["data-cf-beacon"]),
        disclosure: plugin.disclosure || {}
      }))
    : [];
  hydrateLanguageFields();
  renderRows();
  refresh();
}

function parseBeaconToken(value) {
  if (!value) return "";
  try {
    return JSON.parse(value).token || "";
  } catch {
    return "";
  }
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    syncLanguageFields();
    syncRows();
    state.activeLang = tab.dataset.lang;
    document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("is-active", item === tab));
    hydrateLanguageFields();
    renderRows();
    refresh();
  });
});
document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    document.body.classList.toggle("mode-simple", mode === "simple");
    document.body.classList.toggle("mode-advanced", mode === "advanced");
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

form.addEventListener("input", refresh);
requiredList.addEventListener("click", (event) => {
  if (!event.target.matches("[data-remove]")) return;
  state.requiredServices.splice(Number(event.target.closest("[data-index]").dataset.index), 1);
  renderRows();
  refresh();
});
pluginList.addEventListener("click", (event) => {
  if (!event.target.matches("[data-remove]")) return;
  state.plugins.splice(Number(event.target.closest("[data-index]").dataset.index), 1);
  renderRows();
  refresh();
});
document.querySelector("#add-required").addEventListener("click", () => {
  state.requiredServices.push({ id: "required-service", name: "Required service", disclosure: { [state.activeLang]: "" } });
  renderRows();
  refresh();
});
document.querySelector("#add-plugin").addEventListener("click", () => {
  state.plugins.push({ id: "optional-plugin", name: "Optional plugin", src: "https://example.com/plugin.js", category: "analytics", token: "", disclosure: { [state.activeLang]: "" } });
  renderRows();
  refresh();
});
document.querySelector("#reset-demo").addEventListener("click", () => {
  localStorage.removeItem("mycookies_builder_state_v1");
  window.location.reload();
});
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copy);
    await navigator.clipboard.writeText(target.value);
    button.textContent = "已复制";
    setTimeout(() => {
      button.textContent = "复制";
    }, 1100);
  });
});
document.querySelector("#download-json").addEventListener("click", () => {
  const blob = new Blob([output.value], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "privacy-plugins.json";
  link.click();
  URL.revokeObjectURL(link.href);
});
document.querySelector("#import-json").addEventListener("click", () => {
  importSource.value = output.value;
  importDialog.showModal();
});
importDialog.addEventListener("close", () => {
  if (importDialog.returnValue !== "apply") return;
  importConfig(JSON.parse(importSource.value));
});

const saved = localStorage.getItem("mycookies_builder_state_v1");
if (saved) {
  try {
    Object.assign(state, JSON.parse(saved));
  } catch {
    localStorage.removeItem("mycookies_builder_state_v1");
  }
}
hydrateLanguageFields();
renderRows();
refresh();
