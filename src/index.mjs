// Enhanced REDS PLMT Tracker JavaScript - Fixed Version

// Application configuration and data
const HABITS_DATA = [
  {
    id: "R",
    name: "Read for 20 minutes",
    xp: 20,
    category: "learning",
    defaultMascot: "owl",
  },
  {
    id: "E",
    name: "Exercise (Gym or movement)",
    xp: 35,
    category: "health",
    defaultMascot: "bear",
  },
  {
    id: "D",
    name: "Deep Work / Flow session",
    xp: 40,
    category: "productivity",
    defaultMascot: "fox",
  },
  {
    id: "S",
    name: "Sleep on time",
    xp: 25,
    category: "health",
    defaultMascot: "cat",
  },
  {
    id: "P",
    name: "Plan for tomorrow / prep",
    xp: 15,
    category: "productivity",
    defaultMascot: "rabbit",
  },
  {
    id: "L",
    name: "Learn something new",
    xp: 30,
    category: "learning",
    defaultMascot: "panda",
  },
  {
    id: "M",
    name: "Mindfulness (meditation or silence)",
    xp: 20,
    category: "wellness",
    defaultMascot: "tiger",
  },
  {
    id: "T",
    name: "Track finance / journal",
    xp: 15,
    category: "productivity",
    defaultMascot: "dog",
  },
];

const MASCOT_OPTIONS = [
  {
    id: "owl",
    name: "Wise Owl",
    emoji: "🦉",
    colors: ["#8B4513", "#D2691E", "#F4A460"],
  },
  {
    id: "fox",
    name: "Clever Fox",
    emoji: "🦊",
    colors: ["#FF6347", "#FF4500", "#FFD700"],
  },
  {
    id: "cat",
    name: "Calm Cat",
    emoji: "🐱",
    colors: ["#708090", "#A0A0A0", "#C0C0C0"],
  },
  {
    id: "dog",
    name: "Loyal Dog",
    emoji: "🐕",
    colors: ["#8B4513", "#D2691E", "#F5DEB3"],
  },
  {
    id: "rabbit",
    name: "Quick Rabbit",
    emoji: "🐰",
    colors: ["#FFB6C1", "#FFC0CB", "#FFFFE0"],
  },
  {
    id: "bear",
    name: "Strong Bear",
    emoji: "🐻",
    colors: ["#8B4513", "#A0522D", "#D2691E"],
  },
  {
    id: "panda",
    name: "Peaceful Panda",
    emoji: "🐼",
    colors: ["#000000", "#FFFFFF", "#808080"],
  },
  {
    id: "tiger",
    name: "Focused Tiger",
    emoji: "🐯",
    colors: ["#FF6347", "#000000", "#FFD700"],
  },
];

const MOOD_EMOJIS = {
  happy: "🥳",
  worried: "😟",
  sad: "😭",
  celebrating: "🎉",
  sleeping: "😴",
  excited: "🤩",
  neutral: "😐",
};

const REFLECTION_QUESTIONS = [
  "What habits were easiest for you this week?",
  "What challenged you the most this week?",
  "How do you feel about your overall progress?",
  "What would you like to improve next week?",
  "What are you most proud of accomplishing?",
];

const BADGES = [
  {
    id: "first_day",
    name: "First Steps",
    icon: "🌱",
    description: "Complete your first day",
  },
  {
    id: "week_streak",
    name: "Week Warrior",
    icon: "⚡",
    description: "7-day streak",
  },
  {
    id: "month_streak",
    name: "Monthly Master",
    icon: "🏆",
    description: "30-day streak",
  },
  {
    id: "xp_1000",
    name: "XP Champion",
    icon: "💎",
    description: "Reach 1000 XP",
  },
  {
    id: "all_habits",
    name: "Perfect Day",
    icon: "🌟",
    description: "Complete all habits in one day",
  },
  {
    id: "boss_slayer",
    name: "Boss Slayer",
    icon: "⚔️",
    description: "Defeat 5 weekly bosses",
  },
];

// Global tracker instance
let tracker = null;

// Habit Tracker Class
class HabitTracker {
  constructor() {
    this.currentDate = new Date().toISOString().split("T")[0];
    this.user = null;
    this.isDemo = false;
    this.data = null;
    this.currentEditingHabit = null;

    console.log("HabitTracker initialized");
  }

  init() {
    console.log("Starting initialization...");
    this.checkExistingAuth();
    this.setupEventListeners();

    if (this.user) {
      this.showMainApp();
    } else {
      this.showLoginScreen();
    }
  }

  setupEventListeners() {
    console.log("Setting up event listeners...");

    // Demo mode button
    const demoBtn = document.getElementById("demo-mode-btn");
    if (demoBtn) {
      demoBtn.addEventListener("click", () => {
        console.log("Demo button clicked");
        this.enterDemoMode();
      });
    }

    // Google Sign-in button
    const googleBtn = document.getElementById("google-signin-button");
    if (googleBtn) {
      googleBtn.addEventListener("click", () => {
        console.log("Google button clicked");
        this.handleGoogleAuth();
      });
    }

    // Sign out button
    const signoutBtn = document.getElementById("signout-btn");
    if (signoutBtn) {
      signoutBtn.addEventListener("click", () => {
        this.signOut();
      });
    }

    this.setupNavigation();
  }

  checkExistingAuth() {
    const savedData = localStorage.getItem("reds-plmt-enhanced-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.user) {
          this.user = parsed.user;
          this.isDemo = parsed.isDemo || false;
          this.data = parsed.data;
          console.log("Found existing user session");
        }
      } catch (error) {
        console.error("Error parsing saved data:", error);
        localStorage.removeItem("reds-plmt-enhanced-data");
      }
    }
  }

  handleGoogleAuth() {
    // Simulate Google Auth
    const mockUser = {
      id: "google-demo-user",
      name: "Google User",
      email: "google.user@example.com",
      picture: "https://via.placeholder.com/32/1FB8CD/FFFFFF?text=GU",
    };

    this.signInUser(mockUser);
  }

  signInUser(userData) {
    console.log("Signing in user:", userData);
    this.user = userData;
    this.isDemo = false;
    this.loadUserData();
    this.updateUserProfile();
    this.showMainApp();
  }

  enterDemoMode() {
    console.log("Entering demo mode...");

    this.user = {
      id: "demo-mode",
      name: "Demo User",
      email: "demo@example.com",
      picture: "https://via.placeholder.com/32/1FB8CD/FFFFFF?text=DU",
    };
    this.isDemo = true;

    this.loadDemoData();
    this.updateUserProfile();
    this.showMainApp();
  }

  signOut() {
    this.user = null;
    this.isDemo = false;
    this.data = null;
    localStorage.removeItem("reds-plmt-enhanced-data");
    this.showLoginScreen();
  }

  showLoginScreen() {
    console.log("Showing login screen");
    document.getElementById("login-screen")?.classList.remove("hidden");
    document.getElementById("main-app")?.classList.add("hidden");
  }

  showMainApp() {
    console.log("Showing main app");
    document.getElementById("login-screen")?.classList.add("hidden");
    document.getElementById("main-app")?.classList.remove("hidden");

    // Initialize main app views
    this.renderDashboard();
    this.renderProgressView();
    this.renderReflectionView();
    this.renderSettingsView();
  }

  updateUserProfile() {
    const nameElement = document.getElementById("user-name");
    const avatarElement = document.getElementById("user-avatar");

    if (nameElement && this.user) nameElement.textContent = this.user.name;
    if (avatarElement && this.user) {
      avatarElement.src = this.user.picture;
      avatarElement.alt = this.user.name;
    }
  }

  loadUserData() {
    if (this.isDemo) {
      this.loadDemoData();
      return;
    }

    const savedData = localStorage.getItem("reds-plmt-enhanced-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        this.data = parsed.data || this.createDefaultData();
      } catch (error) {
        console.error("Error loading data:", error);
        this.data = this.createDefaultData();
      }
    } else {
      this.data = this.createDefaultData();
    }
  }

  loadDemoData() {
    this.data = {
      habits: HABITS_DATA.map((habit) => ({
        ...habit,
        streak: Math.floor(Math.random() * 10),
      })),
      completions: this.generateSampleCompletions(),
      totalXP: 1250,
      level: 3,
      comboStreak: 5,
      weeklyBossesDefeated: 2,
      badges: ["first_day", "week_streak"],
      reflections: {},
      mascotPreferences: {
        R: { mascot: "owl", color: "#8B4513", name: "Hooty" },
        E: { mascot: "bear", color: "#8B4513", name: "Brutus" },
        D: { mascot: "fox", color: "#FF6347", name: "Foxy" },
        S: { mascot: "cat", color: "#708090", name: "Sleepy" },
        P: { mascot: "rabbit", color: "#FFB6C1", name: "Planner" },
        L: { mascot: "panda", color: "#000000", name: "Learny" },
        M: { mascot: "tiger", color: "#FF6347", name: "Zen" },
        T: { mascot: "dog", color: "#8B4513", name: "Tracker" },
      },
      preferences: { notifications: true, soundEffects: true, theme: "auto" },
    };
  }

  generateSampleCompletions() {
    const completions = {};
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const completed = HABITS_DATA.filter(() => Math.random() > 0.3).map(
        (h) => h.id
      );
      if (completed.length > 0) {
        completions[dateStr] = completed;
      }
    }

    return completions;
  }

  createDefaultData() {
    return {
      habits: HABITS_DATA.map((habit) => ({ ...habit, streak: 0 })),
      completions: {},
      totalXP: 0,
      level: 1,
      comboStreak: 0,
      weeklyBossesDefeated: 0,
      badges: [],
      reflections: {},
      mascotPreferences: HABITS_DATA.reduce((acc, habit) => {
        acc[habit.id] = {
          mascot: habit.defaultMascot,
          color:
            MASCOT_OPTIONS.find((m) => m.id === habit.defaultMascot)
              ?.colors[0] || "#8B4513",
          name:
            MASCOT_OPTIONS.find((m) => m.id === habit.defaultMascot)?.name ||
            "Mascot",
        };
        return acc;
      }, {}),
      preferences: { notifications: true, soundEffects: true, theme: "auto" },
    };
  }

  saveData() {
    if (!this.data) return;

    const savePayload = {
      user: this.user,
      isDemo: this.isDemo,
      data: this.data,
      lastSyncTime: new Date().toISOString(),
    };

    localStorage.setItem(
      "reds-plmt-enhanced-data",
      JSON.stringify(savePayload)
    );
  }

  setupNavigation() {
    const tabs = document.querySelectorAll(".nav-tab");
    const views = document.querySelectorAll(".view");

    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = tab.dataset.tab;

        tabs.forEach((t) => t.classList.remove("active"));
        views.forEach((v) => v.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(`${targetView}-view`)?.classList.add("active");

        switch (targetView) {
          case "dashboard":
            this.renderDashboard();
            break;
          case "progress":
            this.renderProgressView();
            break;
          case "reflection":
            this.renderReflectionView();
            break;
          case "settings":
            this.renderSettingsView();
            break;
        }
      });
    });
  }

  renderDashboard() {
    if (!this.data) return;

    this.updateDashboardStats();
    this.updateLevelProgress();
    this.renderMascots();
    this.updateTodayProgress();
  }

  updateDashboardStats() {
    const elements = {
      "current-level": this.data.level,
      "total-xp": this.data.totalXP.toLocaleString(),
      "combo-streak": this.data.comboStreak,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  updateLevelProgress() {
    const currentLevel = Math.floor(Math.sqrt(this.data.totalXP / 100)) + 1;
    const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
    const nextLevelXP = Math.pow(currentLevel, 2) * 100;
    const progressXP = this.data.totalXP - currentLevelXP;
    const levelProgress = nextLevelXP - currentLevelXP;
    const progressPercent = Math.min((progressXP / levelProgress) * 100, 100);

    const elements = {
      "level-display": currentLevel,
      "current-xp": this.data.totalXP,
      "next-level-xp": nextLevelXP,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    const progressBar = document.getElementById("xp-progress");
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    if (currentLevel !== this.data.level) {
      this.data.level = currentLevel;
      setTimeout(() => this.showLevelUpModal(currentLevel), 500);
    }
  }

  renderMascots() {
    const container = document.getElementById("mascots-grid");
    if (!container || !this.data) return;

    const todayCompletions = this.data.completions[this.currentDate] || [];

    container.innerHTML = this.data.habits
      .map((habit) => {
        const isCompleted = todayCompletions.includes(habit.id);
        const mascotPref = this.data.mascotPreferences[habit.id];
        const mascotData =
          MASCOT_OPTIONS.find((m) => m.id === mascotPref.mascot) ||
          MASCOT_OPTIONS[0];
        const mood = this.getMascotMood(habit, isCompleted);

        return `
                <div class="mascot-card ${
                  isCompleted ? "completed" : ""
                }" data-habit-id="${habit.id}">
                    <div class="mascot-avatar" style="background-color: ${
                      mascotPref.color
                    }" data-habit-id="${habit.id}">
                        ${mascotData.emoji}
                        <div class="mascot-mood">${MOOD_EMOJIS[mood]}</div>
                    </div>
                    <div class="mascot-info">
                        <h3>${habit.name}</h3>
                        <div class="mascot-name">${mascotPref.name}</div>
                        <div class="mascot-status">
                            <div class="habit-streak">
                                <span>🔥</span>
                                <span>${habit.streak} day${
          habit.streak !== 1 ? "s" : ""
        }</span>
                            </div>
                            <div class="habit-xp">+${habit.xp} XP</div>
                        </div>
                        <div class="habit-checkbox ${
                          isCompleted ? "checked" : ""
                        }" data-habit-id="${habit.id}">
                            ${isCompleted ? "✓" : ""}
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    // Add click handlers
    container.querySelectorAll("[data-habit-id]").forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        const habitId = element.dataset.habitId;
        if (
          habitId &&
          (element.classList.contains("habit-checkbox") ||
            element.classList.contains("mascot-avatar"))
        ) {
          this.toggleHabit(habitId);
        }
      });
    });
  }

  getMascotMood(habit, isCompleted) {
    if (isCompleted) return "celebrating";
    if (habit.streak === 0) return "sleeping";
    if (habit.streak >= 7) return "excited";
    if (habit.streak >= 3) return "happy";
    return "neutral";
  }

  updateTodayProgress() {
    const todayCompletions = this.data.completions[this.currentDate] || [];
    const totalHabits = this.data.habits.length;
    const completedToday = todayCompletions.length;
    const progressPercent = (completedToday / totalHabits) * 100;

    const elements = {
      "completed-today": completedToday,
      "total-habits": totalHabits,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    const progressCircle = document.getElementById("progress-circle");
    if (progressCircle) {
      const circumference = 2 * Math.PI * 16;
      const strokeDasharray = `${
        (progressPercent / 100) * circumference
      } ${circumference}`;
      progressCircle.style.strokeDasharray = strokeDasharray;
    }

    const messageElement = document.getElementById("progress-message");
    if (messageElement) {
      let message = "Great start to the day!";
      if (progressPercent === 100) message = "🎉 Perfect day achieved!";
      else if (progressPercent >= 75) message = "Almost there! Keep going!";
      else if (progressPercent >= 50) message = "Good progress so far!";

      messageElement.textContent = message;
    }
  }

  toggleHabit(habitId) {
    if (!this.data) return;

    if (!this.data.completions[this.currentDate]) {
      this.data.completions[this.currentDate] = [];
    }

    const todayCompletions = this.data.completions[this.currentDate];
    const habitIndex = todayCompletions.indexOf(habitId);
    const habit = this.data.habits.find((h) => h.id === habitId);

    if (!habit) return;

    const previousLevel = this.data.level;

    if (habitIndex === -1) {
      // Complete habit
      todayCompletions.push(habitId);
      this.data.totalXP += habit.xp;
      habit.streak += 1;
      this.showHabitCompletionModal(habit);
    } else {
      // Uncomplete habit
      todayCompletions.splice(habitIndex, 1);
      this.data.totalXP = Math.max(0, this.data.totalXP - habit.xp);
      habit.streak = Math.max(0, habit.streak - 1);
    }

    this.updateComboStreak();

    const newLevel = Math.floor(Math.sqrt(this.data.totalXP / 100)) + 1;
    if (newLevel > previousLevel) {
      this.data.level = newLevel;
      setTimeout(() => this.showLevelUpModal(newLevel), 500);
    }

    this.saveData();
    this.renderDashboard();
    this.checkBadges();
  }

  updateComboStreak() {
    const today = new Date(this.currentDate);
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];
      const completions = this.data.completions[dateStr] || [];

      if (completions.length === this.data.habits.length) {
        streak++;
      } else {
        break;
      }
    }

    this.data.comboStreak = streak;
  }

  showHabitCompletionModal(habit) {
    const modal = document.getElementById("habit-complete-modal");
    const mascotElement = document.getElementById("celebrating-mascot");
    const titleElement = document.getElementById("habit-complete-title");
    const messageElement = document.getElementById("habit-complete-message");

    if (modal && mascotElement && titleElement && messageElement) {
      const mascotPref = this.data.mascotPreferences[habit.id];
      const mascotData = MASCOT_OPTIONS.find((m) => m.id === mascotPref.mascot);

      mascotElement.textContent = mascotData?.emoji || "🎉";
      titleElement.textContent = `${mascotPref.name} is celebrating!`;
      messageElement.textContent = `You completed "${habit.name}" and earned ${habit.xp} XP!`;

      modal.classList.add("active");
      setTimeout(() => modal.classList.remove("active"), 2000);
    }
  }

  showLevelUpModal(level) {
    const modal = document.getElementById("level-up-modal");
    const levelElement = document.getElementById("new-level");

    if (modal && levelElement) {
      levelElement.textContent = level;
      modal.classList.add("active");
    }
  }

  checkBadges() {
    if (!this.data) return;

    BADGES.forEach((badge) => {
      if (
        !this.data.badges.includes(badge.id) &&
        this.checkBadgeRequirement(badge)
      ) {
        this.data.badges.push(badge.id);
        this.showBadgeNotification(badge);
      }
    });
  }

  checkBadgeRequirement(badge) {
    switch (badge.id) {
      case "first_day":
        return Object.keys(this.data.completions).length > 0;
      case "week_streak":
        return this.data.comboStreak >= 7;
      case "month_streak":
        return this.data.comboStreak >= 30;
      case "xp_1000":
        return this.data.totalXP >= 1000;
      case "all_habits":
        return (
          (this.data.completions[this.currentDate] || []).length ===
          this.data.habits.length
        );
      case "boss_slayer":
        return this.data.weeklyBossesDefeated >= 5;
      default:
        return false;
    }
  }

  showBadgeNotification(badge) {
    const notification = document.createElement("div");
    notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #4ade80; color: white; 
                        padding: 16px 20px; border-radius: 8px; z-index: 1001; max-width: 300px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div style="font-weight: bold; margin-bottom: 4px;">🎉 Badge Earned!</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">${badge.icon}</span>
                    <span>${badge.name}</span>
                </div>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }

  renderProgressView() {
    if (!this.data) return;

    this.updateProgressStats();
    this.updateWeeklyBoss();
    this.renderStreaks();
    this.renderBadges();
  }

  updateProgressStats() {
    const elements = {
      "total-xp-display": this.data.totalXP.toLocaleString(),
      "progress-level-display": this.data.level,
      "bosses-defeated": this.data.weeklyBossesDefeated,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    this.updateWeeklyProgress();
  }

  updateWeeklyProgress() {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    let daysCompleted = 0;
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(thisWeekStart);
      checkDate.setDate(thisWeekStart.getDate() + i);
      const dateStr = checkDate.toISOString().split("T")[0];
      const completions = this.data.completions[dateStr] || [];

      if (completions.length === this.data.habits.length) {
        daysCompleted++;
      }
    }

    const weeklyElement = document.getElementById("weekly-progress");
    if (weeklyElement) weeklyElement.textContent = `${daysCompleted}/7`;
  }

  updateWeeklyBoss() {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    let daysCompleted = 0;
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(thisWeekStart);
      checkDate.setDate(thisWeekStart.getDate() + i);
      const dateStr = checkDate.toISOString().split("T")[0];
      const completions = this.data.completions[dateStr] || [];

      if (completions.length === this.data.habits.length) {
        daysCompleted++;
      }
    }

    const progressElement = document.getElementById("boss-progress-fill");
    const statusElement = document.getElementById("boss-status");

    if (progressElement) {
      progressElement.style.width = `${Math.min(
        (daysCompleted / 5) * 100,
        100
      )}%`;
    }

    if (statusElement) {
      if (daysCompleted >= 5) {
        statusElement.textContent = "🎉 Week defeated! You're a champion!";
      } else {
        statusElement.textContent = `Complete ${
          5 - daysCompleted
        } more perfect days to defeat this week!`;
      }
    }
  }

  renderStreaks() {
    const container = document.getElementById("streaks-container");
    if (!container || !this.data) return;

    const streaksHTML =
      this.data.habits
        .map(
          (habit) => `
            <div class="streak-card">
                <h4>${habit.id}</h4>
                <div class="streak-number">${habit.streak}</div>
                <div class="streak-label">days</div>
            </div>
        `
        )
        .join("") +
      `
            <div class="streak-card">
                <h4>Combo</h4>
                <div class="streak-number">${this.data.comboStreak}</div>
                <div class="streak-label">days</div>
            </div>
        `;

    container.innerHTML = streaksHTML;
  }

  renderBadges() {
    const container = document.getElementById("badges-container");
    if (!container || !this.data) return;

    container.innerHTML = BADGES.map(
      (badge) => `
            <div class="badge ${
              this.data.badges.includes(badge.id) ? "earned" : ""
            }" title="${badge.description}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
            </div>
        `
    ).join("");
  }

  renderReflectionView() {
    this.renderReflectionQuestions();
    this.renderWeeklyInsights();
  }

  renderReflectionQuestions() {
    const container = document.getElementById("reflection-form");
    if (!container) return;

    container.innerHTML = REFLECTION_QUESTIONS.map(
      (question, index) => `
            <div class="question-item">
                <label>${question}</label>
                <textarea class="form-control" id="reflection-${index}" placeholder="Your thoughts..."></textarea>
            </div>
        `
    ).join("");

    const saveButton = document.getElementById("save-reflection");
    if (saveButton) {
      saveButton.onclick = () => this.saveReflection();
    }
  }

  renderWeeklyInsights() {
    const elements = {
      "most-consistent-habit": "Reading",
      "needs-attention-habit": "Exercise",
      "best-day": "Monday",
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  saveReflection() {
    this.showNotification("Reflection saved! 💭", "success");
  }

  renderSettingsView() {
    this.renderMascotCustomization();
    this.renderPreferences();
  }

  renderMascotCustomization() {
    const container = document.getElementById("mascot-customization");
    if (!container || !this.data) return;

    container.innerHTML = this.data.habits
      .map((habit) => {
        const mascotPref = this.data.mascotPreferences[habit.id];
        const mascotData = MASCOT_OPTIONS.find(
          (m) => m.id === mascotPref.mascot
        );

        return `
                <div class="mascot-custom-item">
                    <div class="mascot-custom-info">
                        <div class="mascot-custom-preview" style="background-color: ${
                          mascotPref.color
                        }">
                            ${mascotData?.emoji || "🦉"}
                        </div>
                        <div class="mascot-custom-details">
                            <h4>${habit.name}</h4>
                            <small>${mascotPref.name} (${
          mascotData?.name || "Unknown"
        })</small>
                        </div>
                    </div>
                    <button class="btn btn--sm btn--outline" onclick="tracker.showMascotSelector('${
                      habit.id
                    }')">
                        Customize
                    </button>
                </div>
            `;
      })
      .join("");
  }

  showMascotSelector(habitId) {
    const modal = document.getElementById("mascot-selector-modal");
    const title = document.getElementById("mascot-selector-title");
    const optionsContainer = document.getElementById("mascot-options");

    if (!modal || !this.data) return;

    const habit = this.data.habits.find((h) => h.id === habitId);
    const currentPref = this.data.mascotPreferences[habitId];

    this.currentEditingHabit = habitId;

    if (title) title.textContent = `Choose Mascot for ${habit.name}`;

    if (optionsContainer) {
      optionsContainer.innerHTML = MASCOT_OPTIONS.map(
        (mascot) => `
                <div class="mascot-option ${
                  mascot.id === currentPref.mascot ? "selected" : ""
                }" 
                     data-mascot-id="${mascot.id}">
                    ${mascot.emoji}
                </div>
            `
      ).join("");

      optionsContainer.querySelectorAll(".mascot-option").forEach((option) => {
        option.addEventListener("click", () => {
          optionsContainer
            .querySelectorAll(".mascot-option")
            .forEach((o) => o.classList.remove("selected"));
          option.classList.add("selected");
          this.updateColorOptions(option.dataset.mascotId);
        });
      });
    }

    const nameInput = document.getElementById("mascot-name-input");
    if (nameInput) nameInput.value = currentPref.name;

    this.updateColorOptions(currentPref.mascot);
    modal.classList.add("active");
  }

  updateColorOptions(mascotId) {
    const colorsContainer = document.getElementById("color-options");
    const currentPref = this.data.mascotPreferences[this.currentEditingHabit];

    if (!colorsContainer) return;

    const mascotData = MASCOT_OPTIONS.find((m) => m.id === mascotId);
    if (!mascotData) return;

    colorsContainer.innerHTML = mascotData.colors
      .map(
        (color) => `
            <div class="color-option ${
              color === currentPref?.color ? "selected" : ""
            }" 
                 style="background-color: ${color}" 
                 data-color="${color}">
            </div>
        `
      )
      .join("");

    colorsContainer.querySelectorAll(".color-option").forEach((option) => {
      option.addEventListener("click", () => {
        colorsContainer
          .querySelectorAll(".color-option")
          .forEach((o) => o.classList.remove("selected"));
        option.classList.add("selected");
      });
    });
  }

  saveMascotSelection() {
    const habitId = this.currentEditingHabit;
    if (!habitId || !this.data) return;

    const selectedMascot = document.querySelector(".mascot-option.selected")
      ?.dataset.mascotId;
    const selectedColor = document.querySelector(".color-option.selected")
      ?.dataset.color;
    const nameInput = document.getElementById("mascot-name-input");
    const name = nameInput?.value || "Mascot";

    if (selectedMascot && selectedColor) {
      this.data.mascotPreferences[habitId] = {
        mascot: selectedMascot,
        color: selectedColor,
        name: name,
      };

      this.saveData();
      this.renderSettingsView();
      this.renderDashboard();
      this.showNotification("Mascot customized successfully!", "success");
    }

    this.closeMascotSelector();
  }

  closeMascotSelector() {
    const modal = document.getElementById("mascot-selector-modal");
    if (modal) modal.classList.remove("active");
    this.currentEditingHabit = null;
  }

  renderPreferences() {
    if (!this.data) return;

    // Setup export buttons
    const exportJsonBtn = document.getElementById("export-json");
    const exportCsvBtn = document.getElementById("export-csv");

    if (exportJsonBtn) {
      exportJsonBtn.onclick = () => this.exportData("json");
    }
    if (exportCsvBtn) {
      exportCsvBtn.onclick = () => this.exportData("csv");
    }
  }

  exportData(format) {
    if (!this.data) return;

    let content, filename, mimeType;

    if (format === "json") {
      content = JSON.stringify(this.data, null, 2);
      filename = `reds-plmt-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      mimeType = "application/json";
    } else if (format === "csv") {
      content = this.generateCSV();
      filename = `reds-plmt-data-${new Date().toISOString().split("T")[0]}.csv`;
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    this.showNotification(
      `Data exported as ${format.toUpperCase()}!`,
      "success"
    );
  }

  generateCSV() {
    const headers = [
      "Date",
      ...this.data.habits.map((h) => h.name),
      "Daily XP",
    ];
    const rows = [headers];

    Object.keys(this.data.completions)
      .sort()
      .forEach((date) => {
        const completions = this.data.completions[date];
        const row = [date];

        this.data.habits.forEach((habit) => {
          row.push(completions.includes(habit.id) ? "✓" : "");
        });

        const dailyXP = completions.reduce((sum, habitId) => {
          const habit = this.data.habits.find((h) => h.id === habitId);
          return sum + (habit ? habit.xp : 0);
        }, 0);

        row.push(dailyXP);
        rows.push(row);
      });

    return rows.map((row) => row.join(",")).join("\n");
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    const colors = {
      success: "#4ade80",
      error: "#ef4444",
      info: "#5bb8cc",
    };

    notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 16px 20px; border-radius: 8px;
            color: white; z-index: 1001; max-width: 300px; font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: ${colors[type]};
        `;

    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }
}

// Global modal functions
function closeLevelUpModal() {
  document.getElementById("level-up-modal")?.classList.remove("active");
}

function closeHabitCompleteModal() {
  document.getElementById("habit-complete-modal")?.classList.remove("active");
}

function closeMascotSelector() {
  tracker?.closeMascotSelector();
}

function saveMascotSelection() {
  tracker?.saveMascotSelection();
}

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing tracker...");
  tracker = new HabitTracker();
  window.tracker = tracker; // Make globally available
  tracker.init();
});
