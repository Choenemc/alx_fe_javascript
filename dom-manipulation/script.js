// Initial quotes database
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "In the middle of difficulty lies opportunity.", category: "inspiration" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "motivation" },
    { text: "The way to get started is to quit talking and begin doing.", category: "action" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "life" },
    { text: "If life were predictable it would cease to be life, and be without flavor.", category: "life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "dreams" }
];
// Load quotes from localStorage if available
function loadQuotesFromStorage() {
    const storedQuotes = localStorage.getItem('savedQuotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save quotes to localStorage
function saveQuotesToStorage() {
    localStorage.setItem('savedQuotes', JSON.stringify(quotes));
}

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryButtons = document.getElementById('categoryButtons');
let currentCategory = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadQuotesFromStorage();
    showRandomQuote();
    newQuoteBtn.addEventListener('click', showRandomQuote);
    updateCategoryButtons();
    createAddQuoteForm(); // Create the form dynamically
});

// Show a random quote
function showRandomQuote() {
    let filteredQuotes = currentCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === currentCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `
            <p class="quote-text">No quotes found in this category.</p>
            <p class="quote-category">${currentCategory}</p>
        `;
        return;
    }

    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `
        <p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-category">Category: ${randomQuote.category}</p>
    `;
}

// Create the add quote form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteContainer';
    formContainer.innerHTML = `
        <h3>Add New Quote</h3>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteBtn">Add Quote</button>
    `;
    document.body.appendChild(formContainer);

    // Add event listener to the dynamically created button
    document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Add a new quote to the database
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    const text = textInput.value.trim();
    const category = categoryInput.value.trim().toLowerCase();
    
    if (text && category) {
        quotes.push({ text, category });
        saveQuotesToStorage();
        textInput.value = '';
        categoryInput.value = '';
        showRandomQuote();
        updateCategoryButtons();
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Update category buttons
function updateCategoryButtons() {
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    categoryButtons.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('category-btn');
        if (category === currentCategory) button.classList.add('active-category');
        
        button.addEventListener('click', () => {
            currentCategory = category;
            updateCategoryButtons();
            showRandomQuote();
        });
        
        categoryButtons.appendChild(button);
    });
}
