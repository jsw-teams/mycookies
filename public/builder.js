const langs = ["zh-CN", "zh-TW", "en"];
const chromeCopy = {
  "zh-CN": {
    documentTitle: "mycookies 隐私 Banner 构建器",
    metaDescription: "可视化构建隐私 banner 内容、必要项目和可选插件配置。",
    brandKicker: "mycookies",
    appTitle: "隐私 Banner 构建器",
    simple: "简化",
    advanced: "高级",
    export: "导出",
    components: "组件",
    addRequired: "新增必要组件",
    addOptional: "新增可选组件",
    inspector: "构建器组件",
    language: "语言",
    viewMode: "视图",
    componentType: "组件类型",
    required: "必要",
    optional: "可选",
    componentName: "组件名称",
    componentId: "组件 ID",
    privacyDisclosure: "隐私说明",
    scriptUrl: "脚本地址",
    category: "类别",
    cloudflareToken: "Cloudflare token",
    bannerCopy: "Banner 文案",
    bannerTitleLabel: "标题",
    bannerMessageLabel: "说明",
    minimumButton: "最小必要按钮",
    acceptButton: "接受按钮",
    preview: "预览",
    bannerPreview: "banner 预览",
    reset: "重置",
    close: "关闭",
    copyEmbed: "复制引用代码",
    copyConfig: "复制配置",
    downloadConfig: "下载配置",
    importConfig: "导入配置",
    embedCode: "引用代码",
    configJson: "配置 JSON",
    cancel: "取消",
    apply: "应用",
    copied: "已复制",
    requiredDefaultName: "必要服务",
    optionalDefaultName: "可选插件"
  },
  "zh-TW": {
    documentTitle: "mycookies 隱私 Banner 建構器",
    metaDescription: "視覺化建立隱私 banner 內容、必要項目與可選外掛配置。",
    brandKicker: "mycookies",
    appTitle: "隱私 Banner 建構器",
    simple: "簡化",
    advanced: "進階",
    export: "匯出",
    components: "組件",
    addRequired: "新增必要組件",
    addOptional: "新增可選組件",
    inspector: "建構器組件",
    language: "語言",
    viewMode: "檢視",
    componentType: "組件類型",
    required: "必要",
    optional: "可選",
    componentName: "組件名稱",
    componentId: "組件 ID",
    privacyDisclosure: "隱私說明",
    scriptUrl: "腳本地址",
    category: "類別",
    cloudflareToken: "Cloudflare token",
    bannerCopy: "Banner 文案",
    bannerTitleLabel: "標題",
    bannerMessageLabel: "說明",
    minimumButton: "最小必要按鈕",
    acceptButton: "接受按鈕",
    preview: "預覽",
    bannerPreview: "banner 預覽",
    reset: "重設",
    close: "關閉",
    copyEmbed: "複製引用碼",
    copyConfig: "複製配置",
    downloadConfig: "下載配置",
    importConfig: "匯入配置",
    embedCode: "引用碼",
    configJson: "配置 JSON",
    cancel: "取消",
    apply: "套用",
    copied: "已複製",
    requiredDefaultName: "必要服務",
    optionalDefaultName: "可選外掛"
  },
  en: {
    documentTitle: "mycookies Privacy Banner Builder",
    metaDescription: "Visually build privacy banner copy, required services, and optional plugin configuration.",
    brandKicker: "mycookies",
    appTitle: "Privacy Banner Builder",
    simple: "Simple",
    advanced: "Advanced",
    export: "Export",
    components: "Components",
    addRequired: "Add required component",
    addOptional: "Add optional component",
    inspector: "Builder Component",
    language: "Language",
    viewMode: "View",
    componentType: "Component type",
    required: "Required",
    optional: "Optional",
    componentName: "Component name",
    componentId: "Component ID",
    privacyDisclosure: "Privacy disclosure",
    scriptUrl: "Script URL",
    category: "Category",
    cloudflareToken: "Cloudflare token",
    bannerCopy: "Banner copy",
    bannerTitleLabel: "Title",
    bannerMessageLabel: "Description",
    minimumButton: "Only-necessary button",
    acceptButton: "Accept button",
    preview: "Preview",
    bannerPreview: "banner preview",
    reset: "Reset",
    close: "Close",
    copyEmbed: "Copy embed code",
    copyConfig: "Copy config",
    downloadConfig: "Download config",
    importConfig: "Import config",
    embedCode: "Embed code",
    configJson: "Config JSON",
    cancel: "Cancel",
    apply: "Apply",
    copied: "Copied",
    requiredDefaultName: "Required service",
    optionalDefaultName: "Optional plugin"
  }
};
const copyDefaults = {
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
    categories: {
      analytics: {
        title: "分析",
        description: "帮助了解页面访问量和性能，不用于定向广告。"
      }
    }
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
    categories: {
      analytics: {
        title: "分析",
        description: "幫助了解頁面訪問量和效能，不用於廣告定向。"
      }
    }
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
    categories: {
      analytics: {
        title: "Analytics",
        description: "Helps understand page visits and site performance. It is not used for targeted advertising."
      }
    }
  }
};

const state = {
  activeLang: detectLang(),
  selectedId: "privacy-choice-storage",
  ui: structuredClone(copyDefaults),
  components: [
    {
      id: "privacy-choice-storage",
      kind: "required",
      name: "Privacy choice storage",
      disclosure: {
        "zh-CN": "用于记住本浏览器中的仅最小必要、全部接受或自定义偏好，避免刷新后重复显示横幅。",
        "zh-TW": "用於記住本瀏覽器中的僅最小必要、全部接受或自訂偏好，避免重新整理後重複顯示橫幅。",
        en: "Remembers the only-necessary, accept-all, or custom preference in this browser so the banner does not repeat on every refresh."
      }
    },
    {
      id: "site-operation-security-session",
      kind: "required",
      name: "Site operation, security, and session",
      disclosure: {
        "zh-CN": "用于提供请求页面、账户登录状态、基础安全防护、语言偏好和服务连续性。",
        "zh-TW": "用於提供要求頁面、帳戶登入狀態、基礎安全防護、語言偏好與服務連續性。",
        en: "Supports requested pages, account login state, basic security protections, language preference, and service continuity."
      }
    },
    {
      id: "cloudflare-web-analytics",
      kind: "optional",
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

const form = document.querySelector("#component-form");
const componentList = document.querySelector("#component-list");
const exportDialog = document.querySelector("#export-dialog");
const importDialog = document.querySelector("#import-dialog");
const configJson = document.querySelector("#config-json");
const importSource = document.querySelector("#import-source");
const snippet = document.querySelector("#snippet");

function detectLang() {
  if (typeof navigator === "undefined") return "zh-CN";
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    const value = String(candidate || "").toLowerCase();
    if (value === "zh-tw" || value === "zh-hk" || value === "zh-mo" || value.startsWith("zh-hant")) return "zh-TW";
    if (value === "zh-cn" || value === "zh-sg" || value.startsWith("zh-hans") || value === "zh") return "zh-CN";
    if (value.startsWith("en")) return "en";
  }
  return "zh-CN";
}

function chrome() {
  return chromeCopy[state.activeLang] || chromeCopy.en;
}

function applyChrome() {
  const text = chrome();
  document.documentElement.lang = state.activeLang;
  document.title = text.documentTitle;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = text.metaDescription;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (text[key]) element.textContent = text[key];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.dataset.i18nAria;
    if (text[key]) element.setAttribute("aria-label", text[key]);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    const key = element.dataset.i18nTitle;
    if (text[key]) element.title = text[key];
  });
  document.querySelectorAll("[data-lang]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.lang === state.activeLang);
  });
}

function selectedComponent() {
  return state.components.find((component) => component.id === state.selectedId) || state.components[0];
}

function localized(value, lang = state.activeLang) {
  if (typeof value === "string") return value;
  return value?.[lang] || value?.en || value?.["zh-CN"] || "";
}

function setLocalized(target, value) {
  return { ...(typeof target === "object" ? target : {}), [state.activeLang]: value };
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

function slugify(value, fallback) {
  const slug = String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || fallback;
}

function ensureUniqueId(base) {
  let id = base;
  let index = 2;
  while (state.components.some((component) => component.id === id)) {
    id = `${base}-${index}`;
    index += 1;
  }
  return id;
}

function syncFormToState() {
  const component = selectedComponent();
  if (!component) return;
  const data = new FormData(form);
  const nextKind = data.get("componentKind");
  const nextId = slugify(data.get("componentId"), component.id);
  if (nextId !== component.id && !state.components.some((item) => item !== component && item.id === nextId)) {
    component.id = nextId;
    state.selectedId = nextId;
  }
  component.kind = nextKind;
  component.name = data.get("componentName") || component.name;
  component.disclosure = setLocalized(component.disclosure, data.get("componentDisclosure") || "");
  if (component.kind === "optional") {
    component.src = data.get("componentSrc") || "";
    component.category = data.get("componentCategory") || "analytics";
    component.token = data.get("componentToken") || "";
  }

  const copy = state.ui[state.activeLang];
  copy.bannerTitle = data.get("bannerTitle") || copy.bannerTitle;
  copy.bannerMessage = data.get("bannerMessage") || copy.bannerMessage;
  copy.rejectAll = data.get("rejectAll") || copy.rejectAll;
  copy.acceptAll = data.get("acceptAll") || copy.acceptAll;
}

function renderComponentList() {
  const text = chrome();
  componentList.innerHTML = state.components.map((component) => `
    <button type="button" class="component-card${component.id === state.selectedId ? " is-active" : ""}" data-select="${escapeHtml(component.id)}">
      <span class="badge ${component.kind === "optional" ? "optional" : ""}">${component.kind === "required" ? text.required : text.optional}</span>
      <strong>${escapeHtml(component.name)}</strong>
      <small>${escapeHtml(component.id)}</small>
    </button>
  `).join("");
}

function renderForm() {
  const component = selectedComponent();
  if (!component) return;
  form.dataset.kind = component.kind;
  form.elements.componentKind.value = component.kind;
  form.elements.componentName.value = component.name || "";
  form.elements.componentId.value = component.id || "";
  form.elements.componentDisclosure.value = localized(component.disclosure);
  form.elements.componentSrc.value = component.src || "";
  form.elements.componentCategory.value = component.category || "analytics";
  form.elements.componentToken.value = component.token || "";
  const copy = state.ui[state.activeLang];
  form.elements.bannerTitle.value = copy.bannerTitle;
  form.elements.bannerMessage.value = copy.bannerMessage;
  form.elements.rejectAll.value = copy.rejectAll;
  form.elements.acceptAll.value = copy.acceptAll;
}

function componentToPlugin(component) {
  const attributes = { defer: true };
  if (component.token) attributes["data-cf-beacon"] = JSON.stringify({ token: component.token });
  return {
    id: component.id,
    name: component.name,
    enabled: true,
    type: "script",
    src: component.src,
    attributes,
    disclosure: component.disclosure,
    policy: {
      category: component.category || "analytics",
      consentMode: "always-prompt"
    }
  };
}

function buildConfig() {
  const requiredServices = state.components
    .filter((component) => component.kind === "required")
    .map(({ id, name, disclosure }) => ({ id, name, disclosure }));
  const plugins = state.components
    .filter((component) => component.kind === "optional")
    .map(componentToPlugin);
  return {
    version: 3,
    revision: new Date().toISOString().slice(0, 10),
    consent: {
      mode: "always-prompt",
      storageVersion: 4,
      globalDefault: "prompt-before-loading-optional-plugins"
    },
    ui: state.ui,
    requiredServices,
    plugins
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
    ...config.plugins.map((plugin) => `<div class="pref-row"><input type="checkbox" /><div><strong>${escapeHtml(plugin.name)}</strong><br /><small>${escapeHtml(localized(plugin.disclosure))}</small></div><em>${escapeHtml(copy.optional)}</em></div>`)
  ].join("");
}

function refresh() {
  const config = buildConfig();
  applyChrome();
  configJson.value = JSON.stringify(config, null, 2);
  snippet.value = '<script src="https://privacy.js.gripe/privacy-plugin-loader.js?v=20260524v2" defer></script>';
  renderComponentList();
  renderPreview(config);
  localStorage.setItem("mycookies_builder_state_v2", JSON.stringify(state));
}

function loadSavedState() {
  const saved = localStorage.getItem("mycookies_builder_state_v2");
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.components)) Object.assign(state, parsed);
  } catch {
    localStorage.removeItem("mycookies_builder_state_v2");
  }
}

function addComponent(kind) {
  syncFormToState();
  const text = chrome();
  const id = ensureUniqueId(kind === "required" ? "required-service" : "optional-plugin");
  state.components.push({
    id,
    kind,
    name: kind === "required" ? text.requiredDefaultName : text.optionalDefaultName,
    src: kind === "optional" ? "https://example.com/plugin.js" : "",
    category: "analytics",
    token: "",
    disclosure: { [state.activeLang]: "" }
  });
  state.selectedId = id;
  renderForm();
  refresh();
}

function importConfig(config) {
  state.ui = { ...structuredClone(copyDefaults), ...(config.ui || {}) };
  state.components = [
    ...(config.requiredServices || []).map((item) => ({
      id: item.id,
      kind: "required",
      name: item.name,
      disclosure: item.disclosure || {}
    })),
    ...(config.plugins || []).map((plugin) => ({
      id: plugin.id,
      kind: "optional",
      name: plugin.name,
      src: plugin.src || "",
      category: plugin.policy?.category || "analytics",
      token: parseBeaconToken(plugin.attributes?.["data-cf-beacon"]),
      disclosure: plugin.disclosure || {}
    }))
  ];
  state.selectedId = state.components[0]?.id || "";
  renderForm();
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

componentList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-select]");
  if (!card) return;
  syncFormToState();
  state.selectedId = card.dataset.select;
  renderForm();
  refresh();
});

form.addEventListener("input", () => {
  syncFormToState();
  refresh();
});

document.querySelector("#add-required").addEventListener("click", () => addComponent("required"));
document.querySelector("#add-optional").addEventListener("click", () => addComponent("optional"));
document.querySelector("#reset-demo").addEventListener("click", () => {
  localStorage.removeItem("mycookies_builder_state_v2");
  window.location.reload();
});

document.querySelectorAll("[data-lang]").forEach((tab) => {
  tab.addEventListener("click", () => {
    syncFormToState();
    state.activeLang = tab.dataset.lang;
    renderForm();
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

document.querySelector("#open-export").addEventListener("click", () => exportDialog.showModal());
document.querySelector("#import-json").addEventListener("click", () => {
  importSource.value = configJson.value;
  importDialog.showModal();
});
importDialog.addEventListener("close", () => {
  if (importDialog.returnValue !== "apply") return;
  importConfig(JSON.parse(importSource.value));
});
document.querySelector("#download-json").addEventListener("click", () => {
  const blob = new Blob([configJson.value], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "privacy-plugins.json";
  link.click();
  URL.revokeObjectURL(link.href);
});
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copy);
    await navigator.clipboard.writeText(target.value);
    const original = button.textContent;
    button.textContent = chrome().copied;
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  });
});

loadSavedState();
renderForm();
refresh();
