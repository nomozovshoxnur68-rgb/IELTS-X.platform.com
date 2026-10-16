(function (window, document) {
  const api = window.IELTSXData;
  if (!api) {
    return;
  }

  const ACTIVITY_SVG_ID = "performanceActivitySvg";
  const LISTENING_TRIGGER_ID = "radix-:rbl:-trigger-listening";
  const READING_TRIGGER_ID = "radix-:rbl:-trigger-reading";
  const WRITING_TRIGGER_ID = "radix-:rbl:-trigger-writing";
  const LISTENING_PANEL_ID = "radix-:rbl:-content-listening";
  const READING_PANEL_ID = "radix-:rbl:-content-reading";
  const WRITING_PANEL_ID = "radix-:rbl:-content-writing";

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function getScopedResults() {
    const currentUserResults = api.getCurrentUserResults();
    return currentUserResults.length ? currentUserResults : api.getResults();
  }

  function renderActivity(results) {
    const activity = api.getActivity(results);
    const svg = document.getElementById(ACTIVITY_SVG_ID);
    if (!svg) {
      return;
    }

    const oldLayer = document.getElementById("performanceActivityCells");
    if (oldLayer) {
      oldLayer.remove();
    }

    const layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    layer.setAttribute("id", "performanceActivityCells");

    const startDate = new Date(activity[0] ? activity[0].date : new Date().toISOString().slice(0, 10));
    const maxCount = activity.reduce(function (max, day) {
      return Math.max(max, day.count);
    }, 0);
    const cellSize = 12;
    const gap = 4;
    const startX = 0;
    const startY = 20;

    function getFill(count) {
      if (count <= 0) {
        return "hsl(var(--muted))";
      }
      if (maxCount <= 1 || count === 1) {
        return "#a7f3d0";
      }
      if (count === 2) {
        return "#6ee7b7";
      }
      if (count === 3) {
        return "#34d399";
      }
      return "#059669";
    }

    activity.forEach(function (day, index) {
      const week = Math.floor(index / 7);
      const weekday = day.dayOfWeek;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(startX + week * (cellSize + gap)));
      rect.setAttribute("y", String(startY + weekday * (cellSize + gap)));
      rect.setAttribute("width", String(cellSize));
      rect.setAttribute("height", String(cellSize));
      rect.setAttribute("rx", "3");
      rect.setAttribute("ry", "3");
      rect.setAttribute("fill", getFill(day.count));
      rect.setAttribute("style", "stroke: rgba(0, 0, 0, 0.08);");

      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = day.date + ": " + day.count + " test" + (day.count === 1 ? "" : "s");
      rect.appendChild(title);
      layer.appendChild(rect);
    });

    svg.appendChild(layer);

    const totalTests = results.length;
    const activeDays = new Set(
      results.map(function (item) {
        return String(item.createdAt || "").slice(0, 10);
      })
    ).size;

    setText("performanceTotalTestsBadge", totalTests + " tests");
    setText("performanceActiveDaysBadge", activeDays + " active days");
    setText("performanceActivityCount", totalTests + " tests in the last year");
  }

  function renderAverageTable(results) {
    ["Practice", "Mock"].forEach(function (bucket) {
      const bucketResults = api.getBucketResults(results, bucket);
      const listening = api.getAverageBand(bucketResults, "Listening");
      const reading = api.getAverageBand(bucketResults, "Reading");
      const writing = api.getAverageBand(bucketResults, "Writing");
      const overall = api.average(
        [listening, reading, writing].filter(function (value) {
          return value !== null;
        })
      );
      const prefix = bucket.toLowerCase();
      setText("performance" + api.titleCase(prefix) + "Listening", api.formatBand(listening));
      setText("performance" + api.titleCase(prefix) + "Reading", api.formatBand(reading));
      setText("performance" + api.titleCase(prefix) + "Writing", api.formatBand(writing));
      setText("performance" + api.titleCase(prefix) + "Overall", api.formatBand(overall));
    });
  }

  function getSkillColor(section) {
    if (section === "Listening") {
      return "bg-sky-500";
    }
    if (section === "Reading") {
      return "bg-lime-500";
    }
    return "bg-violet-500";
  }

  function renderSkillPanel(panelId, section) {
    const panel = document.getElementById(panelId);
    if (!panel) {
      return;
    }

    const results = api.getSectionResults(getScopedResults(), section).slice().sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (!results.length) {
      panel.innerHTML =
        '<div class="rounded-xl border p-6 text-center text-muted-foreground">No ' +
        section.toLowerCase() +
        ' attempts saved yet.</div>';
      return;
    }

    const latest = results[0];
    const averageBand = api.getAverageBand(results);
    const bestBand = Math.max.apply(
      Math,
      results.map(function (item) {
        return Number(item.band || 0);
      })
    );
    const barClass = getSkillColor(section);
    const attempts = results.slice(0, 6).map(function (item, index) {
      const width = Math.max(8, Math.min(100, (Number(item.band || 0) / 9) * 100));
      const created = new Date(item.createdAt);
      const label = item.bucket + " " + (results.length - index);
      return (
        '<div class="space-y-2">' +
        '<div class="flex items-center justify-between gap-3 text-sm">' +
        '<span class="font-medium">' +
        label +
        "</span>" +
        '<span class="text-muted-foreground">' +
        (created.toLocaleDateString ? created.toLocaleDateString() : String(item.createdAt).slice(0, 10)) +
        "</span>" +
        "</div>" +
        '<div class="flex items-center gap-3">' +
        '<div class="h-2 flex-1 rounded-full bg-muted overflow-hidden">' +
        '<div class="h-full rounded-full ' +
        barClass +
        '" style="width:' +
        width.toFixed(0) +
        '%"></div>' +
        "</div>" +
        '<div class="w-10 text-right font-semibold">' +
        Number(item.band || 0).toFixed(1) +
        "</div>" +
        "</div>" +
        "</div>"
      );
    });

    panel.innerHTML =
      '<div class="space-y-6">' +
      '<div class="grid gap-4 md:grid-cols-3">' +
      '<div class="rounded-xl border p-4"><div class="text-sm text-muted-foreground">Average band</div><div class="mt-2 text-3xl font-bold">' +
      api.formatBand(averageBand) +
      "</div></div>" +
      '<div class="rounded-xl border p-4"><div class="text-sm text-muted-foreground">Best attempt</div><div class="mt-2 text-3xl font-bold">' +
      Number(bestBand).toFixed(1) +
      "</div></div>" +
      '<div class="rounded-xl border p-4"><div class="text-sm text-muted-foreground">Latest score</div><div class="mt-2 text-3xl font-bold">' +
      Number(latest.band || 0).toFixed(1) +
      "</div></div>" +
      "</div>" +
      '<div class="rounded-xl border">' +
      '<div class="border-b p-4"><h4 class="text-lg font-medium">' +
      section +
      ' progress</h4><p class="text-sm text-muted-foreground">Most recent saved attempts</p></div>' +
      '<div class="space-y-4 p-4">' +
      attempts.join("") +
      "</div>" +
      "</div>" +
      "</div>";
  }

  function initTabs() {
    const tabs = [
      { trigger: LISTENING_TRIGGER_ID, panel: LISTENING_PANEL_ID },
      { trigger: READING_TRIGGER_ID, panel: READING_PANEL_ID },
      { trigger: WRITING_TRIGGER_ID, panel: WRITING_PANEL_ID },
    ];

    function activate(selectedPanelId) {
      tabs.forEach(function (tab) {
        const trigger = document.getElementById(tab.trigger);
        const panel = document.getElementById(tab.panel);
        const isActive = tab.panel === selectedPanelId;
        if (trigger) {
          trigger.setAttribute("aria-selected", isActive ? "true" : "false");
          trigger.setAttribute("data-state", isActive ? "active" : "inactive");
        }
        if (panel) {
          panel.setAttribute("data-state", isActive ? "active" : "inactive");
          if (isActive) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "");
          }
        }
      });
    }

    tabs.forEach(function (tab) {
      const trigger = document.getElementById(tab.trigger);
      if (!trigger) {
        return;
      }
      trigger.addEventListener("click", function () {
        activate(tab.panel);
      });
    });

    activate(LISTENING_PANEL_ID);
  }

  function renderMockResults(results) {
    const container = document.getElementById("mockResultsContainer");
    if (!container) {
      return;
    }

    const mockResults = api.getBucketResults(results, "Mock");
    if (!mockResults.length) {
      container.innerHTML =
        '<div class="p-6 text-center text-muted-foreground">Complete a mock test to see your mock exam results.</div>';
      return;
    }

    const rows = mockResults.slice(0, 8).map(function (item) {
      const created = new Date(item.createdAt);
      return (
        "<tr class=\"border-t\">" +
        '<td class="px-4 py-3 font-medium">' +
        item.section +
        "</td>" +
        '<td class="px-4 py-3">' +
        item.pageLabel +
        "</td>" +
        '<td class="px-4 py-3 text-center">' +
        api.formatBand(item.band) +
        "</td>" +
        '<td class="px-4 py-3 text-center">' +
        item.scoreCorrect +
        "/" +
        item.scoreTotal +
        "</td>" +
        '<td class="px-4 py-3 text-right text-muted-foreground">' +
        (created.toLocaleDateString ? created.toLocaleDateString() : String(item.createdAt).slice(0, 10)) +
        "</td>" +
        "</tr>"
      );
    });

    container.innerHTML =
      '<div class="overflow-x-auto rounded border">' +
      '<table class="w-full min-w-[560px] text-sm">' +
      '<thead class="bg-muted/50 text-muted-foreground"><tr><th class="px-4 py-3 text-left font-medium">Section</th><th class="px-4 py-3 text-left font-medium">Test</th><th class="px-4 py-3 text-center font-medium">Band</th><th class="px-4 py-3 text-center font-medium">Score</th><th class="px-4 py-3 text-right font-medium">Date</th></tr></thead>' +
      "<tbody>" +
      rows.join("") +
      "</tbody></table></div>";
  }

  function render() {
    if (!document.getElementById(ACTIVITY_SVG_ID)) {
      return;
    }

    const currentUser = api.getCurrentUser();
    const results = getScopedResults();
    const summary = api.getSummary(results);

    setText(
      "performanceUserContext",
      currentUser && currentUser.name
        ? "Showing saved performance for " +
            currentUser.name +
            (currentUser.email ? " (" + currentUser.email + ")." : ".")
        : "Showing saved performance from this device."
    );
    setText("performanceTotalTestsBadge", summary.totalTests + " tests");
    setText("performanceActiveDaysBadge", summary.activeDays + " active days");
    renderActivity(results);
    renderAverageTable(results);
    renderSkillPanel(LISTENING_PANEL_ID, "Listening");
    renderSkillPanel(READING_PANEL_ID, "Reading");
    renderSkillPanel(WRITING_PANEL_ID, "Writing");
    renderMockResults(results);
    initTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }

  window.addEventListener("ieltsx:user-context-changed", render);
  window.addEventListener("storage", function (event) {
    if (
      event.key === "ieltsx_current_user_v1" ||
      event.key === "ieltsx_current_access" ||
      event.key === "ieltsx_results_v1"
    ) {
      render();
    }
  });
})(window, document);
