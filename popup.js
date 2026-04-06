const btn = document.getElementById("toggleBtn");
const counterText = document.getElementById("counter");

// Load state + counter
chrome.storage.local.get(["enabled", "count"]).then((result) => {
  const enabled = result.enabled ?? true;
  const count = result.count ?? 0;

  updateButton(enabled);
  counterText.textContent = `Replacements: ${count}`;
});

// Toggle ON/OFF
btn.addEventListener("click", () => {
  chrome.storage.local.get("enabled").then((result) => {
    const newState = !(result.enabled ?? true);

    chrome.storage.local.set({ enabled: newState });
    updateButton(newState);
  });
});

function updateButton(enabled) {
  btn.textContent = enabled ? "ON " : "OFF ";
}