(function() {
  const state = {
    finishHref: "#",
    dashboardHref: "#",
    correctAnswers: {},
    timerId: null
  };

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function onClick(selector, handler) {
    const el = qs(selector);
    if (el) el.addEventListener("click", handler);
  }

  function startTimer(seconds) {
    const timerEl = qs("#rpTimer");
    if (!timerEl) return;
    let remaining = seconds;
    updateTimerText(timerEl, remaining);
    if (state.timerId) {
      clearInterval(state.timerId);
    }
    state.timerId = setInterval(() => {
      remaining -= 1;
      if (remaining < 0) {
        clearInterval(state.timerId);
        timerEl.textContent = "Time is up";
        return;
      }
      updateTimerText(timerEl, remaining);
    }, 1000);
  }

  function updateTimerText(el, seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      el.textContent = `${mins} minutes left`;
    } else {
      el.textContent = `${secs} seconds left`;
    }
  }

  function getAnswers() {
    const answers = {};
    qsa("input[type=radio]").forEach(input => {
      if (input.checked) {
        answers[input.name] = input.value;
      }
    });
    qsa("input.rp-text-answer").forEach(input => {
      answers[input.name] = input.value.trim();
    });
    return answers;
  }

  function normalizeAnswer(value) {
    return value == null ? "" : String(value).trim().toLowerCase();
  }

  function isAnswerCorrect(actual, expected) {
    if (Array.isArray(expected)) {
      const normalized = normalizeAnswer(actual);
      return expected.some(item => normalizeAnswer(item) === normalized);
    }
    return normalizeAnswer(actual) === normalizeAnswer(expected);
  }

  function gradeAnswers() {
    const answers = getAnswers();
    const keys = Object.keys(state.correctAnswers);
    let correctCount = 0;
    const incorrect = [];
    keys.forEach(key => {
      const expected = state.correctAnswers[key];
      const actual = answers[key];
      if (isAnswerCorrect(actual, expected)) {
        correctCount += 1;
      } else {
        incorrect.push(key.replace(/^q/, ""));
      }
    });
    return {
      correctCount,
      incorrect,
      total: keys.length
    };
  }

  function showResultModal(result) {
    const modal = qs("#rpResultModal");
    const overlay = qs("#rpOverlay");
    const bandScoreEl = qs("#rpBandScore");
    const accuracyEl = qs("#rpAccuracy");
    const incorrectList = qs("#rpIncorrectList");
    if (!modal || !overlay || !bandScoreEl || !accuracyEl || !incorrectList) return;

    const bandScore = Math.round((result.correctCount / result.total) * 9 * 10) / 10;
    bandScoreEl.textContent = bandScore.toFixed(1);
    accuracyEl.textContent = `${Math.round((result.correctCount / result.total) * 100)}% (${result.correctCount}/${result.total} correct)`;

    incorrectList.innerHTML = "";
    if (result.incorrect.length === 0) {
      incorrectList.textContent = "All answers are correct.";
    } else {
      result.incorrect.forEach(value => {
        const chip = document.createElement("div");
        chip.textContent = value;
        chip.style.display = "inline-block";
        chip.style.margin = "2px 4px";
        chip.style.padding = "4px 10px";
        chip.style.borderRadius = "999px";
        chip.style.background = "#fee2e2";
        chip.style.color = "#b91c1c";
        chip.style.fontSize = "0.85rem";
        incorrectList.appendChild(chip);
      });
    }

    overlay.style.display = "block";
    modal.style.display = "block";
  }

  function closeResultModal() {
    const modal = qs("#rpResultModal");
    const overlay = qs("#rpOverlay");
    if (modal) modal.style.display = "none";
    if (overlay) overlay.style.display = "none";
  }

  function toggleNotesDrawer() {
    const drawer = qs("#rpNotesDrawer");
    if (!drawer) return;
    drawer.style.display = drawer.style.display === "block" ? "none" : "block";
  }

  function closeNotesDrawer() {
    const drawer = qs("#rpNotesDrawer");
    if (drawer) drawer.style.display = "none";
  }

  function openSettingsModal() {
    const modal = qs("#rpSettingsModal");
    const overlay = qs("#rpOverlay");
    if (!modal || !overlay) return;
    modal.style.display = "block";
    overlay.style.display = "block";
  }

  function closeSettingsModal() {
    const modal = qs("#rpSettingsModal");
    const overlay = qs("#rpOverlay");
    if (modal) modal.style.display = "none";
    if (overlay) overlay.style.display = "none";
  }

  function resetAnswers() {
    qsa("input[type=radio]").forEach(input => {
      input.checked = false;
    });
    qsa("input.rp-text-answer").forEach(input => {
      input.value = "";
    });
  }

  function attachEvents() {
    onClick("#rpSubmitBtn", event => {
      event.preventDefault();
      showResultModal(gradeAnswers());
    });
    onClick("#rpCloseResult", event => {
      event.preventDefault();
      closeResultModal();
    });
    onClick("#rpReviewBtn", event => {
      event.preventDefault();
      closeResultModal();
    });
    onClick("#rpDashboardBtn", event => {
      event.preventDefault();
      window.location.href = state.dashboardHref;
    });
    onClick("#rpFinishBtn", event => {
      event.preventDefault();
      window.location.href = state.finishHref;
    });
    onClick("#rpNotesBtn", event => {
      event.preventDefault();
      toggleNotesDrawer();
    });
    onClick("#rpOpenNotesBtn", event => {
      event.preventDefault();
      toggleNotesDrawer();
    });
    onClick("#rpCloseNotes", event => {
      event.preventDefault();
      closeNotesDrawer();
    });
    onClick("#rpMenuBtn", event => {
      event.preventDefault();
      openSettingsModal();
    });
    onClick("#rpCloseSettings", event => {
      event.preventDefault();
      closeSettingsModal();
    });
    onClick("#rpFullscreenBtn", event => {
      event.preventDefault();
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    });
    onClick("#rpFullscreenFromSettings", event => {
      event.preventDefault();
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    });
    onClick("#rpResetBtn", event => {
      event.preventDefault();
      resetAnswers();
    });
  }

  function initReadingPassage(config) {
    state.finishHref = config.finishHref || "#";
    state.dashboardHref = config.dashboardHref || "#";
    state.correctAnswers = config.correctAnswers || {};
    startTimer((config.timerMinutes || 0) * 60);
    attachEvents();

    const overlay = qs("#rpOverlay");
    if (overlay) {
      overlay.style.display = "none";
      overlay.style.position = "fixed";
      overlay.style.left = "0";
      overlay.style.top = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0,0,0,0.4)";
      overlay.style.zIndex = "10000";
    }

    const modals = qsa(".rp-modal");
    modals.forEach(modal => {
      modal.style.display = "none";
      modal.style.position = "fixed";
      modal.style.zIndex = "10001";
      modal.style.left = "50%";
      modal.style.top = "50%";
      modal.style.transform = "translate(-50%, -50%)";
      modal.style.background = "white";
      modal.style.padding = "24px";
      modal.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
      modal.style.maxWidth = "520px";
      modal.style.width = "min(100%, 520px)";
      modal.style.borderRadius = "12px";
    });

    const drawer = qs("#rpNotesDrawer");
    if (drawer) {
      drawer.style.display = "none";
      drawer.style.position = "fixed";
      drawer.style.top = "0";
      drawer.style.right = "0";
      drawer.style.height = "100%";
      drawer.style.width = "360px";
      drawer.style.background = "white";
      drawer.style.zIndex = "10002";
      drawer.style.overflowY = "auto";
      drawer.style.boxShadow = "-24px 0 80px rgba(0,0,0,0.18)";
    }
  }

  window.initReadingPassage = initReadingPassage;
})();
