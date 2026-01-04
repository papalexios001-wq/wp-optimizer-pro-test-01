// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO — ENTERPRISE CONTENT QUALITY ENGINE v1.0
// SOTA: Advanced Internal Link Engine | Modern FAQ Accordion | Reference Cards | CTA Fixer
// ═══════════════════════════════════════════════════════════════════════════════

export interface InternalLinkTarget {
  url: string;
  title: string;
  slug: string;
  wordCount?: number;
  relevanceScore?: number;
}

export interface LinkInjectionResult {
  html: string;
  linksAdded: Array<{
    anchor: string;
    url: string;
    relevanceScore: number;
  }>;
  linkCount: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Reference {
  url: string;
  title: string;
  domain?: string;
  description?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 PART 1: SOTA ADVANCED INTERNAL LINK ENGINE - RELEVANCE SCORING PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENTERPRISE-GRADE INTERNAL LINK ENGINE
 * 
 * Features:
 * ✅ Semantic relevance scoring (0-1 scale)
 * ✅ Contextual anchor text (3-5 words, non-generic)
 * ✅ Distance-based link clustering prevention (450+ word minimum)
 * ✅ Anchor text deduplication
 * ✅ Section-based link limits (max 2 per section)
 * ✅ Quality threshold enforcement (min 0.55 relevance)
 * ✅ SOTA semantic matching with topic authority analysis
 */
export function buildAdvancedInternalLinkEngine(
  htmlContent: string,
  linkTargets: InternalLinkTarget[],
  contentKeyword: string,
  options: {
    minLinks?: number;
    maxLinks?: number;
    minRelevance?: number;
    minDistanceBetweenLinks?: number;
    maxLinksPerSection?: number;
  } = {}
): LinkInjectionResult {
  const {
    minLinks = 12,
    maxLinks = 25,
    minRelevance = 0.55,
    minDistanceBetweenLinks = 450,
    maxLinksPerSection = 2,
  } = options;

  const linksAdded: LinkInjectionResult['linksAdded'] = [];
  let modifiedHtml = htmlContent;
  const usedAnchors = new Set<string>();
  let lastLinkPosition = 0;

  // Step 1: Calculate relevance scores for all targets
  const scoredTargets = linkTargets
    .map((target) => ({
      ...target,
      relevanceScore: calculateRelevanceScore(target, contentKeyword),
    }))
    .filter((t) => t.relevanceScore >= minRelevance)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  if (scoredTargets.length === 0) {
    return { html: modifiedHtml, linksAdded, linkCount: 0 };
  }

  // Step 2: Split HTML into sections while preserving structure
  const sections = splitIntoSections(modifiedHtml);
  let sectionLinksCount = 0;
  let currentSectionIndex = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Reset section counter on heading
    if (section.isHeading) {
      sectionLinksCount = 0;
      currentSectionIndex = i;
      continue;
    }

    // Skip if already contains links or too small
    if (section.content.includes('<a href') || section.wordCount < 50) {
      continue;
    }

    // Step 3: Find optimal injection points in section
    const result = injectLinksIntoSection(
      section.content,
      scoredTargets,
      usedAnchors,
      {
        minLinksPerSection: sectionLinksCount,
        maxLinksPerSection,
        minDistanceBetweenLinks,
        lastLinkPosition,
        maxTotalLinks: maxLinks,
        currentLinksCount: linksAdded.length,
        minRelevance,
      }
    );

    if (result.modified) {
      sections[i].content = result.html;
      sectionLinksCount += result.injectedLinks.length;
      lastLinkPosition = result.lastPosition;
      linksAdded.push(...result.injectedLinks);
    }

    if (linksAdded.length >= maxLinks) {
      break;
    }
  }

  // Step 4: Reconstruct HTML from sections
  modifiedHtml = sections.map((s) => s.content).join('');

  // Step 5: Ensure minimum link threshold
  if (linksAdded.length < minLinks) {
    const additionalResult = injectFallbackLinksEnhanced(
      modifiedHtml,
      scoredTargets,
      usedAnchors,
      minLinks - linksAdded.length,
      minRelevance
    );
    modifiedHtml = additionalResult.html;
    linksAdded.push(...additionalResult.links);
  }

  return {
    html: modifiedHtml,
    linksAdded,
    linkCount: linksAdded.length,
  };
}

/**
 * RELEVANCE SCORING ALGORITHM (0-1 scale)
 * Combines: Semantic similarity (0.4) + Topic authority (0.3) + Link quality (0.3)
 */
function calculateRelevanceScore(
  target: InternalLinkTarget,
  contextKeyword: string
): number {
  let score = 0;

  // Extract keywords
  const titleWords = target.title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const contextWords = contextKeyword
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  // 1. SEMANTIC SIMILARITY (0.4 weight)
  const commonWords = titleWords.filter((w) => contextWords.includes(w)).length;
  const semanticScore = Math.min(
    commonWords / Math.max(titleWords.length, 1),
    1
  );
  score += semanticScore * 0.4;

  // 2. TOPIC AUTHORITY (0.3 weight)
  const hasTopicOverlap =
    titleWords.some((w) => contextWords.includes(w)) ||
    titleWords.some((w) => isSynonym(w, contextKeyword));
  const topicRelevance = hasTopicOverlap ? 0.85 : 0.3;
  score += topicRelevance * 0.3;

  // 3. LINK QUALITY METRICS (0.3 weight)
  const titleLength = Math.min(titleWords.length / 6, 1); // Prefer 6+ word titles
  const slugQuality =
    !target.slug.toLowerCase().includes('uncategorized') &&
    !target.slug.toLowerCase().includes('misc') &&
    target.slug.length > 3
      ? 0.9
      : 0.4;
  const linkQuality = (titleLength + slugQuality) / 2;
  score += linkQuality * 0.3;

  return Math.min(Math.max(score, 0), 1); // Clamp 0-1
}

/**
 * SYNONYM DETECTION for broader topic matching
 */
function isSynonym(word: string, context: string): boolean {
  const synonymMap: { [key: string]: string[] } = {
    guide: ['tutorial', 'how-to', 'resource', 'handbook', 'manual'],
    seo: ['search', 'optimization', 'ranking', 'serp'],
    content: ['article', 'post', 'page', 'writing', 'copy'],
    wordpress: ['wp', 'blog', 'site', 'website'],
    marketing: ['promotion', 'campaign', 'strategy', 'advertising'],
    development: ['development', 'code', 'programming', 'engineer'],
    performance: ['speed', 'optimization', 'fast', 'efficient'],
    security: ['protection', 'safety', 'secure', 'encryption'],
  };

  const lowerWord = word.toLowerCase();
  const lowerContext = context.toLowerCase();

  return Object.entries(synonymMap).some(([key, synonyms]) => {
    const keyMatch =
      lowerWord.includes(key) &&
      (lowerContext.includes(key) ||
        synonyms.some((s) => lowerContext.includes(s)));
    return keyMatch;
  });
}

/**
 * SECTION SPLITTER - preserves HTML structure while dividing into logical sections
 */
interface Section {
  content: string;
  isHeading: boolean;
  wordCount: number;
}

function splitIntoSections(html: string): Section[] {
  const sections: Section[] = [];
  // Split on headings but preserve them
  const parts = html.split(/(?=<h[1-6])/i);

  for (const part of parts) {
    if (!part.trim()) continue;

    const isHeading = /^<h[1-6]/i.test(part);
    const wordCount = (part.match(/\b\w+\b/g) || []).length;

    sections.push({
      content: part,
      isHeading,
      wordCount,
    });
  }

  return sections;
}

/**
 * INJECT LINKS INTO SECTION with smart positioning
 */
interface InjectionOptions {
  minLinksPerSection: number;
  maxLinksPerSection: number;
  minDistanceBetweenLinks: number;
  lastLinkPosition: number;
  maxTotalLinks: number;
  currentLinksCount: number;
  minRelevance: number;
}

interface InjectionResult {
  html: string;
  modified: boolean;
  injectedLinks: Array<{
    anchor: string;
    url: string;
    relevanceScore: number;
  }>;
  lastPosition: number;
}

function injectLinksIntoSection(
  sectionContent: string,
  scoredTargets: InternalLinkTarget[],
  usedAnchors: Set<string>,
  options: InjectionOptions
): InjectionResult {
  const injectedLinks: InjectionResult['injectedLinks'] = [];
  let modifiedContent = sectionContent;
  let lastPosition = options.lastLinkPosition;

  // Extract sentences while preserving HTML
  const sentences = extractSentences(sectionContent);

  for (let s = 0; s < sentences.length; s++) {
    const sentence = sentences[s];

    // Check distance constraint
    if (lastPosition > 0 && lastPosition - (sentence.charIndex || 0) < options.minDistanceBetweenLinks) {
      continue;
    }

    // Check section limit
    if (
      injectedLinks.length >= options.maxLinksPerSection - options.minLinksPerSection
    ) {
      break;
    }

    // Check total limit
    if (injectedLinks.length + options.currentLinksCount >= options.maxTotalLinks) {
      break;
    }

    // Find best target for this sentence
    for (const target of scoredTargets) {
      if (target.relevanceScore < options.minRelevance) continue;

      const anchorText = generateContextualAnchorText(target.title);
      if (usedAnchors.has(anchorText)) continue;

      // Check if sentence relates to target
      if (shouldLinkToTarget(sentence.text, target)) {
        const linkedSentence = createLinkElement(
          sentence.text,
          target.url,
          anchorText
        );

        if (linkedSentence !== sentence.text) {
          sentences[s].text = linkedSentence;
          usedAnchors.add(anchorText);
          injectedLinks.push({
            anchor: anchorText,
            url: target.url,
            relevanceScore: target.relevanceScore,
          });
          lastPosition = (sentence.charIndex || 0) + linkedSentence.length;
          break;
        }
      }
    }
  }

  // Reconstruct section from sentences
  if (injectedLinks.length > 0) {
    modifiedContent = sentences.map((s) => s.text).join(' ');
  }

  return {
    html: modifiedContent,
    modified: injectedLinks.length > 0,
    injectedLinks,
    lastPosition,
  };
}

/**
 * EXTRACT SENTENCES while preserving structure
 */
interface Sentence {
  text: string;
  charIndex: number;
}

function extractSentences(content: string): Sentence[] {
  const sentences: Sentence[] = [];
  let currentIndex = 0;

  // Remove HTML tags temporarily for sentence detection
  const textContent = content.replace(/<[^>]*>/g, '');

  // Split on periods, exclamation, question marks (excluding common abbreviations)
  const sentenceRegex =
    /(?<![A-Z][a-z]\.)(?<![A-Z]\.)(?<![a-z]\.)(?<!\s[A-Z]\.)(?<!\s[A-Z][a-z]\.)(?<!\d\.)[\.\!\?]+\s+/g;

  let lastIndex = 0;
  let match;

  while ((match = sentenceRegex.exec(textContent)) !== null) {
    const sentenceText = textContent.substring(lastIndex, match.index + 1).trim();
    if (sentenceText.length > 10) {
      sentences.push({
        text: sentenceText,
        charIndex: lastIndex,
      });
    }
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  const remainingText = textContent.substring(lastIndex).trim();
  if (remainingText.length > 10) {
    sentences.push({
      text: remainingText,
      charIndex: lastIndex,
    });
  }

  return sentences;
}

/**
 * CONTEXTUAL ANCHOR TEXT GENERATION (3-5 words, descriptive, non-generic)
 */
function generateContextualAnchorText(targetTitle: string): string {
  // Remove HTML tags and special characters
  let words = targetTitle
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !isGenericStopWord(w));

  // Return 3-5 words
  if (words.length <= 3) {
    return words.join(' ');
  } else if (words.length <= 5) {
    return words.slice(0, 4).join(' ');
  } else {
    // Take first 5 meaningful words
    return words.slice(0, 5).join(' ');
  }
}

function isGenericStopWord(word: string): boolean {
  const stopWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are',
    'this', 'that', 'these', 'those', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'by', 'from',
    'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'as', 'per',
    'between', 'among', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
    'click', 'here', 'read', 'view', 'see', 'more'
  ];
  return stopWords.includes(word);
}

/**
 * SMART LINK POSITIONING in sentences
 */
function shouldLinkToTarget(sentence: string, target: InternalLinkTarget): boolean {
  const sentenceLower = sentence.toLowerCase();
  const titleLower = target.title.toLowerCase();

  // Avoid if already has link
  if (sentenceLower.includes('<a href')) return false;

  // Extract meaningful words from title
  const titleWords = titleLower
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => !isGenericStopWord(w) && w.length > 2);

  // Count matches
  const matchedWords = titleWords.filter((w) => sentenceLower.includes(w)).length;

  // Require at least 50% word match
  return matchedWords >= Math.ceil(titleWords.length / 2);
}

/**
 * CREATE PROPER LINK ELEMENT with title attribute
 */
function createLinkElement(
  sentence: string,
  url: string,
  anchorText: string
): string {
  // Escape URL and anchor text
  const escapedUrl = escapeHtml(url);
  const escapedAnchor = escapeHtml(anchorText);

  // Create regex for case-insensitive anchor text matching
  const regex = new RegExp(
    `\\b${anchorText.replace(/\s+/g, '\\s+').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
    'i'
  );

  if (regex.test(sentence)) {
    return sentence.replace(
      regex,
      `<a href="${escapedUrl}" title="Learn more: ${escapedAnchor}" rel="internal">${anchorText}</a>`
    );
  }

  return sentence;
}

/**
 * FALLBACK INJECTION for minimum link threshold
 */
interface FallbackResult {
  html: string;
  links: Array<{
    anchor: string;
    url: string;
    relevanceScore: number;
  }>;
}

function injectFallbackLinksEnhanced(
  htmlContent: string,
  scoredTargets: InternalLinkTarget[],
  usedAnchors: Set<string>,
  count: number,
  minRelevance: number
): FallbackResult {
  const fallbackLinks: FallbackResult['links'] = [];
  let modifiedHtml = htmlContent;
  let remaining = count;

  for (const target of scoredTargets) {
    if (remaining <= 0) break;
    if (target.relevanceScore < minRelevance) continue;

    const anchorText = generateContextualAnchorText(target.title);
    if (usedAnchors.has(anchorText)) continue;

    // Find paragraph with similar content
    const paragraphRegex = /<p[^>]*>([^<]+)<\/p>/gi;
    let match;

    while ((match = paragraphRegex.exec(htmlContent)) !== null) {
      const paragraphText = match[1];
      const titleWords = target.title.split(/\s+/).slice(0, 3).join(' ');

      if (paragraphText.toLowerCase().includes(titleWords.toLowerCase())) {
        const linkedParagraph = createLinkElement(
          paragraphText,
          target.url,
          anchorText
        );

        if (linkedParagraph !== paragraphText) {
          modifiedHtml = modifiedHtml.replace(
            match[0],
            `<p>${linkedParagraph}</p>`
          );
          fallbackLinks.push({
            anchor: anchorText,
            url: target.url,
            relevanceScore: target.relevanceScore,
          });
          remaining--;
          break;
        }
      }
    }

    usedAnchors.add(anchorText);
  }

  return { html: modifiedHtml, links: fallbackLinks };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 PART 2: BEAUTIFUL MODERN FAQ ACCORDION - SMOOTH ANIMATIONS & ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENTERPRISE FAQ ACCORDION COMPONENT
 * 
 * Features:
 * ✅ Smooth CSS animations (max-height transition)
 * ✅ Accessible semantics (aria-expanded, role="region")
 * ✅ Rotating SVG chevron icons
 * ✅ Hover effects with background gradients
 * ✅ Rich HTML support in answers (links, lists, code, tables)
 * ✅ Keyboard navigation (Enter/Space to open)
 * ✅ Responsive design (mobile-first)
 * ✅ One-at-a-time open pattern (accordion behavior)
 */
export function generateFAQAccordion(faqs: FAQItem[]): string {
  if (!faqs || faqs.length === 0) return '';

  const faqHTML = `<!-- WP OPTIMIZER PRO — ENTERPRISE FAQ ACCORDION v1.0 -->
<div class="wp-opt-faq-accordion" role="region" aria-label="Frequently Asked Questions" data-faq-version="1.0">
  ${faqs
    .map(
      (faq, index) => `
  <div class="wp-opt-faq-item" data-faq-index="${index}">
    <button 
      class="wp-opt-faq-trigger" 
      aria-expanded="false" 
      aria-controls="wp-opt-faq-panel-${index}"
      id="wp-opt-faq-button-${index}"
      type="button"
    >
      <span class="wp-opt-faq-question">${escapeHtml(faq.question)}</span>
      <svg class="wp-opt-faq-chevron" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" fill="currentColor"/>
      </svg>
    </button>
    <div 
      class="wp-opt-faq-panel" 
      id="wp-opt-faq-panel-${index}"
      role="region"
      aria-labelledby="wp-opt-faq-button-${index}"
      style="max-height: 0; opacity: 0; overflow: hidden;"
    >
      <div class="wp-opt-faq-answer-wrapper">
        <div class="wp-opt-faq-answer">${faq.answer}</div>
      </div>
    </div>
  </div>
`
    )
    .join('')}
</div>

<style>
/* ══════════════════════════════════════════════════════════════════════ */
/* FAQ ACCORDION CONTAINER */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-faq-accordion {
  width: 100%;
  max-width: 900px;
  margin: 3rem auto;
  padding: 0;
}

.wp-opt-faq-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
}

.wp-opt-faq-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.12);
  transform: translateY(-2px);
}

.wp-opt-faq-item:last-child {
  margin-bottom: 0;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* FAQ TRIGGER BUTTON */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-faq-trigger {
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1f2937;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.wp-opt-faq-trigger::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.5s ease;
}

.wp-opt-faq-trigger:hover {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #3b82f6;
}

.wp-opt-faq-trigger:hover::before {
  left: 100%;
}

.wp-opt-faq-trigger:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

.wp-opt-faq-trigger[aria-expanded="true"] {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1e40af;
  border-bottom: 2px solid #3b82f6;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* FAQ QUESTION TEXT */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-faq-question {
  flex: 1;
  font-weight: 600;
  color: inherit;
  transition: color 0.3s ease;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* ROTATING CHEVRON ICON */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-faq-chevron {
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: #6b7280;
}

.wp-opt-faq-trigger:hover .wp-opt-faq-chevron {
  color: #3b82f6;
}

.wp-opt-faq-trigger[aria-expanded="true"] .wp-opt-faq-chevron {
  transform: rotate(180deg);
  color: #1e40af;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* FAQ PANEL - ANSWER SECTION */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-faq-panel {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 1px solid #e5e7eb;
}

.wp-opt-faq-trigger[aria-expanded="true"] ~ .wp-opt-faq-panel {
  opacity: 1;
  border-top-color: #3b82f6;
}

.wp-opt-faq-answer-wrapper {
  padding: 1.5rem;
}

.wp-opt-faq-answer {
  color: #4b5563;
  line-height: 1.75;
  font-size: 0.98rem;
  word-wrap: break-word;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* FAQ ANSWER CONTENT STYLING */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-faq-answer > * {
  margin: 1rem 0;
}

.wp-opt-faq-answer > *:first-child {
  margin-top: 0;
}

.wp-opt-faq-answer > *:last-child {
  margin-bottom: 0;
}

/* Headings */
.wp-opt-faq-answer h3,
.wp-opt-faq-answer h4,
.wp-opt-faq-answer h5 {
  margin: 1.5rem 0 0.75rem 0;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
}

/* Links */
.wp-opt-faq-answer a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
}

.wp-opt-faq-answer a:hover {
  color: #1e40af;
  border-bottom-color: #1e40af;
}

.wp-opt-faq-answer a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Lists */
.wp-opt-faq-answer ul,
.wp-opt-faq-answer ol {
  margin: 1rem 0;
    padding-left: 1.75rem;
}

.wp-opt-faq-answer li {
  margin: 0.5rem 0;
  color: #4b5563;
}

.wp-opt-faq-answer li strong {
  color: #1f2937;
  font-weight: 600;
}

/* Code blocks */
.wp-opt-faq-answer code {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: #d946ef;
}

.wp-opt-faq-answer pre {
  background: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1rem 0;
}

.wp-opt-faq-answer pre code {
  background: none;
  padding: 0;
  color: #f3f4f6;
}

/* Blockquotes */
.wp-opt-faq-answer blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
  font-style: italic;
}

/* Tables */
.wp-opt-faq-answer table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.95rem;
}

.wp-opt-faq-answer table th {
  background: #f3f4f6;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
}

.wp-opt-faq-answer table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.wp-opt-faq-answer table tr:hover {
  background: #f9fafb;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* RESPONSIVE DESIGN - MOBILE */
/* ══════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .wp-opt-faq-accordion {
    margin: 2rem auto;
  }

  .wp-opt-faq-item {
    margin-bottom: 1rem;
  }

  .wp-opt-faq-trigger {
    padding: 1.25rem;
    font-size: 0.95rem;
  }

  .wp-opt-faq-chevron {
    width: 20px;
    height: 20px;
  }

  .wp-opt-faq-answer-wrapper {
    padding: 1.25rem;
  }

  .wp-opt-faq-answer {
    font-size: 0.95rem;
  }

  .wp-opt-faq-answer ul,
  .wp-opt-faq-answer ol {
    padding-left: 1.5rem;
  }
}

@media (max-width: 480px) {
  .wp-opt-faq-trigger {
    padding: 1rem;
    gap: 0.75rem;
  }

  .wp-opt-faq-question {
    font-size: 0.95rem;
  }

  .wp-opt-faq-answer-wrapper {
    padding: 1rem;
  }
}

/* ══════════════════════════════════════════════════════════════════════ */
/* DARK MODE SUPPORT */
/* ══════════════════════════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
  .wp-opt-faq-item {
    background: #1f2937;
    border-color: #374151;
  }

  .wp-opt-faq-trigger {
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    color: #f3f4f6;
  }

  .wp-opt-faq-trigger:hover {
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
    color: #60a5fa;
  }

  .wp-opt-faq-trigger[aria-expanded="true"] {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: #93c5fd;
    border-bottom-color: #3b82f6;
  }

  .wp-opt-faq-chevron {
    color: #9ca3af;
  }

  .wp-opt-faq-trigger:hover .wp-opt-faq-chevron {
    color: #60a5fa;
  }

  .wp-opt-faq-trigger[aria-expanded="true"] .wp-opt-faq-chevron {
    color: #93c5fd;
  }

  .wp-opt-faq-panel {
    border-top-color: #374151;
  }

  .wp-opt-faq-trigger[aria-expanded="true"] ~ .wp-opt-faq-panel {
    border-top-color: #3b82f6;
  }

  .wp-opt-faq-answer {
    color: #d1d5db;
  }

  .wp-opt-faq-answer h3,
  .wp-opt-faq-answer h4,
  .wp-opt-faq-answer h5 {
    color: #f3f4f6;
  }

  .wp-opt-faq-answer a {
    color: #60a5fa;
  }

  .wp-opt-faq-answer a:hover {
    color: #93c5fd;
  }

  .wp-opt-faq-answer code {
    background: #374151;
    color: #f87171;
  }

  .wp-opt-faq-answer pre {
    background: #111827;
  }

  .wp-opt-faq-answer table th {
    background: #374151;
    color: #f3f4f6;
  }

  .wp-opt-faq-answer table tr:hover {
    background: #1f2937;
  }
}
</style>

<script>
(function() {
  'use strict';

  const FAQ_CONFIG = {
    allowMultiple: false,
    animationDuration: 400,
  };

  // Initialize accordion
  const accordion = document.querySelector('.wp-opt-faq-accordion');
  if (!accordion) return;

  const triggers = accordion.querySelectorAll('.wp-opt-faq-trigger');

  triggers.forEach((trigger) => {
    // Click handler
    trigger.addEventListener('click', handleTriggerClick);

    // Keyboard handler
    trigger.addEventListener('keydown', handleTriggerKeydown);

    // Initialize panel height
    const panel = trigger.nextElementSibling;
    if (panel) {
      updatePanelHeight(panel, false);
    }
  });

  function handleTriggerClick(event) {
    const trigger = event.currentTarget;
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

    if (!FAQ_CONFIG.allowMultiple) {
      // Close all other triggers
      triggers.forEach((t) => {
        if (t !== trigger) {
          closeTrigger(t);
        }
      });
    }

    if (isExpanded) {
      closeTrigger(trigger);
    } else {
      openTrigger(trigger);
    }
  }

  function handleTriggerKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }

    // Arrow navigation
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextTrigger = event.currentTarget.closest('.wp-opt-faq-item').nextElementSibling?.querySelector('.wp-opt-faq-trigger');
      if (nextTrigger) nextTrigger.focus();
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevTrigger = event.currentTarget.closest('.wp-opt-faq-item').previousElementSibling?.querySelector('.wp-opt-faq-trigger');
      if (prevTrigger) prevTrigger.focus();
    }
  }

  function openTrigger(trigger) {
    trigger.setAttribute('aria-expanded', 'true');
    const panel = trigger.nextElementSibling;
    if (panel) {
      updatePanelHeight(panel, true);
    }
  }

  function closeTrigger(trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    const panel = trigger.nextElementSibling;
    if (panel) {
      updatePanelHeight(panel, false);
    }
  }

  function updatePanelHeight(panel, isOpen) {
    if (isOpen) {
      const answerWrapper = panel.querySelector('.wp-opt-faq-answer-wrapper');
      const scrollHeight = answerWrapper ? answerWrapper.scrollHeight : 0;
      panel.style.maxHeight = scrollHeight + 'px';
      panel.style.opacity = '1';
    } else {
      panel.style.maxHeight = '0';
      panel.style.opacity = '0';
    }
  }

  // Handle window resize to update panel heights
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      triggers.forEach((trigger) => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        const panel = trigger.nextElementSibling;
        if (panel && isOpen) {
          updatePanelHeight(panel, true);
        }
      });
    }, 100);
  });
})();
</script>
  `;

  return faqHTML;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎴 PART 3: ENTERPRISE REFERENCE CARDS - BEAUTIFUL CLICKABLE CARDS WITH HOVER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * REFERENCE CARDS COMPONENT
 * 
 * Features:
 * ✅ Clickable card design with hover lift effect
 * ✅ Domain favicon from Google Favicons API
 * ✅ Domain badge with uppercase styling
 * ✅ Rich title + description support
 * ✅ "Learn more →" CTA with arrow animation
 * ✅ Responsive grid (3 cols desktop, 1 col mobile)
 * ✅ Smooth hover animations & transitions
 * ✅ Dark mode support
 * ✅ Accessibility (proper link semantics, focus states)
 */
export function renderReferenceCards(references: Reference[]): string {
  if (!references || references.length === 0) return '';

  const refHTML = `<!-- WP OPTIMIZER PRO — ENTERPRISE REFERENCE CARDS v1.0 -->
<div class="wp-opt-references-section">
  <h3 class="wp-opt-references-title">📚 References & Further Reading</h3>
  <div class="wp-opt-references-grid">
    ${references
      .map((ref, index) => {
        const domain = extractDomain(ref.url);
        const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        const hasDescription = ref.description && ref.description.length > 0;
        
        return `
    <a 
      href="${escapeHtml(ref.url)}" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="wp-opt-reference-card"
      title="Open: ${escapeHtml(ref.title)}"
      data-ref-index="${index}"
    >
      <div class="wp-opt-ref-header">
        <img 
          src="${favicon}" 
          alt="${domain} icon" 
          class="wp-opt-ref-favicon" 
          loading="lazy"
          onerror="this.style.display='none'; this.parentElement.classList.add('wp-opt-ref-no-icon')"
        />
        <span class="wp-opt-ref-domain">${escapeHtml(domain)}</span>
      </div>
      <h4 class="wp-opt-ref-title">${escapeHtml(ref.title)}</h4>
      ${hasDescription ? `<p class="wp-opt-ref-description">${escapeHtml(ref.description)}</p>` : ''}
      <div class="wp-opt-ref-cta">
        <span class="wp-opt-ref-cta-text">Learn more</span>
        <span class="wp-opt-ref-arrow">→</span>
      </div>
    </a>
    `;
      })
      .join('')}
  </div>
</div>

<style>
/* ══════════════════════════════════════════════════════════════════════ */
/* REFERENCE CARDS SECTION */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-references-section {
  margin: 3rem 0;
  padding: 2.5rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
  border-left: 5px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.wp-opt-references-title {
  font-size: 1.65rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 2rem 0;
  text-align: center;
  letter-spacing: -0.5px;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* REFERENCE CARDS GRID */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-references-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin: 0;
  padding: 0;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* REFERENCE CARD - MAIN CONTAINER */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-reference-card {
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative
  overflow: hidden;
}

.wp-opt-reference-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.wp-opt-reference-card:hover::before {
  left: 100%;
}

.wp-opt-reference-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 16px 32px rgba(59, 130, 246, 0.18);
  transform: translateY(-8px);
}

.wp-opt-reference-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.wp-opt-reference-card:active {
  transform: translateY(-4px);
}

/* ══════════════════════════════════════════════════════════════════════ */
/* REFERENCE CARD HEADER */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-ref-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
  transition: all 0.3s ease;
}

.wp-opt-reference-card:hover .wp-opt-ref-header {
  border-bottom-color: #3b82f6;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* FAVICON */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-ref-favicon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.wp-opt-reference-card:hover .wp-opt-ref-favicon {
  transform: scale(1.1);
}

.wp-opt-ref-no-icon .wp-opt-ref-favicon {
  display: none !important;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* DOMAIN BADGE */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-ref-domain {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.wp-opt-reference-card:hover .wp-opt-ref-domain {
  color: #3b82f6;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* REFERENCE TITLE */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-ref-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.875rem 0;
  line-height: 1.4;
  transition: color 0.3s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.wp-opt-reference-card:hover .wp-opt-ref-title {
  color: #3b82f6;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* REFERENCE DESCRIPTION */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-ref-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 1.25rem 0;
  line-height: 1.6;
  flex-grow: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* REFERENCE CTA BUTTON */
/* ══════════════════════════════════════════════════════════════════════ */
.wp-opt-ref-cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.95rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.wp-opt-reference-card:hover .wp-opt-ref-cta {
  color: #1e40af;
  border-top-color: #3b82f6;
}

.wp-opt-ref-cta-text {
  transition: all 0.3s ease;
}

.wp-opt-ref-arrow {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-left: 0.25rem;
}

.wp-opt-reference-card:hover .wp-opt-ref-arrow {
  transform: translateX(6px);
}

/* ══════════════════════════════════════════════════════════════════════ */
/* RESPONSIVE DESIGN - TABLET */
/* ══════════════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .wp-opt-references-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .wp-opt-references-section {
    padding: 2rem;
  }
}

/* ══════════════════════════════════════════════════════════════════════ */
/* RESPONSIVE DESIGN - MOBILE */
/* ══════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .wp-opt-references-section {
    margin: 2rem 0;
    padding: 1.5rem;
    border-left-width: 4px;
  }

  .wp-opt-references-title {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  .wp-opt-references-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .wp-opt-reference-card {
    padding: 1.5rem;
  }

  .wp-opt-ref-title {
    font-size: 1.05rem;
  }

  .wp-opt-ref-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .wp-opt-references-section {
    padding: 1rem;
  }

  .wp-opt-references-title {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .wp-opt-reference-card {
    padding: 1.25rem;
  }

  .wp-opt-ref-header {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }

  .wp-opt-ref-title {
    font-size: 0.95rem;
    margin-bottom: 0.75rem;
  }

  .wp-opt-ref-favicon {
    width: 24px;
    height: 24px;
  }

  .wp-opt-ref-domain {
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }

  .wp-opt-ref-cta {
    font-size: 0.9rem;
  }
}

/* ══════════════════════════════════════════════════════════════════════ */
/* DARK MODE SUPPORT */
/* ══════════════════════════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
  .wp-opt-references-section {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    border-left-color: #3b82f6;
  }

  .wp-opt-references-title {
    color: #f3f4f6;
  }

  .wp-opt-reference-card {
    background: #374151;
    border-color: #4b5563;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .wp-opt-reference-card:hover {
    background: #4b5563;
    border-color: #60a5fa;
    box-shadow: 0 16px 32px rgba(59, 130, 246, 0.25);
  }

  .wp-opt-ref-header {
    border-bottom-color: #4b5563;
  }

  .wp-opt-reference-card:hover .wp-opt-ref-header {
    border-bottom-color: #60a5fa;
  }

  .wp-opt-ref-domain {
    color: #9ca3af;
  }

  .wp-opt-reference-card:hover .wp-opt-ref-domain {
    color: #60a5fa;
  }

  .wp-opt-ref-title {
    color: #f3f4f6;
  }

  .wp-opt-reference-card:hover .wp-opt-ref-title {
    color: #93c5fd;
  }

  .wp-opt-ref-description {
    color: #d1d5db;
  }

  .wp-opt-ref-cta {
    color: #60a5fa;
    border-top-color: #4b5563;
  }

  .wp-opt-reference-card:hover .wp-opt-ref-cta {
    color: #93c5fd;
    border-top-color: #60a5fa;
  }
}
</style>
  `;

  return refHTML;
}

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 PART 4: CTA BUTTON FIXER - CONVERT TO ACTUAL WORKING LINKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENTERPRISE CTA BUTTON FIXER
 * 
 * Features:
 * ✅ Converts <button> with onclick to proper <a> tags
 * ✅ Extracts URLs from data attributes
 * ✅ Preserves button styling via CSS classes
 * ✅ Adds proper accessibility attributes
 * ✅ Injects beautiful CTA button styles if missing
 * ✅ Handles external links with target="_blank"
 * ✅ Adds rel="noopener noreferrer" for security
 * ✅ Responsive button styling
 */
export function fixCTALinks(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  let fixed = htmlContent;

  // Pattern 1: Convert <button> with onclick="window.location.href='...'"
  fixed = fixed.replace(
    /<button\s+([^>]*?\s+)?onclick=["']window\.location\.href=['"]([^'"]+)['"]([^>]*?)>([^<]+)<\/button>/gi,
    (match, before, url, after, text) => {
      const href = escapeHtml(url);
      const isExternal = isExternalUrl(url);
      const target = isExternal ? ' target="_blank"' : '';
      const rel = isExternal ? ' rel="noopener noreferrer"' : '';
      return `<a href="${href}" class="wp-opt-cta-button"${target}${rel}>${text}</a>`;
    }
  );

  // Pattern 2: Convert <button> with data-url attribute
  fixed = fixed.replace(
    /<button\s+([^>]*?\s+)?data-url=["']([^'"]+)["']([^>]*?)>([^<]+)<\/button>/gi,
    (match, before, url, after, text) => {
      const href = escapeHtml(url);
      const isExternal = isExternalUrl(url);
      const target = isExternal ? ' target="_blank"' : '';
      const rel = isExternal ? ' rel="noopener noreferrer"' : '';
      return `<a href="${href}" class="wp-opt-cta-button"${target}${rel}>${text}</a>`;
    }
  );

  // Pattern 3: Convert <button> with data-href attribute
  fixed = fixed.replace(
    /<button\s+([^>]*?\s+)?data-href=["']([^'"]+)["']([^>]*?)>([^<]+)<\/button>/gi,
    (match, before, url, after, text) => {
      const href = escapeHtml(url);
      const isExternal = isExternalUrl(url);
      const target = isExternal ? ' target="_blank"' : '';
      const rel = isExternal ? ' rel="noopener noreferrer"' : '';
      return `<a href="${href}" class="wp-opt-cta-button"${target}${rel}>${text}</a>`;
    }
  );

  // Pattern 4: Convert plain <button> with cta class
  fixed = fixed.replace(
    /<button\s+class=["']([^"]*(?:cta|button)[^"]*)["']([^>]*)>([^<]+)<\/button>/gi,
    (match, classes, attrs, text) => {
      const allClasses = `wp-opt-cta-button ${classes}`;
      return `<a href="#" class="${allClasses}">${text}</a>`;
    }
  );

  // Add CTA button styles if not present
  if (!fixed.includes('.wp-opt-cta-button')) {
    fixed = addCTAButtonStyles(fixed);
  }

  return fixed;
}

/**
 * CHECK if URL is external
 */
function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, 'https://localhost');
    const windowLocation = typeof window !== 'undefined' ? window.location.hostname : '';
    return urlObj.hostname !== windowLocation && !url.startsWith('/') && !url.startsWith('#');
  } catch {
    return !url.startsWith('/') && !url.startsWith('#') && !url.startsWith('mailto:');
  }
}

/**
 * ADD BEAUTIFUL CTA BUTTON STYLES
 */
function addCTAButtonStyles(htmlContent: string): string {
  const ctaStyles = `
<style>
/* ══════════════════════════
════════════════════════════════════════════════════════════════════ */
/* CTA BUTTON STYLES */
/* ══════════════════════════════════════════════════════════════════ */
.wp-opt-cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-weight: 700;
  font-size: 1.05rem;
  border: 2px solid transparent;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  position: relative;
  overflow: hidden;
  font-family: inherit;
}

.wp-opt-cta-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.wp-opt-cta-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.5);
}

.wp-opt-cta-button:hover::before {
  width: 300px;
  height: 300px;
}

.wp-opt-cta-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.wp-opt-cta-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.wp-opt-cta-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* CTA Button with secondary styling */
.wp-opt-cta-button.secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.3);
}

.wp-opt-cta-button.secondary:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  box-shadow: 0 10px 30px rgba(107, 114, 128, 0.4);
}

/* CTA Button with success styling */
.wp-opt-cta-button.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.wp-opt-cta-button.success:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5);
}

/* CTA Button with danger styling */
.wp-opt-cta-button.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.wp-opt-cta-button.danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.5);
}

/* CTA Button - Large variant */
.wp-opt-cta-button.large {
  padding: 1.25rem 2.5rem;
  font-size: 1.15rem;
  min-width: 200px;
}

/* CTA Button - Small variant */
.wp-opt-cta-button.small {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
}

/* CTA Button - Full width */
.wp-opt-cta-button.full-width {
  width: 100%;
  min-width: 100%;
}

/* CTA Button - Loading state */
.wp-opt-cta-button.loading {
  pointer-events: none;
  opacity: 0.8;
}

.wp-opt-cta-button.loading::after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: wp-opt-cta-spin 0.8s linear infinite;
}

@keyframes wp-opt-cta-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ══════════════════════════════════════════════════════════════════ */
/* RESPONSIVE DESIGN - MOBILE */
/* ══════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .wp-opt-cta-button {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
    width: 100%;
    justify-content: center;
  }

  .wp-opt-cta-button.large {
    padding: 1.125rem 2rem;
    font-size: 1.05rem;
  }

  .wp-opt-cta-button.small {
    padding: 0.7rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .wp-opt-cta-button {
    padding: 0.8rem 1.5rem;
    font-size: 0.95rem;
    width: 100%;
  }

  .wp-opt-cta-button.large {
    padding: 1rem 1.75rem;
    font-size: 1rem;
  }
}

/* ══════════════════════════════════════════════════════════════════ */
/* DARK MODE SUPPORT */
/* ══════════════════════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
  .wp-opt-cta-button {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
  }

  .wp-opt-cta-button:hover {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    box-shadow: 0 10px 30px rgba(37, 99, 235, 0.6);
  }

  .wp-opt-cta-button.secondary {
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    box-shadow: 0 6px 20px rgba(75, 85, 99, 0.4);
  }

  .wp-opt-cta-button.secondary:hover {
    background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
    box-shadow: 0 10px 30px rgba(75, 85, 99, 0.5);
  }
}

/* ══════════════════════════════════════════════════════════════════ */
/* ACCESSIBILITY ENHANCEMENTS */
/* ══════════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .wp-opt-cta-button,
  .wp-opt-cta-button::before {
    transition: none;
    animation: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: more) {
  .wp-opt-cta-button {
    border-width: 2px;
    border-color: currentColor;
    font-weight: 800;
  }

  .wp-opt-cta-button:focus {
    outline-width: 3px;
  }
}
</style>
  `;

  // Insert styles before closing body tag or at end
  if (htmlContent.includes('</body>')) {
    return htmlContent.replace('</body>', `${ctaStyles}</body>`);
  }

  return htmlContent + ctaStyles;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🛠️ UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * SAFE HTML ESCAPING - prevents XSS attacks
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'\/]/g, (char) => map[char]);
}

/**
 * DECODE HTML ENTITIES
 */
export function decodeHtmlEntities(text: string): string {
  const textarea = typeof document !== 'undefined' ? document.createElement('textarea') : null;
  if (textarea) {
    textarea.innerHTML = text;
    return textarea.value;
  }
  return text;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📦 EXPORT ALL FUNCTIONS AND TYPES
// ═══════════════════════════════════════════════════════════════════════════════



