const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");

const subjectPath = path.resolve(__dirname, "../assets/book-club.js");

function loadSubject() {
  try {
    return require(subjectPath);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND" && error.message.includes(subjectPath)) {
      return {};
    }

    throw error;
  }
}

const BookClub = loadSubject();

test("getBookBySlug returns the matching book", () => {
  const books = [
    { slug: "first-book", title: "First Book" },
    { slug: "second-book", title: "Second Book" },
  ];

  assert.equal(typeof BookClub.getBookBySlug, "function");
  assert.equal(BookClub.getBookBySlug(books, "second-book"), books[1]);
});

test("getBookBySlug returns null for an unknown book", () => {
  assert.equal(typeof BookClub.getBookBySlug, "function");
  assert.equal(BookClub.getBookBySlug([{ slug: "known" }], "missing"), null);
});

test("getBookHref safely encodes the book slug", () => {
  assert.equal(typeof BookClub.getBookHref, "function");
  assert.equal(
    BookClub.getBookHref("a book & its sequel"),
    "book.html?book=a%20book%20%26%20its%20sequel",
  );
});

test("summarizeRatings calculates totals, average, and five histogram rows", () => {
  assert.equal(typeof BookClub.summarizeRatings, "function");

  assert.deepEqual(
    BookClub.summarizeRatings({ 1: 0, 2: 1, 3: 2, 4: 4, 5: 3 }),
    {
      total: 10,
      average: 3.9,
      rows: [
        { stars: 5, count: 3, percentage: 30 },
        { stars: 4, count: 4, percentage: 40 },
        { stars: 3, count: 2, percentage: 20 },
        { stars: 2, count: 1, percentage: 10 },
        { stars: 1, count: 0, percentage: 0 },
      ],
    },
  );
});

test("summarizeRatings keeps an empty histogram usable", () => {
  assert.equal(typeof BookClub.summarizeRatings, "function");

  assert.deepEqual(BookClub.summarizeRatings({}), {
    total: 0,
    average: 0,
    rows: [
      { stars: 5, count: 0, percentage: 0 },
      { stars: 4, count: 0, percentage: 0 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ],
  });
});

test("question deck uses every prompt before repeating", () => {
  assert.equal(typeof BookClub.createQuestionDeck, "function");
  const deck = BookClub.createQuestionDeck(["Alpha", "Beta", "Gamma"], () => 0);

  const firstCycle = [deck.next(), deck.next(), deck.next()];

  assert.equal(new Set(firstCycle).size, 3);
  assert.equal(deck.remaining(), 0);
  assert.notEqual(deck.next(), firstCycle[2]);
  assert.equal(deck.remaining(), 2);
});

test("question deck handles zero or one prompt", () => {
  assert.equal(typeof BookClub.createQuestionDeck, "function");
  const emptyDeck = BookClub.createQuestionDeck([], () => 0);
  const singleDeck = BookClub.createQuestionDeck(["Only question"], () => 0);

  assert.equal(emptyDeck.next(), null);
  assert.equal(emptyDeck.remaining(), 0);
  assert.equal(singleDeck.next(), "Only question");
  assert.equal(singleDeck.next(), "Only question");
});

test("question navigator moves backward and forward through drawn history", () => {
  assert.equal(typeof BookClub.createQuestionNavigator, "function");
  const questions = ["Alpha", "Beta", "Gamma"];
  const navigator = BookClub.createQuestionNavigator({
    next: () => questions.shift() || null,
  });

  assert.deepEqual(navigator.next(), {
    question: "Alpha",
    position: 0,
    canPrevious: false,
  });
  assert.deepEqual(navigator.next(), {
    question: "Beta",
    position: 1,
    canPrevious: true,
  });
  assert.deepEqual(navigator.previous(), {
    question: "Alpha",
    position: 0,
    canPrevious: false,
  });
  assert.deepEqual(navigator.next(), {
    question: "Beta",
    position: 1,
    canPrevious: true,
  });
  assert.deepEqual(navigator.next(), {
    question: "Gamma",
    position: 2,
    canPrevious: true,
  });
});

test("question navigator handles empty decks and the start boundary", () => {
  assert.equal(typeof BookClub.createQuestionNavigator, "function");
  const emptyNavigator = BookClub.createQuestionNavigator({
    next: () => null,
  });
  const singleNavigator = BookClub.createQuestionNavigator({
    next: () => "Only question",
  });

  assert.equal(emptyNavigator.next(), null);
  assert.equal(emptyNavigator.previous(), null);
  assert.deepEqual(singleNavigator.next(), {
    question: "Only question",
    position: 0,
    canPrevious: false,
  });
  assert.deepEqual(singleNavigator.previous(), {
    question: "Only question",
    position: 0,
    canPrevious: false,
  });
});
