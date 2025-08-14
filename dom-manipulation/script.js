// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");

// Initialize quotes array, loading from localStorage if available
let quotes = loadQuotesFromStorage() || [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Motivation" }
];

// Load quotes from localStorage
function loadQuotesFromStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  return storedQuotes ? JSON.parse(storedQuotes) : null;
}

// Save quotes to localStorage
function saveQuotesToStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  let filteredQuotes = quotes;

  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotesToStorage();
  updateCategoryOptions();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added successfully!");
  showRandomQuote();
}

// Update category filter options
function updateCategoryOptions() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => 
    `<option value="${cat.toLowerCase()}">${cat}</option>`
  ).join("");
}

// Create form for adding quotes (alternative approach)
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.className = "quote-form-container";
  formContainer.innerHTML = `
    <h3>Add New Quote</h3>
    <div class="form-group">
      <label for="newQuoteText">Quote Text:</label>
      <textarea id="newQuoteText" rows="3" required></textarea>
    </div>
    <div class="form-group">
      <label for="newQuoteCategory">Category:</label>
      <input type="text" id="newQuoteCategory" required>
    </div>
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
}

// Initialize the application
function init() {
  updateCategoryOptions();
  showRandomQuote();
  
  // Event Listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  categoryFilter.addEventListener("change", showRandomQuote);
  
  // Optional: Uncomment if you want the dynamic form
  // createAddQuoteForm();
}

// Run initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", init);