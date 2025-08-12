// Load quotes from local storage or use defaults
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Inspiration" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "Motivation" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Action" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "Life" },
  { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display all quotes
function displayQuotes() {
  const quotesList = document.getElementById('quotesList');
  quotesList.innerHTML = '<h3>All Quotes</h3>';
  
  quotes.forEach((quote, index) => {
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    quoteElement.innerHTML = `
      <p>"${quote.text}"</p>
      <p>- ${quote.author} (${quote.category})</p>
      <button onclick="deleteQuote(${index})">Delete</button>
    `;
    quotesList.appendChild(quoteElement);
  });
}

// Add a new quote
function addQuote(text, author, category) {
  const newQuote = { text, author, category };
  quotes.push(newQuote);
  saveQuotes();
  displayQuotes();
}

// Add quote from input fields
function addQuoteFromInput() {
  const text = document.getElementById('quoteText').value;
  const author = document.getElementById('quoteAuthor').value;
  const category = document.getElementById('quoteCategory').value;
  
  if (text) {
    addQuote(text, author || 'Unknown', category || 'Uncategorized');
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteAuthor').value = '';
    document.getElementById('quoteCategory').value = '';
  } else {
    alert('Quote text is required!');
  }
}

// Delete a quote
function deleteQuote(index) {
  if (confirm('Are you sure you want to delete this quote?')) {
    quotes.splice(index, 1);
    saveQuotes();
    displayQuotes();
  }
}

// Display random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available.</p>';
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Store in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  
  document.getElementById('quoteDisplay').innerHTML = `
    <p>"${quote.text}"</p>
    <p>- ${quote.author} (${quote.category})</p>
  `;
}

// Export to JSON file
function exportToJsonFile() {
  if (quotes.length === 0) {
    alert('No quotes to export!');
    return;
  }
  
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotes();
        displayQuotes();
        alert(`Successfully imported ${importedQuotes.length} quotes!`);
      } else {
        alert('Invalid format: Expected an array of quotes');
      }
    } catch (error) {
      alert('Error parsing JSON file: ' + error.message);
    }
  };
  fileReader.onerror = function() {
    alert('Error reading file');
  };
  fileReader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}

// Clear all quotes
function clearAllQuotes() {
  if (confirm('Are you sure you want to delete ALL quotes? This cannot be undone.')) {
    quotes = [];
    saveQuotes();
    displayQuotes();
  }
}

// Initialize the page
window.onload = function() {
  displayQuotes();
  
  // Check for last viewed quote in session storage
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById('quoteDisplay').innerHTML = `
      <p>Last viewed: "${quote.text}"</p>
      <p>- ${quote.author} (${quote.category})</p>
    `;
  }
};
