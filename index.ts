// This interface defines the shape of a bug report object.
interface BugReport {
  reporterName: string;
  bugTitle: string;
  severity: string;
  description: string;
}

// These are the only valid severity values we use.
type SeverityLevel = "low" | "medium" | "high" | "critical";

// A small helper that checks if the severity coming from the form
function isValidSeverity(value: string): value is SeverityLevel {
  return ["low", "medium", "high", "critical"].includes(value);
}

// All the form elements from the DOM. it.
const nameInput = document.getElementById("reporter-name") as HTMLInputElement;
const titleInput = document.getElementById("bug-title") as HTMLInputElement;
const severityInput = document.getElementById("severity") as HTMLSelectElement;
const descriptionInput = document.getElementById("description") as HTMLTextAreaElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
const successMessage = document.getElementById("success-message") as HTMLDivElement;
const submittedReport = document.getElementById("submitted-report") as HTMLDivElement;

// These are the error message elements shown below each input field
const nameError = document.getElementById("name-error") as HTMLParagraphElement;
const titleError = document.getElementById("title-error") as HTMLParagraphElement;
const severityError = document.getElementById("severity-error") as HTMLParagraphElement;
const descriptionError = document.getElementById("description-error") as HTMLParagraphElement;

// This function shows or hides an error message under a field.
// Instead of writing this logic four times, we made it reusable.
function showError(errorEl: HTMLElement, show: boolean): void {
  if (show) {
    errorEl.classList.add("visible");
  } else {
    errorEl.classList.remove("visible");
  }
}

// This is where all the validation logic.
function validateForm(): boolean {
  let isValid = true;

  const name = nameInput.value.trim();
  const title = titleInput.value.trim();
  const severity = severityInput.value;
  const description = descriptionInput.value.trim();

  // Name can't be empty
  if (name === "") {
    showError(nameError, true);
    isValid = false;
  } else {
    showError(nameError, false);
  }

  // Title needs to be at least 10 characters
  if (title.length < 10) {
    showError(titleError, true);
    isValid = false;
  } else {
    showError(titleError, false);
  }

  // Severity must be one of our valid options, not the placeholder
  if (!isValidSeverity(severity)) {
    showError(severityError, true);
    isValid = false;
  } else {
    showError(severityError, false);
  }

  // Description needs enough detail — at least 30 characters
  if (description.length < 30) {
    showError(descriptionError, true);
    isValid = false;
  } else {
    showError(descriptionError, false);
  }

  return isValid;
}

// This function takes a valid BugReport object and displays it on the page, have all four fields before we try to display them.
function displayReport(report: BugReport): void {
  const outName = document.getElementById("out-name") as HTMLSpanElement;
  const outTitle = document.getElementById("out-title") as HTMLSpanElement;
  const outSeverity = document.getElementById("out-severity") as HTMLSpanElement;
  const outDescription = document.getElementById("out-description") as HTMLSpanElement;

  outName.textContent = report.reporterName;
  outTitle.textContent = report.bugTitle;
  outSeverity.textContent = report.severity;
  outDescription.textContent = report.description;

  submittedReport.style.display = "block";
}

// The main click handler for the submit button.
submitBtn.addEventListener("click", () => {
  const valid = validateForm();

  if (!valid) return;

  // If all fields are clean, we can safely build our BugReport object
  const report: BugReport = {
    reporterName: nameInput.value.trim(),
    bugTitle: titleInput.value.trim(),
    severity: severityInput.value,
    description: descriptionInput.value.trim(),
  };

  successMessage.style.display = "block";
  displayReport(report);

  console.log("Bug report submitted:", report);
});
