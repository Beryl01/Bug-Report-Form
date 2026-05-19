"use strict";
// Checks if the severity value from the form is one of the valid options
function isValidSeverity(value) {
    return ["low", "medium", "high", "critical"].includes(value);
}

// My DOM elements 
const nameInput = document.getElementById("reporter-name");
const titleInput = document.getElementById("bug-title");
const severityInput = document.getElementById("severity");
const descriptionInput = document.getElementById("description");
const submitBtn = document.getElementById("submit-btn");
const successMessage = document.getElementById("success-message");
const submittedReport = document.getElementById("submitted-report");
const allReports = document.getElementById("all-reports");

// Error messages and elements shown below each field
const nameError = document.getElementById("name-error");
const titleError = document.getElementById("title-error");
const severityError = document.getElementById("severity-error");
const descriptionError = document.getElementById("description-error");


// Error display helper. Shows or hides the error message under a field
function showError(errorEl, show) {
    if (show) {
        errorEl.classList.add("visible");
    }
    else {
        errorEl.classList.remove("visible");
    }
}
// The Validations 
function validateForm() {
    let isValid = true;
    const name = nameInput.value.trim();
    const title = titleInput.value.trim();
    const severity = severityInput.value;
    const description = descriptionInput.value.trim();
    if (name === "") {
        showError(nameError, true);
        isValid = false;
    }
    else {
        showError(nameError, false);
    }
    if (title.length < 10) {
        showError(titleError, true);
        isValid = false;
    }
    else {
        showError(titleError, false);
    }
    if (!isValidSeverity(severity)) {
        showError(severityError, true);
        isValid = false;
    }
    else {
        showError(severityError, false);
    }
    if (description.length < 20) {
        showError(descriptionError, true);
        isValid = false;
    }
    else {
        showError(descriptionError, false);
    }
    return isValid;
}


// Loads all saved reports 
function loadReports() {
    const data = localStorage.getItem("bugReports");
    if (data === null)
        return [];
    return JSON.parse(data);
}


// Adds a new report to the saved list in localStorage
function saveReport(report) {
    const existing = loadReports();
    existing.push(report);
    localStorage.setItem("bugReports", JSON.stringify(existing));
}


// Shows the report that was just submitted at the top of the page
function displayCurrentReport(report) {
    const outName = document.getElementById("out-name");
    const outTitle = document.getElementById("out-title");
    const outSeverity = document.getElementById("out-severity");
    const outDescription = document.getElementById("out-description");
    outName.textContent = report.reporterName;
    outTitle.textContent = report.bugTitle;
    outSeverity.textContent = report.severity;
    outDescription.textContent = report.description;
    submittedReport.style.display = "block";
}

// Full list of saved reports below the form
function displayAllReports() {
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


// Submit handler 
submitBtn.addEventListener("click", () => {
    const valid = validateForm();
    if (!valid)
        return;
    const report = {
        reporterName: nameInput.value.trim(),
        bugTitle: titleInput.value.trim(),
        severity: severityInput.value,
        description: descriptionInput.value.trim(),
    };
    saveReport(report);
    displayCurrentReport(report);
    displayAllReports();
    successMessage.style.display = "block";

    
    // Clear the form fields after a successful submit
    nameInput.value = "";
    titleInput.value = "";
    severityInput.value = "";
    descriptionInput.value = "";
});


// Show any previously saved reports 
displayAllReports();
