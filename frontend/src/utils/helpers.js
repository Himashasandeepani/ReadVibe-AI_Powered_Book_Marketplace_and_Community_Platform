// Books data
export const books = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 6000.00,
    category: "Fiction",
    rating: 4.3,
    reviews: 128,
    inStock: true,
    image: "/Images/The_Midnight_Library.jpeg"
  },
  {
    id: 2,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 6500.00,
    category: "Science Fiction",
    rating: 4.8,
    reviews: 95,
    inStock: true,
    image: "/Images/Project_Hail_Mary.jpg"
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    price: 5400.00,
    category: "Science Fiction",
    rating: 4.0,
    reviews: 210,
    inStock: true,
    image: "/Images/Dune.jpeg"
  },
  {
    id: 4,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 3500.00,
    category: "Fantasy",
    rating: 4.9,
    reviews: 305,
    inStock: false,
    image: "/Images/The_Hobbit.jpeg"
  }
]

// Cart functions
export const getCart = () => {
  return JSON.parse(localStorage.getItem('cart')) || []
}

export const updateCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export const addToCart = (bookId, quantity = 1) => {
  const cart = getCart()
  const book = books.find(b => b.id === bookId)

  if (!book) return

  const existingItem = cart.find(item => item.id === bookId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
      quantity: quantity
    })
  }

  updateCart(cart)
}

export const removeFromCart = (bookId) => {
  const cart = getCart().filter(item => item.id !== bookId)
  updateCart(cart)
}

export const updateQuantity = (bookId, change) => {
  const cart = getCart()
  const item = cart.find(item => item.id === bookId)

  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(bookId)
    } else {
      updateCart(cart)
    }
  }
}



// Search books
export const searchBooks = (query) => {
  return books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  )
}

// Add this function to your existing helpers.js file
export const addToWishlist = (bookId, userId) => {
  const wishlistKey = `wishlist_${userId}`
  const currentWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || []
  const book = books.find(b => b.id === bookId)

  if (book && !currentWishlist.some(item => item.id === bookId)) {
    currentWishlist.push(book)
    localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist))
    return true
  }
  return false
}





// Add these to your existing helpers.js

// Filter books function
export const filterBooks = (filters, booksArray) => {
  let filtered = [...booksArray];

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(book => book.category === filters.category);
  }

  if (filters.minPrice) {
    filtered = filtered.filter(book => book.price >= filters.minPrice);
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(book => book.price <= filters.maxPrice);
  }

  if (filters.minRating) {
    filtered = filtered.filter(book => book.rating >= filters.minRating);
  }

  if (filters.inStock) {
    filtered = filtered.filter(book => book.inStock);
  }

  return filtered;
};

// Enhanced showNotification function
export const showNotification = (message, type = 'info') => {
  const typeMap = {
    success: { icon: 'check-circle', label: 'Success' },
    warning: { icon: 'exclamation-triangle', label: 'Warning' },
    danger: { icon: 'times-circle', label: 'Error' },
    info: { icon: 'info-circle', label: 'Info' },
  };

  const meta = typeMap[type] || typeMap.info;

  // Ensure a single toast container exists
  let container = document.querySelector('.rv-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'rv-toast-container';
    document.body.appendChild(container);
  }

  const notification = document.createElement('div');
  notification.className = `rv-toast rv-toast-${type}`;
  notification.innerHTML = `
    <div class="rv-toast__icon">
      <i class="fas fa-${meta.icon}" aria-hidden="true"></i>
    </div>
    <div class="rv-toast__content">
      <div class="rv-toast__title">${meta.label}</div>
      <div class="rv-toast__message">${message}</div>
    </div>
    <button class="rv-toast__close" aria-label="Dismiss notification">x</button>
  `;

  // Close on click of the dismiss button
  notification.querySelector('.rv-toast__close').addEventListener('click', () => {
    notification.classList.add('rv-toast--hide');
    setTimeout(() => notification.remove(), 250);
  });

  container.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('rv-toast--hide');
    setTimeout(() => notification.remove(), 250);
  }, 3000);
};


// Price formatting cart, delivery
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};




// Star rating generator
export const generateStarRating = (rating) => {
  const stars = Math.round(rating);
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format date
// export const formatDate = (dateString) => {
//   const options = { year: 'numeric', month: 'long', day: 'numeric' };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};




// userprofile
// utils/helpers.js


export const getBookById = (bookId) => {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  return books.find(book => book.id.toString() === bookId.toString());
};

export const updateBookRating = (bookId, rating) => {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  const bookIndex = books.findIndex(book => book.id.toString() === bookId.toString());
  if (bookIndex !== -1) {
    // Update rating logic
    books[bookIndex].rating = rating;
    localStorage.setItem('books', JSON.stringify(books));
  }
};



//wishlist
export const getWishlistCount = () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return 0;

  const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
  return wishlist.length;
};



// Authentication utilities
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'))
}

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user))
}

export const logout = () => {
  localStorage.removeItem('currentUser')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('currentUser')
}

export const getUserWishlist = () => {
  const user = getCurrentUser()
  if (!user) return []

  return JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || []
}

export const updateWishlistCount = () => {
  // This function can be called to update wishlist count in real-time
  const user = getCurrentUser()
  if (!user) return 0

  const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || []
  return wishlist.length
}




//order confirmation
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// export const formatPrice = (price) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD'
//   }).format(price);
// };