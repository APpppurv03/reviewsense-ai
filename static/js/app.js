/**
 * ReviewSense AI - Frontend Application
 * Turn customer feedback into smarter decisions.
 * Vanilla JavaScript implementation with safe DOM rendering and zero external JS dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Navigation & Status
    const apiStatusPill = document.getElementById('api-status-pill');
    const apiStatusDot = document.getElementById('api-status-dot');
    const apiStatusLabel = document.getElementById('api-status-label');

    // DOM Elements - Workspace Form
    const analyzeForm = document.getElementById('analyze-form');
    const reviewsTextarea = document.getElementById('reviews-text');
    const businessNameInput = document.getElementById('business-name');
    const industryInput = document.getElementById('industry-category');
    const liveReviewCount = document.getElementById('live-review-count');
    const charCounter = document.getElementById('char-counter');
    const btnSubmitAnalyze = document.getElementById('btn-submit-analyze');
    const btnAnalyzeText = document.getElementById('btn-analyze-text');
    const btnLoadSample = document.getElementById('btn-load-sample');
    const btnClearInput = document.getElementById('btn-clear-input');

    // DOM Elements - Alerts & Loading
    const statusBanner = document.getElementById('status-banner');
    const statusBannerIcon = document.getElementById('status-banner-icon');
    const statusBannerTitle = document.getElementById('status-banner-title');
    const statusBannerMessage = document.getElementById('status-banner-message');
    const statusBannerClose = document.getElementById('status-banner-close');
    const loadingContainer = document.getElementById('loading-container');
    const loadingStepText = document.getElementById('loading-step-text');

    // DOM Elements - Dashboard
    const dashboardSection = document.getElementById('dashboard-section');
    const dashboardSubtitleText = document.getElementById('dashboard-subtitle-text');
    const summaryContentText = document.getElementById('summary-content-text');
    
    // Metrics Elements
    const metricTotalCount = document.getElementById('metric-total-count');
    const metricDominantSentiment = document.getElementById('metric-dominant-sentiment');
    const metricPositiveCount = document.getElementById('metric-positive-count');
    const metricPositivePct = document.getElementById('metric-positive-pct');
    const barPositivePct = document.getElementById('bar-positive-pct');
    const metricNegativeCount = document.getElementById('metric-negative-count');
    const metricNegativePct = document.getElementById('metric-negative-pct');
    const barNegativePct = document.getElementById('bar-negative-pct');
    const metricNeutralCount = document.getElementById('metric-neutral-count');
    const metricNeutralPct = document.getElementById('metric-neutral-pct');
    const barNeutralPct = document.getElementById('bar-neutral-pct');

    // Stacked Distribution Bar
    const stackedPos = document.getElementById('stacked-pos');
    const stackedNeut = document.getElementById('stacked-neut');
    const stackedNeg = document.getElementById('stacked-neg');
    const legendPosPct = document.getElementById('legend-pos-pct');
    const legendNeutPct = document.getElementById('legend-neut-pct');
    const legendNegPct = document.getElementById('legend-neg-pct');

    // Panels
    const positiveThemesList = document.getElementById('positive-themes-list');
    const negativeThemesList = document.getElementById('negative-themes-list');
    const badgePosThemeCount = document.getElementById('badge-pos-theme-count');
    const badgeNegThemeCount = document.getElementById('badge-neg-theme-count');
    const neutralObservationsContainer = document.getElementById('neutral-observations-container');
    const neutralObservationsList = document.getElementById('neutral-observations-list');
    const recommendationsList = document.getElementById('recommendations-list');
    const reviewsListContainer = document.getElementById('reviews-list-container');
    const reviewSearchInput = document.getElementById('review-search-input');
    const reviewSearchCount = document.getElementById('review-search-count');

    // Filter Buttons
    const filterTabs = document.querySelectorAll('.filter-tab');
    const filterCountAll = document.getElementById('filter-count-all');
    const filterCountPos = document.getElementById('filter-count-pos');
    const filterCountNeg = document.getElementById('filter-count-neg');
    const filterCountNeut = document.getElementById('filter-count-neut');

    // Actions
    const btnExportJson = document.getElementById('btn-export-json');
    const btnExportCsv = document.getElementById('btn-export-csv');
    const btnResetAll = document.getElementById('btn-reset-all');
    const btnCopySummary = document.getElementById('btn-copy-summary');
    const btnCopySummaryLabel = document.getElementById('btn-copy-summary-label');

    // Internal State
    let currentAnalysisData = null;
    let activeFilter = 'all';

    // Representative Sample Reviews for user convenience
    const SAMPLE_REVIEWS = [
        "The customer onboarding experience was seamless, and the support representative guided me through setup within 15 minutes! Fantastic service.",
        "Mobile app performance is frustrating. The app frequently freezes on checkout and won't remember my saved shipping address.",
        "Product build quality exceeded my expectations. Clean materials and very sturdy construction.",
        "Delivery took four days longer than the promised express window, and there was zero tracking information provided.",
        "Pricing is reasonable for the core feature set, although a few advanced customization options require an expensive tier upgrade.",
        "The return process was completely painless. Support processed my replacement without any back-and-forth friction."
    ].join('\n\n');

    // ==========================================
    // 1. Backend Health Check
    // ==========================================
    async function checkBackendHealth() {
        try {
            const response = await fetch('/api/health');
            if (!response.ok) throw new Error('Health check failed');
            const data = await response.json();

            if (data.gemini_configured) {
                apiStatusDot.className = 'status-dot status-online';
                apiStatusLabel.textContent = `AI Ready (${data.model || 'Gemini'})`;
                apiStatusPill.title = `Connected to Google Gemini using ${data.model}`;
            } else {
                apiStatusDot.className = 'status-dot status-offline';
                apiStatusLabel.textContent = 'API Key Needed';
                apiStatusPill.title = 'GEMINI_API_KEY is not set in backend .env file';
            }
        } catch (err) {
            apiStatusDot.className = 'status-dot status-offline';
            apiStatusLabel.textContent = 'Server Offline';
            apiStatusPill.title = 'Cannot connect to backend server';
        }
    }

    // ==========================================
    // 2. Input Counter & Validation
    // ==========================================
    function updateInputCounters() {
        const text = reviewsTextarea.value;
        const charLen = text.length;
        charCounter.textContent = `${charLen.toLocaleString()} / 50,000 characters`;

        if (charLen > 50000) {
            charCounter.style.color = 'var(--color-negative)';
        } else {
            charCounter.style.color = 'var(--color-text-light)';
        }

        // Count non-empty review blocks / lines
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        liveReviewCount.textContent = lines.length;
    }

    reviewsTextarea.addEventListener('input', updateInputCounters);

    // Load Example Reviews
    btnLoadSample.addEventListener('click', () => {
        businessNameInput.value = 'Apex Retail & Gear';
        industryInput.value = 'E-Commerce & Apparel';
        reviewsTextarea.value = SAMPLE_REVIEWS;
        updateInputCounters();
        hideStatusBanner();
        showStatusBanner('info', 'Sample Reviews Loaded', '6 representative customer reviews loaded. Click "Analyze Feedback" to run the live Gemini analysis.');
        reviewsTextarea.focus();
    });

    // Clear Text
    btnClearInput.addEventListener('click', () => {
        reviewsTextarea.value = '';
        businessNameInput.value = '';
        industryInput.value = '';
        updateInputCounters();
        hideStatusBanner();
    });

    // ==========================================
    // 3. Alert / Status Banner Helpers
    // ==========================================
    function showStatusBanner(type, title, message) {
        statusBanner.className = `status-banner status-banner-${type}`;
        
        let iconHtml = 'ℹ️';
        if (type === 'error') iconHtml = '⚠️';
        if (type === 'success') iconHtml = '✅';

        statusBannerIcon.textContent = iconHtml;
        statusBannerTitle.textContent = title;
        statusBannerMessage.textContent = message;
        statusBanner.classList.remove('is-hidden');
    }

    function hideStatusBanner() {
        statusBanner.classList.add('is-hidden');
    }

    statusBannerClose.addEventListener('click', hideStatusBanner);

    // ==========================================
    // 4. Form Submission & Analysis Call
    // ==========================================
    analyzeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideStatusBanner();

        const rawReviews = reviewsTextarea.value.trim();
        const businessName = businessNameInput.value.trim();
        const industry = industryInput.value.trim();

        // Validation
        if (!rawReviews) {
            showStatusBanner('error', 'Input Required', 'Please paste at least one customer review in the workspace before analyzing.');
            reviewsTextarea.focus();
            return;
        }

        if (rawReviews.length > 50000) {
            showStatusBanner('error', 'Text Limit Exceeded', 'The reviews exceed the 50,000 character limit. Please shorten your input.');
            return;
        }

        // Enter loading state
        setLoadingState(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    reviews: rawReviews,
                    business_name: businessName,
                    industry: industry
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Backend structured error response
                const errorMsg = data.error || 'An unexpected error occurred while analyzing reviews.';
                showStatusBanner('error', `Analysis Failed (${data.code || response.status})`, errorMsg);
                setLoadingState(false);
                return;
            }

            // Success: render dashboard results
            currentAnalysisData = data;
            renderDashboard(data);
            setLoadingState(false);

            // Save a privacy-conscious summary to browser history
            saveToHistory(data);

            showStatusBanner('success', 'Analysis Succeeded', `Successfully analyzed ${data.metrics.total_classified} reviews with Google Gemini.`);
            
            // Scroll to dashboard smoothly
            setTimeout(() => {
                dashboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

        } catch (networkErr) {
            setLoadingState(false);
            showStatusBanner('error', 'Connection Error', 'Could not communicate with the backend server. Please verify the Flask server is running.');
        }
    });

    function setLoadingState(isLoading) {
        if (isLoading) {
            btnSubmitAnalyze.disabled = true;
            btnAnalyzeText.textContent = 'Analyzing...';
            loadingContainer.classList.remove('is-hidden');
            loadingStepText.textContent = 'Transmitting feedback to Google Gemini for structured sentiment extraction...';
        } else {
            btnSubmitAnalyze.disabled = false;
            btnAnalyzeText.textContent = 'Analyze Feedback';
            loadingContainer.classList.add('is-hidden');
        }
    }

    // ==========================================
    // 5. Dashboard Rendering
    // ==========================================
    function renderDashboard(data) {
        dashboardSection.classList.remove('is-hidden');

        const metrics = data.metrics || {};
        const metadata = data.metadata || {};

        // Subtitle with business info
        const bName = metadata.business_name && metadata.business_name !== 'N/A' ? metadata.business_name : 'Customer Feedback';
        const ind = metadata.industry && metadata.industry !== 'N/A' ? `(${metadata.industry})` : '';
        dashboardSubtitleText.textContent = `Grounded analysis for ${bName} ${ind} • ${metrics.total_classified} reviews analyzed`;

        // Executive Summary
        summaryContentText.textContent = data.summary || 'Analysis completed successfully.';

        // Metrics Numbers
        metricTotalCount.textContent = metrics.total_classified ?? 0;
        metricDominantSentiment.textContent = metrics.dominant_sentiment ?? 'Neutral';

        metricPositiveCount.textContent = metrics.positive_count ?? 0;
        metricPositivePct.textContent = `${metrics.positive_percentage ?? 0}%`;
        barPositivePct.style.width = `${metrics.positive_percentage ?? 0}%`;

        metricNegativeCount.textContent = metrics.negative_count ?? 0;
        metricNegativePct.textContent = `${metrics.negative_percentage ?? 0}%`;
        barNegativePct.style.width = `${metrics.negative_percentage ?? 0}%`;

        metricNeutralCount.textContent = metrics.neutral_count ?? 0;
        metricNeutralPct.textContent = `${metrics.neutral_percentage ?? 0}%`;
        barNeutralPct.style.width = `${metrics.neutral_percentage ?? 0}%`;

        // Visual Stacked Distribution Bar
        const posPct = metrics.positive_percentage ?? 0;
        const neutPct = metrics.neutral_percentage ?? 0;
        const negPct = metrics.negative_percentage ?? 0;

        stackedPos.style.width = `${posPct}%`;
        stackedNeut.style.width = `${neutPct}%`;
        stackedNeg.style.width = `${negPct}%`;

        legendPosPct.textContent = `${posPct}%`;
        legendNeutPct.textContent = `${neutPct}%`;
        legendNegPct.textContent = `${negPct}%`;

        // Update Filter Tab Counts
        filterCountAll.textContent = metrics.total_classified ?? 0;
        filterCountPos.textContent = metrics.positive_count ?? 0;
        filterCountNeg.textContent = metrics.negative_count ?? 0;
        filterCountNeut.textContent = metrics.neutral_count ?? 0;

        // Render Themes
        renderPositiveThemes(data.positive_themes || []);
        renderNegativeThemes(data.negative_themes || []);
        renderNeutralObservations(data.neutral_observations || []);

        // Render Recommendations
        renderRecommendations(data.recommendations || []);

        // Render Classified Reviews
        renderReviewsList(data.reviews || [], activeFilter);
    }

    // Render Positive Themes
    function renderPositiveThemes(themes) {
        positiveThemesList.innerHTML = '';
        badgePosThemeCount.textContent = `${themes.length} ${themes.length === 1 ? 'Theme' : 'Themes'}`;

        if (!themes.length) {
            const emptyP = document.createElement('p');
            emptyP.className = 'theme-desc';
            emptyP.textContent = 'No recurring positive themes identified in the submitted feedback.';
            positiveThemesList.appendChild(emptyP);
            return;
        }

        themes.forEach(item => {
            const box = document.createElement('div');
            box.className = 'theme-item';

            const topRow = document.createElement('div');
            topRow.className = 'theme-item-top';

            const name = document.createElement('span');
            name.className = 'theme-name';
            name.textContent = item.topic || 'Positive Sentiment';

            const countBadge = document.createElement('span');
            countBadge.className = 'badge badge-positive';
            countBadge.textContent = `~${item.count_estimate || 1} mentions`;

            topRow.appendChild(name);
            topRow.appendChild(countBadge);

            const desc = document.createElement('p');
            desc.className = 'theme-desc';
            desc.textContent = item.description || '';

            box.appendChild(topRow);
            box.appendChild(desc);
            positiveThemesList.appendChild(box);
        });
    }

    // Render Negative Themes
    function renderNegativeThemes(themes) {
        negativeThemesList.innerHTML = '';
        badgeNegThemeCount.textContent = `${themes.length} ${themes.length === 1 ? 'Issue' : 'Issues'}`;

        if (!themes.length) {
            const emptyP = document.createElement('p');
            emptyP.className = 'theme-desc';
            emptyP.textContent = 'No critical negative themes or friction points detected.';
            negativeThemesList.appendChild(emptyP);
            return;
        }

        themes.forEach(item => {
            const box = document.createElement('div');
            box.className = 'theme-item';

            const topRow = document.createElement('div');
            topRow.className = 'theme-item-top';

            const name = document.createElement('span');
            name.className = 'theme-name';
            name.textContent = item.topic || 'Friction Point';

            const severityBadge = document.createElement('span');
            const sev = (item.severity || 'Medium').toLowerCase();
            severityBadge.className = `priority-badge priority-${sev}`;
            severityBadge.textContent = `${item.severity || 'Medium'} Severity`;

            topRow.appendChild(name);
            topRow.appendChild(severityBadge);

            const desc = document.createElement('p');
            desc.className = 'theme-desc';
            desc.textContent = item.description || '';

            box.appendChild(topRow);
            box.appendChild(desc);
            negativeThemesList.appendChild(box);
        });
    }

    // Render Neutral Observations
    function renderNeutralObservations(observations) {
        neutralObservationsList.innerHTML = '';
        if (!observations || observations.length === 0) {
            neutralObservationsContainer.classList.add('is-hidden');
            return;
        }

        neutralObservationsContainer.classList.remove('is-hidden');
        observations.forEach(obs => {
            const li = document.createElement('li');
            li.textContent = obs;
            neutralObservationsList.appendChild(li);
        });
    }

    // Render Practical Recommendations
    function renderRecommendations(recommendations) {
        recommendationsList.innerHTML = '';

        if (!recommendations.length) {
            const emptyP = document.createElement('p');
            emptyP.className = 'theme-desc';
            emptyP.textContent = 'No specific operational recommendations generated from this sample size.';
            recommendationsList.appendChild(emptyP);
            return;
        }

        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';

            // Top section: Title and AI Priority
            const top = document.createElement('div');
            top.className = 'rec-top';

            const title = document.createElement('h4');
            title.className = 'rec-title';
            title.textContent = rec.title || 'Recommended Action';

            const priorityBadge = document.createElement('span');
            const prio = (rec.priority || 'Medium').toLowerCase();
            priorityBadge.className = `priority-badge priority-${prio}`;
            priorityBadge.textContent = `${rec.priority || 'Medium'} Priority`;

            top.appendChild(title);
            top.appendChild(priorityBadge);

            // Supporting Feedback
            const feedbackP = document.createElement('p');
            feedbackP.className = 'rec-feedback';
            feedbackP.textContent = rec.supporting_feedback || '';

            // Action Box
            const actionBox = document.createElement('div');
            actionBox.className = 'rec-action-box';

            const actionLabel = document.createElement('div');
            actionLabel.className = 'rec-action-label';
            actionLabel.textContent = 'Suggested Next Action:';

            const actionText = document.createElement('div');
            actionText.className = 'rec-action-text';
            actionText.textContent = rec.suggested_action || '';

            actionBox.appendChild(actionLabel);
            actionBox.appendChild(actionText);

            card.appendChild(top);
            card.appendChild(feedbackP);
            card.appendChild(actionBox);
            recommendationsList.appendChild(card);
        });
    }

    // Render Classified Reviews List with Filter
    function renderReviewsList(reviews, filter) {
        reviewsListContainer.innerHTML = '';

        const keyword = reviewSearchInput.value.trim().toLowerCase();

        const filtered = reviews.filter(rev => {
            const matchesSentiment =
                filter === 'all' || rev.sentiment === filter;

            const searchableText = [
                rev.excerpt,
                rev.theme,
                rev.explanation,
                rev.sentiment
            ].filter(Boolean).join(' ').toLowerCase();

            const matchesKeyword = searchableText.includes(keyword);

            return matchesSentiment && matchesKeyword;
        });

        reviewSearchCount.textContent =
            `${filtered.length} review${filtered.length === 1 ? '' : 's'} found`;

        if (!filtered.length) {
            const emptyNotice = document.createElement('div');
            emptyNotice.style.padding = '1.5rem';
            emptyNotice.style.textAlign = 'center';
            emptyNotice.style.color = 'var(--color-text-subtle)';
            const keyword = reviewSearchInput.value.trim();
            if (keyword) {
                emptyNotice.textContent = `No reviews match "${keyword}"${filter !== 'all' ? ` in the ${filter} category` : ''}.`;
            } else {
                emptyNotice.textContent = `No reviews classified as "${filter}".`;
            }
            reviewsListContainer.appendChild(emptyNotice);
            return;
        }

        filtered.forEach(rev => {
            const item = document.createElement('div');
            item.className = 'review-card-item';

            const header = document.createElement('div');
            header.className = 'review-item-header';

            const idTag = document.createElement('span');
            idTag.className = 'review-id-tag';
            idTag.textContent = `Review #${rev.id}`;

            const badgeWrap = document.createElement('div');
            badgeWrap.className = 'review-badge-wrap';

            const themeTag = document.createElement('span');
            themeTag.className = 'review-theme-tag';
            themeTag.textContent = rev.theme || 'General';

            const sentimentBadge = document.createElement('span');
            if (rev.sentiment === 'positive') {
                sentimentBadge.className = 'badge badge-positive';
                sentimentBadge.textContent = 'Positive';
            } else if (rev.sentiment === 'negative') {
                sentimentBadge.className = 'badge badge-negative';
                sentimentBadge.textContent = 'Negative';
            } else {
                sentimentBadge.className = 'badge badge-neutral';
                sentimentBadge.textContent = 'Neutral';
            }

            badgeWrap.appendChild(themeTag);
            badgeWrap.appendChild(sentimentBadge);

            header.appendChild(idTag);
            header.appendChild(badgeWrap);

            const quote = document.createElement('blockquote');
            quote.className = 'review-quote';
            quote.textContent = `"${rev.excerpt || ''}"`;

            const explanation = document.createElement('div');
            explanation.className = 'review-explanation';
            explanation.textContent = `Rationale: ${rev.explanation || 'Classified based on contextual sentiment.'}`;

            item.appendChild(header);
            item.appendChild(quote);
            item.appendChild(explanation);

            reviewsListContainer.appendChild(item);
        });
    }

    // Filter Tab Clicks
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            activeFilter = tab.getAttribute('data-filter') || 'all';

            if (currentAnalysisData && currentAnalysisData.reviews) {
                renderReviewsList(currentAnalysisData.reviews, activeFilter);
            }
        });
    });

    // Search reviews as the user types
    reviewSearchInput.addEventListener('input', () => {
        if (currentAnalysisData && currentAnalysisData.reviews) {
            renderReviewsList(currentAnalysisData.reviews, activeFilter);
        }
    });
    // ==========================================
    // 6. JSON Export Feature
    // ==========================================
    btnExportJson.addEventListener('click', () => {
        if (!currentAnalysisData) {
            showStatusBanner('error', 'Export Error', 'No active analysis report available to export.');
            return;
        }

        try {
            const reportContent = JSON.stringify(currentAnalysisData, null, 2);
            const blob = new Blob([reportContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const sanitizedName = (currentAnalysisData.metadata?.business_name || 'reviews')
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, '_');
            const fileName = `reviewsense_analysis_${sanitizedName}_${timestamp}.json`;

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            showStatusBanner('success', 'Report Exported', `Analysis report downloaded as ${fileName}`);
        } catch (err) {
            showStatusBanner('error', 'Export Failed', 'Could not generate JSON download. Please try again.');
        }
    });

    // ==========================================
    // 7. CSV Export Feature
    // ==========================================
    btnExportCsv.addEventListener('click', () => {
        if (!currentAnalysisData) {
            showStatusBanner('error', 'Export Error', 'No active analysis report available to export.');
            return;
        }

        const reviews = currentAnalysisData.reviews || [];
        if (!reviews.length) {
            showStatusBanner('info', 'Nothing to Export', 'The analysis contains no classified reviews to export as CSV.');
            return;
        }

        /**
         * Escapes a value for safe inclusion in a CSV cell.
         * Wraps in double-quotes and doubles any internal double-quotes.
         * Handles null / undefined / numbers / strings uniformly.
         */
        function csvCell(value) {
            if (value === null || value === undefined) return '""';
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
        }

        const headers = ['Review ID', 'Sentiment', 'Theme', 'Excerpt', 'Explanation'];
        const rows = reviews.map(rev => [
            csvCell(rev.id),
            csvCell(rev.sentiment),
            csvCell(rev.theme),
            csvCell(rev.excerpt),
            csvCell(rev.explanation)
        ].join(','));

        // UTF-8 BOM so Excel opens the file correctly without needing import config
        const BOM = '\uFEFF';
        const csvContent = BOM + [headers.map(csvCell).join(','), ...rows].join('\r\n');

        try {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const sanitizedName = (currentAnalysisData.metadata?.business_name || 'reviews')
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, '_');
            const fileName = `reviewsense_reviews_${sanitizedName}_${timestamp}.csv`;

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            showStatusBanner('success', 'CSV Exported', `${reviews.length} classified review${reviews.length === 1 ? '' : 's'} downloaded as ${fileName}`);
        } catch (err) {
            showStatusBanner('error', 'Export Failed', 'Could not generate CSV download. Please try again.');
        }
    });

    // ==========================================
    // 8. Reset & Start Over
    // ==========================================
    btnResetAll.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the current analysis and start fresh?')) {
            currentAnalysisData = null;
            reviewsTextarea.value = '';
            businessNameInput.value = '';
            industryInput.value = '';
            updateInputCounters();

            dashboardSection.classList.add('is-hidden');
            hideStatusBanner();

            // Reset filter
            filterTabs.forEach(t => t.classList.remove('active'));
            filterTabs[0].classList.add('active');
            activeFilter = 'all';

            // Clear search field and count label
            reviewSearchInput.value = '';
            reviewSearchCount.textContent = '';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // ==========================================
    // 9. Copy Executive Summary to Clipboard
    // ==========================================
    btnCopySummary.addEventListener('click', async () => {
        const summaryText = summaryContentText.textContent.trim();
        if (!summaryText) {
            showStatusBanner('info', 'Nothing to Copy', 'Run an analysis first to generate an executive summary.');
            return;
        }

        /** Build a richer text including key metrics for context */
        const bName = currentAnalysisData?.metadata?.business_name || '';
        const metrics = currentAnalysisData?.metrics || {};
        const contextLine = bName
            ? `${bName} — ReviewSense AI Analysis\n`
            : 'ReviewSense AI Analysis\n';
        const metricLine = `${metrics.total_classified ?? 0} reviews | `
            + `${metrics.positive_count ?? 0} positive · `
            + `${metrics.negative_count ?? 0} negative · `
            + `${metrics.neutral_count ?? 0} neutral\n\n`;
        const fullText = contextLine + metricLine + summaryText;

        const resetLabel = () => {
            setTimeout(() => {
                btnCopySummaryLabel.textContent = 'Copy';
                btnCopySummary.classList.remove('copy-success', 'copy-error');
            }, 2500);
        };

        try {
            await navigator.clipboard.writeText(fullText);
            btnCopySummaryLabel.textContent = 'Copied!';
            btnCopySummary.classList.add('copy-success');
            resetLabel();
        } catch (_) {
            // Fallback for browsers without clipboard API or insecure context
            try {
                const ta = document.createElement('textarea');
                ta.value = fullText;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                btnCopySummaryLabel.textContent = 'Copied!';
                btnCopySummary.classList.add('copy-success');
                resetLabel();
            } catch (_fallbackErr) {
                btnCopySummaryLabel.textContent = 'Failed';
                btnCopySummary.classList.add('copy-error');
                showStatusBanner('error', 'Copy Failed', 'Your browser blocked clipboard access. Please select and copy the summary text manually.');
                resetLabel();
            }
        }
    });

    // ==========================================
    // 10. Recent Analysis History (localStorage)
    // ==========================================
    const HISTORY_KEY = 'reviewsense_history';
    const HISTORY_MAX = 5;

    const historyList = document.getElementById('history-list');
    const historyEmpty = document.getElementById('history-empty');
    const historyCountBadge = document.getElementById('history-count-badge');
    const btnClearHistory = document.getElementById('btn-clear-history');

    /**
     * Safely load history from localStorage.
     * Returns an empty array on any parsing failure.
     */
    function loadHistory() {
        try {
            const raw = localStorage.getItem(HISTORY_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_) {
            return [];
        }
    }

    /**
     * Save a new entry to history. Keeps most recent HISTORY_MAX entries.
     * Stores only metadata + metrics + summary — never raw review text.
     */
    function saveToHistory(data) {
        const entry = {
            savedAt: new Date().toISOString(),
            businessName: data.metadata?.business_name || 'Unknown',
            industry: data.metadata?.industry || '',
            summary: data.summary || '',
            totalClassified: data.metrics?.total_classified ?? 0,
            positiveCount: data.metrics?.positive_count ?? 0,
            negativeCount: data.metrics?.negative_count ?? 0,
            neutralCount: data.metrics?.neutral_count ?? 0,
            dominantSentiment: data.metrics?.dominant_sentiment || 'Neutral'
        };

        const history = loadHistory();
        history.unshift(entry);          // newest first
        const trimmed = history.slice(0, HISTORY_MAX);

        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
        } catch (_) {
            // Storage quota exceeded or unavailable — silently ignore
        }

        renderHistory();
    }

    function renderHistory() {
        const history = loadHistory();
        historyCountBadge.textContent = history.length;
        historyList.innerHTML = '';

        if (!history.length) {
            historyEmpty.style.display = 'block';
            return;
        }

        historyEmpty.style.display = 'none';

        history.forEach((entry, idx) => {
            const card = document.createElement('div');
            card.className = 'history-card';

            const savedDate = new Date(entry.savedAt);
            const formattedDate = isNaN(savedDate)
                ? 'Unknown date'
                : savedDate.toLocaleString(undefined, {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

            const bName = entry.businessName && entry.businessName !== 'N/A'
                ? entry.businessName
                : 'Unnamed Analysis';
            const ind = entry.industry && entry.industry !== 'N/A'
                ? ` — ${entry.industry}` : '';

            card.innerHTML = `
                <div class="history-card-top">
                    <div class="history-card-title">${escapeHtml(bName)}${escapeHtml(ind)}</div>
                    <span class="history-card-date">${formattedDate}</span>
                </div>
                <div class="history-card-meta">
                    <span class="badge badge-neutral">${entry.totalClassified} reviews</span>
                    <span class="badge badge-positive">${entry.positiveCount} positive</span>
                    <span class="badge badge-negative">${entry.negativeCount} negative</span>
                </div>
                <p class="history-card-summary">${escapeHtml(entry.summary || '').slice(0, 200)}${(entry.summary || '').length > 200 ? '…' : ''}</p>
            `;

            historyList.appendChild(card);
        });
    }

    /** Simple HTML escaping for untrusted strings rendered via innerHTML */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    btnClearHistory.addEventListener('click', () => {
        if (!loadHistory().length) return;
        if (confirm('Clear all saved analysis history from this browser?')) {
            try { localStorage.removeItem(HISTORY_KEY); } catch (_) {}
            renderHistory();
        }
    });

    // Initialize history on load
    renderHistory();

    // ==========================================
    // Initialize Page
    // ==========================================
    checkBackendHealth();
    updateInputCounters();
});
