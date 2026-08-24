export const mockTasks = [
  {
    id: "task-1",
    title: "Task 1: Hangman Game",
    status: "APPROVED",
    dueDate: "2026-08-01",
    score: 92,
    submittedAt: "2026-07-28",
    objective: "Create a simple text-based Hangman game where the player guesses a word one letter at a time.",
    requirements: [
      "Use a small list of 5 predefined words (no need to use a file or API).",
      "Limit incorrect guesses to 6.",
      "Basic console input/output — no graphics or audio."
    ],
    skills: ["random", "while loop", "if-else", "strings", "lists"]
  },
  {
    id: "task-2",
    title: "Task 2: Stock Portfolio Tracker",
    status: "CHANGES_REQUESTED",
    dueDate: "2026-08-15",
    score: null,
    submittedAt: "2026-08-12",
    objective: "Build a simple stock tracker that calculates total investment based on manually defined stock prices.",
    requirements: [
      "User inputs stock names and quantity.",
      "Use a hardcoded dictionary to define stock prices (e.g., {'AAPL': 180, 'TSLA': 250}).",
      "Display total investment value and optionally save the result in a .txt or .csv file."
    ],
    skills: ["dictionary", "input/output", "basic arithmetic", "file handling"]
  },
  {
    id: "task-3",
    title: "Task 3: Task Automation with Python Scripts",
    status: "PENDING",
    dueDate: "2026-08-25",
    score: null,
    submittedAt: null,
    objective: "Automate a small, real-life repetitive task.",
    requirements: [
      "Pick one of these ideas:",
      "- Move all .jpg files from a folder to a new folder.",
      "- Extract all email addresses from a .txt file and save them to another file.",
      "- Scrape the title of a fixed webpage and save it."
    ],
    skills: ["os", "shutil", "re", "requests", "file handling"]
  },
  {
    id: "task-4",
    title: "Task 4: Basic Chatbot",
    status: "PENDING",
    dueDate: "2026-09-10",
    score: null,
    submittedAt: null,
    objective: "Build a simple rule-based chatbot.",
    requirements: [
      "Input from user like: 'hello', 'how are you', 'bye'.",
      "Predefined replies like: 'Hi!', 'I\\'m fine, thanks!', 'Goodbye!'."
    ],
    skills: ["if-elif", "functions", "loops", "input/output"]
  }
];
