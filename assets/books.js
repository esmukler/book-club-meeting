(function exposeBooks(root) {
  const books = [
    {
      slug: "the-long-island-compromise",
      title: "The Long Island Compromise",
      author: "Taffy Brodesser-Akner",
      ratings: {
        1: 0,
        2: 1,
        3: 2,
        4: 4,
        5: 3,
      },
      questions: [
        "Which member of the Fletcher family changed the most over the course of the book?",
        "How did the family’s wealth protect them, and where did it fail to protect them?",
        "Did the novel make you feel differently about the idea of inherited trauma?",
        "Which character’s choices were the hardest for you to understand?",
        "How did the book balance humor with the family’s darker experiences?",
        "What do you think the title means by “compromise”?",
        "Which scene stayed with you after you finished reading?",
        "Did the ending feel earned? What would you have changed?",
      ],
    },
  ];

  if (typeof module === "object" && module.exports) {
    module.exports = books;
  }

  if (root) {
    root.BOOK_CLUB_BOOKS = books;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
