let currentMission = "Trivia";
let totalPoints = 0;
let hearts = 3;
let wrongAttempts = 0;
let timer;
let gameTime = 3 * 60; // 1 hour timer (for testing, adjust as needed)
let currentRound = 0; // Start with round 0 (round 1 is actually round 0 in the array)
let matchedCards = 0;
let roundTimer;
let roundTime = [30, 25, 20, 20]; // Waktu untuk setiap ronde, dalam detik
let flippedCards = [];
let currentQuestionIndex = 0;
const songClips = [
  {
    title: "About You",
    file: "about-you.mp3",
  },
  {
    title: "ILYSB",
    file: "ilysb.mp3",
  },
  {
    title: "Happiness",
    file: "happiness.mp3",
  },
];

// Pemutar audio
let audio = document.getElementById("audio");
let currentSongIndex = 0;
let currentQuestion = "";

const triviaQuestions = [
  {
    question: "Hasil dari 89 x 3 : 3 + 2 : 7 ?",
    correctAnswer: "13",
    options: ["9", "13", "10"],
  },
  {
    question: "Siapa Orang Tercantik didunia ini?",
    correctAnswer: "Kamu",
    options: ["Han So Hee", "Kamu", "Han ji eun"],
  },
  {
    question: "Kenapa kamu cantik banget woi?!?!",
    correctAnswer: "Udah dari lahir :)",
    options: ["Tanya aja ibu aku", "Udah dari lahir :)", "Gatauu"],
  },
  {
    question:
      "Kapan terakhir kali kamu membuat dunia tercengang dengan pesona kamu?",
    correctAnswer: "Setiap saat, kan aku selalu menawan",
    options: [
      "Setiap saat, kan aku selalu menawan",
      "Waktu bangun pagi",
      "Saat di depan cermin",
    ],
  },
  {
    question: "Kamu tahu nggak, tiap kali kamu senyum dunia jadi lebih indah?",
    correctAnswer: "Iya, karena senyuman kamu itu ajaib",
    options: [
      "Iya, karena senyuman kamu itu ajaib",
      "Enggak, emang iya?",
      "Karena aku senang lihat kamu",
    ],
  },
  {
    question: "Apa yang membuat aku nggak bisa berhenti mikirin kamu?",
    correctAnswer: "Karena kamu ada di setiap pikiranku",
    options: [
      "Karena kamu ada di setiap pikiranku",
      "Karena kamu sempurna",
      "Karena kamu luar biasa",
    ],
  },
  {
    question:
      "Jangan pikirin aku, tapi kok tiap detik kamu selalu muncul di pikiranku?",
    correctAnswer: "Karena kamu terlalu istimewa untuk dilupakan",
    options: [
      "Karena kamu terlalu istimewa untuk dilupakan",
      "Aku juga nggak tahu",
      "Karena aku nggak bisa berhenti mikirin kamu",
    ],
  },
];

const cardSets = [
  // Round 1: Animals
  [
    { id: 1, symbol: "🐶" },
    { id: 2, symbol: "🐱" },
    { id: 3, symbol: "🐱" },
    { id: 4, symbol: "🐶" },
    { id: 5, symbol: "🐰" },
    { id: 6, symbol: "🐰" },
    { id: 7, symbol: "🐯" },
    { id: 8, symbol: "🐯" },
  ],

  // Round 2: Fruits
  [
    { id: 1, symbol: "🍎" },
    { id: 2, symbol: "🍌" },
    { id: 3, symbol: "🍌" },
    { id: 4, symbol: "🍎" },
    { id: 5, symbol: "🍉" },
    { id: 6, symbol: "🍉" },
    { id: 7, symbol: "🍇" },
    { id: 8, symbol: "🍇" },
  ],

  // Round 3: Flowers
  [
    { id: 1, symbol: "🌹" },
    { id: 2, symbol: "🌸" },
    { id: 3, symbol: "🌸" },
    { id: 4, symbol: "🌹" },
    { id: 5, symbol: "🌼" },
    { id: 6, symbol: "🌼" },
    { id: 7, symbol: "🌻" },
    { id: 8, symbol: "🌻" },
  ],

  // Round 4: Jobs
  [
    { id: 1, symbol: "👨‍💻" }, // Man at computer
    { id: 2, symbol: "👩‍🍳" }, // Woman chef
    { id: 3, symbol: "👩‍🍳" }, // Woman chef
    { id: 4, symbol: "👨‍💻" }, // Man at computer
    { id: 5, symbol: "👨‍🚒" }, // Firefighter
    { id: 6, symbol: "👨‍🚒" }, // Firefighter (female)
    { id: 7, symbol: "👨‍⚕️" }, // Doctor
    { id: 8, symbol: "👨‍⚕️" }, // Doctor (female)
  ],
];

// Start Trivia Game
function startTriviaGame() {
  showGame("quiz-container");
  displayTriviaQuestion();
  hideTriviaButton();
  startGlobalTimer();
}

// Hide Trivia Button
function hideTriviaButton() {
  const triviaButton = document.getElementById("start-quiz");
  if (triviaButton) triviaButton.style.display = "none";
}

// Start Global Timer
function startGlobalTimer() {
  let minutes = Math.floor(gameTime / 60);
  let seconds = gameTime % 60;

  timer = setInterval(function () {
    if (gameTime <= 0) {
      clearInterval(timer);
      alert("Yah, kamu kehabisan waktu :{");
      resetGame();
    } else {
      gameTime--;
      minutes = Math.floor(gameTime / 60);
      seconds = gameTime % 60;
      document.getElementById("timer").innerText = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  }, 1000);
}

// Display Trivia Question
function displayTriviaQuestion() {
  const questionObj = triviaQuestions[currentQuestionIndex];
  document.getElementById("quiz-question").innerText = questionObj.question;

  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  const allOptions = [...questionObj.options];
  shuffleArray(allOptions);

  allOptions.forEach((answer) => {
    const button = document.createElement("button");
    button.classList.add("answer");
    button.innerText = answer;
    button.onclick = () => checkTriviaAnswer(answer);
    answersContainer.appendChild(button);
  });
}

// Shuffle Array (for randomizing answers)
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Check Trivia Answer
function checkTriviaAnswer(selected) {
  const correctAnswer = triviaQuestions[currentQuestionIndex].correctAnswer;
  const resultDiv = document.getElementById("quiz-result");

  if (selected === correctAnswer) {
    resultDiv.innerHTML = "Correct! 🎉";
    wrongAttempts = 0;
    currentQuestionIndex++;
    if (currentQuestionIndex < triviaQuestions.length) {
      setTimeout(() => {
        displayTriviaQuestion();
        resultDiv.innerHTML = "";
      }, 1000);
    } else {
      setTimeout(() => {
        totalPoints += 10;
        showPopup("Congratulations! You've completed the trivia quiz!");
        nextMission("Trivia");
      }, 1000);
    }
  } else {
    resultDiv.innerHTML = "Wrong answer, try again.";
    wrongAttempts++;

    if (wrongAttempts >= 2) {
      hearts--;
      resetHeartsDisplay();
      if (hearts <= 0) {
        setTimeout(() => {
          alert("Game Over! You lost all hearts.");
          resetGame();
        }, 1000);
      } else {
        setTimeout(() => {
          currentQuestionIndex = 0;
          displayTriviaQuestion();
          resultDiv.innerHTML = "";
        }, 1000);
      }
    }
  }
}

// Reset Heart Display
function resetHeartsDisplay() {
  for (let i = 1; i <= 3; i++) {
    const heart = document.getElementById(`heart${i}`);
    if (i > hearts) {
      heart.style.display = "none";
    } else {
      heart.style.display = "inline";
    }
  }
}

// Show Popup Message
function showPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="popup-content">
      <h2>${message}</h2>
      <button onclick="nextMission('${currentMission}'); removePopup();">Go to Next Mission</button>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.classList.add("show");
  }, 100);
}

function removePopup() {
  const popup = document.querySelector(".popup");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.remove();
    }, 300);
  }
}

// Transition to the Next Mission
function nextMission(game) {
  if (game === "Memory") {
    if (currentRound < cardSets.length - 1) {
      currentRound++; // Move to the next round (urutan benar)
      matchedCards = 0;
      generateAndShuffleCards(); // Shuffle new set for the next round
    } else {
      showPopup("Congratulations! You've completed all rounds!");
      currentMission = "Karaoke"; // Move to the next game
      document.getElementById("mission-text").innerText =
        "Sing along to the song!";
      showGame("karaoke");
    }
  } else if (game === "Trivia") {
    currentMission = "Memory";
    document.getElementById("mission-text").innerText =
      "Find all matching pairs in the Memory Match game!";
    showGame("memory-game");
    generateAndShuffleCards(); // Start the Memory Match game
  }
}

// Show the Game Screen
function showGame(gameId) {
  const games = document.querySelectorAll(".game-container");
  games.forEach((game) => {
    game.style.display = "none"; // Hide all games
  });
  const gameElement = document.getElementById(gameId);
  if (gameElement) {
    gameElement.style.display = "block"; // Show the current game
  } else {
    console.error(`Game container with id '${gameId}' not found.`);
  }
}

// Generate and Shuffle Cards for Memory Game
function generateAndShuffleCards() {
  const cardsToUse = cardSets[currentRound]; // Get the cards for this round
  shuffleArray(cardsToUse); // Shuffle the cards

  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // Clear the previous cards

  // Create and add new cards to the game board
  cardsToUse.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("onclick", "flipCard(this)");

    const innerElement = document.createElement("div");
    innerElement.classList.add("inner");

    const frontElement = document.createElement("div");
    frontElement.classList.add("front");

    const backElement = document.createElement("div");
    backElement.classList.add("back");
    backElement.innerText = card.symbol;

    innerElement.appendChild(frontElement);
    innerElement.appendChild(backElement);
    cardElement.appendChild(innerElement);
    gameBoard.appendChild(cardElement);
  });

  startRoundTimer(); // Start the timer after cards have been shuffled
}

function shuffleCardsAndRestartRound() {
  matchedCards = 0; // Reset jumlah pasangan yang cocok
  generateAndShuffleCards();
}

function startRoundTimer() {
  // Stop the previous round timer if it exists
  if (roundTimer) {
    clearInterval(roundTimer);
  }

  let timeLeft = roundTime[currentRound]; // Time for this round

  // Show the timer-info element
  document.getElementById("timer-info").style.display = "block";

  roundTimer = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(roundTimer); // Stop the timer when time is up
      document.getElementById("timer-info").style.display = "none"; // Hide the timer-info element

      shuffleCardsAndRestartRound(); // Shuffle and restart the round without alert
    } else {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById(
        "timer-info"
      ).innerText = `Time left: ${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  }, 1000);
}

function checkRoundCompletion() {
  // If all pairs have been matched in the round
  if (matchedCards === cardSets[currentRound].length / 2) {
    totalPoints += 10;
    // Hide timer-info once round is completed
    document.getElementById("timer-info").style.display = "none";

    // Only show a popup once all rounds are completed
    if (currentRound < cardSets.length - 1) {
      setTimeout(() => {
        currentRound++; // Move to the next round
        matchedCards = 0;
        generateAndShuffleCards(); // Generate next round of cards
      }, 1000);
    } else {
      // Show a final popup after all rounds are done
      setTimeout(() => {
        showPopup("Congratulations! You've completed all rounds!");
      }, 1000);
    }
  }
}

function stopGameTimer() {
  if (roundTimer) {
    clearInterval(roundTimer); // Hentikan timer jika ada
    document.getElementById("timer-info").style.display = "none"; // Sembunyikan timer jika dihentikan
  }
}

function flipCard(cardElement) {
  if (flippedCards.length < 2 && !cardElement.classList.contains("flipped")) {
    cardElement.classList.add("flipped");
    flippedCards.push(cardElement);

    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (
    card1.querySelector(".back").innerText ===
    card2.querySelector(".back").innerText
  ) {
    matchedCards++;
    flippedCards = [];

    if (matchedCards === cardSets[currentRound].length / 2) {
      totalPoints += 10;
      setTimeout(() => {
        if (currentRound < cardSets.length - 1) {
          currentRound++;
          matchedCards = 0;
          generateAndShuffleCards();
        } else {
          showPopup("Congratulations! You've completed all rounds!");
        }
      }, 1000);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}
function startSongQuiz() {
  showGame("karaoke"); // Tampilkan layar karaoke
  playRandomSongClip(); // Putar klip lagu acak
}

function playRandomSongClip() {
  // Pilih lagu acak
  currentSongIndex = Math.floor(Math.random() * songClips.length);
  const song = songClips[currentSongIndex];

  // Set audio source
  audio.src = song.file;

  // Menunggu hingga audio siap diputar
  audio.addEventListener("canplaythrough", function () {
    audio.play();
  });

  // Tentukan waktu mulai acak untuk memutar lagu dari menit/detik acak
  const songStartTime = Math.floor(Math.random() * 60); // Random mulai dalam detik
  audio.currentTime = songStartTime;

  // Setelah 10 detik, berhenti memutar dan tampilkan soal tebak lagu
  setTimeout(() => {
    audio.pause();
    askSongQuestion(song.title); // Tanyakan soal setelah klip selesai
  }, 10000); // 10 detik
}

function playRandomSongClip() {
  // Pilih lagu acak
  currentSongIndex = Math.floor(Math.random() * songClips.length);
  const song = songClips[currentSongIndex];

  // Set audio source dan mulai memainkan klip
  audio.src = song.file;
  audio.play();

  // Tentukan waktu mulai acak untuk memutar lagu dari menit/detik acak
  const songStartTime = Math.floor(Math.random() * 60); // Random mulai dalam detik
  audio.currentTime = songStartTime;

  // Setelah 10 detik, berhenti memutar dan tampilkan soal tebak lagu
  setTimeout(() => {
    audio.pause();
    askSongQuestion(song.title); // Tanyakan soal setelah klip selesai
  }, 10000); // 10 detik
}

// Fungsi untuk menampilkan soal tebak lagu
function askSongQuestion(correctAnswer) {
  currentQuestion = correctAnswer;

  // Pilihan jawaban acak
  let options = [correctAnswer];
  while (options.length < 3) {
    const randomSong =
      songClips[Math.floor(Math.random() * songClips.length)].title;
    if (!options.includes(randomSong)) {
      options.push(randomSong);
    }
  }

  // Acak pilihan jawaban
  shuffleArray(options);

  // Menampilkan soal dan pilihan jawaban
  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = ""; // Clear any previous answers

  options.forEach((answer) => {
    const button = document.createElement("button");
    button.classList.add("answer");
    button.innerText = answer;
    button.onclick = () => checkSongAnswer(answer);
    answersContainer.appendChild(button);
  });
}

// Fungsi untuk mengecek jawaban lagu
function checkSongAnswer(selectedAnswer) {
  const resultDiv = document.getElementById("quiz-result");

  if (selectedAnswer === currentQuestion) {
    resultDiv.innerHTML = "Correct! 🎉";
    totalPoints += 10; // Tambah poin jika benar
    setTimeout(() => {
      document.getElementById("guest-song-next").style.display = "inline"; // Tampilkan tombol Next
    }, 1000);
  } else {
    resultDiv.innerHTML = "Wrong answer, try again.";
  }
}
