// Defines the shape of a bug report object — every report must have these four fields
interface BugReport {
  reporterName: string;
  bugTitle: string;
  severity: string;
  description: string;
}

// These are the only valid severity values
type SeverityLevel = "low" | "medium" | "high" | "critical";

// Checks if the severity value from the form is one of our valid options
function isValidSeverity(value: string): value is SeverityLevel {
  return ["low", "medium", "high", "critical"].includes(value);
}

// ── DOM elements ──────────────────────────────────────────────────────────────

const nameInput        = document.getElementById("reporter-name") as HTMLInputElement;
const titleInput       = document.getElementById("bug-title")     as HTMLInputElement;
const severityInput    = document.getElementById("severity")      as HTMLSelectElement;
const descriptionInput = document.getElementById("description")   as HTMLTextAreaElement;
const submitBtn        = document.getElementById("submit-btn")    as HTMLButtonElement;
const successMessage   = document.getElementById("success-message") as HTMLDivElement;
const submittedReport  = document.getElementById("submitted-report") as HTMLDivElement;
const allReports       = document.getElementById("all-reports")   as HTMLDivElement;

// Error message elements shown below each field
const nameError        = document.getElementById("name-error")        as HTMLParagraphElement;
const titleError       = document.getElementById("title-error")       as HTMLParagraphElement;
const severityError    = document.getElementById("severity-error")    as HTMLParagraphElement;
const descriptionError = document.getElementById("description-error") as HTMLParagraphElement;

// ── Error display helper ──────────────────────────────────────────────────────

// Shows or hides the error message under a field
function showError(errorEl: HTMLElement, show: boolean): void {
  if (show) {
    errorEl.classList.add("visible");
  } else {
    errorEl.classList.remove("visible");
  }
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateForm(): boolean {
  let isValid = true;

  const name        = nameInput.value.trim();
  const title       = titleInput.value.trim();
  const severity    = severityInput.value;
  const description = descriptionInput.value.trim();

  if (name === "") {
    showError(nameError, true);
    isValid = false;
  } else {
    showError(nameError, false);
  }

  if (title.length < 10) {
    showError(titleError, true);
    isValid = false;
  } else {
    showError(titleError, false);
  }

  if (!isValidSeverity(severity)) {
    showError(severityError, true);
    isValid = false;
  } else {
    showError(severityError, false);
  }

  if (description.length < 20) {
    showError(descriptionError, true);
    isValid = false;
  } else {
    showError(descriptionError, false);
  }

  return isValid;
}

// ── localStorage: save and load ───────────────────────────────────────────────

// Loads all saved reports from localStorage. Returns an empty array if none exist.
function loadReports(): BugReport[] {
  const data = localStorage.getItem("bugReports");
  if (data === null) return [];
  return JSON.parse(data) as BugReport[];
}

// Adds a new report to the saved list in localStorage
function saveReport(report: BugReport): void {
  const existing: BugReport[] = loadReports();
  existing.push(report);
  localStorage.setItem("bugReports", JSON.stringify(existing));
}

// ── Display ───────────────────────────────────────────────────────────────────

// Shows the report that was just submitted at the top of the page
function displayCurrentReport(report: BugReport): void {
  const outName        = document.getElementById("out-name")        as HTMLSpanElement;
  const outTitle       = document.getElementById("out-title")       as HTMLSpanElement;
  const outSeverity    = document.getElementById("out-severity")    as HTMLSpanElement;
  const outDescription = document.getElementById("out-description") as HTMLSpanElement;

  outName.textContent        = report.reporterName;
  outTitle.textContent       = report.bugTitle;
  outSeverity.textContent    = report.severity;
  outDescription.textContent = report.description;

  submittedReport.style.display = "block";
}

// Renders the full list of saved reports below the form
function displayAllReports(): void {
  const reports = loadReports();

  if (reports.length === 0) {
    allReports.style.display = "none";
    return;
  }

  allReports.style.display = "block";
  allReports.innerHTML = `<h3>All Saved Reports (${reports.length})</h3>`;

  reports.forEach((report, index) => {
    const card = document.createElement("div");
    card.className = "saved-report-card";

    // Using textContent (not innerHTML) so user-typed text can never be treated as HTML
    const titleLine = document.createElement("p");
    const titleSpan = document.createElement("span");
    titleSpan.textContent = `#${index + 1} — ${report.bugTitle}`;
    const severityTag = document.createElement("em");
    severityTag.textContent = ` [${report.severity}]`;
    titleLine.appendChild(titleSpan);
    titleLine.appendChild(severityTag);

    const reporterLine = document.createElement("p");
    reporterLine.textContent = `Reporter: ${report.reporterName}`;

    const descLine = document.createElement("p");
    descLine.textContent = report.description;

    card.appendChild(titleLine);
    card.appendChild(reporterLine);
    card.appendChild(descLine);
    allReports.appendChild(card);
  });
}

// ── Submit handler ────────────────────────────────────────────────────────────

submitBtn.addEventListener("click", () => {
  const valid = validateForm();
  if (!valid) return;

  const report: BugReport = {
    reporterName: nameInput.value.trim(),
    bugTitle:     titleInput.value.trim(),
    severity:     severityInput.value,
    description:  descriptionInput.value.trim(),
  };

  saveReport(report);
  displayCurrentReport(report);
  displayAllReports();

  successMessage.style.display = "block";

  // Clear the form fields after a successful submit
  nameInput.value        = "";
  titleInput.value       = "";
  severityInput.value    = "";
  descriptionInput.value = "";
});

// ── On page load: show any previously saved reports ───────────────────────────
displayAllReports();
