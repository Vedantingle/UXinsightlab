const axios = require('axios');
const cheerio = require('cheerio');
const Report = require('../models/Report');

const analyzeUrl = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    let targetUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Setup generic user-agent to bypass some basic blocks
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      timeout: 10000 // 10 sec timeout
    });

    const html = response.data;
    const $ = cheerio.load(html);

    let score = 100;
    const audits = []; 
    const strengths = [];
    const areasForImprovement = [];

    const addAudit = (issueText, suggestionText, impact = 0, categoricalArea = "General", educationalData = {}) => {
      score += impact;
      audits.push({
        issue: issueText,
        suggestion: suggestionText,
        scoreImpact: impact,
        category: categoricalArea,
        whyMatters: educationalData.why || "This issue impacts the overall quality and discoverability of your site.",
        howToFix: educationalData.how || suggestionText,
        learnMore: educationalData.link || "https://web.dev/learn/"
      });
      if (!areasForImprovement.includes(categoricalArea)) {
        areasForImprovement.push(categoricalArea);
      }
    };

    // RULES-BASED CHECKS

    // 1. Title check
    const title = $('title').text().trim();
    if (!title) {
      addAudit('Missing <title> tag.', 'Add a descriptive <title> tag inside the <head>.', -15, "SEO", {
        why: "Search engines use titles to understand your page content and display it in result snippets.",
        how: "Insert a <title> Your Page Name </title> tag inside the <head> section of your HTML.",
        link: "https://developers.google.com/search/docs/appearance/title-links"
      });
    } else if (title.length < 10) {
      addAudit('<title> tag is too short.', 'Make the <title> tag more descriptive (typically 50-60 characters).', -5, "SEO", {
        why: "Short titles are less likely to contain relevant keywords and often lack enough context for users in search results.",
        how: "Expand your title to including your primary keyword and brand name.",
        link: "https://moz.com/learn/seo/title-tag"
      });
    } else {
      strengths.push("Well-defined page title for search visibility.");
    }

    // 2. Meta description check
    const metaDescription = $('meta[name="description"]').attr('content');
    if (!metaDescription || metaDescription.trim() === '') {
      addAudit('Missing meta description.', 'Add a <meta name="description" content="..."> tag.', -15, "SEO", {
        why: "Meta descriptions act as a preview for your page in search results, directly impacting click-through rates.",
        how: "Add a <meta name='description' content='A brief summary of your page content'> tag to your <head>.",
        link: "https://developers.google.com/search/docs/appearance/snippet"
      });
    } else if (metaDescription.length < 50) {
      addAudit('Meta description is too short.', 'Aim for 50-160 characters in your meta description.', -5, "SEO", {
        why: "Short descriptions don't provide enough information to entice users to click.",
        how: "Elaborate on the value proposition of your page in the description snippet.",
        link: "https://yoast.com/meta-descriptions/"
      });
    } else {
      strengths.push("Optimized meta description for better click-through rates.");
    }

    // 3. Heading structure (H1 count)
    const h1Count = $('h1').length;
    if (h1Count === 0) {
      addAudit('Missing <h1> tag.', 'Ensure the page has exactly one <h1> tag representing the main topic.', -15, "Content Structure", {
        why: "The H1 tag is the most important heading. It tells users and search bots what the page is about.",
        how: "Wrap your page's primary title in an <h1> tag.",
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements"
      });
    } else if (h1Count > 1) {
      addAudit('Multiple <h1> tags found.', 'Use only one <h1> tag per page for better structural hierarchy.', -5, "Content Structure", {
        why: "Multiple H1s dilute the primary topic and can confuse screen reader users who use headings for navigation.",
        how: "Convert secondary H1 tags into H2 or H3 tags.",
        link: "https://www.nngroup.com/articles/headings-study/"
      });
    } else {
      strengths.push("Clear visual hierarchy with a single primary heading (H1).");
    }

    // 4. Image alt attributes
    const images = $('img');
    let imagesWithoutAlt = 0;
    images.each((i, img) => {
        const alt = $(img).attr('alt');
        if (typeof alt === 'undefined' || alt.trim() === '') {
            imagesWithoutAlt++;
        }
    });

    if (imagesWithoutAlt > 0) {
      const penalty = Math.max(-15, imagesWithoutAlt * -2);
      addAudit(`${imagesWithoutAlt} image(s) missing 'alt' attributes.`, 'Add descriptive alt attributes to all semantic images.', penalty, "Accessibility", {
        why: "Alt text allows screen readers to describe images to visually impaired users and helps search engines index image content.",
        how: "Add the alt='your image description' attribute to every <img> tag.",
        link: "https://www.w3.org/WAI/tutorials/images/"
      });
    } else if (images.length > 0) {
      strengths.push("Excellent image accessibility with consistent descriptive alternatives.");
    }

    // 5. Mobile responsiveness / Viewport meta tag
    const viewport = $('meta[name="viewport"]').attr('content');
    if (!viewport) {
      addAudit('Missing viewport meta tag.', 'Add a viewport meta tag for responsive design.', -15, "Mobile Experience", {
        why: "Without a viewport tag, mobile browsers render pages at desktop width and then scale down, making text unreadable.",
        how: "Add <meta name='viewport' content='width=device-width, initial-scale=1.0'> to your <head>.",
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag"
      });
    } else {
      strengths.push("Mobile-ready layout configuration via viewport metadata.");
    }

    // 6. Language attribute check
    const lang = $('html').attr('lang');
    if (!lang) {
      addAudit('Missing lang attribute on <html>.', 'Set the language of your document (e.g., <html lang="en">).', -10, "Accessibility", {
        why: "Screen readers use the lang attribute to choose the correct voice and accent for synthesized speech.",
        how: "Update your <html> tag to include the lang attribute: <html lang='en'>.",
        link: "https://www.w3.org/International/questions/qa-html-language-declarations"
      });
    }

    // 7. Meta Charset
    const charset = $('meta[charset]').length > 0 || $('meta[http-equiv="Content-Type"]').length > 0;
    if (!charset) {
      addAudit('Missing Character encoding declaration.', 'Add <meta charset="UTF-8"> early in the <head>.', -5, "Technical Quality", {
        why: "Explicit encoding prevents browsers from misinterpreting special characters (like symbols or non-English text).",
        how: "Add <meta charset='UTF-8'> as the first child of your <head> tag.",
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#charset"
      });
    }

    // 8. Broken Buttons (No accessibility text)
    const buttons = $('button');
    let inaccessibleButtons = 0;
    buttons.each((i, btn) => {
      const text = $(btn).text().trim();
      const ariaLabel = $(btn).attr('aria-label');
      if (!text && !ariaLabel) {
        inaccessibleButtons++;
      }
    });
    if (inaccessibleButtons > 0) {
      const penalty = Math.max(-10, inaccessibleButtons * -2);
      addAudit(`${inaccessibleButtons} button(s) lack labels.`, 'Ensure buttons have text content or an aria-label.', penalty, "Accessibility", {
        why: "An empty button is 'silent' to screen readers, making it impossible for some users to know what it does.",
        how: "Add descriptive text inside the button or use the aria-label attribute.",
        link: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role"
      });
    } else if (buttons.length > 0) {
      strengths.push("Highly interactive and accessible button elements.");
    }

    // 9. Links Analysis
    const linkCount = $('a').length;
    if (linkCount > 200) {
        addAudit(`Very high number of links (${linkCount}).`, 'Consolidate navigation to prevent UI clutter.', -5, "Usability", {
          why: "Excessive links create 'choice paralysis' and increase cognitive load, making it harder for users to navigate.",
          how: "Review and remove redundant links or use dropdowns for overflow items.",
          link: "https://www.nngroup.com/articles/navigation-links/"
        });
    }

    // 10. Favicon check
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').length;
    if (favicon === 0) {
      addAudit('Missing Favicon.', 'Add a favicon link in the <head>.', -5, "Branding", {
        why: "Favicons help users identify your website quickly in bookmarks and browser tabs.",
        how: "Link to a .ico or .png icon file in your <head> using <link rel='icon' ...>.",
        link: "https://developer.mozilla.org/en-US/docs/Glossary/Favicon"
      });
    }

    // Ensure score stays within bounds (0-100)
    score = Math.max(0, Math.min(100, score));

    // NEW: Refined Heuristic Scoring Logic
    const calculateHeuristics = (allAudits) => {
        const mapping = [
            { title: "Accessibility", category: "Accessibility", rec: "Add alt text and accessible labels to all interactive elements." },
            { title: "SEO", category: "SEO", rec: "Enhance your metadata and title tags for better search indexing." },
            { title: "Responsiveness", category: "Mobile Experience", rec: "Configure viewport settings and responsive layouts for small screens." },
            { title: "Content", category: "Content Structure", rec: "Ensure a logical heading hierarchy with a single primary H1." },
            { title: "Usability", category: ["Usability", "Technical Quality", "Branding"], rec: "Optimize link density and address technical basics like favicons and encoding." }
        ];

        return mapping.map(m => {
            const categories = Array.isArray(m.category) ? m.category : [m.category];
            const catAudits = allAudits.filter(a => categories.includes(a.category));
            const catImpact = catAudits.reduce((sum, a) => sum + a.scoreImpact, 0);
            const catScore = Math.max(0, 100 + catImpact);
            
            let explanation = "";
            const catLabel = Array.isArray(m.category) ? "Technical & Usability" : m.category;
            
            if (catScore >= 90) {
                explanation = `The site shows strong ${catLabel} fundamentals with nearly zero detected friction points.`;
            } else if (catScore >= 70) {
                explanation = `Good foundation, though we found ${catAudits.length} area(s) needing refinement, specifically regarding ${catAudits[0].issue.toLowerCase()}`;
            } else {
                explanation = `Significant ${catLabel} gaps detected. The primary blocker is ${catAudits[0].issue.toLowerCase()}`;
            }

            return {
                title: m.title,
                score: catScore,
                explanation,
                recommendation: catAudits.length > 0 ? catAudits[0].suggestion : "Continue following established web standards for this category."
            };
        });
    };

    const heuristics = calculateHeuristics(audits);

    // Calculate Category Scores
    const categoryScores = {
        seo: heuristics.find(h => h.title === "SEO")?.score || 100,
        accessibility: heuristics.find(h => h.title === "Accessibility")?.score || 100,
        ux: Math.round(
            (heuristics.find(h => h.title === "Responsiveness")?.score +
             heuristics.find(h => h.title === "Content")?.score +
             heuristics.find(h => h.title === "Usability")?.score) / 3
        )
    };

    // Generate Summary
    // ... (generateSummary stays the same)
    const generateSummary = (s, aud) => {
      let grade = "Poor";
      if (s > 85) grade = "Excellent";
      else if (s > 70) grade = "Good";
      else if (s > 50) grade = "Fair";

      const crit = aud.filter(a => a.scoreImpact <= -10).length;
      let sum = `The automated scan indicates a ${grade} UX foundation with a score of ${s}/100. `;
      
      if (crit > 0) {
        sum += `We found ${crit} critical issues in ${areasForImprovement.join(' & ')} that significantly impact the user experience. `;
      } else if (s < 95) {
        sum += `The site is structurally sound, but refined optimizations in ${areasForImprovement[0] || 'Technical UX'} could further boost performance. `;
      } else {
        sum += `The site demonstrates exceptional adherence to modern web standards and UX best practices. `;
      }
      return sum;
    };

    const summary = generateSummary(score, audits);

    const reportData = {
      url: targetUrl,
      score,
      audits,
      summary,
      strengths: strengths.slice(0, 3), // Only top 3 meaningful strengths
      areasForImprovement,
      heuristics,
      categoryScores
    };

    // Only save report if user is logged in
    let reportResponse;
    if (req.user) {
      reportData.userId = req.user._id;
      reportResponse = await Report.create(reportData);
    } else {
      // For guests, we return the data without saving to DB
      reportResponse = reportData;
    }

    res.status(200).json(reportResponse);


  } catch (error) {
    console.error('Analyze Error:', error);
    res.status(500).json({ message: error.message || 'Failed to analyze URL or save report.' });
  }
};

const getReports = async (req, res) => {
  try {
    // Only fetch reports belonging to the current user
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
       return res.status(404).json({ message: 'Report not found' });
    }
    
    // Ensure report belongs to current user
    if (report.userId && report.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report details' });
  }
};

module.exports = { analyzeUrl, getReports, getReportById };
