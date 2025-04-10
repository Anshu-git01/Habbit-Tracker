document.addEventListener('DOMContentLoaded', () => {
  const chatOutput = document.getElementById("chat-output");
  const userInput = document.getElementById("user-input");
  const typingIndicator = document.getElementById("typing-indicator");
  const themeToggle = document.getElementById("theme-toggle");
  function autoResize(textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  function appendMessage(text, isUser = false) {
    const div = document.createElement("div");
    div.className = `message ${isUser ? "user-message" : "bot-message"}`;
    div.textContent = text;
    chatOutput.appendChild(div);
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }

  function showTyping() {
    typingIndicator.classList.remove("hidden");
  }

  function hideTyping() {
    typingIndicator.classList.add("hidden");
  }

  async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    appendMessage(input, true);
    userInput.value = "";
    showTyping();

    try {
      const res = await axios.post("/chat", { message: input });
      appendMessage(res.data.reply);
    } catch (err) {
      appendMessage("⚠️ Couldn't reach Gemini AI.");
    }

    hideTyping();
  }

  document.querySelector(".input-container button").addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  });

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }

  appendMessage("👋 Hello! I'm your AI habit assistant. Ask me anything like 'create reading habit' or 'suggest a new one'");
});
