const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('searchBar');
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const closeReaderModal = document.getElementById('closeReaderModal');
const readerModal = document.getElementById('readerModal');
const bookDetailsModal = document.getElementById('bookDetailsModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');
const featuredBooksContainer = document.getElementById('featuredBooks');
const categoriesGrid = document.getElementById('categoriesGrid');
const trendingBooks = document.getElementById('trendingBooks');
const exploreBtn = document.getElementById('exploreBtn');
const searchInput = document.getElementById('searchInput');
const readerContent = document.getElementById('readerContent');
const bookTitleElement = document.getElementById('bookTitle');
const currentChapterElement = document.getElementById('currentChapter');
const progressBar = document.getElementById('progressBar');
const prevChapterBtn = document.getElementById('prevChapter');
const nextChapterBtn = document.getElementById('nextChapter');
const darkModeBtn = document.getElementById('darkModeBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const notesBtn = document.getElementById('notesBtn');
const shareBtn = document.getElementById('shareBtn');
const fontSizeBtn = document.getElementById('fontSizeBtn');
const addFavoriteBtn = document.getElementById('addFavorite');
const detailsTitle = document.getElementById('detailsTitle');
const detailsAuthor = document.getElementById('detailsAuthor');
const detailsRating = document.getElementById('detailsRating');
const ratingCount = document.getElementById('ratingCount');
const detailsGenre = document.getElementById('detailsGenre');
const detailsSynopsis = document.getElementById('detailsSynopsis');
const detailsYear = document.getElementById('detailsYear');
const detailsPages = document.getElementById('detailsPages');
const detailsISBN = document.getElementById('detailsISBN');
const detailsCover = document.getElementById('detailsCover');
const reviewsList = document.getElementById('reviewsList');
const reviewForm = document.getElementById('reviewForm');

let activeBook = null;
let currentChapterIndex = 0;
let fontSize = 1.08;
let darkMode = false;
let chapterProgress = 0;

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('show');
});

searchBtn.addEventListener('click', () => {
  searchBar.classList.toggle('active');
  if (searchBar.classList.contains('active')) {
    searchInput.focus();
  }
});

authBtn.addEventListener('click', () => {
  authModal.classList.add('active');
});

closeAuthModal.addEventListener('click', () => {
  authModal.classList.remove('active');
});

closeReaderModal.addEventListener('click', () => {
  readerModal.classList.remove('active');
});

closeDetailsModal.addEventListener('click', () => {
  bookDetailsModal.classList.remove('active');
});

exploreBtn.addEventListener('click', () => {
  document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
});

[...document.querySelectorAll('.auth-tab')].forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.auth-tab').forEach((t) => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.auth-form').forEach((form) => {
      form.classList.toggle('active', form.id === `${target}Form`);
    });
  });
});

function renderFeaturedBooks() {
  featuredBooksContainer.innerHTML = featuredBooks
    .map(
      (book) => `
        <article class="book-card" data-id="${book.id}">
          <div class="book-cover">${book.cover}</div>
          <div class="book-body">
            <span class="book-tag">${book.category}</span>
            <h3>${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <div class="rating-stars">${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</div>
            <div class="book-meta">
              <span>${book.pages} págs.</span>
              <span>${book.year}</span>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.book-card').forEach((card) => {
    card.addEventListener('click', () => openBookDetails(Number(card.dataset.id)));
  });
}

function renderCategories() {
  categoriesGrid.innerHTML = categories
    .map(
      (category) => `
        <article class="category-card">
          <i class="fas ${category.icon}"></i>
          <h3>${category.name}</h3>
          <p>${category.description}</p>
        </article>
      `
    )
    .join('');
}

function renderTrendingBooks() {
  trendingBooks.innerHTML = trendingItems
    .map(
      (item) => `
        <article class="trending-item">
          <div class="trending-rank">${item.rank}</div>
          <div>
            <h3>${item.title}</h3>
            <p>${item.author}</p>
          </div>
        </article>
      `
    )
    .join('');
}

function openBookDetails(bookId) {
  const book = featuredBooks.find((item) => item.id === bookId);
  if (!book) return;

  activeBook = book;
  detailsTitle.textContent = book.title;
  detailsAuthor.textContent = book.author;
  detailsGenre.textContent = book.category;
  detailsSynopsis.textContent = book.synopsis;
  detailsYear.textContent = book.year;
  detailsPages.textContent = `${book.pages} páginas`;
  detailsISBN.textContent = book.isbn;
  detailsCover.src = `https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80`;

  detailsRating.innerHTML = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);
  ratingCount.textContent = `${book.rating}.0/5`;

  reviewsList.innerHTML = book.reviews
    .map(
      (review) => `
        <article class="review-item">
          <h4>${review.user}</h4>
          <p>${review.text}</p>
        </article>
      `
    )
    .join('');

  bookDetailsModal.classList.add('active');
}

document.getElementById('readBtn').addEventListener('click', () => {
  if (!activeBook) return;
  openReader(activeBook);
  bookDetailsModal.classList.remove('active');
});

document.getElementById('addListBtn').addEventListener('click', () => {
  alert('Libro agregado a tu lista de lectura');
});

function openReader(book) {
  activeBook = book;
  currentChapterIndex = 0;
  bookTitleElement.textContent = book.title;
  renderChapter();
  readerModal.classList.add('active');
}

function renderChapter() {
  if (!activeBook) return;

  const chapter = activeBook.content[currentChapterIndex];
  currentChapterElement.textContent = `Capítulo ${currentChapterIndex + 1}: ${chapter.title}`;
  readerContent.innerHTML = `<h3>${chapter.title}</h3>${chapter.text
    .split('\n')
    .map((line) => `<p>${line}</p>`)
    .join('')}`;

  progressBar.value = ((currentChapterIndex + 1) / activeBook.content.length) * 100;
  chapterProgress = progressBar.value;

  readerContent.style.fontSize = `${fontSize}rem`;

  if (darkMode) {
    document.querySelector('.book-reader').classList.add('dark');
  } else {
    document.querySelector('.book-reader').classList.remove('dark');
  }
}

prevChapterBtn.addEventListener('click', () => {
  if (!activeBook) return;
  currentChapterIndex = Math.max(0, currentChapterIndex - 1);
  renderChapter();
});

nextChapterBtn.addEventListener('click', () => {
  if (!activeBook) return;
  currentChapterIndex = Math.min(activeBook.content.length - 1, currentChapterIndex + 1);
  renderChapter();
});

darkModeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  document.querySelector('.book-reader').classList.toggle('dark', darkMode);
});

bookmarkBtn.addEventListener('click', () => {
  alert('Marcador guardado en tu biblioteca');
});

notesBtn.addEventListener('click', () => {
  const note = prompt('Escribe una nota para este libro:');
  if (note) {
    alert(`Nota guardada: ${note}`);
  }
});

shareBtn.addEventListener('click', () => {
  navigator.clipboard?.writeText(`Estoy leyendo: ${activeBook.title}`);
  alert('Enlace compartido al portapapeles');
});

fontSizeBtn.addEventListener('click', () => {
  fontSize = fontSize >= 1.3 ? 1.08 : fontSize + 0.1;
  readerContent.style.fontSize = `${fontSize}rem`;
});

addFavoriteBtn.addEventListener('click', () => {
  alert('Libro agregado a favoritos');
});

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  if (!query) {
    renderFeaturedBooks();
    return;
  }

  const filtered = featuredBooks.filter((book) =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.category.toLowerCase().includes(query)
  );

  featuredBooksContainer.innerHTML = filtered
    .map(
      (book) => `
        <article class="book-card" data-id="${book.id}">
          <div class="book-cover">${book.cover}</div>
          <div class="book-body">
            <span class="book-tag">${book.category}</span>
            <h3>${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <div class="rating-stars">${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</div>
            <div class="book-meta">
              <span>${book.pages} págs.</span>
              <span>${book.year}</span>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.book-card').forEach((card) => {
    card.addEventListener('click', () => openBookDetails(Number(card.dataset.id)));
  });
});

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const textarea = reviewForm.querySelector('textarea');

  if (!textarea.value.trim()) {
    alert('Escribe una reseña antes de enviarla');
    return;
  }

  const newReview = {
    user: 'Tú',
    text: textarea.value.trim()
  };

  activeBook.reviews.push(newReview);
  reviewsList.innerHTML = activeBook.reviews
    .map(
      (review) => `
        <article class="review-item">
          <h4>${review.user}</h4>
          <p>${review.text}</p>
        </article>
      `
    )
    .join('');

  textarea.value = '';
  alert('Tu reseña se ha agregado correctamente');
});

renderFeaturedBooks();
renderCategories();
renderTrendingBooks();
