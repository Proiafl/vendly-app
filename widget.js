/*! Vendly chat widget loader. Usage:
 *  <script src="https://<your-vendly-host>/widget.js" data-key="<public key>" async></script>
 * It only injects a button and an iframe served from the Vendly origin; chat content never runs in the host page. */
(function () {
  "use strict";
  var script = document.currentScript;
  if (!script || window.__vendlyWidget) return;
  var key = script.getAttribute("data-key") || "";
  if (!/^[0-9a-f]{24}$/.test(key)) return;
  window.__vendlyWidget = true;

  var origin;
  try { origin = new URL(script.src).origin; } catch (e) { return; }
  var color = /^#[0-9a-fA-F]{6}$/.test(script.getAttribute("data-color") || "") ? script.getAttribute("data-color") : "#10b981";
  var label = (script.getAttribute("data-label") || "Chatear con nosotros").slice(0, 60);
  var open = false;
  var frame = null;

  var button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-expanded", "false");
  button.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:2147483646;width:56px;height:56px;border-radius:50%;border:0;cursor:pointer;" +
    "background:" + color + ";color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:0";
  button.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 20l1.1-4.7A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>';

  function layout() {
    if (!frame) return;
    var small = window.innerWidth < 480;
    frame.style.cssText = "position:fixed;z-index:2147483647;border:0;background:#fff;box-shadow:0 8px 32px rgba(0,0,0,.3);" +
      (small ? "inset:0;width:100%;height:100%;border-radius:0" : "right:20px;bottom:88px;width:370px;height:min(560px,calc(100vh - 110px));border-radius:16px") +
      ";display:" + (open ? "block" : "none");
  }

  function toggle(next) {
    open = typeof next === "boolean" ? next : !open;
    if (open && !frame) {
      frame = document.createElement("iframe");
      frame.title = label;
      frame.setAttribute("allow", "");
      frame.src = origin + "/widget/?k=" + encodeURIComponent(key) + "&h=" + encodeURIComponent(location.origin);
      document.body.appendChild(frame);
    }
    layout();
    button.setAttribute("aria-expanded", String(open));
    button.style.display = open && window.innerWidth < 480 ? "none" : "flex";
    if (open && frame) frame.focus();
    else button.focus();
  }

  button.addEventListener("click", function () { toggle(); });
  window.addEventListener("resize", function () { layout(); button.style.display = open && window.innerWidth < 480 ? "none" : "flex"; });
  window.addEventListener("message", function (e) {
    if (e.origin !== origin || !e.data || e.data.source !== "vendly-widget") return;
    if (e.data.type === "close") toggle(false);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) toggle(false); });

  document.body.appendChild(button);
})();
