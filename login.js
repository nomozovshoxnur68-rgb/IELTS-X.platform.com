/*
 * IELTSX — login page (assets/js/login.js)
 * One module for: saved accounts, Telegram button and email login / register.
 * (site-access.js still handles Google + quick-login on its own.)
 */
import { getKnownAccounts, removeKnownAccount, login, register } from "../../auth.js";

const $ = (selector) => document.querySelector(selector);

/* ───────────── Saved accounts ───────────── */
function readAccounts() {
    try {
        const accounts = getKnownAccounts();
        return Array.isArray(accounts) ? accounts : [];
    } catch (e) {
        console.warn("Saved accounts could not be read:", e);
        return [];
    }
}

function buildAccountRow(account) {
    const row = document.createElement("div");
    row.className = "flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition";

    const info = document.createElement("button");
    info.type = "button";
    info.className = "flex-1 flex items-center gap-3 text-left";
    info.setAttribute("data-quick-login", "true");
    info.setAttribute("data-account-uid", account.uid || "");
    info.setAttribute("data-account-email", account.email || "");
    info.setAttribute("data-account-name", account.displayName || "User");

    if (account.photoURL) {
        const photo = document.createElement("img");
        photo.src = account.photoURL;
        photo.alt = "";
        photo.loading = "lazy";
        photo.referrerPolicy = "no-referrer";
        photo.className = "w-8 h-8 rounded-full object-cover";
        info.appendChild(photo);
    } else {
        const avatar = document.createElement("div");
        avatar.className = "w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold";
        avatar.textContent = (account.displayName || "?").charAt(0).toUpperCase();
        info.appendChild(avatar);
    }

    const text = document.createElement("div");
    text.className = "flex-1 min-w-0";

    const name = document.createElement("div");
    name.className = "text-sm font-medium text-gray-900";
    name.textContent = account.displayName || "User";
    text.appendChild(name);

    const email = document.createElement("div");
    email.className = "text-xs text-gray-500 truncate";
    email.textContent = account.email || "";
    text.appendChild(email);

    if (account.premium) {
        const premium = document.createElement("div");
        premium.className = "mt-1 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700";
        premium.innerHTML = "&#128081; Premium";
        text.appendChild(premium);
    }
    info.appendChild(text);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition";
    removeBtn.title = "O'chirish";
    removeBtn.setAttribute("aria-label", "O'chirish");
    removeBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`${account.displayName || "User"} hisobini o'chirasizmi?`)) {
            removeKnownAccount(account.uid);
            renderSavedAccounts();
        }
    });

    row.appendChild(info);
    row.appendChild(removeBtn);
    return row;
}

function renderSavedAccounts() {
    const container = $("#saved-accounts-container");
    const list = $("#saved-accounts-list");
    if (!container || !list) return;

    const accounts = readAccounts();
    if (accounts.length === 0) {
        container.classList.add("hidden");
        list.replaceChildren();
        return;
    }

    const fragment = document.createDocumentFragment();
    accounts.forEach((account) => fragment.appendChild(buildAccountRow(account)));
    list.replaceChildren(fragment);
    container.classList.remove("hidden");

    // site-access.js listens for this to attach the quick-login handlers
    document.dispatchEvent(new CustomEvent("saved-accounts-rendered"));
}

/* ───────────── Telegram ───────────── */
$("#telegram-btn")?.addEventListener("click", () => {
    alert("Telegram login coming soon.");
});

/* ───────────── Email login / register ───────────── */
const form = $("#ieltsx-auth-form");
const nameInput = $("#ieltsx-name");
const emailInput = $("#ieltsx-email");
const passwordInput = $("#ieltsx-password");
const registerBtn = $("#ieltsx-register");
const loginBtn = form?.querySelector('button[type="submit"]');
const errorBox = $("#ieltsx-auth-error");

const ERROR_MESSAGES = {
    "auth/invalid-email": "Email address is not valid.",
    "auth/missing-email": "Please enter your email.",
    "auth/missing-password": "Please enter your password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-login-credentials": "Incorrect email or password.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/email-already-in-use": "This email is already registered. Try logging in.",
    "auth/weak-password": "Password is too weak. Use at least 8 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait a bit and try again.",
    "auth/network-request-failed": "Network error. Check your connection and try again."
};

function errorText(error) {
    return ERROR_MESSAGES[error && error.code] ||
        (error && error.message) ||
        "Something went wrong. Please try again.";
}

function showError(message) {
    if (errorBox) errorBox.textContent = message || "";
}

let busy = false;
const labels = new Map();

function setBusy(on, activeBtn) {
    busy = on;
    form?.setAttribute("aria-busy", on ? "true" : "false");
    [loginBtn, registerBtn].forEach((btn) => {
        if (!btn) return;
        if (!labels.has(btn)) labels.set(btn, btn.textContent);
        btn.disabled = on;
        btn.textContent = on && btn === activeBtn ? "Please wait…" : labels.get(btn);
    });
}

async function runAuth(action, activeBtn) {
    if (busy) return;
    showError("");
    setBusy(true, activeBtn);
    try {
        await action();
        location.href = "index.html";
    } catch (error) {
        showError(errorText(error));
        setBusy(false);
    }
}

form?.addEventListener("submit", (e) => {
    e.preventDefault();
    runAuth(() => login(emailInput.value.trim(), passwordInput.value), loginBtn);
});

registerBtn?.addEventListener("click", () => {
    // this button is type="button", so run the browser validation by hand
    if (!form.reportValidity()) return;
    if (!nameInput.value.trim()) {
        showError("Please enter your full name to register.");
        nameInput.focus();
        return;
    }
    runAuth(() => register(nameInput.value.trim(), emailInput.value.trim(), passwordInput.value), registerBtn);
});

// coming back with the browser's Back button must not leave the buttons disabled
window.addEventListener("pageshow", (e) => {
    if (e.persisted) setBusy(false);
});

renderSavedAccounts();
