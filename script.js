// ============================================
// QUOTE DATABASE
// ============================================
const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb"
    },
    {
        text: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde"
    },
    {
        text: "Two roads diverged in a wood, and I took the one less traveled by.",
        author: "Robert Frost"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    },
    {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        text: "The purpose of life is not to be happy. It is to be useful, honorable, and compassionate.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "Don't count the days, make the days count.",
        author: "Muhammad Ali"
    },
    {
        text: "The only limit to our realization of tomorrow will be our doubts of today.",
        author: "Franklin D. Roosevelt"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "Education is the most powerful weapon you can use to change the world.",
        author: "Nelson Mandela"
    },
    {
        text: "Every great developer you know got there by solving problems they were unqualified to solve.",
        author: "Patrick McKenzie"
    },
    {
        text: "Code is like humor. When you have to explain it, it's bad.",
        author: "Cory House"
    },
    {
        text: "The computer was born to solve problems that did not exist before.",
        author: "Bill Gates"
    },
    {
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson"
    },
    {
        text: "Experience is the name everyone gives to their mistakes.",
        author: "Oscar Wilde"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    }
];

// ============================================
// APPLICATION STATE
// ============================================
let currentQuote = null;
let favorites = [];

function loadFavorites() {
    const stored = localStorage.getItem('favoriteQuotes');
    if (stored) {
        try {
            favorites = JSON.parse(stored);
        } catch (e) {
            favorites = [];
        }
    }
    renderFavorites();
}

function saveFavorites() {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
}

// ============================================
// CORE FUNCTIONS
// ============================================

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displayQuote(quote) {
    currentQuote = quote;
    
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    
    const content = document.querySelector('.quote-content');
    content.style.animation = 'none';
    content.offsetHeight;
    content.style.animation = 'fadeIn 0.5s ease';
    
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = `- ${quote.author}`;
    
    updateFavoriteButton();
}

function newQuote() {
    const quote = getRandomQuote();
    displayQuote(quote);
}

// ============================================
// FAVORITES FUNCTIONALITY
// ============================================

function toggleFavorite() {
    if (!currentQuote) return;
    
    const isFavorite = favorites.some(q => 
        q.text === currentQuote.text && q.author === currentQuote.author
    );
    
    if (isFavorite) {
        favorites = favorites.filter(q => 
            q.text !== currentQuote.text || q.author !== currentQuote.author
        );
    } else {
        favorites.push({ ...currentQuote });
    }
    
    saveFavorites();
    renderFavorites();
    updateFavoriteButton();
}

function updateFavoriteButton() {
    const btn = document.getElementById('favoriteBtn');
    
    if (!currentQuote) return;
    
    const isFavorite = favorites.some(q => 
        q.text === currentQuote.text && q.author === currentQuote.author
    );
    
    if (isFavorite) {
        btn.classList.add('liked');
        btn.innerHTML = '<i class="fas fa-heart"></i> Unfavorite';
    } else {
        btn.classList.remove('liked');
        btn.innerHTML = '<i class="far fa-heart"></i> Favorite';
    }
}

function renderFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">No favorites yet. Click ❤️ to save quotes!</p>';
        return;
    }
    
    const sorted = [...favorites].reverse();
    
    favoritesList.innerHTML = sorted.map((quote, index) => `
        <div class="favorite-item" data-index="${index}">
            <span class="quote-text-sm">"${quote.text}"</span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="quote-author-sm">— ${quote.author}</span>
                <button class="remove-favorite" onclick="removeFavorite(${index})">
                    <i class="fas fa-times-circle"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function removeFavorite(index) {
    const sorted = [...favorites].reverse();
    const quoteToRemove = sorted[index];
    
    const originalIndex = favorites.findIndex(q => 
        q.text === quoteToRemove.text && q.author === quoteToRemove.author
    );
    
    if (originalIndex !== -1) {
        favorites.splice(originalIndex, 1);
        saveFavorites();
        renderFavorites();
        updateFavoriteButton();
    }
}

// ============================================
// SHARE FUNCTIONALITY
// ============================================

function shareQuote() {
    if (!currentQuote) return;
    
    const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'InspireMe - Daily Quote',
            text: shareText,
            url: window.location.href
        }).catch(err => {});
    } else {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Quote copied to clipboard! 📋');
            });
        } else {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
        }
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.target === document.body && (e.key === ' ' || e.key === 'Space')) {
        e.preventDefault();
        newQuote();
    }
    
    if (e.target === document.body && (e.key === 'f' || e.key === 'F')) {
        toggleFavorite();
    }
});

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    const initialQuote = getRandomQuote();
    displayQuote(initialQuote);
    
    document.getElementById('newQuoteBtn').addEventListener('click', newQuote);
    document.getElementById('shareBtn').addEventListener('click', shareQuote);
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
});

console.log('✨ Welcome to InspireMe!');
console.log('📝 Keyboard shortcuts: Space → New Quote | F → Toggle Favorite');
console.log(`📚 ${quotes.length} quotes loaded. Get inspired!`);