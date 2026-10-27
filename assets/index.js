const bookList = document.querySelector("#book-list");
const emptyLibrary = document.querySelector("#empty-library");
const books = Array.isArray(globalThis.BOOK_CLUB_BOOKS)
  ? globalThis.BOOK_CLUB_BOOKS
  : [];

if (books.length === 0) {
  emptyLibrary.hidden = false;
} else {
  const fragment = document.createDocumentFragment();

  books.forEach((book, index) => {
    const link = document.createElement("a");
    link.className = "book-link";
    link.href = BookClub.getBookHref(book.slug);
    link.setAttribute("aria-label", `Open ${book.title} by ${book.author}`);

    const card = document.createElement("article");
    card.className = "book-card";

    const cover = document.createElement("div");
    cover.className = "book-cover";
    cover.setAttribute("aria-hidden", "true");
    cover.innerHTML = `
      <span class="cover-ornament">BC</span>
      <span class="cover-title">${book.title}</span>
      <span class="cover-author">${book.author}</span>
    `;

    const details = document.createElement("div");
    details.className = "book-details";
    details.innerHTML = `
      <p class="book-index">Book ${String(index + 1).padStart(2, "0")}</p>
      <h3>${book.title}</h3>
      <p>by ${book.author}</p>
      <span class="book-open">Open meeting page <span aria-hidden="true">→</span></span>
    `;

    card.append(cover, details);
    link.append(card);
    fragment.append(link);
  });

  bookList.append(fragment);
}
