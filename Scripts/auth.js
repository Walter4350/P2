const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

let isLoggedIn = false;

const overlayLogin = document.getElementById("overlay_login");
const inputLoginUsername = document.getElementById("input_login_username");
const inputLoginPassword = document.getElementById("input_login_password");
const paraLoginError = document.getElementById("para_login_error");
const buttonLoginSubmit = document.getElementById("button_login_submit");
const buttonLoginClose = document.getElementById("button_login_close");
const buttonOverlayLogin = document.getElementById("button_overlay_login");

const buttonCreateEventOpen = document.getElementById(
    "button_overlay_create_event_open",
);
const spanLoggedInLabel = document.getElementById("span_logged_in_label");

buttonOverlayLogin.addEventListener("click", () => {
    if (isLoggedIn) {
        logout();
    } else {
        openLoginOverlay();
    }
});

buttonLoginClose.addEventListener("click", closeLoginOverlay);

overlayLogin.addEventListener("click", (e) => {
    if (e.target === overlayLogin) closeLoginOverlay();
});

inputLoginPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptLogin();
});
inputLoginUsername.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptLogin();
});

buttonLoginSubmit.addEventListener("click", attemptLogin);

function attemptLogin() {
    const username = inputLoginUsername.value.trim();
    const password = inputLoginPassword.value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        login();
    } else {
        paraLoginError.textContent = "Incorrect username or password.";
        inputLoginPassword.value = "";
        inputLoginPassword.focus();
    }
}

function login() {
    isLoggedIn = true;
    closeLoginOverlay();
    updateUIForAuthState();
}

function logout() {
    isLoggedIn = false;
    updateUIForAuthState();

    const overlayCreateEvent = document.getElementById("overlay_create_event");
    const overlayEvent = document.getElementById("overlay_event");
    if (overlayCreateEvent) overlayCreateEvent.style.display = "none";
    if (overlayEvent) overlayEvent.style.display = "none";

    if (typeof displayEvents === "function") displayEvents();
}

function updateUIForAuthState() {
    if (isLoggedIn) {
        buttonCreateEventOpen.style.display = "inline-block";
        spanLoggedInLabel.style.display = "inline-block";
        buttonOverlayLogin.textContent = "Logout";
        buttonOverlayLogin.classList.add("logged_in");
    } else {
        buttonCreateEventOpen.style.display = "none";
        spanLoggedInLabel.style.display = "none";
        buttonOverlayLogin.textContent = "Login";
        buttonOverlayLogin.classList.remove("logged_in");
    }
}

function openLoginOverlay() {
    paraLoginError.textContent = "";
    inputLoginUsername.value = "";
    inputLoginPassword.value = "";
    overlayLogin.style.display = "flex";
    setTimeout(() => inputLoginUsername.focus(), 50);
}

function closeLoginOverlay() {
    overlayLogin.style.display = "none";
}

function userIsAdmin() {
    return isLoggedIn;
}
