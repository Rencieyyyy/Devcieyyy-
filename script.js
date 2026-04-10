const words = ["Web Developer", "UI/UX Designer", "Front End Developer", ];
let wi = 0, ci = 0, del = false;
const el = document.getElementById('typewriter');

function type() {
  const w = words[wi];
  
  if (!del) {
    el.textContent = w.slice(0, ++ci);
    if (ci === w.length) { 
      del = true; 
      setTimeout(type, 1600); // Pause when word is finished
      return; 
    }
  } else {
    el.textContent = w.slice(0, --ci);
    if (ci === 0) { 
      del = false; 
      wi = (wi + 1) % words.length; 
    }
  }
  
  // Dynamic speed: slower while typing, faster while deleting
  setTimeout(type, del ? 60 : 100);
}

// Ensure the DOM is loaded before starting
document.addEventListener('DOMContentLoaded', type);

// Theme Toggle logic
const btn = document.getElementById('themeBtn');
let dark = false;

btn.addEventListener('click', () => {
  dark = !dark;
  // Applying to documentElement allows CSS to use :root[data-theme="dark"]
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  btn.textContent = dark ? '☀️ Light' : '🌙 Dark'; 
});
const stats = document.querySelectorAll('.stat-number');

const countUp = (element) => {
  const target = +element.getAttribute('data-target');
  const count = +element.innerText;
  const speed = 200; // Lower is faster
  
  const inc = target / speed;

  if (count < target) {
    element.innerText = Math.ceil(count + inc);
    setTimeout(() => countUp(element), 100); // Animation speed
  } else {
    element.innerText = target;
  }
};

// Start animation only when section is visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      observer.unobserve(entry.target); // Run only once
    }
  });
}, { threshold: 1.0 });

stats.forEach(stat => observer.observe(stat));
var form = document.getElementById("my-form");
  
  async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("status");
    var data = new FormData(event.target);
    var btn = document.getElementById("submit-btn");

    btn.innerHTML = "Sending..."; // Visual feedback
    btn.disabled = true;

    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        // SUCCESS MESSAGE
        alert("Thank youuu! Your proposal has been sent successfully. ✨");
        form.reset(); // Clears the form
        btn.innerHTML = "Send Proposal";
        btn.disabled = false;
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            alert(data["errors"].map(error => error["message"]).join(", "));
          } else {
            alert("Oops! There was a problem submitting your form");
          }
        })
      }
    }).catch(error => {
      alert("Oops! There was a problem connecting to the server.");
    });
  }
  
  form.addEventListener("submit", handleSubmit)

 const API_KEY = "AIzaSyBk7RZxPdhx25cHWx86CarcuYQ2BM3bumo";

const chatWindow = document.getElementById('chat-window');
const chatContent = document.getElementById('chat-content');
const chatInput = document.getElementById('chat-input');

// Knowledge base for the AI
const portfolioData = `
    You are the AI assistant for Devcieyyy++. 
    Details: Devcieyyy++ is a developer from the Philippines. 
    Contact: renceeformanes823@gmail.com | +63 962 721 0484.
    Skills: System Building, Web Development, PHP, JS, HTML/CSS.
    Rules: Only answer questions about Devcieyyy++. Be concise and helpful.
`;

function toggleChat() {
    const isVisible = chatWindow.style.display === 'flex';
    chatWindow.style.display = isVisible ? 'none' : 'flex';
}

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    // Create typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.id = "ai-typing";
    typingDiv.innerText = "AI is thinking...";
    typingDiv.style.cssText = "font-size: 0.8rem; color: #999; margin-left: 10px;";
    chatContent.appendChild(typingDiv);
    chatContent.scrollTop = chatContent.scrollHeight;

    try {
      // Change this specific line in your script:
const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{
            parts: [{ text: `Context: ${portfolioData}\n\nUser Question: ${text}` }]
        }]
    })
});

        const data = await response.json();
        
        // Remove typing indicator safely
        const existingIndicator = document.getElementById("ai-typing");
        if (existingIndicator) existingIndicator.remove();

        if (data.error) {
            appendMessage("Error: " + data.error.message, 'ai');
            console.error("Gemini Error:", data.error);
        } else if (data.candidates && data.candidates[0].content.parts[0].text) {
            appendMessage(data.candidates[0].content.parts[0].text, 'ai');
        }
    } catch (error) {
        const existingIndicator = document.getElementById("ai-typing");
        if (existingIndicator) existingIndicator.remove();
        
        appendMessage("Connection error. If you are testing locally, try hosting the site on GitHub Pages.", 'ai');
        console.error("Fetch Error:", error);
    }
}

function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.innerText = text;
    msg.style.padding = "10px 15px";
    msg.style.borderRadius = "15px";
    msg.style.maxWidth = "85%";
    msg.style.fontSize = "0.9rem";
    msg.style.marginBottom = "5px";

    if (sender === 'user') {
        msg.style.background = "#1565C0";
        msg.style.color = "white";
        msg.style.alignSelf = "flex-end";
    } else {
        msg.style.background = "#eeeeee";
        msg.style.color = "#333";
        msg.style.alignSelf = "flex-start";
    }
    chatContent.appendChild(msg);
    chatContent.scrollTop = chatContent.scrollHeight;
}

chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});