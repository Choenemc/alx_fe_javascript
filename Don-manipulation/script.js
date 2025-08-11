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

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryButtons = document.getElementById('categoryButtons');
let currentCategory = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Display first random quote
    showRandomQuote();
    
    // Set up event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    
    // Generate category buttons
    updateCategoryButtons();
});

// Show a random quote
function showRandomQuote() {
    let filteredQuotes = quotes;
    
    // Filter by category if not 'all'
    if (currentCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
    }
    
    // Check if there are quotes available
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `
            <p class="quote-text">No quotes found in this category.</p>
            <p class="quote-category">${currentCategory}</p>
        `;
        return;
    }
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    // Display the quote
    quoteDisplay.innerHTML = `
        <p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-category">Category: ${randomQuote.category}</p>
    `;
}

// Add a new quote to the database
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    const text = textInput.value.trim();
    const category = categoryInput.value.trim().toLowerCase();
    
    if (text && category) {
        // Add new quote
        quotes.push({ text, category });
        
        // Clear inputs
        textInput.value = '';
        categoryInput.value = '';
        
        // Update UI
        showRandomQuote();
        updateCategoryButtons();
        
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Update category buttons
function updateCategoryButtons() {
    // Get all unique categories
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing buttons
    categoryButtons.innerHTML = '';
    
    // Create new buttons
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('category-btn');
        if (category === currentCategory) {
            button.classList.add('active-category');
        }
        
        button.addEventListener('click', () => {
            currentCategory = category;
            updateCategoryButtons();
            showRandomQuote();
        });
        
        categoryButtons.appendChild(button);
    });
}