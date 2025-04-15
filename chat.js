const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatbox = document.getElementById("chatbox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("You", userMessage, "user");
  input.value = "";

  try {
    const res = await fetch("https://api.simplyai.ie/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "frontend-test-user",
        message: userMessage
      })
    });

    const data = await res.json();
    appendMessage("Planner", data.response || "Something went wrong.", "planner");
  } catch (err) {
    appendMessage("Planner", "⚠️ Failed to connect to server.", "planner");
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
