const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatbox = document.getElementById("chatbox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = sessionStorage.getItem("user_id");
  if (!userId) {
    alert("Please sign in to use the chat.");
    return;
  }

  const userMessage = input.value.trim();
  if (!userMessage) return;

  const firstName = (sessionStorage.getItem("user_name") || "You").split(" ")[0];
  appendMessage(firstName, userMessage, "user");
  input.value = "";

  try {
    const res = await fetch("https://api.simplyai.ie/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        message: userMessage
      })
    });

    const data = await res.json();
    appendMessage("Pension Guru", data.response || "Something went wrong.", "planner");
  } catch (err) {
    appendMessage("Pension Guru", "⚠️ Failed to connect to server.", "planner");
  }
});

function appendMessage(sender, text, role) {
  const parts = text.split(/\n{2,}/); // split on double newlines

  parts.forEach(part => {
    const message = document.createElement("div");
    message.classList.add("message", role);
    message.innerHTML = `<strong>${sender}:</strong> ${part.trim()}`;
    chatbox.appendChild(message);
  });

  chatbox.scrollTop = chatbox.scrollHeight;
}

// Auto-trigger GPT greeting after login
window.addEventListener("DOMContentLoaded", () => {
  const userId = sessionStorage.getItem("user_id");
  if (userId) {
    fetch("https://api.simplyai.ie/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        message: "__INIT__"
      })
    })
    .then(res => res.json())
    .then(data => {
      appendMessage("Pension Guru", data.response || "Welcome!", "planner");
    });
  }
});

function triggerInitialGreeting(userId) {
  fetch("https://api.simplyai.ie/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      message: "__INIT__"
    })
  })
  .then(res => res.json())
  .then(data => {
    appendMessage("Pension Guru", data.response || "Welcome!", "planner");
  })
  .catch(err => console.error("Init message failed:", err));
}

