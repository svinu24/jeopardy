/*
 * Question bank: 7 categories x 7 clues worth 100-700.
 *
 * Clue fields:
 *   value     point value
 *   question  clue text (`backticks` render as inline code)
 *   answer    answer text, or an array of strings rendered as a list
 *   lyric     optional lyric excerpt for Finish the Lyric clues
 *   cue       optional playback cue, used instead of written-out lyrics
 *   song      optional, shown only after the answer is revealed
 *   artist    optional, shown only after the answer is revealed
 *   pending   true for clues that haven't been written yet
 */
(function () {
  "use strict";

  const VALUES = [100, 200, 300, 400, 500, 600, 700];

  function pending(value) {
    return { value: value, pending: true };
  }

  function pendingCategory(name) {
    return { name: name, clues: VALUES.map(pending) };
  }

  window.JEOPARDY_DATA = {
    categories: [
      {
        name: "C / C++",
        clues: [
          {
            value: 100,
            question: "What does the `++` operator do to a variable?",
            answer: "Increments its value by 1.",
          },
          {
            value: 200,
            question: "In C, what is the difference between `=` and `==`?",
            answer: "`=` assigns a value, while `==` compares two values for equality.",
          },
          {
            value: 300,
            question: "What infamous C function is notorious for being unsafe because it doesn't check input length?",
            answer: "`gets()`.",
          },
          {
            value: 400,
            question: "What is the difference between `malloc()` and `calloc()`?",
            answer: "`malloc()` allocates uninitialized memory, while `calloc()` allocates memory and initializes it to zero.",
          },
          {
            value: 500,
            question: "What happens when you attempt to free the same dynamically allocated memory twice in C?",
            answer: "Undefined behavior, potentially including crashes or memory corruption.",
          },
          {
            value: 600,
            question: "In C++, why might a base class need a virtual destructor?",
            answer: "To ensure the derived class's destructor is called when deleting a derived object through a base-class pointer.",
          },
          {
            value: 700,
            question: "What is the difference between undefined behavior, unspecified behavior, and implementation-defined behavior in C?",
            answer: [
              "Undefined: The language imposes no requirements on what happens.",
              "Unspecified: One of several permitted behaviors occurs, without requiring documentation of the choice.",
              "Implementation-defined: The implementation chooses a behavior and must document it.",
            ],
          },
        ],
      },
      {
        name: "Green Book (Quant)",
        clues: [
          {
            value: 100,
            question: "You flip a fair coin twice. What is the probability of getting two heads?",
            answer: "1/4 or 25%.",
          },
          {
            value: 200,
            question: "You roll two fair dice. What is the probability their sum is 7?",
            answer: "1/6.",
          },
          {
            value: 300,
            question: "You keep flipping a fair coin until you get heads. What is the expected number of flips?",
            answer: "2 flips.",
          },
          {
            value: 400,
            question: "You have 8 identical-looking balls, one of which is heavier. What's the minimum number of balance-scale weighings needed to guarantee finding it?",
            answer: "2 weighings. Weigh 3 against 3, then narrow the candidates with a second weighing.",
          },
          {
            value: 500,
            question: "You roll a fair six-sided die repeatedly until you get a 6. What is the expected sum of all your rolls, including the final 6?",
            answer: "21.",
          },
          {
            value: 600,
            question: "You have two ropes that each take exactly 60 minutes to burn, but burn at uneven rates. How can you measure exactly 45 minutes?",
            answer: "Light the first rope at both ends and the second rope at one end. After 30 minutes, light the second end of the remaining rope. It will finish burning 15 minutes later.",
          },
          {
            value: 700,
            question: "A fair coin is flipped until the pattern HHT appears. What is the expected number of flips?",
            answer: "8 flips.",
          },
        ],
      },
      {
        name: "Sports",
        clues: [
          {
            value: 100,
            question: "Which NFL team completed the only undefeated season that included a Super Bowl victory?",
            answer: "1972 Miami Dolphins.",
          },
          {
            value: 200,
            question: 'Which NBA player earned the nickname "The Answer"?',
            answer: "Allen Iverson.",
          },
          {
            value: 300,
            question: "Which country won the 2022 FIFA World Cup, and whom did it defeat in the final?",
            answer: "Argentina defeated France.",
          },
          {
            value: 400,
            question: "What NFL running back holds the single-game rushing record with 296 yards?",
            answer: "Adrian Peterson.",
          },
          {
            value: 500,
            question: "What was the nickname of the 1992 U.S. Olympic men's basketball team? Name three players on its roster.",
            answer: "The Dream Team. Accept any three of Michael Jordan, Magic Johnson, Larry Bird, Charles Barkley, Scottie Pippen, Patrick Ewing, Karl Malone, John Stockton, David Robinson, Clyde Drexler, Chris Mullin, or Christian Laettner.",
          },
          {
            value: 600,
            question: "Which NFL quarterback famously guaranteed victory before Super Bowl III and delivered on that promise?",
            answer: "Joe Namath.",
          },
          pending(700),
        ],
      },
      pendingCategory("Brainrot"),
      pendingCategory("Madison"),
      pendingCategory("Random"),
      pendingCategory("Finish the Lyric"),
    ],
  };
})();
