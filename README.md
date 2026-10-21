# ReviewSense AI

> **"Turn customer feedback into smarter decisions."**

ReviewSense AI is a full-stack, enterprise-grade customer intelligence web application. It ingests unstructured customer reviews from any channel (e-commerce, app stores, support tickets, satisfaction surveys) and uses Google Gemini to generate validated sentiment distributions, extract recurring themes, pinpoint operational bottlenecks, and provide actionable business recommendations.

---

## Table of Contents

1. [Project Overview and Objectives](#project-overview-and-objectives)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Prerequisites](#prerequisites)
6. [Windows Setup & Local Execution Guide](#windows-setup--local-execution-guide)
7. [Environment & Gemini API Key Configuration](#environment--gemini-api-key-configuration)
8. [Automated Testing](#automated-testing)
9. [Jenkins CI/CD Automation](#jenkins-cicd-automation)
10. [Git & GitHub Workflow](#git--github-workflow)
11. [Privacy & Security Architecture](#privacy--security-architecture)
12. [Five Website Improvements and Commit History](#five-website-improvements-and-commit-history)
13. [Screenshot Checklist](#screenshot-checklist)
14. [Troubleshooting & Known Limitations](#troubleshooting--known-limitations)
15. [**View DevOps ISE-II Documentation (PDF)**](Project%20Documentation/DevOps%20ISE-II.pdf)

---

## Project Overview and Objectives

Modern organizations often receive hundreds of unstructured feedback comments weekly across various touchpoints. Manual review reading is slow, error-prone, and biased.

**ReviewSense AI** solves this problem by automating qualitative customer feedback synthesis:
- **Instant Sentiment Classification**: Labels each review as Positive, Negative, or Neutral with accompanying rationales.
- **Mathematical Integrity**: Sentiment statistics and percentages are calculated strictly from the validated classification outcomes.
- **Root Cause & Theme Extraction**: Clusters customer likes and recurring friction points into concrete categories.
- **Actionable Strategic Insights**: Formulates prioritized, realistic operational next steps without vague business promises.
- **Zero Lock-In Export**: One-click JSON and CSV export for downstream CRM or business intelligence integration.

---

## Key Features

- **Intuitive SaaS Workspace**: Clean, light-themed interface built with responsive HTML5, modern CSS3 variables, and vanilla JavaScript.
- **Official Google Gemini Integration**: Leverages Google's official `google-genai` Python SDK with configurable model selection (`gemini-2.5-flash` default).
- **Prompt Injection Defense**: Customer reviews are treated as untrusted data and strictly bounded within analysis guards to prevent prompt-injection attacks.
- **Mathematical Consistency**: Total classified reviews strictly equal the sum of positive, negative, and neutral items. Percentages always total 100%.
- **Live Input Telemetry**: Dynamic review counter and character tracking (up to 50,000 characters).
- **Interactive Sentiment Filter + Keyword Search**: Filter review breakdowns dynamically by sentiment (All, Positive, Negative, Neutral) and search by keyword.
- **JSON & CSV Report Export**: Download complete reports including metadata, metrics, themes, and recommendations as JSON or CSV.
- **Recent Analysis History**: Stores the last 5 analysis summaries in the browser's localStorage — no raw review text is ever saved.
- **Copy AI Summary**: One-click clipboard copy of the executive summary with context metadata.
- **Print-Friendly Report**: Dedicated print stylesheet hides all UI chrome and formats the analysis dashboard for paper or PDF.
- **Robust Error Handling**: Transparent user-facing alerts for missing API keys, rate limits, timeouts, and oversized inputs.

---

## Technology Stack

- **Backend**: Python 3.10+ with [Flask 3.x](https://flask.palletsprojects.com/)
- **AI SDK**: Official [`google-genai`](https://pypi.org/project/google-genai/) SDK
- **Configuration**: [`python-dotenv`](https://pypi.org/project/python-dotenv/)
- **Frontend**: Semantic HTML5, CSS3 (Modern Flexbox/Grid, CSS custom properties), Vanilla JavaScript (ES6+, zero third-party UI dependencies)
- **Testing**: [`pytest`](https://docs.pytest.org/) with comprehensive unit and mocking fixtures
- **CI Automation**: Declarative `Jenkinsfile` for automated pipeline execution

---

## Folder Structure

```
reviewsense-ai/
├── app.py                  # Flask application server, endpoints, Gemini client, & metrics logic
├── requirements.txt        # Python dependency manifest
├── .env.example            # Environment variable template with placeholders
├── .gitignore              # Ignores .env, virtual environments, caches, and test artifacts
├── pytest.ini              # Pytest configuration and warning filters
├── Jenkinsfile             # Declarative Jenkins CI pipeline definition
├── README.md               # Complete setup, technical architecture, and operations manual
├── templates/
│   └── index.html          # Semantic HTML5 single-page application
├── static/
│   ├── css/
│   │   └── style.css       # Premium light-theme SaaS design and responsive styling
│   └── js/
│       └── app.js          # Client-side validation, health polling, DOM rendering, & export
└── tests/
    └── test_app.py         # 100% mocked automated unit and integration tests
```

---

## Prerequisites

Before running ReviewSense AI locally on Windows:
- **Operating System**: Windows 10 or Windows 11 (64-bit)
- **Python**: Python 3.10, 3.11, 3.12, 3.13, or 3.14 (Ensure *"Add python.exe to PATH"* was selected during installation)
- **Code Editor**: Visual Studio Code (Recommended) with the official Python extension
- **Google Gemini API Key**: Free or paid key from [Google AI Studio](https://aistudio.google.com/)

---

## Windows Setup & Local Execution Guide

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Click **File** > **Open Folder...** (or press `Ctrl+K, Ctrl+O`).
3. Navigate to and select the `reviewsense-ai` directory:
   ```
   C:\Users\Admin\.gemini\antigravity\scratch\reviewsense-ai
   ```
4. Open an integrated PowerShell terminal in VS Code (`` Ctrl+` ``).

### Step 2: Create and Activate a Python Virtual Environment
Creating an isolated virtual environment prevents conflicts with globally installed packages:

```powershell
# Create a virtual environment named 'venv'
python -m venv venv

# If running on PowerShell, set execution policy if needed:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Activate the virtual environment
.\venv\Scripts\Activate.ps1
```

*(When active, `(venv)` will appear at the start of your terminal command prompt).*

### Step 3: Install Required Dependencies
Install the required packages from `requirements.txt`:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Step 4: Run the Application

```powershell
python app.py
```

The terminal will display:
```
[*] Starting ReviewSense AI server on http://127.0.0.1:5000 (Debug: False)
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

Open your browser and visit: **`http://127.0.0.1:5000`**

---

## Environment & Gemini API Key Configuration

1. In the root directory, create a local `.env` file by copying `.env.example`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Open `.env` in VS Code and insert your Gemini API Key:
   ```ini
   # Google Gemini API Key from https://aistudio.google.com/
   GEMINI_API_KEY=AIzaSyYourActualKeyHere

   # Currently supported Flash model
   GEMINI_MODEL=gemini-2.5-flash

   # Server Settings
   FLASK_ENV=development
   PORT=5000
   DEBUG=False
   ```

> [!CAUTION]
> Never commit your `.env` file with real API credentials to any Git repository or public tracking service. The `.gitignore` file is preconfigured to prevent this.

---

## Automated Testing

ReviewSense AI includes automated tests in `tests/test_app.py`. All external Gemini calls are mocked, allowing tests to run rapidly and offline without an API key or quota consumption.

To execute the test suite:

```powershell
python -m pytest tests/ -v
```

### Verified Test Results (21/21 passed):

| Test | Status |
|------|--------|
| `test_health_endpoint` | ✅ PASS |
| `test_landing_page_loads` | ✅ PASS |
| `test_analyze_empty_request` | ✅ PASS |
| `test_analyze_invalid_content_type` | ✅ PASS |
| `test_analyze_oversized_request` | ✅ PASS |
| `test_missing_api_key` | ✅ PASS |
| `test_valid_analysis_and_calculations` | ✅ PASS |
| `test_missing_or_invalid_classifications_fallback` | ✅ PASS |
| `test_gemini_api_rate_limit` | ✅ PASS |
| `test_gemini_malformed_json_response` | ✅ PASS |
| `test_gemini_empty_response` | ✅ PASS |
| `test_gemini_model_unavailable` | ✅ PASS |
| `test_gemini_invalid_api_key` | ✅ PASS |
| `test_gemini_permission_denied` | ✅ PASS |
| `test_gemini_service_high_demand` | ✅ PASS |
| `test_gemini_timeout_error` | ✅ PASS |
| `test_sanitization_redacts_api_keys_and_tokens` | ✅ PASS |
| `test_diagnostic_logging_does_not_leak_secrets` | ✅ PASS |
| `test_prompt_injection_safety_prompt_format` | ✅ PASS |
| `test_clean_json_response_with_markdown_blocks` | ✅ PASS |
| `test_sanitize_input_text` | ✅ PASS |

**Result: 21 passed in ~2 seconds** (Python 3.13.14, pytest 9.1.1)

---

## Jenkins CI/CD Automation

ReviewSense AI is configured with a Declarative `Jenkinsfile` for continuous integration.

### Pipeline Stages:
1. **Checkout**: Retrieves source code from the configured repository.
2. **Python Environment Check**: Detects Python 3 on Linux or Windows Jenkins agents.
3. **Install Dependencies**: Installs packages from `requirements.txt` into a virtual environment.
4. **Run Pytest Test Suite**: Runs automated tests and produces a `test-results.xml` report via the Jenkins JUnit plugin.

### Jenkins Prerequisites:
- Jenkins server with an active agent node.
- Python 3.10+ installed on the agent and available on PATH.
- Git client installed on the agent.
- Recommended Jenkins Plugins:
  - **Pipeline** (workflow-aggregator)
  - **Git plugin**
  - **JUnit plugin** (to visualize test reports)

> [!NOTE]
> No real `GEMINI_API_KEY` is required in Jenkins because all automated tests run against mocked Gemini responses.

### Jenkins Setup (Local / Windows):
1. Install Jenkins from [jenkins.io](https://www.jenkins.io/download/).
2. Install recommended plugins plus the JUnit plugin.
3. Create a **Pipeline** job pointing to the GitHub repository (`https://github.com/APpppurv03/reviewsense-ai`).
4. Set **Script Path** to `Jenkinsfile`.
5. Click **Build Now**. The pipeline runs Checkout → Python Check → pip install → pytest.
6. Build results and test reports appear in the Jenkins build log and Test Results tab.

---

## Git & GitHub Workflow

```powershell
# Clone the repository
git clone https://github.com/APpppurv03/reviewsense-ai.git

# Navigate into the project
cd reviewsense-ai

# Check status
git status

# Stage and commit a change
git add <file>
git commit -m "descriptive commit message"

# Push to GitHub (without force)
git push origin main
```

> [!CAUTION]
> Never use `git push --force` on the `main` branch. This project maintains a linear commit history.

---

## Privacy & Security Architecture

1. **Zero Server Persistence**: Customer review content and generated analyses are processed strictly in-memory and are never written to disk or stored in a backend database.
2. **Untrusted Data Isolation**: User feedback text is treated as untrusted data with strict boundaries in the system prompt to prevent prompt injection.
3. **Safe DOM Rendering**: All dynamic elements on the frontend are rendered using `textContent` and safe DOM construction methods — all `innerHTML` use in the history panel runs through an `escapeHtml()` utility function — preventing Cross-Site Scripting (XSS).
4. **Credential Isolation**: The Gemini API key is loaded strictly into server memory via `python-dotenv` and is never exposed in client-side HTML, CSS, JavaScript, or API JSON responses.
5. **localStorage Privacy**: The Recent Analysis History panel stores only: business name, industry, summary text, and aggregate metrics. Raw review text is never written to `localStorage`.
6. **Notice on Third-Party Processing**: The interface and documentation clearly disclose that submitted review text is transmitted to Google's Gemini API for processing.

---

## Five Website Improvements and Commit History

The following five functional improvements were developed and committed separately after the initial project release. All commits are on the `main` branch at `https://github.com/APpppurv03/reviewsense-ai`.

### Commit 1 — Keyword Search for Classified Reviews

**Hash:** `118768c`
**Message:** `Add keyword search for classified reviews`
**Files changed:** `static/js/app.js`, `static/css/style.css`, `templates/index.html`

**What it does:**
- Adds a live search field below the sentiment filter tabs.
- Searches across review excerpt, theme, explanation, and sentiment label as the user types.
- Works in combination with the All / Positive / Negative / Neutral filter tabs.
- Shows a result count badge (e.g., "3 reviews found").
- Displays contextual empty-state messages when no results match keyword or filter.
- Clears the search field and result count when "Reset & Start Over" is used.
- Responsive: search row stacks vertically on narrow viewports (≤640px).

**Verification:** `node --check static/js/app.js` → exit 0 | `python -m pytest tests/ -v` → **21/21 passed**

---

### Commit 2 — CSV Export for Classified Reviews

**Hash:** `ec83ec2`
**Message:** `Add CSV export for classified reviews`
**Files changed:** `static/js/app.js`, `templates/index.html`

**What it does:**
- Adds a "Download CSV" button in the dashboard action bar beside the existing JSON export.
- Exports: Review ID, Sentiment, Theme, Excerpt, Explanation.
- Correctly escapes commas, double-quotes, and embedded newlines (RFC 4180 compliant).
- Prepends a UTF-8 BOM so Excel opens the file correctly without import configuration.
- Uses a timestamped filename: `reviewsense_reviews_<name>_<timestamp>.csv`.
- Handles empty-analysis state with a user-facing informational banner.
- Preserves the existing JSON export unchanged.

**Verification:** `node --check static/js/app.js` → exit 0 | `python -m pytest tests/ -v` → **21/21 passed**

---

### Commit 3 — Recent Analysis History

**Hash:** `dc83592`
**Message:** `Add recent analysis history`
**Files changed:** `static/js/app.js`, `static/css/style.css`, `templates/index.html`

**What it does:**
- Adds a "Recent Analyses" panel below the dashboard using browser `localStorage`.
- Stores the last 5 analyses (newest first). Older entries are automatically discarded.
- Each history card shows: business name, industry, formatted timestamp, review count badges (total/positive/negative), and a truncated executive summary.
- Stored fields: timestamp, business name, industry, summary, aggregate metrics — **raw review text is never stored**.
- Handles corrupted or missing `localStorage` data gracefully (try/catch).
- "Clear History" button with confirmation dialog removes all saved entries.
- Responsive card grid using `auto-fill minmax(260px, 1fr)`.

**Verification:** `node --check static/js/app.js` → exit 0 | `python -m pytest tests/ -v` → **21/21 passed**

---

### Commit 4 — Copy Action for Analysis Summary

**Hash:** `6d0037d`
**Message:** `Add copy action for analysis summary`
**Files changed:** `static/js/app.js`, `static/css/style.css`, `templates/index.html`

**What it does:**
- Adds a small "Copy" button inside the Executive Summary card header.
- Copies a rich text block: business name header, aggregate metrics line, and full summary text.
- Uses `navigator.clipboard.writeText()` (async, modern) with a synchronous `execCommand('copy')` fallback for legacy or insecure-context browsers.
- Visual feedback: button label changes to "Copied!" (green) or "Failed" (red) for 2.5 seconds, then resets.
- If both clipboard methods fail, shows a user-facing status banner explaining the failure.

**Verification:** `node --check static/js/app.js` → exit 0 | `python -m pytest tests/ -v` → **21/21 passed**

---

### Commit 5 — Print-Friendly Report View and Dashboard Action Button

**Hash:** `0555542`
**Message:** `Add print-friendly report view and dashboard action button`
**Files changed:** `static/css/style.css`, `templates/index.html`

**What it does:**
- Adds a "Print Report" button to the dashboard action bar (uses `window.print()` inline).
- Adds a comprehensive `@media print` stylesheet that:
  - Hides all interactive UI chrome (header, hero, workspace form, filter tabs, search field, history panel, footer, action buttons).
  - Removes all shadows and backgrounds to reduce ink usage.
  - Formats metric cards as a 4-column grid on A4 landscape.
  - Forces theme panels side-by-side.
  - Adds a "ReviewSense AI —" prefix to the report title via CSS `::before`.
  - Ensures review cards and recommendation cards do not break across pages (`break-inside: avoid`).
- Enables any user to Save the analysis as a PDF using the browser's built-in print-to-PDF functionality.

**Verification:** `python -m pytest tests/ -v` → **21/21 passed** | Print layout verified via browser print preview.

---

## Screenshot Checklist

The following screenshots are required as submission evidence. **Capture these manually in the browser at `http://127.0.0.1:5000`** after running `python app.py`:

| # | Screenshot | What to Show |
|---|-----------|--------------|
| 1 | `01_landing_page.png` | Full landing page with product name, tagline, and feature cards |
| 2 | `02_workspace.png` | Analysis workspace with sample reviews loaded |
| 3 | `03_analysis_in_progress.png` | Loading spinner during analysis (if capturable) |
| 4 | `04_dashboard_results.png` | Full dashboard with metrics, themes, and recommendations |
| 5 | `05_keyword_search.png` | Keyword search active with filtered results and count badge |
| 6 | `06_csv_export.png` | CSV download initiated / file saved confirmation |
| 7 | `07_history_panel.png` | Recent analysis history panel with at least one saved entry |
| 8 | `08_copy_summary.png` | "Copied!" state on the copy button after clicking |
| 9 | `09_print_preview.png` | Browser print preview showing the clean report layout |
| 10 | `10_github_commits.png` | GitHub repository commits page showing all 6 commits on `main` |
| 11 | `11_jenkins_build.png` | Jenkins build console log showing 21 passed tests (if Jenkins configured) |
| 12 | `12_pytest_results.png` | VS Code terminal showing `21 passed` pytest output |

> Place all screenshots in a folder named `screenshots/` in the project root (this folder is ignored by `.gitignore`).

---

## Troubleshooting & Known Limitations

- **"API Key Needed" in status pill / 503 error on analysis**:
  - Verify that `.env` exists in the `reviewsense-ai` root folder (not inside `tests/` or `static/`).
  - Verify that `GEMINI_API_KEY` contains a valid key from Google AI Studio.
  - Restart the Flask server after modifying `.env`.
- **"Rate limit or quota exceeded (429)"**:
  - The free tier of Gemini has rate limits (RPM / TPM). Wait 30–60 seconds before submitting another request or upgrade quota in Google AI Studio.
- **Port 5000 Already in Use**:
  - If another application occupies port 5000, set `PORT=5050` in `.env` and restart `python app.py`.
- **Virtual Environment Execution Policy on Windows**:
  - If PowerShell blocks `Activate.ps1`, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`
- **CSV file appears garbled in Excel**:
  - The file includes a UTF-8 BOM; if Excel still shows garbled characters, use **Data → From Text/CSV** to import with UTF-8 encoding specified.

---

## 📄 Project Documentation

The project documentation is available below:

📘 [**View DevOps ISE-II Documentation (PDF)**](Project%20Documentation/DevOps%20ISE-II.pdf)
