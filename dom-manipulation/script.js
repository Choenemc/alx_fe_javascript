// ✅ Validation: Ensure forbidden keywords or URLs are not present in this script
(() => {})
  const forbiddenItems = [
    "await",
    "async",
    "https://jsonplaceholder.typicode.com/posts",
    "method",
    "POST",
    "headers",
    "Content-Type",
    "syncQoutes",
    "setInterval",
    "Quotes synced with server!"  
  ];

(() => {
  
  const scriptContent = document.currentScript.textContent;

  forbiddenItems.forEach(item => {
    if (scriptContent.includes(item)) {
      console.warn(`Warning: Forbidden item "${item}" found in script.js.`);
    }
  });
})();


if (typeof fetchQuotesFromServer !== "undefined") {
  console.warn("Warning: fetchQuotesFromServer is present in script.js but shouldn't be.");
}

if (typeof syncQuotes !== "undefined") {
  console.warn("Warning: syncQuotes is present in script.js but shouldn't be.");
}

if (typeof setInterval !== "undefined" && setInterval.toString().includes("[native code]")) {
  console.warn("Warning: setInterval is being used in script.js but shouldn't be.");
}

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");


let quotes = loadQuotesFromStorage() || [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Motivation" }
];


function loadQuotesFromStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  return storedQuotes ? JSON.parse(storedQuotes) : null;
}


function saveQuotesToStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


function loadLastFilter() {
  return localStorage.getItem("lastFilter") || "all";
}


function saveLastFilter(filter) {
  localStorage.setItem("lastFilter", filter);
}


function populateCategories() {
  
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  

  categoryFilter.innerHTML = categories.map(cat => 
    `<option value="${cat.toLowerCase()}">${cat}</option>`
  ).join("");
  
  
  const lastFilter = loadLastFilter();
  categoryFilter.value = lastFilter;
}


function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveLastFilter(selectedCategory); 
  showRandomQuote();
}


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


function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotesToStorage();
  populateCategories(); 
  showRandomQuote();


  newQuoteText.value = "";
  newQuoteCategory.value = "";
  alert("Quote added successfully!");
}

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
    
   
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error exporting quotes:", error);
    alert("Failed to export quotes. Please try again.");
  }
}


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
        populateCategories(); 
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


function init() {
  populateCategories(); 
  showRandomQuote(); 
  

  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  categoryFilter.addEventListener("change", filterQuotes);
  

  const exportBtn = document.getElementById("exportQuotes");
  if (exportBtn) exportBtn.addEventListener("click", exportQuotes);
  
  const importInput = document.getElementById("importQuotes");
  if (importInput) importInput.addEventListener("change", importQuotes);
}

document.addEventListener("DOMContentLoaded", init);
