const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatbox = document.getElementById("chatbox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("You", userMessage);
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
    appendMessage("Planner", data.response || "Something went wrong.");
  } catch (err) {
    appendMessage("Planner", "⚠️ Failed to connect to server.");
  }
});

function appendMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message");
  message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatbox.appendChild(message);
  chatbox.scrollTop = chatbox.scrollHeight;
}
