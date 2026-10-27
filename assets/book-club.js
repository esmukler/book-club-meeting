(function exposeBookClub(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.BookClub = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createBookClub() {
  function getBookBySlug(books, slug) {
    return books.find((book) => book.slug === slug) || null;
  }

  function getBookHref(slug) {
    return `book.html?book=${encodeURIComponent(slug)}`;
  }

  function summarizeRatings(ratings) {
    const rows = [5, 4, 3, 2, 1].map((stars) => {
      const value = Number(ratings?.[stars] ?? 0);
      const count = Number.isFinite(value) && value > 0 ? value : 0;

      return { stars, count };
    });
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const weightedTotal = rows.reduce(
      (sum, row) => sum + row.stars * row.count,
      0,
    );

    return {
      total,
      average: total === 0 ? 0 : Number((weightedTotal / total).toFixed(1)),
      rows: rows.map((row) => ({
        ...row,
        percentage: total === 0 ? 0 : Math.round((row.count / total) * 100),
      })),
    };
  }

  function createQuestionDeck(questions, random = Math.random) {
    const prompts = questions
      .filter((question) => typeof question === "string" && question.trim())
      .map((question) => question.trim());
    let remainingQuestions = [];
    let previousQuestion = null;

    function refill() {
      remainingQuestions = [...prompts];

      for (let index = remainingQuestions.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [remainingQuestions[index], remainingQuestions[swapIndex]] = [
          remainingQuestions[swapIndex],
          remainingQuestions[index],
        ];
      }

      if (
        remainingQuestions.length > 1 &&
        remainingQuestions[0] === previousQuestion
      ) {
        [remainingQuestions[0], remainingQuestions[1]] = [
          remainingQuestions[1],
          remainingQuestions[0],
        ];
      }
    }

    function next() {
      if (prompts.length === 0) {
        return null;
      }

      if (remainingQuestions.length === 0) {
        refill();
      }

      previousQuestion = remainingQuestions.shift();
      return previousQuestion;
    }

    function remaining() {
      return remainingQuestions.length;
    }

    return { next, remaining };
  }

  function createQuestionNavigator(deck) {
    const history = [];
    let currentIndex = -1;

    function current() {
      if (currentIndex < 0) {
        return null;
      }

      return {
        question: history[currentIndex],
        position: currentIndex,
        canPrevious: currentIndex > 0,
      };
    }

    function next() {
      if (currentIndex < history.length - 1) {
        currentIndex += 1;
        return current();
      }

      const question = deck.next();

      if (question === null) {
        return current();
      }

      history.push(question);
      currentIndex += 1;
      return current();
    }

    function previous() {
      if (currentIndex > 0) {
        currentIndex -= 1;
      }

      return current();
    }

    return { next, previous };
  }

  return {
    createQuestionDeck,
    createQuestionNavigator,
    getBookBySlug,
    getBookHref,
    summarizeRatings,
  };
});
