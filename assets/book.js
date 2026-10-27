const params = new URLSearchParams(globalThis.location.search);
const slug = params.get("book");
const books = Array.isArray(globalThis.BOOK_CLUB_BOOKS)
  ? globalThis.BOOK_CLUB_BOOKS
  : [];
const book = BookClub.getBookBySlug(books, slug);

const meetingContent = document.querySelector("#meeting-content");
const notFound = document.querySelector("#book-not-found");

if (!book) {
  notFound.hidden = false;
} else {
  const bookTitle = document.querySelector("#book-title");
  const bookAuthor = document.querySelector("#book-author");
  const ratingsToggle = document.querySelector("#ratings-toggle");
  const ratingsPanel = document.querySelector("#ratings-panel");
  const ratingsBack = document.querySelector("#ratings-back");
  const ratingAverage = document.querySelector("#rating-average");
  const ratingTotal = document.querySelector("#rating-total");
  const ratingHistogram = document.querySelector("#rating-histogram");
  const questionToggle = document.querySelector("#question-toggle");
  const questionPanel = document.querySelector("#question-panel");
  const questionBack = document.querySelector("#question-back");
  const questionText = document.querySelector("#question-text");
  const questionCount = document.querySelector("#question-count");
  const previousQuestion = document.querySelector("#previous-question");
  const nextQuestion = document.querySelector("#next-question");

  bookTitle.textContent = book.title;
  bookAuthor.textContent = `by ${book.author}`;
  document.title = `${book.title} — Book Club`;
  meetingContent.hidden = false;

  const summary = BookClub.summarizeRatings(book.ratings || {});
  ratingAverage.textContent = summary.total === 0 ? "—" : `${summary.average} ★`;
  ratingTotal.textContent = String(summary.total);

  summary.rows.forEach((row) => {
    const histogramRow = document.createElement("div");
    histogramRow.className = "histogram-row";

    const starLabel = document.createElement("span");
    starLabel.className = "star-label";
    starLabel.textContent = `${row.stars} ${row.stars === 1 ? "star" : "stars"}`;

    const barTrack = document.createElement("span");
    barTrack.className = "bar-track";
    barTrack.setAttribute("aria-hidden", "true");

    const bar = document.createElement("span");
    bar.className = "bar";
    bar.style.setProperty("--bar-width", `${row.percentage}%`);
    barTrack.append(bar);

    const ratingCount = document.createElement("span");
    ratingCount.className = "rating-count";
    ratingCount.textContent = `${row.count} (${row.percentage}%)`;

    histogramRow.append(starLabel, barTrack, ratingCount);
    ratingHistogram.append(histogramRow);
  });

  const questionDeck = BookClub.createQuestionDeck(book.questions || []);
  const questionNavigator = BookClub.createQuestionNavigator(questionDeck);
  const questionTotal = Array.isArray(book.questions)
    ? book.questions.filter(
        (question) => typeof question === "string" && question.trim(),
      ).length
    : 0;
  let questionHasBeenDrawn = false;

  function showQuestion(state) {
    if (!state) {
      questionText.textContent = "No questions have been submitted yet.";
      questionCount.textContent = "The question box is empty";
      previousQuestion.hidden = true;
      nextQuestion.hidden = true;
      return;
    }

    const questionNumber = (state.position % questionTotal) + 1;
    questionText.textContent = state.question;
    questionCount.textContent = `Question ${questionNumber} of ${questionTotal}`;
    previousQuestion.hidden = false;
    previousQuestion.disabled = !state.canPrevious;
    nextQuestion.hidden = false;
    questionHasBeenDrawn = true;
  }

  function setCardSide(button, panel, flipped) {
    const card = button.closest(".reveal-card");
    const front = button.closest(".card-front");

    card.classList.toggle("is-flipped", flipped);
    button.setAttribute("aria-expanded", String(flipped));
    front.setAttribute("aria-hidden", String(flipped));
    front.toggleAttribute("inert", flipped);
    panel.setAttribute("aria-hidden", String(!flipped));
    panel.toggleAttribute("inert", !flipped);

    if (flipped) {
      panel.focus({ preventScroll: true });
    } else {
      button.focus({ preventScroll: true });
    }
  }

  ratingsToggle.addEventListener("click", () => {
    setCardSide(ratingsToggle, ratingsPanel, true);
  });

  questionToggle.addEventListener("click", () => {
    if (!questionHasBeenDrawn) {
      showQuestion(questionNavigator.next());
    }

    setCardSide(questionToggle, questionPanel, true);
  });

  ratingsBack.addEventListener("click", () => {
    setCardSide(ratingsToggle, ratingsPanel, false);
  });

  questionBack.addEventListener("click", () => {
    setCardSide(questionToggle, questionPanel, false);
  });

  previousQuestion.addEventListener("click", () => {
    showQuestion(questionNavigator.previous());
  });

  nextQuestion.addEventListener("click", () => {
    showQuestion(questionNavigator.next());
  });
}
