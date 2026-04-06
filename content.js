let replaceCount = 0;

const replacements = {
  filipinx: "filipino",
  latinx: "latino",
  womxn: "women",
  pinxy: "pinoy"
  //filipinx
};

function matchCase(word, replacement) {
  if (word === word.toUpperCase()) return replacement.toUpperCase();
  if (word[0] === word[0].toUpperCase())
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  return replacement.toLowerCase();
}
const pattern = new RegExp(Object.keys(replacements).join("|"), "gi");

function replaceText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node._replaced) return;
    node._replaced = true;

    node.textContent = node.textContent.replace(pattern, (match) => {
      replaceCount++;
      const replacement = replacements[match.toLowerCase()];
      return matchCase(match, replacement);
    });
  } else {
    node.childNodes.forEach(replaceText);
  }
}

// Run only if enabled
chrome.storage.local.get(["enabled"]).then((result) => {
  const enabled = result.enabled ?? true;
  if (!enabled) return;

  // Initial run
  replaceText(document.body);

  // Observe changes (IMPORTANT for Twitter/X)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        replaceText(node);
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  chrome.storage.local.set({ count: replaceCount });
});