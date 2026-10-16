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
12. [Troubleshooting & Known Limitations](#troubleshooting--known-limitations)
13. [Future Roadmap](#future-roadmap)
14. [Version History](#version-history)
15. [**View DevOps ISE-II Documentation (PDF)**](Project%20Documentation/DevOps%20ISE-II.pdf)

---

## Project Overview and Objectives

Modern organizations often receive hundreds of unstructured feedback comments weekly across various touchpoints. Manual review reading is slow, error-prone, and biased. 

**ReviewSense AI** solves this problem by automating qualitative customer feedback synthesis:
- **Instant Sentiment Classification**: Labels each review as Positive, Negative, or Neutral with accompanying rationales.
- **Mathematical Integrity**: Sentiment statistics and percentages are calculated strictly from the validated classification outcomes.
- **Root Cause & Theme Extraction**: Clusters customer likes and recurring friction points into concrete categories.
- **Actionable Strategic Insights**: Formulates prioritized, realistic operational next steps without vague business promises.
- **Zero Lock-In Export**: One-click JSON export for downstream CRM or business intelligence integration.

---

## Key Features

- **Intuitive SaaS Workspace**: Clean, light-themed interface built with responsive HTML5, modern CSS3 variables, and vanilla JavaScript.
- **Official Google Gemini Integration**: Leverages Google's official `google-genai` Python SDK with configurable model selection (`gemini-2.5-flash` default).
- **Prompt Injection Defense**: Customer reviews are treated as untrusted data and strictly bounded within analysis guards to prevent prompt-injection attacks.
- **Mathematical Consistency**: Total classified reviews strictly equal the sum of positive, negative, and neutral items. Percentages always total 100%.
- **Live Input Telemetry**: Dynamic review counter and character tracking (up to 50,000 characters).
- **Interactive Sentiment Filter**: Filter review breakdowns dynamically by sentiment (All, Positive, Negative, Neutral).
- **JSON Report Export**: Download complete reports including metadata, metrics, themes, and recommendations with standard JSON schemas.
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
│       └── app.js          # Client-side validation, health polling, DOM rendering, & JSON export
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
4. Open an integrated PowerShell terminal in VS Code (`Ctrl+\``).

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

### Step 4: Run the Application
Start the local Flask development server:

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

## Automated Testing

ReviewSense AI includes automated tests in `tests/test_app.py`. All external Gemini calls are mocked, allowing tests to run rapidly and offline without an API key or quota consumption.

To execute the test suite:

```powershell
python -m pytest tests/ -v
```

### Verified Test Cases:
- **`test_health_endpoint`**: Verifies `/api/health` reports status, model, and configuration.
- **`test_landing_page_loads`**: Asserts HTTP 200 and presence of branding and tagline.
- **`test_analyze_empty_request`**: Validates 400 rejection on empty or whitespace input.
- **`test_analyze_invalid_content_type`**: Validates 400 rejection on non-JSON payload.
- **`test_analyze_oversized_request`**: Ensures inputs over 50,000 characters are rejected.
- **`test_missing_api_key`**: Checks 503 response and user-friendly error when API key is missing.
- **`test_valid_analysis_and_calculations`**: Verifies that sentiment counts, percentages, and totals are computed strictly from results.
- **`test_missing_or_invalid_classifications_fallback`**: Tests normalization of unrecognized sentiment labels.
- **`test_gemini_api_rate_limit`**: Checks graceful 429 response on quota exhaustion.
- **`test_gemini_malformed_json_response`**: Checks 502 handling on unparseable AI output.
- **`test_gemini_empty_response`**: Checks 502 handling when model returns empty text.
- **`test_prompt_injection_safety_prompt_format`**: Ensures prompt boundaries isolate untrusted review text.
- **`test_clean_json_response_with_markdown_blocks`**: Tests JSON extraction from markdown code fences.
- **`test_sanitize_input_text`**: Tests stripping of non-printable control characters.

---

## Jenkins CI/CD Automation

ReviewSense AI is configured with a beginner-friendly Declarative `Jenkinsfile` for continuous integration.

### Pipeline Stages:
1. **Checkout**: Retrieves source code from the configured repository.
2. **Python Environment Check**: Detects Python 3 on Linux or Windows Jenkins agents.
3. **Install Dependencies**: Installs packages from `requirements.txt`.
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

---

## Git & GitHub Workflow

When you are ready to version-control the project:

```powershell
# Initialize git repository
git init

# Verify .env is untracked
git status

# Stage files
git add .

# Initial commit
git commit -m "feat: initial release of ReviewSense AI v1.0.0"
```

To connect to a remote GitHub repository in the future:
```powershell
git remote add origin https://github.com/<your-username>/reviewsense-ai.git
git branch -M main
git push -u origin main
```

---

## Privacy & Security Architecture

1. **Zero Server Persistence**: Customer review content and generated analyses are processed strictly in-memory and are never written to disk or stored in a backend database.
2. **Untrusted Data Isolation**: User feedback text is treated as untrusted data with strict boundaries in the system prompt to prevent prompt injection.
3. **Safe DOM Rendering**: All dynamic elements on the frontend are rendered using `textContent` and safe DOM construction methods, preventing Cross-Site Scripting (XSS).
4. **Credential Isolation**: The Gemini API key is loaded strictly into server memory via `python-dotenv` and is never exposed in client-side HTML, CSS, JavaScript, or API JSON responses.
5. **Notice on Third-Party Processing**: The interface and documentation clearly disclose that submitted review text is transmitted to Google's Gemini API for processing.

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
  - If PowerShell blocks `Activate.ps1`, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`.

---

## Future Roadmap

- Multi-language sentiment detection and translation.
- CSV / Excel batch feedback upload.
- Historical trend tracking with optional lightweight SQLite storage.
- Word cloud visualization for high-frequency sentiment keywords.
- Webhook integrations for Slack and Discord alerts on critical negative reviews.

---

## Version History

- **`v1.0.0`** (October 2026):
  - Initial production-ready release of ReviewSense AI.
  - Flask backend with official Google GenAI (`google-genai`) SDK integration.
  - Configurable model support with `gemini-2.5-flash` default.
  - Responsive, light-theme SaaS interface with zero frontend framework dependencies.
  - Validated sentiment calculations guaranteeing exact mathematical consistency.
  - Full suite of 14 mocked pytest unit and integration tests.
  - Declarative Jenkinsfile pipeline and `.env` configuration.
 

## 📄 Project Documentation

The project documentation for DevOps ISE-II is available below:

📘 [**View DevOps ISE-II Documentation (PDF)**](Project%20Documentation/DevOps%20ISE-II.pdf)


