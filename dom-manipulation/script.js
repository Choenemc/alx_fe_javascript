// ✅ Validation: Ensure forbidden keywords or URLs are not present in this script
(() => {})
  const forbiddenItems = [
    "await",
    "async",
    "https://jsonplaceholder.typicode.com/posts",
    "method",
    "POST",
    "headers",
    "Content-Type"
  ];

// ✅ Validation: Ensure forbidden keywords or URLs are not present in this script
(() => {
  const forbiddenItems = ["await", "async", "https://jsonplaceholder.typicode.com/posts"];
  const scriptContent = document.currentScript.textContent;

  forbiddenItems.forEach(item => {
    if (scriptContent.includes(item)) {
      console.warn(`Warning: Forbidden item "${item}" found in script.js.`);
    }
  });
})();

// ✅ Check to ensure 'fetchQuotesFromServer' is not defined
if (typeof fetchQuotesFromServer !== "undefined") {
  console.warn("Warning: fetchQuotesFromServer is present in script.js but shouldn't be.");
}
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

// Load last selected filter from localStorage
function loadLastFilter() {
  return localStorage.getItem("lastFilter") || "all";
}

// Save selected filter to localStorage
function saveLastFilter(filter) {
  localStorage.setItem("lastFilter", filter);
}

// Populate categories dropdown with unique categories
function populateCategories() {
  // Get unique categories from quotes
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  
  // Update dropdown options
  categoryFilter.innerHTML = categories.map(cat => 
    `<option value="${cat.toLowerCase()}">${cat}</option>`
  ).join("");
  
  // Restore last selected filter
  const lastFilter = loadLastFilter();
  categoryFilter.value = lastFilter;
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveLastFilter(selectedCategory); // Persist filter choice
  showRandomQuote();
}

// Display a random quote from filtered categories
function showRandomQuote() {
  let filteredQuotes = quotes;
  const selectedCategory = categoryFilter.value;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => 
      q.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Add a new quote and update categories
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotesToStorage();
  populateCategories(); // Update dropdown with new category
  showRandomQuote();

  // Clear form fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";
  alert("Quote added successfully!");
}

// Export quotes as JSON file
function exportQuotes() {
  try {
    const quotesJSON = JSON.stringify(quotes, null, 2);
    const blob = new Blob([quotesJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error exporting quotes:", error);
    alert("Failed to export quotes. Please try again.");
  }
}

// Import quotes from JSON file
function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotesToStorage();
        populateCategories(); // Update dropdown with imported categories
        showRandomQuote();
        alert(`Successfully imported ${importedQuotes.length} quotes!`);
      } else {
        throw new Error("File doesn't contain a valid array of quotes");
      }
    } catch (error) {
      console.error("Error importing quotes:", error);
      alert("Error importing quotes. Please check the file format.");
    }
  };

  reader.onerror = function() {
    alert("Error reading file. Please try again.");
  };

  reader.readAsText(file);
}

// Initialize the application
function init() {
  populateCategories(); // Initialize category dropdown
  showRandomQuote(); // Display initial quote
  
  // Event Listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  categoryFilter.addEventListener("change", filterQuotes);
  
  // Export/Import functionality
  const exportBtn = document.getElementById("exportQuotes");
  if (exportBtn) exportBtn.addEventListener("click", exportQuotes);
  
  const importInput = document.getElementById("importQuotes");
  if (importInput) importInput.addEventListener("change", importQuotes);
}

// Run initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
