// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v25.0 — ENTERPRISE SOTA AI ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════
// 
// SOTA FEATURES IMPLEMENTED:
// ✅ CSS-Only FAQ Accordion (WordPress CSP compatible)
// ✅ Word-Boundary-Safe Internal Link Injection
// ✅ Anti-AI Detection Human Writing DNA
// ✅ Smart Year Detection (evergreen vs time-sensitive)
// ✅ Multi-Stage Content Pipeline
// ✅ SERP-Targeted Content Generators
// ✅ NLP Term Injection with Semantic Context
// ✅ High-Contrast Dark Mode Components
// ✅ Structured Logging Throughout
// ✅ Error Boundary Compatible
//
// CONTENT ORDER (CORRECT):
// 1. Introduction (with Quick Answer)
// 2. Main Sections (H2s with H3s)
// 3. Key Takeaways Box ← BEFORE FAQ
// 4. FAQ Section (CSS-Only Accordion)
// 5. Conclusion/CTA
// 6. References Section ← ALWAYS AT VERY END
// ═══════════════════════════════════════════════════════════════════════════════

import { GoogleGenAI } from '@google/genai';
import { 
    ContentContract, GenerateConfig, SiteContext, EntityGapAnalysis,
    NeuronAnalysisResult, ExistingContentAnalysis, InternalLinkTarget,
    ValidatedReference, GeoTargetConfig, NeuronTerm, APP_VERSION,
    SerpLengthPolicy, ContentOutline, SectionOutline, GeneratedSection,
    InternalLinkResult  // ← ADD THIS
} from '../types';

import { 
    injectInternalLinks,
    // ... other imports from utils
} from '../utils';

import {
  generateEnhancedBlogContent,
  renderBlogHTML,
  validateBlogContent
} from './text-aware-link-injector';
import { injectContextualLinks } from './context-aware-link-injector';
import { generateBlogContent } from './blog-content-generator';




// ═══════════════════════════════════════════════════════════════════════════════
// 📌 VERSION & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const AI_ORCHESTRATOR_VERSION = "25.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 DYNAMIC YEAR CALCULATION — SMART YEAR LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

// If December, use next year; otherwise use current year
const CONTENT_YEAR = currentMonth === 11 ? currentYear + 1 : currentYear;

console.log(`[AI Orchestrator v${AI_ORCHESTRATOR_VERSION}] Year Logic: Month=${currentMonth + 1}, Using Year=${CONTENT_YEAR}`);

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 SMART YEAR DETECTOR — Determines if year should be in title
// ═══════════════════════════════════════════════════════════════════════════════

function shouldIncludeYearInTitle(topic: string): boolean {
    const topicLower = topic.toLowerCase();
    
    // Topics that should NOT have a year (EVERGREEN content)
    const evergreenPatterns = [
        /\b(numerology|astrology|zodiac|horoscope|tarot)\b/i,
        /\b(angel number|life path|soul number|destiny number)\b/i,
        /\b(spiritual|spirituality|meditation|chakra|aura)\b/i,
        /\b(meaning|definition|what is|what are|what does)\b/i,
        /\b(symbolism|symbol|symbols|significance)\b/i,
        /\b(dream meaning|dreams about|dreaming of)\b/i,
        /\b(history|historical|ancient|classic|mythology)\b/i,
        /\b(biography|who is|who was|life of)\b/i,
        /\b(recipe|recipes|cooking|baking|how to cook)\b/i,
        /\b(art|artist|painting|sculpture|music theory)\b/i,
        /\b(philosophy|philosophical|ethics|morality)\b/i,
        /\b(religion|religious|faith|belief|prayer)\b/i,
        /\b(animal|animals|species|breed|breeds)\b/i,
        /\b(plant|plants|flower|flowers|tree|trees)\b/i,
        /\b(personality type|personality trait|mbti|enneagram)\b/i,
    ];
    
    // Topics that SHOULD have a year (TIME-SENSITIVE content)
    const timeSensitivePatterns = [
        /\b(guide|tutorial|tips|strategies|tactics)\b/i,
        /\b(how to start|how to make money|how to grow)\b/i,
        /\b(ways to|steps to|methods to|techniques)\b/i,
        /\b(best|top \d+|top|latest|newest|updated)\b/i,
        /\b(review|reviews|comparison|vs|versus|compare)\b/i,
        /\b(ranking|ranked|list of|alternatives)\b/i,
        /\b(salary|salaries|price|pricing|cost|rates)\b/i,
        /\b(statistics|stats|data|report|survey)\b/i,
        /\b(trends|trending|forecast|prediction|outlook)\b/i,
        /\b(business|startup|entrepreneur|freelance)\b/i,
        /\b(software|tool|tools|app|apps|platform)\b/i,
        /\b(technology|tech|ai|artificial intelligence)\b/i,
        /\b(marketing|seo|social media|advertising)\b/i,
        /\b(career|job|jobs|hiring|resume|interview)\b/i,
    ];
    
    for (const pattern of evergreenPatterns) {
        if (pattern.test(topicLower)) return false;
    }
    
    for (const pattern of timeSensitivePatterns) {
        if (pattern.test(topicLower)) return true;
    }
    
    return false;
}

function updateExistingYear(text: string): string {
    if (!text) return text;
    const yearPattern = /\b(202[0-9]|2030)\b/g;
    return text.replace(yearPattern, String(CONTENT_YEAR));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 VALID MODELS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const VALID_GEMINI_MODELS: Record<string, string> = {
    'gemini-2.5-flash-preview-05-20': 'Gemini 2.5 Flash Preview',
    'gemini-2.5-pro-preview-05-06': 'Gemini 2.5 Pro Preview',
    'gemini-2.0-flash': 'Gemini 2.0 Flash',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
};

export const OPENROUTER_MODELS = [
    'google/gemini-2.5-flash-preview',
    'anthropic/claude-sonnet-4',
    'deepseek/deepseek-chat',
    'meta-llama/llama-3.3-70b-instruct',
    'openai/gpt-4o',
];

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 STAGED GENERATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface StageProgress {
    stage: 'outline' | 'sections' | 'merge' | 'polish';
    progress: number;
    message: string;
    sectionsCompleted?: number;
    totalSections?: number;
}

export interface NLPInjectionResult {
    html: string;
    termsAdded: string[];
    termsFailed: string[];
    initialCoverage: number;
    finalCoverage: number;
    insertionDetails: Array<{
        term: string;
        location: 'paragraph' | 'list' | 'heading' | 'callout';
        template: string;
        contextScore: number;
    }>;
}

export interface NLPCoverageAnalysis {
    score: number;
    weightedScore: number;
    usedTerms: Array<NeuronTerm & { count: number; positions: number[] }>;
    missingTerms: NeuronTerm[];
    criticalMissing: NeuronTerm[];
    headerMissing: NeuronTerm[];
    bodyMissing: NeuronTerm[];
}

export interface SERPContentBlocks {
    quickAnswer?: string;
    featuredSnippetBait?: string;
    paaFAQs?: Array<{ question: string; answer: string }>;
    paaHTML?: string;
    comparisonTable?: string;
    statsDashboard?: string;
    prosConsTable?: string;
    definitionBox?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📏 GENERATION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const MIN_SECTIONS = 10;
const MAX_SECTIONS = 15;
const SECTION_MIN_WORDS = 350;
const SECTION_MAX_WORDS = 500;
const INTRO_TARGET_WORDS = 300;
const CONCLUSION_TARGET_WORDS = 400;
const DEFAULT_TARGET_NLP_COVERAGE = 85;
const MAX_NLP_INJECTIONS = 30;

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥🔥🔥 HUMAN WRITING DNA — ANTI-AI-DETECTION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

const HUMAN_WRITING_PATTERNS = {
    sentenceStarters: [
        'Look,', "Here's the thing:", 'Real talk:', 'The truth?',
        'Plot twist:', 'Fair warning:', 'Quick story:', 'Fun fact:',
        'Heads up:', 'Pro tip:', "Not gonna lie,", 'Full disclosure:'
    ],
    
    transitions: [
        'That said,', 'On the flip side,', "Here's where it gets interesting:",
        'But wait—', "And here's the kicker:", 'The catch?',
        'What most people miss:', 'The real question is:', 'Bottom line:'
    ],
    
    conversationalPhrases: [
        'you know what I mean?', 'makes sense, right?', 'stick with me here',
        'bear with me', "here's why that matters", 'let me break this down',
        "I'll be honest", 'between you and me'
    ],
    
    // AI-detectable phrases to AVOID
    bannedPhrases: [
        "it's important to note",
        "in today's fast-paced world",
        "when it comes to",
        "in order to",
        "let's dive in",
        "without further ado",
        "in this article we will",
        "comprehensive guide",
        "valuable insights",
        "actionable tips",
        "game-changer",
        "unlock your potential",
        "leverage",
        "utilize",
        "delve",
        "myriad of",
        "plethora of",
        "navigate the complexities",
        "embark on a journey",
        "whether you're a beginner or expert",
        "look no further",
        "in conclusion",
        "to summarize",
        "as we've seen",
        "it goes without saying"
    ]
};

const HUMAN_WRITING_DNA = `
════════════════════════════════════════════════════════════════════════════════
🔥 CRITICAL: WRITE LIKE A HUMAN EXPERT — PASS ALL AI DETECTION
════════════════════════════════════════════════════════════════════════════════

You MUST write content that sounds 100% human-written. Follow these rules EXACTLY:

█ ALEX HORMOZI WRITING STYLE:
• Lead with SPECIFIC numbers: "$127,453.21" NOT "over $100,000"
• Use pattern interrupts: "Here's what nobody tells you..."
• Share failure stories BEFORE success stories
• Write like you're talking to ONE person at a bar
• Make BOLD claims and back them with PROOF
• Use the word "you" constantly — it's personal

█ SENTENCE STRUCTURE RULES:
• Mix lengths DRAMATICALLY: "Short. Punchy." Then a longer sentence.
• Start sentences with "And", "But", "So", "Look," — real humans do this
• Use fragments. On purpose. For emphasis.
• Vary paragraph length (1-5 sentences, mostly 2-3)

█ 🚫 BANNED AI PHRASES — NEVER USE THESE:
${HUMAN_WRITING_PATTERNS.bannedPhrases.slice(0, 15).map(p => `❌ "${p}"`).join('\n')}

█ ✅ HUMAN PATTERNS TO USE INSTEAD:
${HUMAN_WRITING_PATTERNS.sentenceStarters.slice(0, 6).map(p => `✅ "${p}"`).join('\n')}

█ MANDATORY WRITING HABITS:
• ALWAYS use contractions: don't, won't, can't, you'll, I've, we're
• Paragraphs: 2-4 sentences MAX (no walls of text)
• Use "you" and "your" in every paragraph
• Include rhetorical questions: "Sound familiar?"
• Add personality: humor, frustration, excitement
• Be opinionated — take a stance

█ GOLDEN RULE:
Read every sentence aloud. If it sounds like ChatGPT wrote it → REWRITE IT.
════════════════════════════════════════════════════════════════════════════════
`;

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT LIBRARY v8.0 — PREMIUM AUTHORITY DESIGN
// ═══════════════════════════════════════════════════════════════════════════════
// Design Philosophy: Reforge + Notion + Backlinko aesthetic
// • Visual Breathability — generous whitespace, 1.75 line-height
// • Digital Comfort — soft gradients, muted accents, subtle shadows
// • Authority Signals — clean typography, professional cards
// • 12px border-radius throughout for modern feel
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT LIBRARY v15.0 — ULTIMATE ENTERPRISE SOTA EDITION
// ═══════════════════════════════════════════════════════════════════════════════
// Design Philosophy: Reforge + Notion + Backlinko + Apple aesthetic
// • Visual Breathability — generous whitespace, 1.75 line-height
// • Digital Comfort — soft gradients, muted accents, subtle shadows
// • Authority Signals — clean typography, professional cards
// • Mobile-First — clamp() responsive, 44px touch targets
// • WordPress Compatible — all !important overrides
// ═══════════════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 ENHANCED VISUAL RULES v2.0 — INSERT BEFORE VISUAL_COMPONENT_LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════

const ENHANCED_VISUAL_RULES = `
════════════════════════════════════════════════════════════════════════════════
🎨 VISUAL HIERARCHY & PLACEMENT RULES v2.0 — MANDATORY COMPLIANCE
════════════════════════════════════════════════════════════════════════════════

█ CRITICAL VISUAL DENSITY REQUIREMENTS:
┌──────────────────────────────────────────────────────────────────────────────┐
│ Content Section          │ Required Visual Elements                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ Introduction (0-500 words) │ Quick Answer Box + Statistics Dashboard         │
│ Section 1-3 (H2s)          │ 1 Pro Tip OR 1 Warning + 1 Expert Quote        │
│ Section 4-6 (H2s)          │ 1 Comparison Table + 1 Checklist               │
│ Section 7-9 (H2s)          │ 1 Step-by-Step + 1 Info Box                    │
│ Section 10+ (H2s)          │ 1 Highlight Box + 1 Definition (if needed)     │
│ Pre-FAQ                    │ Key Takeaways Box (MANDATORY)                   │
│ Conclusion                 │ CTA Box (MANDATORY)                             │
└──────────────────────────────────────────────────────────────────────────────┘

█ VISUAL SPACING ENFORCEMENT:
• MAXIMUM 250 words between visual elements (NOT 300)
• Each H2 section MUST contain at least 1 visual component
• Tables should appear in middle 40% of content (not intro/conclusion)
• Expert quotes should IMMEDIATELY follow a claim or statistic

█ ANCHOR TEXT QUALITY STANDARDS FOR INTERNAL LINKS:
┌──────────────────────────────────────────────────────────────────────────────┐
│ Quality Tier │ Word Count │ Example                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ EXCELLENT    │ 4-5 words  │ "advanced keyword research strategies"          │
│ GOOD         │ 3 or 6     │ "SEO optimization techniques"                   │
│ REJECTED     │ 1-2 words  │ "guide", "here", "click"                       │
│ REJECTED     │ 7+ words   │ Too long, reduces click-through                │
└──────────────────────────────────────────────────────────────────────────────┘

█ FORBIDDEN ANCHOR PATTERNS (AUTOMATIC REJECTION):
❌ "click here", "read more", "learn more", "this article"
❌ "here is", "check out", "see more", "find out"
❌ Single generic words: "guide", "tips", "post", "article"
❌ Starting with: "the", "a", "an", "this", "our", "your"

════════════════════════════════════════════════════════════════════════════════
`;





const VISUAL_COMPONENT_LIBRARY = `
════════════════════════════════════════════════════════════════════════════════
🎨 ENTERPRISE VISUAL COMPONENTS v15.0 — ULTIMATE MOBILE-FIRST RESPONSIVE DESIGN
════════════════════════════════════════════════════════════════════════════════

⚠️ MANDATORY REQUIREMENTS — READ BEFORE GENERATING:

1. USE MINIMUM 18+ VISUAL COMPONENTS PER ARTICLE:
   □ 1x Quick Answer Box (immediately after intro)
   □ 1x Statistics Dashboard (3-4 metrics — early in content)
   □ 3x Pro Tip Boxes (distributed across sections)
   □ 2x Warning/Important Boxes (for critical information)
   □ 2x Expert Quote Blockquotes (with real attribution)
   □ 2x Comparison Tables (with real data)
   □ 1x Step-by-Step Process Box (for procedural content)
   □ 2x Checklist Boxes (actionable items)
   □ 1x Definition Box (for key terms)
   □ 1x Key Takeaways Box (BEFORE FAQ section)
   □ 1x CTA Box (in conclusion)
   □ 1x References Section (at VERY END)

2. MANDATORY STYLING RULES:
   • ALL styles MUST use !important to override WordPress themes
   • Use clamp() for ALL sizes: clamp(min, preferred, max)
   • Minimum touch targets: 44px for mobile accessibility
   • Border-radius: 16-20px for cards, 12px for buttons, 8px for tags
   • Line-height: 1.75 for body text readability
   • ALL backgrounds MUST be DARK (#0f172a, #1e293b) with LIGHT text (#f1f5f9, #ffffff)

3. VISUAL PLACEMENT RULES:
   • NEVER have more than 3 paragraphs without a visual element
   • Alternate between different box types (don't cluster same type)
   • Tables work best in middle sections
   • Expert quotes work best after making a claim
   • Statistics dashboard should appear within first 20% of content

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 1: QUICK ANSWER BOX — FEATURED SNIPPET OPTIMIZED
═══════════════════════════════════════════════════════════════════════════════
USE: Immediately after intro paragraph. 50-70 words direct answer.

<div style="
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
  border-radius: clamp(12px, 3vw, 20px) !important;
  padding: clamp(20px, 5vw, 40px) !important;
  margin: clamp(24px, 6vw, 48px) 0 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05) !important;
  border: 1px solid rgba(99,102,241,0.2) !important;
  position: relative !important;
  overflow: hidden !important;
">
  <div style="
    position: absolute !important;
    top: 0 !important;
    right: 0 !important;
    width: 40% !important;
    height: 100% !important;
    background: radial-gradient(ellipse at top right, rgba(99,102,241,0.1) 0%, transparent 70%) !important;
    pointer-events: none !important;
  "></div>
  <div style="
    display: inline-flex !important;
    align-items: center !important;
    gap: clamp(6px, 1.5vw, 10px) !important;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
    color: #fff !important;
    font-size: clamp(9px, 2.5vw, 11px) !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
    padding: clamp(6px, 1.5vw, 10px) clamp(12px, 3vw, 18px) !important;
    border-radius: 8px !important;
    text-transform: uppercase !important;
    margin-bottom: clamp(12px, 3vw, 20px) !important;
    box-shadow: 0 4px 12px rgba(99,102,241,0.3) !important;
  ">
    <span style="font-size: clamp(12px, 3vw, 16px) !important;">⚡</span>
    Quick Answer
  </div>
  <p style="
    color: #f1f5f9 !important;
    font-size: clamp(15px, 3.8vw, 19px) !important;
    line-height: 1.75 !important;
    margin: 0 !important;
    position: relative !important;
    z-index: 1 !important;
  ">[50-70 word direct answer optimized for featured snippets — be specific and definitive]</p>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 2: STATISTICS DASHBOARD — 3-4 METRICS WITH TRENDS
═══════════════════════════════════════════════════════════════════════════════
USE: Early in content to establish credibility. Use REAL statistics with sources.

<div style="
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(clamp(120px, 25vw, 160px), 1fr)) !important;
  gap: clamp(12px, 3vw, 20px) !important;
  margin: clamp(28px, 7vw, 56px) 0 !important;
">
  <!-- Stat Card 1 -->
  <div style="
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
    border-radius: 16px !important;
    padding: clamp(16px, 4vw, 28px) !important;
    text-align: center !important;
    border: 1px solid rgba(99,102,241,0.15) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
    position: relative !important;
    overflow: hidden !important;
  ">
    <div style="
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 3px !important;
      background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%) !important;
    "></div>
    <div style="
      font-size: clamp(28px, 7vw, 42px) !important;
      font-weight: 800 !important;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      line-height: 1.1 !important;
    ">87%</div>
    <div style="
      color: #94a3b8 !important;
      font-size: clamp(9px, 2.2vw, 11px) !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      margin-top: 8px !important;
      font-weight: 600 !important;
    ">Success Rate</div>
    <div style="
      color: #22c55e !important;
      font-size: clamp(10px, 2.5vw, 12px) !important;
      margin-top: 6px !important;
      font-weight: 600 !important;
    ">↑ 12% from 2024</div>
  </div>
  <!-- Stat Card 2 -->
  <div style="
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
    border-radius: 16px !important;
    padding: clamp(16px, 4vw, 28px) !important;
    text-align: center !important;
    border: 1px solid rgba(16,185,129,0.15) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
    position: relative !important;
    overflow: hidden !important;
  ">
    <div style="
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 3px !important;
      background: linear-gradient(90deg, #10b981 0%, #22c55e 100%) !important;
    "></div>
    <div style="
      font-size: clamp(28px, 7vw, 42px) !important;
      font-weight: 800 !important;
      background: linear-gradient(135deg, #10b981 0%, #22c55e 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      line-height: 1.1 !important;
    ">2.4M</div>
    <div style="
      color: #94a3b8 !important;
      font-size: clamp(9px, 2.2vw, 11px) !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      margin-top: 8px !important;
      font-weight: 600 !important;
    ">Users Worldwide</div>
    <div style="
      color: #22c55e !important;
      font-size: clamp(10px, 2.5vw, 12px) !important;
      margin-top: 6px !important;
      font-weight: 600 !important;
    ">↑ 340K this year</div>
  </div>
  <!-- Stat Card 3 -->
  <div style="
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
    border-radius: 16px !important;
    padding: clamp(16px, 4vw, 28px) !important;
    text-align: center !important;
    border: 1px solid rgba(245,158,11,0.15) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
    position: relative !important;
    overflow: hidden !important;
  ">
    <div style="
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 3px !important;
      background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%) !important;
    "></div>
    <div style="
      font-size: clamp(28px, 7vw, 42px) !important;
      font-weight: 800 !important;
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      line-height: 1.1 !important;
    ">4.8★</div>
    <div style="
      color: #94a3b8 !important;
      font-size: clamp(9px, 2.2vw, 11px) !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      margin-top: 8px !important;
      font-weight: 600 !important;
    ">Average Rating</div>
    <div style="
      color: #94a3b8 !important;
      font-size: clamp(10px, 2.5vw, 12px) !important;
      margin-top: 6px !important;
    ">Based on 12,847 reviews</div>
  </div>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 3: PRO TIP BOX — DARK GREEN GRADIENT
═══════════════════════════════════════════════════════════════════════════════
USE: Distribute 3 across different sections. Actionable expert advice.

<div style="
  background: linear-gradient(135deg, #14532d 0%, #166534 100%) !important;
  border-radius: clamp(12px, 3vw, 16px) !important;
  padding: clamp(18px, 4.5vw, 32px) !important;
  margin: clamp(24px, 6vw, 40px) 0 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(34,197,94,0.2) !important;
  border: none !important;
  position: relative !important;
">
  <div style="
    display: flex !important;
    align-items: flex-start !important;
    gap: clamp(14px, 3.5vw, 18px) !important;
  ">
    <div style="
      min-width: clamp(40px, 10vw, 48px) !important;
      height: clamp(40px, 10vw, 48px) !important;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
      border-radius: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 16px rgba(34,197,94,0.35) !important;
      flex-shrink: 0 !important;
    ">
      <span style="font-size: clamp(18px, 4.5vw, 22px) !important;">💡</span>
    </div>
    <div style="flex: 1 !important;">
      <div style="
        color: #86efac !important;
        font-size: clamp(10px, 2.5vw, 12px) !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 1.5px !important;
        margin-bottom: clamp(6px, 1.5vw, 10px) !important;
      ">Pro Tip</div>
      <p style="
        color: #dcfce7 !important;
        font-size: clamp(14px, 3.5vw, 16px) !important;
        line-height: 1.7 !important;
        margin: 0 !important;
      ">[Specific, actionable expert advice that readers can implement immediately]</p>
    </div>
  </div>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 4: WARNING/IMPORTANT BOX — SOFT AMBER
═══════════════════════════════════════════════════════════════════════════════
USE: For critical warnings, common mistakes, or important caveats.

<div style="
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%) !important;
  border-radius: clamp(12px, 3vw, 16px) !important;
  padding: clamp(18px, 4.5vw, 32px) !important;
  margin: clamp(24px, 6vw, 40px) 0 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25) !important;
  border-left: 5px solid #f59e0b !important;
">
  <div style="
    display: flex !important;
    align-items: flex-start !important;
    gap: clamp(14px, 3.5vw, 18px) !important;
  ">
    <div style="
      min-width: clamp(40px, 10vw, 48px) !important;
      height: clamp(40px, 10vw, 48px) !important;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      border-radius: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 16px rgba(245,158,11,0.35) !important;
      flex-shrink: 0 !important;
    ">
      <span style="font-size: clamp(18px, 4.5vw, 22px) !important;">⚠️</span>
    </div>
    <div style="flex: 1 !important;">
      <div style="
        color: #fde68a !important;
        font-size: clamp(10px, 2.5vw, 12px) !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 1.5px !important;
        margin-bottom: clamp(6px, 1.5vw, 10px) !important;
      ">Important</div>
      <p style="
        color: #fef3c7 !important;
        font-size: clamp(14px, 3.5vw, 16px) !important;
        line-height: 1.7 !important;
        margin: 0 !important;
      ">[Critical warning or important caveat that readers must know]</p>
    </div>
  </div>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 5: EXPERT QUOTE BLOCKQUOTE — WITH ATTRIBUTION
═══════════════════════════════════════════════════════════════════════════════
USE: After making a claim, cite a real expert. Include name, title, company.

<blockquote style="
  position: relative !important;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%) !important;
  border-radius: 20px !important;
  padding: clamp(28px, 7vw, 48px) !important;
  margin: clamp(28px, 7vw, 56px) 0 !important;
  border-left: 5px solid #6366f1 !important;
  box-shadow: 0 12px 40px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05) !important;
">
  <div style="
    position: absolute !important;
    top: clamp(12px, 3vw, 20px) !important;
    left: clamp(20px, 5vw, 36px) !important;
    font-size: clamp(48px, 12vw, 72px) !important;
    color: #6366f1 !important;
    opacity: 0.25 !important;
    font-family: Georgia, serif !important;
    line-height: 1 !important;
  ">"</div>
  <p style="
    color: #e0e7ff !important;
    font-size: clamp(16px, 4vw, 20px) !important;
    font-style: italic !important;
    line-height: 1.8 !important;
    margin: 0 0 24px 0 !important;
    position: relative !important;
    z-index: 1 !important;
    padding-left: clamp(0px, 2vw, 16px) !important;
  ">[Expert quote here — 2-3 sentences of genuine insight from a recognized authority]</p>
  <footer style="
    display: flex !important;
    align-items: center !important;
    gap: clamp(12px, 3vw, 16px) !important;
    padding-left: clamp(0px, 2vw, 16px) !important;
  ">
    <div style="
      width: clamp(44px, 11vw, 52px) !important;
      height: clamp(44px, 11vw, 52px) !important;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: clamp(18px, 4.5vw, 22px) !important;
      box-shadow: 0 4px 12px rgba(99,102,241,0.3) !important;
    ">👤</div>
    <div>
      <cite style="
        color: #c7d2fe !important;
        font-style: normal !important;
        font-weight: 700 !important;
        font-size: clamp(13px, 3.2vw, 15px) !important;
        display: block !important;
      ">[Expert Name]</cite>
      <span style="
        color: #818cf8 !important;
        font-size: clamp(11px, 2.8vw, 13px) !important;
      ">[Title, Company/Organization]</span>
    </div>
  </footer>
</blockquote>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 6: COMPARISON TABLE — PREMIUM STYLED
═══════════════════════════════════════════════════════════════════════════════
USE: For comparing options, features, products. Use REAL data.

<div style="
  overflow-x: auto !important;
  margin: clamp(28px, 7vw, 56px) 0 !important;
  border-radius: 16px !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25) !important;
  -webkit-overflow-scrolling: touch !important;
">
  <table style="
    width: 100% !important;
    border-collapse: collapse !important;
    min-width: 500px !important;
    background: #0f172a !important;
  ">
    <thead>
      <tr style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;">
        <th style="
          padding: clamp(14px, 3.5vw, 20px) !important;
          text-align: left !important;
          color: #f1f5f9 !important;
          font-weight: 700 !important;
          font-size: clamp(12px, 3vw, 14px) !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          border-bottom: 2px solid #3b82f6 !important;
        ">Feature</th>
        <th style="
          padding: clamp(14px, 3.5vw, 20px) !important;
          text-align: center !important;
          color: #f1f5f9 !important;
          font-weight: 700 !important;
          font-size: clamp(12px, 3vw, 14px) !important;
          border-bottom: 2px solid #3b82f6 !important;
        ">Option A</th>
        <th style="
          padding: clamp(14px, 3.5vw, 20px) !important;
          text-align: center !important;
          color: #f1f5f9 !important;
          font-weight: 700 !important;
          font-size: clamp(12px, 3vw, 14px) !important;
          border-bottom: 2px solid #3b82f6 !important;
        ">Option B</th>
        <th style="
          padding: clamp(14px, 3.5vw, 20px) !important;
          text-align: center !important;
          color: #f1f5f9 !important;
          font-weight: 700 !important;
          font-size: clamp(12px, 3vw, 14px) !important;
          border-bottom: 2px solid #3b82f6 !important;
        ">Option C</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background: rgba(255,255,255,0.02) !important;">
        <td style="padding: clamp(12px, 3vw, 18px) !important; color: #e2e8f0 !important; font-weight: 500 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">Feature Name 1</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #22c55e !important; font-weight: 700 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">✓ Yes</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #22c55e !important; font-weight: 700 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">✓ Yes</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #ef4444 !important; font-weight: 700 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">✗ No</td>
      </tr>
      <tr style="background: rgba(255,255,255,0.04) !important;">
        <td style="padding: clamp(12px, 3vw, 18px) !important; color: #e2e8f0 !important; font-weight: 500 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">Feature Name 2</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #f1f5f9 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">$29/mo</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #f1f5f9 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">$49/mo</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #f1f5f9 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">$99/mo</td>
      </tr>
      <tr style="background: rgba(255,255,255,0.02) !important;">
        <td style="padding: clamp(12px, 3vw, 18px) !important; color: #e2e8f0 !important; font-weight: 500 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">Feature Name 3</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #fbbf24 !important; font-weight: 600 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">Limited</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #22c55e !important; font-weight: 700 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">✓ Full</td>
        <td style="padding: clamp(12px, 3vw, 18px) !important; text-align: center !important; color: #22c55e !important; font-weight: 700 !important; border-bottom: 1px solid rgba(255,255,255,0.04) !important;">✓ Full</td>
      </tr>
    </tbody>
  </table>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 7: STEP-BY-STEP PROCESS BOX — NUMBERED STEPS
═══════════════════════════════════════════════════════════════════════════════
USE: For any procedural or how-to content. Include clear action items.

<div style="
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
  border-radius: 20px !important;
  padding: clamp(24px, 6vw, 44px) !important;
  margin: clamp(28px, 7vw, 56px) 0 !important;
  border: 1px solid rgba(255,255,255,0.06) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
">
  <div style="
    display: flex !important;
    align-items: center !important;
    gap: clamp(12px, 3vw, 16px) !important;
    margin-bottom: clamp(20px, 5vw, 28px) !important;
    padding-bottom: clamp(16px, 4vw, 24px) !important;
    border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  ">
    <div style="
      width: clamp(44px, 11vw, 52px) !important;
      height: clamp(44px, 11vw, 52px) !important;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
      border-radius: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 16px rgba(59,130,246,0.3) !important;
    ">
      <span style="font-size: clamp(20px, 5vw, 26px) !important;">📋</span>
    </div>
    <h3 style="
      color: #f1f5f9 !important;
      font-size: clamp(18px, 4.5vw, 24px) !important;
      font-weight: 700 !important;
      margin: 0 !important;
    ">Step-by-Step Process</h3>
  </div>
  <div style="display: flex !important; flex-direction: column !important; gap: clamp(14px, 3.5vw, 20px) !important;">
    <!-- Step 1 -->
    <div style="display: flex !important; gap: clamp(14px, 3.5vw, 18px) !important; align-items: flex-start !important;">
      <div style="
        min-width: clamp(36px, 9vw, 44px) !important;
        height: clamp(36px, 9vw, 44px) !important;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-weight: 800 !important;
        font-size: clamp(14px, 3.5vw, 18px) !important;
        box-shadow: 0 4px 12px rgba(34,197,94,0.3) !important;
        flex-shrink: 0 !important;
      ">1</div>
      <div style="
        flex: 1 !important;
        background: rgba(255,255,255,0.03) !important;
        border-radius: 12px !important;
        padding: clamp(14px, 3.5vw, 20px) !important;
        border: 1px solid rgba(255,255,255,0.06) !important;
      ">
        <div style="color: #f1f5f9 !important; font-weight: 700 !important; margin-bottom: 6px !important; font-size: clamp(14px, 3.5vw, 16px) !important;">[Step Title]</div>
        <div style="color: #94a3b8 !important; font-size: clamp(13px, 3.2vw, 15px) !important; line-height: 1.6 !important;">[Step description with specific actions]</div>
      </div>
    </div>
    <!-- Step 2 -->
    <div style="display: flex !important; gap: clamp(14px, 3.5vw, 18px) !important; align-items: flex-start !important;">
      <div style="
        min-width: clamp(36px, 9vw, 44px) !important;
        height: clamp(36px, 9vw, 44px) !important;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-weight: 800 !important;
        font-size: clamp(14px, 3.5vw, 18px) !important;
        box-shadow: 0 4px 12px rgba(59,130,246,0.3) !important;
        flex-shrink: 0 !important;
      ">2</div>
      <div style="
        flex: 1 !important;
        background: rgba(255,255,255,0.03) !important;
        border-radius: 12px !important;
        padding: clamp(14px, 3.5vw, 20px) !important;
        border: 1px solid rgba(255,255,255,0.06) !important;
      ">
        <div style="color: #f1f5f9 !important; font-weight: 700 !important; margin-bottom: 6px !important; font-size: clamp(14px, 3.5vw, 16px) !important;">[Step Title]</div>
        <div style="color: #94a3b8 !important; font-size: clamp(13px, 3.2vw, 15px) !important; line-height: 1.6 !important;">[Step description with specific actions]</div>
      </div>
    </div>
    <!-- Step 3 -->
    <div style="display: flex !important; gap: clamp(14px, 3.5vw, 18px) !important; align-items: flex-start !important;">
      <div style="
        min-width: clamp(36px, 9vw, 44px) !important;
        height: clamp(36px, 9vw, 44px) !important;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-weight: 800 !important;
        font-size: clamp(14px, 3.5vw, 18px) !important;
        box-shadow: 0 4px 12px rgba(139,92,246,0.3) !important;
        flex-shrink: 0 !important;
      ">3</div>
      <div style="
        flex: 1 !important;
        background: rgba(255,255,255,0.03) !important;
        border-radius: 12px !important;
        padding: clamp(14px, 3.5vw, 20px) !important;
        border: 1px solid rgba(255,255,255,0.06) !important;
      ">
        <div style="color: #f1f5f9 !important; font-weight: 700 !important; margin-bottom: 6px !important; font-size: clamp(14px, 3.5vw, 16px) !important;">[Step Title]</div>
        <div style="color: #94a3b8 !important; font-size: clamp(13px, 3.2vw, 15px) !important; line-height: 1.6 !important;">[Step description with specific actions]</div>
      </div>
    </div>
  </div>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 8: CHECKLIST BOX — INTERACTIVE STYLE
═══════════════════════════════════════════════════════════════════════════════
USE: For actionable lists, requirements, or best practices.

<div style="
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%) !important;
  border-radius: 16px !important;
  padding: clamp(20px, 5vw, 36px) !important;
  margin: clamp(24px, 6vw, 44px) 0 !important;
  border: 1px solid rgba(16,185,129,0.3) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
">
  <div style="
    display: flex !important;
    align-items: center !important;
    gap: clamp(10px, 2.5vw, 14px) !important;
    margin-bottom: clamp(16px, 4vw, 24px) !important;
  ">
    <div style="
      width: clamp(36px, 9vw, 44px) !important;
      height: clamp(36px, 9vw, 44px) !important;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      border-radius: 12px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 12px rgba(16,185,129,0.3) !important;
    ">
      <span style="font-size: clamp(16px, 4vw, 20px) !important;">✅</span>
    </div>
    <h4 style="
      color: #a7f3d0 !important;
      font-size: clamp(15px, 3.8vw, 18px) !important;
      font-weight: 700 !important;
      margin: 0 !important;
    ">Quick Checklist</h4>
  </div>
  <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important; display: flex !important; flex-direction: column !important; gap: clamp(10px, 2.5vw, 14px) !important;">
    <li style="
      display: flex !important;
      align-items: center !important;
      gap: clamp(10px, 2.5vw, 14px) !important;
      padding: clamp(12px, 3vw, 16px) !important;
      background: rgba(255,255,255,0.06) !important;
      border-radius: 10px !important;
      border: 1px solid rgba(16,185,129,0.15) !important;
    ">
      <span style="
        min-width: 24px !important;
        height: 24px !important;
        background: #10b981 !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-size: 14px !important;
        font-weight: 700 !important;
      ">✓</span>
      <span style="color: #d1fae5 !important; font-size: clamp(13px, 3.2vw, 15px) !important; line-height: 1.5 !important;">[Actionable checklist item 1]</span>
    </li>
    <li style="
      display: flex !important;
      align-items: center !important;
      gap: clamp(10px, 2.5vw, 14px) !important;
      padding: clamp(12px, 3vw, 16px) !important;
      background: rgba(255,255,255,0.06) !important;
      border-radius: 10px !important;
      border: 1px solid rgba(16,185,129,0.15) !important;
    ">
      <span style="
        min-width: 24px !important;
        height: 24px !important;
        background: #10b981 !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-size: 14px !important;
        font-weight: 700 !important;
      ">✓</span>
      <span style="color: #d1fae5 !important; font-size: clamp(13px, 3.2vw, 15px) !important; line-height: 1.5 !important;">[Actionable checklist item 2]</span>
    </li>
    <li style="
      display: flex !important;
      align-items: center !important;
      gap: clamp(10px, 2.5vw, 14px) !important;
      padding: clamp(12px, 3vw, 16px) !important;
      background: rgba(255,255,255,0.06) !important;
      border-radius: 10px !important;
      border: 1px solid rgba(16,185,129,0.15) !important;
    ">
      <span style="
        min-width: 24px !important;
        height: 24px !important;
        background: #10b981 !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-size: 14px !important;
        font-weight: 700 !important;
      ">✓</span>
      <span style="color: #d1fae5 !important; font-size: clamp(13px, 3.2vw, 15px) !important; line-height: 1.5 !important;">[Actionable checklist item 3]</span>
    </li>
  </ul>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 9: DEFINITION BOX — FOR KEY TERMS
═══════════════════════════════════════════════════════════════════════════════
USE: When introducing important concepts or technical terms.

<div style="
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
  border-radius: 16px !important;
  padding: clamp(20px, 5vw, 32px) !important;
  margin: clamp(24px, 6vw, 40px) 0 !important;
  border-left: 4px solid #06b6d4 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
">
  <div style="
    display: flex !important;
    align-items: center !important;
    gap: clamp(10px, 2.5vw, 14px) !important;
    margin-bottom: clamp(12px, 3vw, 18px) !important;
  ">
    <span style="
      font-size: clamp(20px, 5vw, 26px) !important;
    ">📖</span>
    <span style="
      color: #22d3ee !important;
      font-size: clamp(10px, 2.5vw, 12px) !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
    ">Definition</span>
  </div>
  <div style="
    color: #67e8f9 !important;
    font-size: clamp(16px, 4vw, 20px) !important;
    font-weight: 700 !important;
    margin-bottom: clamp(8px, 2vw, 12px) !important;
  ">[Term Being Defined]</div>
  <p style="
    color: #e0f2fe !important;
    font-size: clamp(14px, 3.5vw, 16px) !important;
    line-height: 1.7 !important;
    margin: 0 !important;
  ">[Clear, concise definition of the term in plain language that any reader can understand]</p>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 10: KEY TAKEAWAYS BOX — BEFORE FAQ
═══════════════════════════════════════════════════════════════════════════════
USE: MUST appear BEFORE FAQ section. Summarize 5-7 key points.

<div style="
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%) !important;
  border-radius: clamp(16px, 4vw, 24px) !important;
  padding: clamp(24px, 6vw, 44px) !important;
  margin: clamp(32px, 8vw, 64px) 0 !important;
  border: 1px solid rgba(16,185,129,0.3) !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.25) !important;
">
  <div style="
    display: flex !important;
    align-items: center !important;
    gap: clamp(12px, 3vw, 18px) !important;
    margin-bottom: clamp(20px, 5vw, 32px) !important;
    padding-bottom: clamp(16px, 4vw, 24px) !important;
    border-bottom: 1px solid rgba(16,185,129,0.2) !important;
  ">
    <div style="
      width: clamp(48px, 12vw, 60px) !important;
      height: clamp(48px, 12vw, 60px) !important;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      border-radius: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 6px 20px rgba(16,185,129,0.35) !important;
    ">
      <span style="font-size: clamp(22px, 5.5vw, 28px) !important;">🎯</span>
    </div>
    <h2 style="
      color: #a7f3d0 !important;
      font-size: clamp(20px, 5vw, 28px) !important;
      font-weight: 800 !important;
      margin: 0 !important;
    ">Key Takeaways</h2>
  </div>
  <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">
    <li style="
      display: flex !important;
      align-items: flex-start !important;
      gap: clamp(12px, 3vw, 16px) !important;
      margin-bottom: clamp(12px, 3vw, 16px) !important;
      padding: clamp(14px, 3.5vw, 20px) !important;
      background: rgba(255,255,255,0.06) !important;
      border-radius: 12px !important;
      border: 1px solid rgba(16,185,129,0.15) !important;
    ">
      <div style="
        min-width: clamp(26px, 6.5vw, 32px) !important;
        height: clamp(26px, 6.5vw, 32px) !important;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
        border-radius: 8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        margin-top: 2px !important;
        box-shadow: 0 2px 8px rgba(16,185,129,0.3) !important;
      ">
        <span style="color: #fff !important; font-size: clamp(13px, 3.2vw, 16px) !important; font-weight: 800 !important;">✓</span>
      </div>
      <span style="
        color: #d1fae5 !important;
        font-size: clamp(14px, 3.5vw, 16px) !important;
        line-height: 1.65 !important;
      ">[Key takeaway point 1 — specific and actionable]</span>
    </li>
    <li style="
      display: flex !important;
      align-items: flex-start !important;
      gap: clamp(12px, 3vw, 16px) !important;
      margin-bottom: clamp(12px, 3vw, 16px) !important;
      padding: clamp(14px, 3.5vw, 20px) !important;
      background: rgba(255,255,255,0.06) !important;
      border-radius: 12px !important;
      border: 1px solid rgba(16,185,129,0.15) !important;
    ">
      <div style="
        min-width: clamp(26px, 6.5vw, 32px) !important;
        height: clamp(26px, 6.5vw, 32px) !important;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
        border-radius: 8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        margin-top: 2px !important;
        box-shadow: 0 2px 8px rgba(16,185,129,0.3) !important;
      ">
        <span style="color: #fff !important; font-size: clamp(13px, 3.2vw, 16px) !important; font-weight: 800 !important;">✓</span>
      </div>
      <span style="
        color: #d1fae5 !important;
        font-size: clamp(14px, 3.5vw, 16px) !important;
        line-height: 1.65 !important;
      ">[Key takeaway point 2 — specific and actionable]</span>
    </li>
    <!-- Add 3-5 more takeaway items -->
  </ul>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 11: CTA BOX — CONCLUSION CALL-TO-ACTION
═══════════════════════════════════════════════════════════════════════════════
USE: In conclusion section. Clear next step for the reader.

<div style="
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%) !important;
  border-radius: clamp(16px, 4vw, 24px) !important;
  padding: clamp(32px, 8vw, 56px) !important;
  margin: clamp(36px, 9vw, 72px) 0 !important;
  text-align: center !important;
  box-shadow: 0 16px 48px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1) !important;
  position: relative !important;
  overflow: hidden !important;
">
  <div style="
    position: absolute !important;
    top: -50% !important;
    right: -20% !important;
    width: 60% !important;
    height: 200% !important;
    background: radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%) !important;
    pointer-events: none !important;
  "></div>
  <h3 style="
    color: #ffffff !important;
    font-size: clamp(22px, 5.5vw, 32px) !important;
    font-weight: 800 !important;
    margin: 0 0 clamp(12px, 3vw, 16px) 0 !important;
    position: relative !important;
    z-index: 1 !important;
  ">Ready to Get Started?</h3>
  <p style="
    color: #e9d5ff !important;
    font-size: clamp(14px, 3.5vw, 18px) !important;
    margin: 0 0 clamp(24px, 6vw, 32px) 0 !important;
    max-width: 550px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    line-height: 1.6 !important;
    position: relative !important;
    z-index: 1 !important;
  ">[Compelling call-to-action message that summarizes the value and encourages the reader to take the next step]</p>
  <div style="
    display: inline-block !important;
    background: #ffffff !important;
    color: #5b21b6 !important;
    font-weight: 700 !important;
    padding: clamp(14px, 3.5vw, 18px) clamp(28px, 7vw, 40px) !important;
    border-radius: 14px !important;
    font-size: clamp(14px, 3.5vw, 17px) !important;
    box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
    position: relative !important;
    z-index: 1 !important;
    letter-spacing: 0.5px !important;
  ">🚀 [Action Button Text]</div>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 12: INFO BOX — BLUE GRADIENT (ADDITIONAL INFORMATION)
═══════════════════════════════════════════════════════════════════════════════
USE: For supplementary information, context, or background.

<div style="
  background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%) !important;
  border-radius: clamp(12px, 3vw, 16px) !important;
  padding: clamp(18px, 4.5vw, 32px) !important;
  margin: clamp(24px, 6vw, 40px) 0 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25) !important;
  border-left: 5px solid #3b82f6 !important;
">
  <div style="
    display: flex !important;
    align-items: flex-start !important;
    gap: clamp(14px, 3.5vw, 18px) !important;
  ">
    <div style="
      min-width: clamp(40px, 10vw, 48px) !important;
      height: clamp(40px, 10vw, 48px) !important;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
      border-radius: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 16px rgba(59,130,246,0.35) !important;
      flex-shrink: 0 !important;
    ">
      <span style="font-size: clamp(18px, 4.5vw, 22px) !important;">ℹ️</span>
    </div>
    <div style="flex: 1 !important;">
      <div style="
        color: #93c5fd !important;
        font-size: clamp(10px, 2.5vw, 12px) !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 1.5px !important;
        margin-bottom: clamp(6px, 1.5vw, 10px) !important;
      ">Did You Know?</div>
      <p style="
        color: #dbeafe !important;
        font-size: clamp(14px, 3.5vw, 16px) !important;
        line-height: 1.7 !important;
        margin: 0 !important;
      ">[Interesting additional information or context that adds value]</p>
    </div>
  </div>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 13: PROS/CONS TABLE — BALANCED COMPARISON
═══════════════════════════════════════════════════════════════════════════════
USE: When weighing advantages and disadvantages.

<div style="
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(clamp(200px, 40vw, 280px), 1fr)) !important;
  gap: clamp(16px, 4vw, 24px) !important;
  margin: clamp(28px, 7vw, 56px) 0 !important;
">
  <!-- Pros Column -->
  <div style="
    background: linear-gradient(135deg, #064e3b 0%, #065f46 100%) !important;
    border-radius: 16px !important;
    padding: clamp(20px, 5vw, 28px) !important;
    border: 1px solid rgba(34,197,94,0.3) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
  ">
    <div style="
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      margin-bottom: clamp(16px, 4vw, 20px) !important;
      padding-bottom: 12px !important;
      border-bottom: 1px solid rgba(34,197,94,0.2) !important;
    ">
      <span style="font-size: 24px !important;">👍</span>
      <span style="color: #86efac !important; font-size: 16px !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 1px !important;">Pros</span>
    </div>
    <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">
      <li style="display: flex !important; align-items: flex-start !important; gap: 10px !important; margin-bottom: 12px !important; color: #d1fae5 !important; font-size: 14px !important; line-height: 1.5 !important;">
        <span style="color: #22c55e !important; font-weight: 700 !important;">✓</span>
        [Pro point 1]
      </li>
      <li style="display: flex !important; align-items: flex-start !important; gap: 10px !important; margin-bottom: 12px !important; color: #d1fae5 !important; font-size: 14px !important; line-height: 1.5 !important;">
        <span style="color: #22c55e !important; font-weight: 700 !important;">✓</span>
        [Pro point 2]
      </li>
      <li style="display: flex !important; align-items: flex-start !important; gap: 10px !important; color: #d1fae5 !important; font-size: 14px !important; line-height: 1.5 !important;">
        <span style="color: #22c55e !important; font-weight: 700 !important;">✓</span>
        [Pro point 3]
      </li>
    </ul>
  </div>
  <!-- Cons Column -->
  <div style="
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%) !important;
    border-radius: 16px !important;
    padding: clamp(20px, 5vw, 28px) !important;
    border: 1px solid rgba(239,68,68,0.3) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
  ">
    <div style="
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      margin-bottom: clamp(16px, 4vw, 20px) !important;
      padding-bottom: 12px !important;
      border-bottom: 1px solid rgba(239,68,68,0.2) !important;
    ">
      <span style="font-size: 24px !important;">👎</span>
      <span style="color: #fca5a5 !important; font-size: 16px !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 1px !important;">Cons</span>
    </div>
    <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">
      <li style="display: flex !important; align-items: flex-start !important; gap: 10px !important; margin-bottom: 12px !important; color: #fecaca !important; font-size: 14px !important; line-height: 1.5 !important;">
        <span style="color: #ef4444 !important; font-weight: 700 !important;">✗</span>
        [Con point 1]
      </li>
      <li style="display: flex !important; align-items: flex-start !important; gap: 10px !important; margin-bottom: 12px !important; color: #fecaca !important; font-size: 14px !important; line-height: 1.5 !important;">
        <span style="color: #ef4444 !important; font-weight: 700 !important;">✗</span>
        [Con point 2]
      </li>
      <li style="display: flex !important; align-items: flex-start !important; gap: 10px !important; color: #fecaca !important; font-size: 14px !important; line-height: 1.5 !important;">
        <span style="color: #ef4444 !important; font-weight: 700 !important;">✗</span>
        [Con point 3]
      </li>
    </ul>
  </div>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT 14: HIGHLIGHT BOX — PINK/MAGENTA ACCENT
═══════════════════════════════════════════════════════════════════════════════
USE: For key insights, surprising facts, or standout information.

<div style="
  background: linear-gradient(135deg, #701a75 0%, #86198f 100%) !important;
  border-radius: clamp(12px, 3vw, 16px) !important;
  padding: clamp(18px, 4.5vw, 32px) !important;
  margin: clamp(24px, 6vw, 40px) 0 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(236,72,153,0.2) !important;
  position: relative !important;
  overflow: hidden !important;
">
  <div style="
    position: absolute !important;
    top: -20px !important;
    right: -20px !important;
    width: 100px !important;
    height: 100px !important;
    background: radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%) !important;
    pointer-events: none !important;
  "></div>
  <div style="
    display: flex !important;
    align-items: flex-start !important;
    gap: clamp(14px, 3.5vw, 18px) !important;
  ">
    <div style="
      min-width: clamp(40px, 10vw, 48px) !important;
      height: clamp(40px, 10vw, 48px) !important;
      background: linear-gradient(135deg, #ec4899 0%, #db2777 100%) !important;
      border-radius: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 16px rgba(236,72,153,0.35) !important;
      flex-shrink: 0 !important;
    ">
      <span style="font-size: clamp(18px, 4.5vw, 22px) !important;">✨</span>
    </div>
    <div style="flex: 1 !important; position: relative !important; z-index: 1 !important;">
      <div style="
        color: #fbcfe8 !important;
        font-size: clamp(10px, 2.5vw, 12px) !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 1.5px !important;
        margin-bottom: clamp(6px, 1.5vw, 10px) !important;
      ">Key Insight</div>
      <p style="
        color: #fce7f3 !important;
        font-size: clamp(14px, 3.5vw, 16px) !important;
        line-height: 1.7 !important;
        margin: 0 !important;
      ">[Important insight or surprising fact that stands out]</p>
    </div>
  </div>
</div>

═══════════════════════════════════════════════════════════════════════════════
█ COMPONENT USAGE SUMMARY — MINIMUM 18 PER ARTICLE
═══════════════════════════════════════════════════════════════════════════════

PLACEMENT GUIDELINES:
• Quick Answer Box → Immediately after intro (within first 3 paragraphs)
• Statistics Dashboard → Within first 20% of content
• Pro Tip Boxes (3x) → Distributed evenly: one early, one middle, one late
• Warning Boxes (2x) → When discussing risks, mistakes, or important caveats
• Expert Quotes (2x) → After making claims that need authority
• Comparison Tables (2x) → When comparing options, products, or approaches
• Step-by-Step (1x) → For any procedural content
• Checklists (2x) → For actionable requirements or best practices
• Definition Box (1x) → When introducing key technical terms
• Key Takeaways → DIRECTLY BEFORE FAQ section
• CTA Box → In conclusion section
• Info/Highlight Boxes → For variety throughout content

SPACING RULES:
• Never place same component type consecutively
• Maximum 3 paragraphs between visual elements
• Minimum 300 words between similar box types

════════════════════════════════════════════════════════════════════════════════
`;



// ═══════════════════════════════════════════════════════════════════════════════
// 📊 OPTIMIZATION DNA BUILDER v15.0 — ULTIMATE ENTERPRISE SOTA
// ═══════════════════════════════════════════════════════════════════════════════
// This is THE MASTER INSTRUCTION SET that controls all AI content generation.
// Every requirement here MUST be followed by the AI.
// ═══════════════════════════════════════════════════════════════════════════════

const buildOptimizationDNA = (hasNeuron: boolean, targetWords: number) => `
════════════════════════════════════════════════════════════════════════════════
████████████████████████████████████████████████████████████████████████████████
██                                                                            ██
██   📊 SEO/AEO/GEO OPTIMIZATION DNA v15.0 — ENTERPRISE REQUIREMENTS         ██
██                                                                            ██
████████████████████████████████████████████████████████████████████████████████
════════════════════════════════════════════════════════════════════════════════

🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
                    CRITICAL REQUIREMENTS — READ EVERY LINE
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

════════════════════════════════════════════════════════════════════════════════
█ WORD COUNT — ABSOLUTE MINIMUM ${targetWords}+ WORDS — NON-NEGOTIABLE
════════════════════════════════════════════════════════════════════════════════

You MUST write AT LEAST ${targetWords} words of REAL, VALUABLE content.
• This is NOT optional — content under ${targetWords} words will be REJECTED
• NO filler, NO fluff, NO repetition — every sentence must add value
• Target: ${targetWords} - ${targetWords + 800} words

SECTION WORD BUDGETS (MANDATORY):
┌──────────────────────────────────────────────────────────────────────────────┐
│ Section                    │ Min Words │ Target Words │ Max Words           │
├──────────────────────────────────────────────────────────────────────────────┤
│ Introduction (with hook)   │    250    │     350      │     450             │
│ Quick Answer Box           │     50    │      70      │     100             │
│ Main H2 Sections (10-12x)  │    350    │     450      │     600 each        │
│ H3 Subsections (18+ total) │    120    │     180      │     250 each        │
│ Key Takeaways Box          │    100    │     150      │     200             │
│ FAQ Section (7-10 Q&As)    │    500    │     700      │     900             │
│ Conclusion with CTA        │    150    │     250      │     350             │
└──────────────────────────────────────────────────────────────────────────────┘

TOTAL MINIMUM: ${targetWords} words | SECTIONS NEEDED: ${Math.ceil(targetWords / 400)}

════════════════════════════════════════════════════════════════════════════════
█ 🎨 VISUAL COMPONENTS — MANDATORY 18+ ELEMENTS — VARIETY IS KEY
════════════════════════════════════════════════════════════════════════════════

You MUST include ALL of these visual elements. Readers expect PREMIUM content:

┌──────────────────────────────────────────────────────────────────────────────┐
│ #  │ Component               │ Count │ Placement                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ 1  │ Quick Answer Box        │   1   │ Immediately after intro paragraph    │
│ 2  │ Statistics Dashboard    │   1   │ Within first 20% of content          │
│ 3  │ Pro Tip Boxes           │   3   │ Distributed: early, middle, late     │
│ 4  │ Warning/Important Boxes │   2   │ For critical info and caveats        │
│ 5  │ Expert Quote Blocks     │   2   │ After making claims that need proof  │
│ 6  │ Comparison Tables       │   2   │ In middle sections, with REAL data   │
│ 7  │ Step-by-Step Process    │   1   │ For any procedural/how-to content    │
│ 8  │ Checklist Boxes         │   2   │ For actionable requirements          │
│ 9  │ Definition Box          │   1   │ When introducing key technical terms │
│ 10 │ Key Takeaways Box       │   1   │ DIRECTLY BEFORE FAQ section          │
│ 11 │ CTA Box                 │   1   │ In conclusion section                │
│ 12 │ Info/Highlight Boxes    │   1+  │ Throughout for variety               │
└──────────────────────────────────────────────────────────────────────────────┘

VISUAL SPACING RULES:
• NEVER have more than 3 consecutive paragraphs without a visual element
• Alternate between different box types — don't cluster same type together
• Tables work best in middle sections, not intro/conclusion
• Expert quotes are most powerful after making a claim

STYLING REQUIREMENTS (CRITICAL):
• ALL backgrounds MUST be DARK (#0f172a, #1e293b, gradients)
• ALL text MUST be LIGHT (#ffffff, #f1f5f9, #e2e8f0)
• ALL styles MUST use !important to override WordPress themes
• Use clamp() for responsive sizing: clamp(min, preferred, max)
• Border-radius: 16-20px for cards, 12px for buttons, 8px for tags
• Line-height: 1.75 for body text readability

════════════════════════════════════════════════════════════════════════════════
█ 🔗 INTERNAL LINKS — MANDATORY 15-20 LINKS — RICH ANCHOR TEXT
════════════════════════════════════════════════════════════════════════════════

You MUST include 15-20 internal links with DESCRIPTIVE anchor text:

ANCHOR TEXT REQUIREMENTS:
┌──────────────────────────────────────────────────────────────────────────────┐
│ Rule                        │ Example                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ MINIMUM 3 words             │ ✓ "protein timing for muscle growth"           │
│ MAXIMUM 6 words             │ ✓ "complete guide to email marketing"          │
│ IDEAL 4-5 words             │ ✓ "best practices for content optimization"    │
│ Must be descriptive         │ ✓ "advanced keyword research strategies"       │
│ NEVER generic               │ ✗ "click here", "read more", "this article"   │
│ NEVER single word           │ ✗ "guide", "tips", "learn"                    │
│ NEVER start with weak words │ ✗ "the best...", "a guide to..."             │
└──────────────────────────────────────────────────────────────────────────────┘

LINK DISTRIBUTION:
• Distribute evenly across ALL H2 sections (1-2 links per section)
• NO more than 2 links in any single paragraph
• Minimum 300 characters between links
• Links should flow naturally within sentences

════════════════════════════════════════════════════════════════════════════════
█ 📐 STRUCTURE — HEADINGS, HIERARCHY, AND FLOW
════════════════════════════════════════════════════════════════════════════════

⚠️⚠️⚠️ CRITICAL H1 RULE ⚠️⚠️⚠️
WordPress automatically provides the page title as H1.
NEVER include an <h1> tag in your htmlContent.
Start your content with an engaging <p> paragraph — NOT a heading.

HEADING REQUIREMENTS:
┌──────────────────────────────────────────────────────────────────────────────┐
│ Element │ Count    │ Requirements                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ H1      │ 0 (ZERO) │ WordPress provides — NEVER include in content          │
│ H2      │ 10-12    │ Main sections — include keyword in 3-4 of them         │
│ H3      │ 18+      │ Subsections under H2s — 2-3 per H2 section             │
│ H4      │ Optional │ For deep nesting only when needed                      │
└──────────────────────────────────────────────────────────────────────────────┘

CONTENT FLOW ORDER:
1. Introduction paragraph (engaging hook, NO heading)
2. Quick Answer Box
3. Statistics Dashboard  
4. Main Sections (H2s with H3s, visual components distributed)
5. Key Takeaways Box ← MUST appear BEFORE FAQ
6. FAQ Section (7-10 Q&As in accordion format)
7. Conclusion with CTA Box
8. References Section ← ALWAYS AT THE VERY END

════════════════════════════════════════════════════════════════════════════════
█ 🤖 AEO (Answer Engine Optimization) — AI CITATION READINESS
════════════════════════════════════════════════════════════════════════════════

Make your content PERFECT for AI systems to cite:

FEATURED SNIPPET OPTIMIZATION:
• First 50-70 words = Direct, definitive answer to the main question
• Use "What is X? X is..." format for definitions
• Use numbered lists for "how to" and "steps" queries
• Use tables for comparisons and "best of" queries

ENTITY OPTIMIZATION:
• Use EXACT entity names (proper capitalization, official names)
• Include entity relationships: "X, which is owned by Y, provides Z"
• Mention related entities naturally throughout content
• Use schema markup for all entities when possible

QUOTABLE SOUNDBITES:
• Create 2-3 sentence "quotable" summaries per section
• Make definitive statements: "The best X for Y is Z because..."
• Include specific numbers: "Studies show 73% improvement..."
• Use expert-style phrasing: "Based on our analysis of 500+ cases..."

════════════════════════════════════════════════════════════════════════════════
█ 🌍 GEO (Generative Engine Optimization) — SOURCE CITATION
════════════════════════════════════════════════════════════════════════════════

AI systems LOVE well-sourced content. Follow these rules:

INLINE CITATIONS:
• Use [1], [2], [3] notation for inline citations
• Cite sources IMMEDIATELY after making claims
• Aim for 8-15 unique citations throughout content
• Each major claim should have a supporting source

REFERENCE SECTION (AT VERY END):
• List ALL sources with full details
• Format: [1] Source Name. "Article Title." Publication, Year. URL
• Prioritize authority sources (.gov, .edu, major publications)
• Include a mix: studies, expert opinions, official sources

SOURCE DIVERSITY:
• Academic sources (journals, research papers)
• Government/institutional sources (.gov, .edu, .org)
• Industry experts (named individuals with credentials)
• Reputable publications (major news, trade publications)
• Recent data (${CONTENT_YEAR} preferred, 2023+ acceptable)

════════════════════════════════════════════════════════════════════════════════
█ 🔍 SEO FUNDAMENTALS — RANKING SIGNALS
════════════════════════════════════════════════════════════════════════════════

KEYWORD OPTIMIZATION:
• Primary keyword in: first 100 words, 2-3 H2s, meta description
• Keyword density: 0.8-1.5% (natural, not forced)
• LSI/semantic keywords distributed throughout
• Question keywords in FAQ section
${hasNeuron ? '• NeuronWriter terms: 70%+ coverage MANDATORY' : ''}

READABILITY:
• Paragraphs: 2-4 sentences MAX (mobile-friendly)
• Sentences: Mix lengths — short punchy + longer explanatory
• Use transition words between paragraphs
• Active voice preferred (limit passive to 10%)
• Reading level: 8th-10th grade (Flesch 60-70)

ENGAGEMENT SIGNALS:
• Use "you" and "your" — address reader directly
• Ask rhetorical questions
• Use power words (proven, essential, critical, etc.)
• Include specific numbers and data points
• Break up text with visual elements

════════════════════════════════════════════════════════════════════════════════
█ 🏆 E-E-A-T SIGNALS — EXPERTISE, EXPERIENCE, AUTHORITY, TRUST
════════════════════════════════════════════════════════════════════════════════

EXPERIENCE SIGNALS:
• First-hand observations: "In our experience..."
• Case study references: "We tested this with 50 clients..."
• Practical tips from real implementation
• Specific examples with real outcomes

EXPERTISE SIGNALS:
• Technical accuracy and depth
• Industry-specific terminology (properly explained)
• Up-to-date information (current year data)
• Comprehensive coverage of the topic

AUTHORITY SIGNALS:
• Expert quotes with full attribution
• Citations to authoritative sources
• Reference to studies and research
• Industry statistics and data

TRUST SIGNALS:
• Transparent methodology
• Balanced viewpoints (pros AND cons)
• Clear source attribution
• Factual accuracy throughout

════════════════════════════════════════════════════════════════════════════════
█ ✍️ WRITING STYLE — HUMAN, NOT AI
════════════════════════════════════════════════════════════════════════════════

Write like Alex Hormozi — direct, punchy, human:

✅ DO:
• Use contractions (don't, won't, you'll, we're)
• Start sentences with "And", "But", "So" — real humans do this
• Use fragments. For emphasis. Like this.
• Include personality — humor, frustration, excitement
• Address reader directly: "Here's what you need to know..."
• Be opinionated — take a stance

❌ DON'T USE THESE AI-DETECTABLE PHRASES:
• "In today's fast-paced world..."
• "It's important to note that..."
• "Let's dive in..."
• "Without further ado..."
• "In conclusion..."
• "Comprehensive guide"
• "Valuable insights"
• "Leverage" or "utilize" (use "use")
• "Delve" (use "explore" or "look at")
• "Navigate the complexities"
• "Embark on a journey"

SENTENCE STRUCTURE:
• Mix lengths DRAMATICALLY: "Short. Punchy." Then longer explanations.
• Vary paragraph length (1-5 sentences, average 2-3)
• Use rhetorical questions: "Sound familiar?"
• Include pattern interrupts: "Here's what nobody tells you..."

════════════════════════════════════════════════════════════════════════════════
█ 📋 FINAL CHECKLIST — VERIFY BEFORE SUBMITTING
════════════════════════════════════════════════════════════════════════════════

Before outputting your response, verify ALL of these:

□ Word count is ${targetWords}+ words (count manually if needed)
□ NO H1 tags in content (WordPress provides title)
□ 10+ H2 headings with keyword in 3-4
□ 18+ H3 subheadings
□ Quick Answer Box after intro
□ Statistics Dashboard early in content
□ 3 Pro Tip boxes distributed throughout
□ 2 Warning boxes for critical info
□ 2 Expert quote blockquotes
□ 2 Comparison tables with real data
□ 1 Step-by-step process box
□ 2 Checklist boxes
□ Key Takeaways BEFORE FAQ
□ FAQ section with 7-10 Q&As
□ CTA box in conclusion
□ References section AT VERY END
□ 15-20 internal links with 3-5 word anchors
□ 8-15 external reference citations
□ ALL visual components have dark backgrounds
□ ALL text is light colored
□ Content reads naturally and human

════════════════════════════════════════════════════════════════════════════════
`;



// ═══════════════════════════════════════════════════════════════════════════════
// 📝 DATA FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════════

function formatNeuronTerms(neuronData?: NeuronAnalysisResult): string {
    if (!neuronData?.terms?.length) return '';
    
    const terms = neuronData.terms;
    const criticalTerms = terms.filter(t => t.importance >= 80).slice(0, 20);
    const titleTerms = terms.filter(t => t.type === 'title').slice(0, 10);
    const headerTerms = terms.filter(t => t.type === 'header').slice(0, 30);
    const bodyTerms = terms.filter(t => t.type === 'basic' || t.type === 'extended').slice(0, 50);
    
    return `
════════════════════════════════════════════════════════════════════════════════
🧬 NEURONWRITER NLP TERMS — MANDATORY 70%+ COVERAGE
════════════════════════════════════════════════════════════════════════════════
Target Word Count: ${neuronData.targetWordCount || 4500}+ words

🎯 CRITICAL TERMS (Must use ALL):
${criticalTerms.map(t => `• "${t.term}" (use ${t.recommended}+ times)`).join('\n')}

🏷️ TITLE/H1 TERMS (Use in headings):
${titleTerms.map(t => t.term).join(', ')}

📑 HEADER TERMS (Use in H2/H3):
${headerTerms.map(t => t.term).join(', ')}

📝 BODY TERMS (Distribute throughout):
${bodyTerms.map(t => t.term).join(', ')}

⚠️ You MUST naturally incorporate 70%+ of these terms throughout the content.
════════════════════════════════════════════════════════════════════════════════
`;
}

function formatEntityGap(data?: EntityGapAnalysis): string {
    if (!data) return '';
    
    const parts: string[] = [];
    
    if (data.missingEntities?.length) {
        parts.push(`ENTITIES TO INCLUDE:\n${data.missingEntities.slice(0, 25).join(', ')}`);
    }
    
    if (data.paaQuestions?.length) {
        parts.push(`PEOPLE ALSO ASK (Answer these in FAQ):\n${data.paaQuestions.slice(0, 12).map((q, i) => `${i + 1}. ${q}`).join('\n')}`);
    }
    
    if (data.topKeywords?.length) {
        parts.push(`SEMANTIC KEYWORDS:\n${data.topKeywords.slice(0, 20).join(', ')}`);
    }
    
    if (data.contentGaps?.length) {
        parts.push(`CONTENT GAPS TO FILL:\n${data.contentGaps.slice(0, 8).map(g => `• ${g}`).join('\n')}`);
    }
    
    return parts.length > 0 ? `
════════════════════════════════════════════════════════════════════════════════
🧠 SERP ANALYSIS & ENTITY DATA
════════════════════════════════════════════════════════════════════════════════
${parts.join('\n\n')}
════════════════════════════════════════════════════════════════════════════════
` : '';
}

function formatReferences(refs?: ValidatedReference[]): string {
    if (!refs?.length) return '';
    
    const validRefs = refs.filter(r => r.isValid).slice(0, 15);
    
    return `
════════════════════════════════════════════════════════════════════════════════
📚 VALIDATED AUTHORITATIVE REFERENCES — USE THESE
════════════════════════════════════════════════════════════════════════════════
${validRefs.map((r, i) => `[${i + 1}] ${r.title} (${r.source}, ${r.year})
    URL: ${r.url}${r.isAuthority ? ' ⭐ AUTHORITY SOURCE' : ''}`).join('\n\n')}

⚠️ CITE these sources inline using [1], [2] notation.
⚠️ Include ALL sources in the References section at the VERY END of the article.
════════════════════════════════════════════════════════════════════════════════
`;
}

function formatInternalLinks(links?: InternalLinkTarget[]): string {
    if (!links?.length) return '';
    
    const validLinks = links.filter(l => l.title?.length > 5).slice(0, 30);
    
    return `
════════════════════════════════════════════════════════════════════════════════
🔗 INTERNAL LINK TARGETS — ADD 15-20 CONTEXTUAL LINKS
════════════════════════════════════════════════════════════════════════════════
Use 3-5 word descriptive anchor text (NOT "click here" or single words):

${validLinks.map(l => `• "${l.title}" → ${l.url}`).join('\n')}

⚠️ Anchor text rules:
- MINIMUM 3 words — NO EXCEPTIONS
- GOOD: "complete guide to protein timing" → /protein-timing-guide
- BAD: "here", "click", "protein", "guide"
════════════════════════════════════════════════════════════════════════════════
`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 H1 REMOVAL — ALWAYS APPLIED
// ═══════════════════════════════════════════════════════════════════════════════

export function removeAllH1Tags(html: string): string {
    if (!html) return html;
    
    let cleaned = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');
    cleaned = cleaned.replace(/<h1[^>]*\/>/gi, '');
    cleaned = cleaned.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned.trim();
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥🔥🔥 CSS-ONLY FAQ ACCORDION — WORDPRESS CSP COMPATIBLE
// ═══════════════════════════════════════════════════════════════════════════════
// This version uses NO JavaScript - only CSS :checked pseudo-class
// Works in all WordPress themes regardless of CSP settings
// ═══════════════════════════════════════════════════════════════════════════════

export function generateEnterpriseAccordionFAQ(
    faqs: Array<{ question: string; answer: string }>
): string {
    if (!faqs || faqs.length === 0) return '';
    
    const sectionId = `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 🔥 NEW: Modern muted color palette (authority brand feel)
    const colorPalette = [
        { accent: '#6366f1', bg: '#eef2ff', text: '#3730a3' },  // Indigo
        { accent: '#8b5cf6', bg: '#f5f3ff', text: '#5b21b6' },  // Purple
        { accent: '#06b6d4', bg: '#ecfeff', text: '#155e75' },  // Cyan
        { accent: '#10b981', bg: '#ecfdf5', text: '#065f46' },  // Emerald
        { accent: '#f59e0b', bg: '#fffbeb', text: '#92400e' },  // Amber
        { accent: '#ec4899', bg: '#fdf2f8', text: '#9d174d' },  // Pink
    ];
    
    // Generate CSS for this accordion instance
    const css = `
<style>
.wp-opt-faq-${sectionId} {
    background: #ffffff !important;
    border-radius: 12px !important;
    padding: 0 !important;
    margin: 48px 0 !important;
    border: 1px solid rgba(0,0,0,0.08) !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
    overflow: hidden !important;
}
.wp-opt-faq-${sectionId} .faq-header {
    padding: 28px 32px !important;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
    border-bottom: 1px solid rgba(0,0,0,0.06) !important;
}
.wp-opt-faq-${sectionId} .faq-item {
    border-bottom: 1px solid rgba(0,0,0,0.06) !important;
}
.wp-opt-faq-${sectionId} .faq-item:last-child {
    border-bottom: none !important;
}
.wp-opt-faq-${sectionId} .faq-checkbox {
    position: absolute !important;
    opacity: 0 !important;
    pointer-events: none !important;
}
.wp-opt-faq-${sectionId} .faq-question {
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    gap: 16px !important;
    padding: 20px 24px !important;
    border: none !important;
    background: #ffffff !important;
    cursor: pointer !important;
    text-align: left !important;
    transition: background 0.2s ease !important;
    margin: 0 !important;
}
.wp-opt-faq-${sectionId} .faq-question:hover {
    background: #f8fafc !important;
}
.wp-opt-faq-${sectionId} .faq-answer {
    max-height: 0 !important;
    overflow: hidden !important;
    transition: max-height 0.4s ease, padding 0.4s ease !important;
    background: #f8fafc !important;
}
.wp-opt-faq-${sectionId} .faq-checkbox:checked + .faq-question + .faq-answer {
    max-height: 800px !important;
}
.wp-opt-faq-${sectionId} .faq-chevron {
    transition: transform 0.3s ease !important;
    display: inline-block !important;
}
.wp-opt-faq-${sectionId} .faq-checkbox:checked + .faq-question .faq-chevron {
    transform: rotate(180deg) !important;
}
</style>`;

    const faqItems = faqs.map((faq, index) => {
        const colors = colorPalette[index % colorPalette.length];
        const itemId = `${sectionId}-q${index}`;
        const safeQuestion = escapeHtml(faq.question);
        const safeAnswer = escapeHtml(faq.answer);
        
        return `
    <div class="faq-item">
        <input type="checkbox" id="${itemId}" class="faq-checkbox" aria-hidden="true" />
        <label for="${itemId}" class="faq-question">
            <div style="min-width: 36px !important; height: 36px !important; background: ${colors.bg} !important; border-radius: 10px !important; display: flex !important; align-items: center !important; justify-content: center !important; border: 2px solid ${colors.accent}30 !important;">
                <span style="font-size: 14px !important; font-weight: 700 !important; color: ${colors.accent} !important;">${index + 1}</span>
            </div>
            <span style="flex: 1 !important; color: #1e293b !important; font-size: 16px !important; font-weight: 600 !important; line-height: 1.5 !important;">
                ${safeQuestion}
            </span>
            <span class="faq-chevron" style="font-size: 14px !important; color: #94a3b8 !important;">▼</span>
        </label>
        <div class="faq-answer">
            <div style="padding: 0 24px 24px 76px !important;">
                <p style="color: #475569 !important; font-size: 15px !important; line-height: 1.75 !important; margin: 0 !important;">
                    ${safeAnswer}
                </p>
            </div>
        </div>
    </div>`;
    }).join('\n');

    return `
${css}
<section class="wp-opt-faq-${sectionId}" itemscope itemtype="https://schema.org/FAQPage">
    <div class="faq-header">
        <div style="display: flex !important; align-items: center !important; gap: 16px !important;">
            <div style="width: 48px !important; height: 48px !important; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 4px 12px rgba(99,102,241,0.25) !important;">
                <span style="font-size: 24px !important;">❓</span>
            </div>
            <div>
                <h2 style="color: #1e293b !important; font-size: 22px !important; font-weight: 700 !important; margin: 0 !important;">Frequently Asked Questions</h2>
                <p style="color: #64748b !important; font-size: 13px !important; margin: 4px 0 0 0 !important;">${faqs.length} questions answered • Click to expand</p>
            </div>
        </div>
    </div>
    ${faqItems}
</section>
`;
}



// ═══════════════════════════════════════════════════════════════════════════════
// 📚 REFERENCES SECTION GENERATOR — DARK MODE
// ═══════════════════════════════════════════════════════════════════════════════

export function generateReferencesSection(references: ValidatedReference[]): string {
    if (!references || !Array.isArray(references) || references.length === 0) {
        return '';
    }
    
    const validRefs = references.filter(ref => {
        if (!ref) return false;
        if (!ref.url || typeof ref.url !== 'string') return false;
        if (!ref.url.startsWith('http')) return false;
        if (ref.isValid === false) return false;
        return true;
    });
    
    if (validRefs.length === 0) {
        return '';
    }

    // 🔥 NEW: Link Card style references (not plain list)
    const refItems = validRefs.map((ref, index) => {
        const domain = ref.domain || (() => {
            try {
                return new URL(ref.url).hostname.replace('www.', '');
            } catch {
                return 'Source';
            }
        })();
        const title = ref.title || 'Untitled Source';
        
        // Generate favicon URL
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        
        return `
        <a href="${ref.url}" target="_blank" rel="noopener noreferrer" style="display: block !important; text-decoration: none !important; margin-bottom: 12px !important;">
            <div style="background: #ffffff !important; border-radius: 12px !important; padding: 16px 20px !important; border: 1px solid rgba(0,0,0,0.08) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important; transition: all 0.2s ease !important; display: flex !important; align-items: center !important; gap: 16px !important;">
                <div style="width: 40px !important; height: 40px !important; background: #f8fafc !important; border-radius: 8px !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important;">
                    <img src="${faviconUrl}" alt="" style="width: 20px !important; height: 20px !important; border-radius: 4px !important;" onerror="this.style.display='none'" />
                </div>
                <div style="flex: 1 !important; min-width: 0 !important;">
                    <div style="color: #1e293b !important; font-size: 14px !important; font-weight: 600 !important; line-height: 1.4 !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;">${escapeHtml(title)}</div>
                    <div style="display: flex !important; align-items: center !important; gap: 8px !important; margin-top: 4px !important;">
                        <span style="color: #3b82f6 !important; font-size: 12px !important; font-weight: 500 !important;">${ref.source || domain}</span>
                        <span style="color: #cbd5e1 !important;">•</span>
                        <span style="color: #94a3b8 !important; font-size: 12px !important;">${ref.year || CONTENT_YEAR}</span>
                        ${ref.isAuthority ? '<span style="background: #dcfce7 !important; color: #166534 !important; font-size: 10px !important; font-weight: 600 !important; padding: 2px 8px !important; border-radius: 4px !important; text-transform: uppercase !important;">Authority</span>' : ''}
                    </div>
                </div>
                <div style="color: #94a3b8 !important; font-size: 16px !important; flex-shrink: 0 !important;">→</div>
            </div>
        </a>`;
    }).join('\n');
    
    // 🔥 NEW: Collapsible accordion for references
    const sectionId = `refs-${Date.now()}`;
    
    return `
<!-- REFERENCES SECTION — LINK CARDS WITH ACCORDION -->
<style>
.ref-accordion-${sectionId} input { display: none !important; }
.ref-accordion-${sectionId} .ref-content { max-height: 0 !important; overflow: hidden !important; transition: max-height 0.4s ease !important; }
.ref-accordion-${sectionId} input:checked + label + .ref-content { max-height: 2000px !important; }
.ref-accordion-${sectionId} label .ref-chevron { transition: transform 0.3s ease !important; }
.ref-accordion-${sectionId} input:checked + label .ref-chevron { transform: rotate(180deg) !important; }
</style>
<section class="ref-accordion-${sectionId}" style="background: #f8fafc !important; border-radius: 12px !important; margin: 64px 0 32px 0 !important; border: 1px solid rgba(0,0,0,0.06) !important; overflow: hidden !important;">
    <input type="checkbox" id="ref-toggle-${sectionId}" />
    <label for="ref-toggle-${sectionId}" style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 20px 24px !important; cursor: pointer !important; background: #ffffff !important; border-bottom: 1px solid rgba(0,0,0,0.06) !important;">
        <div style="display: flex !important; align-items: center !important; gap: 12px !important;">
            <span style="font-size: 20px !important;">📚</span>
            <div>
                <div style="color: #1e293b !important; font-size: 16px !important; font-weight: 700 !important;">Sources & References</div>
                <div style="color: #64748b !important; font-size: 12px !important;">${validRefs.length} authoritative sources cited</div>
            </div>
        </div>
        <span class="ref-chevron" style="color: #94a3b8 !important; font-size: 14px !important;">▼</span>
    </label>
    <div class="ref-content" style="padding: 0 20px !important; background: #f8fafc !important;">
        <div style="padding: 20px 0 !important;">
            ${refItems}
        </div>
    </div>
</section>
`;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 KEY TAKEAWAYS BOX GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export function generateKeyTakeawaysBox(takeaways: string[]): string {
    if (!takeaways || takeaways.length === 0) return '';
    
    const items = takeaways.map((t, i) => `
    <li style="display: flex !important; align-items: flex-start !important; gap: 14px !important; margin-bottom: 12px !important; padding: 16px 18px !important; background: rgba(255,255,255,0.8) !important; border-radius: 10px !important; border: 1px solid rgba(34,197,94,0.15) !important;">
      <div style="min-width: 24px !important; height: 24px !important; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important; border-radius: 6px !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; margin-top: 2px !important;">
        <span style="color: #ffffff !important; font-size: 14px !important; font-weight: 700 !important;">✓</span>
      </div>
      <span style="color: #14532d !important; font-size: 15px !important; line-height: 1.65 !important;">${escapeHtml(t)}</span>
    </li>`).join('\n');
    
    return `
<!-- KEY TAKEAWAYS BOX — AUTHORITY DESIGN -->
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important; border-radius: 12px !important; padding: 32px !important; margin: 48px 0 !important; border: 1px solid rgba(34,197,94,0.2) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;">
  <div style="display: flex !important; align-items: center !important; gap: 14px !important; margin-bottom: 24px !important; padding-bottom: 20px !important; border-bottom: 1px solid rgba(34,197,94,0.15) !important;">
    <div style="width: 44px !important; height: 44px !important; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 4px 12px rgba(34,197,94,0.25) !important;">
      <span style="font-size: 22px !important;">🎯</span>
    </div>
    <h2 style="color: #166534 !important; font-size: 20px !important; font-weight: 700 !important; margin: 0 !important;">Key Takeaways</h2>
  </div>
  <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">
    ${items}
  </ul>
</div>
`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 SYSTEM PROMPT BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

export function buildSystemPrompt(config: {
    ctx: SiteContext;
    topic: string;
    mode: 'surgical' | 'writer';
    entityGapData?: EntityGapAnalysis;
    neuronData?: NeuronAnalysisResult;
    existingAnalysis?: ExistingContentAnalysis;
    allFeedback?: string[];
    targetKeyword?: string;
    validatedReferences?: ValidatedReference[];
    internalLinks?: InternalLinkTarget[];
    geoConfig?: GeoTargetConfig;
    attemptNumber?: number;
}): string {
    const { 
        ctx, topic, mode, entityGapData, neuronData, existingAnalysis, 
        allFeedback, targetKeyword, validatedReferences, internalLinks, 
        geoConfig, attemptNumber = 1
    } = config;
    
    const kw = targetKeyword || topic;
    const hasNeuron = neuronData?.terms?.length;
    const targetWords = hasNeuron ? neuronData!.targetWordCount : 4500;
    const addYearToTitle = shouldIncludeYearInTitle(topic);

    const identity = `You are a $200K/year SEO content architect who writes like Alex Hormozi.
Your content ALWAYS sounds 100% human-written — never like AI.
You create premium, visually stunning WordPress blog posts that rank #1.

═══════════════════════════════════════════════════════════════════════════════
📌 CURRENT ASSIGNMENT
═══════════════════════════════════════════════════════════════════════════════
SITE: ${ctx.orgName} (${ctx.url})
AUTHOR: ${ctx.authorName}
TOPIC: "${topic}"
PRIMARY KEYWORD: "${kw}"
MODE: ${mode.toUpperCase()}
CURRENT YEAR: ${CONTENT_YEAR}
YEAR IN TITLE: ${addYearToTitle ? `YES - Include ${CONTENT_YEAR}` : 'NO - Evergreen topic'}
═══════════════════════════════════════════════════════════════════════════════`;

    const structureRequirements = `
════════════════════════════════════════════════════════════════════════════════
🏗️ MANDATORY CONTENT STRUCTURE — ZERO TOLERANCE FOR VIOLATIONS
════════════════════════════════════════════════════════════════════════════════

⛔⛔⛔ ABSOLUTE RULES — VIOLATION = REJECTION ⛔⛔⛔

1. ZERO H1 TAGS — WordPress provides page title as H1
   └─ Your content starts with <p>, NEVER <h1>

2. MINIMUM ${targetWords} WORDS — Count before submitting
   └─ Short content = automatic rejection

3. VISUAL COMPONENT QUOTA:
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Component Type              │ MINIMUM │ Placement                       │
   ├─────────────────────────────────────────────────────────────────────────┤
   │ Quick Answer Box            │    1    │ Within first 150 words          │
   │ Statistics Dashboard        │    1    │ Within first 500 words          │
   │ Pro Tip Boxes (green)       │    3    │ Sections 2, 5, 8                │
   │ Warning Boxes (amber)       │    2    │ Where mistakes are discussed    │
   │ Expert Blockquotes          │    2    │ After claims needing authority  │
   │ Comparison Tables           │    2    │ Middle sections (H2 #4-7)       │
   │ Step-by-Step Process        │    1    │ Any how-to section              │
   │ Checklists                  │    2    │ Actionable sections             │
   │ Key Takeaways               │    1    │ IMMEDIATELY before FAQ          │
   │ CTA Box                     │    1    │ In conclusion section           │
   │ Definition Boxes            │   1+    │ When introducing key terms      │
   │ Info/Highlight Boxes        │   2+    │ Throughout for variety          │
   └─────────────────────────────────────────────────────────────────────────┘

4. INTERNAL LINKS — 15-20 REQUIRED:
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Anchor Text Rules:                                                      │
   │ ✓ MUST be 3-6 words (ideal: 4-5)                                       │
   │ ✓ MUST start with meaningful word (noun/verb)                          │
   │ ✓ MUST describe destination content                                    │
   │                                                                         │
   │ ❌ BANNED: "click here", "read more", "this guide", "learn more"       │
   │ ❌ BANNED: Single words, starting with "the/a/an/this/our/your"        │
   │ ❌ BANNED: Generic phrases that don't describe content                 │
   └─────────────────────────────────────────────────────────────────────────┘

5. CORRECT CONTENT ORDER:
   1. Hook paragraph (engaging, NO heading)
   2. Quick Answer Box (50-70 words)
   3. Statistics Dashboard (3-4 metrics)
   4. Main H2 Sections (10-12 sections, each with visuals)
   5. Key Takeaways Box ← MUST appear HERE, before FAQ
   6. FAQ Accordion (7-10 Q&As)
   7. Conclusion paragraph
   8. CTA Box
   9. References Section ← ALWAYS LAST

════════════════════════════════════════════════════════════════════════════════
`;


    const outputFormat = `
════════════════════════════════════════════════════════════════════════════════
📤 OUTPUT FORMAT — VALID JSON ONLY
════════════════════════════════════════════════════════════════════════════════

{
  "title": "50-60 char SEO title with '${kw}'${addYearToTitle ? ` and '${CONTENT_YEAR}'` : ''}",
  "excerpt": "150-160 char excerpt summarizing value",
  "metaDescription": "150-160 char meta description with keyword",
  "slug": "${kw.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}${addYearToTitle ? `-${CONTENT_YEAR}` : ''}",
  "htmlContent": "FULL HTML content with ${targetWords}+ words. NO <h1> tags. DARK backgrounds, WHITE text.",
  "faqs": [
    {"question": "Specific question?", "answer": "100-150 word answer"},
    ... (7-10 total FAQs)
  ],
  "schema": {
    "@context": "https://schema.org",
    "@graph": [
      {"@type": "Article", "headline": "[title]", "author": {...}, "datePublished": "..."},
      {"@type": "FAQPage", "mainEntity": [...]}
    ]
  },
  "expertInsight": "150+ word expert perspective",
  "internalLinkSuggestions": ["anchor text suggestions"],
  "groundingSources": [{"uri": "url", "title": "title"}],
  "featuredImagePrompt": "DALL-E prompt for featured image",
  "categoryNames": ["categories"],
  "structureVerified": true
}

⚠️ CRITICAL: Output ONLY valid JSON. No markdown, no explanation.
════════════════════════════════════════════════════════════════════════════════`;

    let feedbackSection = '';
    if (allFeedback?.length && attemptNumber > 1) {
        feedbackSection = `
════════════════════════════════════════════════════════════════════════════════
🔧 FIXES REQUIRED (From attempt #${attemptNumber - 1})
════════════════════════════════════════════════════════════════════════════════
${allFeedback.slice(-6).map((f, i) => `${i + 1}. ${f}`).join('\n')}
════════════════════════════════════════════════════════════════════════════════`;
    }

    const sections = [
        identity,
        HUMAN_WRITING_DNA,
        VISUAL_COMPONENT_LIBRARY,
        buildOptimizationDNA(!!hasNeuron, targetWords),
        structureRequirements,
        formatNeuronTerms(neuronData),
        formatEntityGap(entityGapData),
        formatReferences(validatedReferences),
        formatInternalLinks(internalLinks),
        feedbackSection,
        outputFormat
    ].filter(Boolean);

    return sections.join('\n\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 NLP COVERAGE ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════

export function analyzeNLPCoverage(
    html: string,
    terms: NeuronTerm[]
): NLPCoverageAnalysis {
    if (!html || terms.length === 0) {
        return {
            score: 100,
            weightedScore: 100,
            usedTerms: [],
            missingTerms: [],
            criticalMissing: [],
            headerMissing: [],
            bodyMissing: [],
        };
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const textContent = doc.body?.textContent?.toLowerCase() || '';
    
    const usedTerms: Array<NeuronTerm & { count: number; positions: number[] }> = [];
    const missingTerms: NeuronTerm[] = [];
    
    let totalWeight = 0;
    let usedWeight = 0;

    for (const term of terms) {
        const termLower = term.term.toLowerCase();
        const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        
        const positions: number[] = [];
        let match;
        while ((match = regex.exec(textContent)) !== null) {
            positions.push(match.index);
        }
        
        const count = positions.length;
        const weight = term.importance || 50;
        totalWeight += weight;
        
        if (count > 0) {
            usedTerms.push({ ...term, count, positions });
            usedWeight += weight;
        } else {
            missingTerms.push(term);
        }
    }

    const criticalMissing = missingTerms.filter(t => (t.importance || 50) >= 80);
    const headerMissing = missingTerms.filter(t => t.type === 'header' || t.type === 'title');
    const bodyMissing = missingTerms.filter(t => t.type === 'basic' || t.type === 'extended');

    const score = terms.length > 0 
        ? Math.round((usedTerms.length / terms.length) * 100)
        : 100;
    
    const weightedScore = totalWeight > 0
        ? Math.round((usedWeight / totalWeight) * 100)
        : 100;

    return {
        score,
        weightedScore,
        usedTerms,
        missingTerms,
        criticalMissing,
        headerMissing,
        bodyMissing,
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 NLP TERM INJECTION POST-PROCESSOR
// ═══════════════════════════════════════════════════════════════════════════════

const INJECTION_TEMPLATES = {
    definition: [
        `{term} refers to the process of`,
        `Understanding {term} is essential because`,
        `{term} plays a crucial role in`,
        `The concept of {term} involves`,
    ],
    importance: [
        `{term} is particularly important for`,
        `Many experts emphasize {term} as`,
        `The significance of {term} cannot be overstated—`,
        `Focusing on {term} helps ensure`,
    ],
    example: [
        `A good example of {term} is`,
        `{term} can be seen in`,
        `Consider how {term} applies to`,
    ],
    transition: [
        `This relates directly to {term}, which`,
        `Building on this, {term}`,
        `Furthermore, {term}`,
    ],
    expert: [
        `Industry experts recommend {term} for`,
        `Research supports the use of {term} in`,
        `Studies show that {term}`,
    ],
};

const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been'
]);

const TERM_CLUSTERS: Record<string, string[]> = {
    seo: ['ranking', 'search', 'google', 'keyword', 'optimization', 'serp', 'traffic'],
    content: ['writing', 'article', 'blog', 'post', 'copy', 'text', 'words'],
    marketing: ['strategy', 'campaign', 'audience', 'conversion', 'leads', 'funnel'],
    health: ['wellness', 'fitness', 'nutrition', 'medical', 'treatment', 'symptoms'],
    business: ['company', 'revenue', 'profit', 'growth', 'market', 'industry'],
    finance: ['money', 'investment', 'budget', 'cost', 'price', 'savings', 'roi'],
};

function getRelatedTerms(term: string): string[] {
    const related: Set<string> = new Set();
    const termLower = term.toLowerCase();
    
    for (const [cluster, clusterTerms] of Object.entries(TERM_CLUSTERS)) {
        let matchScore = 0;
        for (const clusterTerm of clusterTerms) {
            if (termLower.includes(clusterTerm) || clusterTerm.includes(termLower)) {
                matchScore += 2;
            }
        }
        if (matchScore >= 2) {
            clusterTerms.forEach(t => related.add(t));
        }
    }
    
    return Array.from(related);
}

function findSemanticInsertionPoints(
    doc: Document,
    term: NeuronTerm,
    existingInsertions: Map<Element, number>
): Array<{ element: Element; score: number; position: 'start' | 'middle' | 'end' }> {
    const insertionPoints: Array<{ element: Element; score: number; position: 'start' | 'middle' | 'end' }> = [];
    const termLower = term.term.toLowerCase();
    const relatedTerms = getRelatedTerms(termLower);
    
    const paragraphs = Array.from(doc.querySelectorAll('p, li, td'));
    
    for (const element of paragraphs) {
        const currentInsertions = existingInsertions.get(element) || 0;
        if (currentInsertions >= 2) continue;
        
        const text = element.textContent?.toLowerCase() || '';
        if (text.length < 80 || text.length > 600) continue;
        if (text.includes(termLower)) continue;
        
        let parent = element.parentElement;
        const forbiddenTags = new Set(['A', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'CODE', 'PRE']);
        let isInvalid = false;
        while (parent) {
            if (forbiddenTags.has(parent.tagName)) {
                isInvalid = true;
                break;
            }
            parent = parent.parentElement;
        }
        if (isInvalid) continue;
        
        let contextScore = 0;
        for (const related of relatedTerms) {
            if (text.includes(related)) contextScore += 15;
        }
        
        if (contextScore < 10) continue;
        
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
        let position: 'start' | 'middle' | 'end' = 'end';
        if (sentences.length >= 3) position = 'middle';
        
        insertionPoints.push({ element, score: contextScore, position });
    }
    
    return insertionPoints.sort((a, b) => b.score - a.score);
}

function insertTermNaturally(
    element: Element,
    term: NeuronTerm,
    position: 'start' | 'middle' | 'end'
): { success: boolean; template: string } {
    const originalHtml = element.innerHTML;
    const termText = term.term;
    
    const categories = Object.keys(INJECTION_TEMPLATES) as Array<keyof typeof INJECTION_TEMPLATES>;
    const templateCategory = categories[Math.floor(Math.random() * categories.length)];
    const templates = INJECTION_TEMPLATES[templateCategory];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const insertionText = template.replace('{term}', `<strong>${termText}</strong>`);
    const sentences = originalHtml.split(/(?<=[.!?])\s+/);
    
    if (sentences.length === 0) return { success: false, template: '' };
    
    let newHtml: string;
    if (position === 'end' || sentences.length === 1) {
        newHtml = `${originalHtml.trim()} ${insertionText}`;
    } else if (position === 'start') {
        newHtml = `${insertionText} ${originalHtml.trim()}`;
    } else {
        const midPoint = Math.floor(sentences.length / 2);
        const before = sentences.slice(0, midPoint).join(' ');
        const after = sentences.slice(midPoint).join(' ');
        newHtml = `${before} ${insertionText} ${after}`;
    }
    
    element.innerHTML = newHtml;
    return { success: true, template };
}

export function injectMissingNLPTerms(
    html: string,
    neuronTerms: NeuronTerm[],
    options: {
        targetCoverage?: number;
        maxInsertions?: number;
        prioritizeCritical?: boolean;
    } = {}
): NLPInjectionResult {
    const {
        targetCoverage = DEFAULT_TARGET_NLP_COVERAGE,
        maxInsertions = MAX_NLP_INJECTIONS,
        prioritizeCritical = true,
    } = options;

    if (!html || neuronTerms.length === 0) {
        return {
            html,
            termsAdded: [],
            termsFailed: [],
            initialCoverage: 100,
            finalCoverage: 100,
            insertionDetails: [],
        };
    }

    const initialAnalysis = analyzeNLPCoverage(html, neuronTerms);
    
    if (initialAnalysis.score >= targetCoverage) {
        return {
            html,
            termsAdded: [],
            termsFailed: [],
            initialCoverage: initialAnalysis.score,
            finalCoverage: initialAnalysis.score,
            insertionDetails: [],
        };
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const termsAdded: string[] = [];
    const termsFailed: string[] = [];
    const insertionDetails: NLPInjectionResult['insertionDetails'] = [];
    const insertionCounts = new Map<Element, number>();

    let termsToInject = [...initialAnalysis.missingTerms];
    
    if (prioritizeCritical) {
        termsToInject.sort((a, b) => {
            if ((a.importance || 50) >= 80 && (b.importance || 50) < 80) return -1;
            if ((b.importance || 50) >= 80 && (a.importance || 50) < 80) return 1;
            return (b.importance || 50) - (a.importance || 50);
        });
    }

    let insertionCount = 0;
    
    for (const term of termsToInject) {
        if (insertionCount >= maxInsertions) break;
        
        const currentHtml = doc.body?.innerHTML || '';
        const currentAnalysis = analyzeNLPCoverage(currentHtml, neuronTerms);
        if (currentAnalysis.score >= targetCoverage) break;
        
        const insertionPoints = findSemanticInsertionPoints(doc, term, insertionCounts);
        
        if (insertionPoints.length === 0) {
            termsFailed.push(term.term);
            continue;
        }
        
        const bestPoint = insertionPoints[0];
        const result = insertTermNaturally(bestPoint.element, term, bestPoint.position);
        
        if (result.success) {
            termsAdded.push(term.term);
            insertionCount++;
            
            const currentCount = insertionCounts.get(bestPoint.element) || 0;
            insertionCounts.set(bestPoint.element, currentCount + 1);
            
            insertionDetails.push({
                term: term.term,
                location: bestPoint.element.tagName.toLowerCase() === 'li' ? 'list' : 'paragraph',
                template: result.template,
                contextScore: bestPoint.score,
            });
        } else {
            termsFailed.push(term.term);
        }
    }

    const finalHtml = doc.body?.innerHTML || html;
    const finalAnalysis = analyzeNLPCoverage(finalHtml, neuronTerms);

    return {
        html: finalHtml,
        termsAdded,
        termsFailed,
        initialCoverage: initialAnalysis.score,
        finalCoverage: finalAnalysis.score,
        insertionDetails,
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 YOUTUBE VIDEO DISCOVERY & EMBEDDING
// ═══════════════════════════════════════════════════════════════════════════════

export async function findAndEmbedYouTubeVideo(
    topic: string,
    serperKey: string | null,
    youtubeApiKey?: string | null,
    onProgress?: (msg: string) => void
): Promise<string> {
    onProgress?.('🎬 Searching for relevant YouTube video...');
    
    let videoId: string | null = null;
    let videoTitle: string = topic;
    
    if (serperKey) {
        try {
            const response = await fetch('https://google.serper.dev/videos', {
                method: 'POST',
                headers: { 
                    'X-API-KEY': serperKey, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    q: `${topic} tutorial guide how to`, 
                    num: 10 
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                const videos = data.videos || [];
                
                const ytVideo = videos.find((v: any) => {
                    const link = v.link || '';
                    return (link.includes('youtube.com/watch') || link.includes('youtu.be')) &&
                           v.title && v.title.length > 10;
                });
                
                if (ytVideo) {
                    const linkMatch = ytVideo.link.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                    if (linkMatch) {
                        videoId = linkMatch[1];
                        videoTitle = ytVideo.title.substring(0, 80);
                        onProgress?.(`   ✅ Found: "${videoTitle}"`);
                    }
                }
            }
        } catch (e: any) {
            onProgress?.(`   ⚠️ Video search failed: ${e.message}`);
        }
    }
    
    if (videoId) {
        return `
<!-- YOUTUBE VIDEO EMBED -->
<div style="margin: 48px 0 !important; border-radius: 20px !important; overflow: hidden !important; box-shadow: 0 12px 40px rgba(0,0,0,0.4) !important; background: #0f172a !important; border: 2px solid rgba(255,255,255,0.1) !important;">
  <div style="position: relative !important; padding-bottom: 56.25% !important; height: 0 !important; overflow: hidden !important;">
    <iframe 
      src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
      style="position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border: none !important;"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
      loading="lazy"
      title="${escapeHtml(videoTitle)}">
    </iframe>
  </div>
  <div style="padding: 16px 20px !important; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important; border-top: 1px solid rgba(255,255,255,0.06) !important;">
    <div style="display: flex !important; align-items: center !important; gap: 10px !important;">
      <span style="font-size: 20px !important;">📺</span>
      <span style="color: #ffffff !important; font-size: 14px !important; font-weight: 500 !important;">${escapeHtml(videoTitle)}</span>
    </div>
  </div>
</div>`;
    } else {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`;
        onProgress?.(`   → Adding search link fallback`);
        
        return `
<!-- YOUTUBE VIDEO PLACEHOLDER -->
<div style="margin: 48px 0 !important; border-radius: 20px !important; overflow: hidden !important; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important; border: 2px solid rgba(255,255,255,0.1) !important;">
  <div style="padding: 40px 24px !important; text-align: center !important;">
    <div style="font-size: 48px !important; margin-bottom: 16px !important;">📺</div>
    <h3 style="color: #ffffff !important; font-size: 20px !important; font-weight: 700 !important; margin: 0 0 12px 0 !important;">Watch Related Videos</h3>
    <p style="color: #94a3b8 !important; font-size: 14px !important; margin: 0 0 20px 0 !important;">Find helpful video tutorials on this topic</p>
    <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block !important; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important; color: #ffffff !important; font-weight: 700 !important; padding: 14px 28px !important; border-radius: 12px !important; text-decoration: none !important; font-size: 15px !important;">
      🔍 Search YouTube
    </a>
  </div>
</div>`;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 TITLE & META OPTIMIZER
// ═══════════════════════════════════════════════════════════════════════════════

export function optimizeTitleAndMeta(
    contract: ContentContract,
    topic: string
): ContentContract {
    const optimized = { ...contract };
    const addYear = shouldIncludeYearInTitle(topic);
    
    // Title optimization
    let title = optimized.title || topic;
    title = updateExistingYear(title);
    
    const hasYear = /\b202[0-9]\b/.test(title);
    
    if (!hasYear && addYear && title.length < 52) {
        if (title.includes(':')) {
            const colonIndex = title.indexOf(':');
            if (colonIndex < 30) {
                title = title.slice(0, colonIndex) + ` ${CONTENT_YEAR}` + title.slice(colonIndex);
            } else {
                title = title + ` (${CONTENT_YEAR})`;
            }
        } else {
            title = title + ` | ${CONTENT_YEAR}`;
        }
    }
    
    if (title.length > 65) {
        title = title
            .replace(' | Complete Guide', '')
            .replace(' | Ultimate Guide', '')
            .replace(' - Complete Guide', '');
        
        if (title.length > 65) {
            title = title.substring(0, 62) + '...';
        }
    }
    
    optimized.title = title;
    
    // Meta description optimization
    let meta = optimized.metaDescription || `Discover everything about ${topic}. Expert insights and comprehensive information.`;
    meta = updateExistingYear(meta);
    
    const metaHasYear = /\b202[0-9]\b/.test(meta);
    
    if (!metaHasYear && addYear && meta.length < 140) {
        meta = meta.replace(/\.$/, '') + `. Updated for ${CONTENT_YEAR}.`;
    }
    
    if (meta.length > 160) {
        meta = meta.substring(0, 157) + '...';
    }
    
    optimized.metaDescription = meta;
    optimized.excerpt = meta.substring(0, 155);
    
    // Slug optimization
    let slug = optimized.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    slug = updateExistingYear(slug);
    
    const slugHasYear = /202[0-9]/.test(slug);
    
    if (!slugHasYear && addYear && slug.length < 60) {
        slug = slug + `-${CONTENT_YEAR}`;
    }
    
    slug = slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 80);
    
    optimized.slug = slug;
    
    return optimized;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 PREMIUM FAQ UPGRADE v3.1 — DUPLICATE-SAFE, SELF-CONTAINED
// ═══════════════════════════════════════════════════════════════════════════════

export function upgradeFAQSection(
    htmlContent: string, 
    faqs: Array<{ question: string; answer: string }>,
    log?: (msg: string) => void
): string {
    // Early return if no content or FAQs
    if (!htmlContent) return htmlContent;
    if (!faqs || faqs.length === 0) {
        log?.('   ⚠️ No FAQs provided — skipping FAQ upgrade');
        return htmlContent;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 1: Define FAQ detection patterns (MUST BE INSIDE FUNCTION)
    // ═══════════════════════════════════════════════════════════════════════════
    
    const faqDetectionPatterns = [
        // Section-based with class
        /<section[^>]*class="[^"]*(?:faq|wp-opt-faq)[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
        // Section-based with id
        /<section[^>]*id="[^"]*faq[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
        // Div-based
        /<div[^>]*class="[^"]*faq-(?:section|accordion|container)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        // Schema-based
        /<[^>]*itemtype="https?:\/\/schema\.org\/FAQPage"[^>]*>[\s\S]*?<\/[^>]+>/gi,
        // Style blocks
        /<style>[^<]*(?:faq-section-|wp-opt-faq-)[^<]*<\/style>/gi,
    ];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 2: Detect ALL existing FAQ sections
    // ═══════════════════════════════════════════════════════════════════════════
    
    let existingFaqCount = 0;
    let hasPremiumFaq = false;
    
    for (const pattern of faqDetectionPatterns) {
        const matches = htmlContent.match(pattern);
        if (matches) {
            existingFaqCount += matches.length;
            // Check if any match has premium styling
            for (const match of matches) {
                if (match.includes('linear-gradient') && match.includes('border-radius')) {
                    hasPremiumFaq = true;
                }
            }
        }
    }
    
    // Also check for FAQ headings
    const faqHeadingPattern = /<h[23][^>]*>[\s\S]*?(?:frequently\s+asked|faq)[\s\S]*?<\/h[23]>/gi;
    const faqHeadings = htmlContent.match(faqHeadingPattern) || [];
    
    log?.(`   📊 Existing FAQs: ${existingFaqCount} sections, ${faqHeadings.length} headings, Premium: ${hasPremiumFaq}`);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 3: If premium FAQ already exists with enough questions, skip
    // ═══════════════════════════════════════════════════════════════════════════
    
    if (hasPremiumFaq) {
        const existingQuestionCount = (htmlContent.match(/class="faq-question"|class="faq-lbl"|faq-itm/gi) || []).length;
        
        if (existingQuestionCount >= faqs.length * 0.7) {
            log?.(`   ✓ Premium FAQ already exists with ${existingQuestionCount} questions — skipping`);
            return htmlContent;
        }
        
        log?.(`   → Existing premium FAQ only has ${existingQuestionCount} questions, will replace`);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 4: Remove ALL existing FAQ sections
    // ═══════════════════════════════════════════════════════════════════════════
    
    let cleaned = htmlContent;
    let removedCount = 0;
    
    for (const pattern of faqDetectionPatterns) {
        const matches = cleaned.match(pattern);
        if (matches) {
            removedCount += matches.length;
            cleaned = cleaned.replace(pattern, '\n<!-- FAQ_SLOT -->\n');
        }
    }
    
    // Remove orphaned FAQ headings with their following content
    cleaned = cleaned.replace(
        /<h2[^>]*>[\s\S]*?(?:Frequently\s+Asked|FAQ)[\s\S]*?<\/h2>[\s\S]*?(?=<h2|<section|$)/gi,
        '\n<!-- FAQ_SLOT -->\n'
    );
    
    // Consolidate multiple slots into one
    cleaned = cleaned.replace(/(<!-- FAQ_SLOT -->\s*)+/g, '<!-- FAQ_SLOT -->');
    
    if (removedCount > 0) {
        log?.(`   → Removed ${removedCount} existing FAQ section(s)`);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 5: Generate NEW premium FAQ accordion
    // ═══════════════════════════════════════════════════════════════════════════
    
    const premiumFaqHtml = generateEnterpriseAccordionFAQ(faqs);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 6: Insert at correct location
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Priority 1: Replace placeholder
    if (cleaned.includes('<!-- FAQ_SLOT -->')) {
        cleaned = cleaned.replace('<!-- FAQ_SLOT -->', premiumFaqHtml);
        cleaned = cleaned.replace(/<!-- FAQ_SLOT -->/g, '');
        log?.(`   ✅ Inserted premium FAQ at placeholder position`);
        return cleaned.replace(/\n{3,}/g, '\n\n').trim();
    }
    
    // Priority 2: Before conclusion/summary
    const conclusionPatterns = [
        /<h2[^>]*>[\s\S]*?(?:conclusion|summary|final\s+thoughts|wrapping\s+up)[\s\S]*?<\/h2>/i,
        /<div[^>]*class="[^"]*conclusion[^"]*"[^>]*>/i,
    ];
    
    for (const pattern of conclusionPatterns) {
        const match = cleaned.match(pattern);
        if (match && match.index !== undefined) {
            cleaned = cleaned.slice(0, match.index) + '\n\n' + premiumFaqHtml + '\n\n' + cleaned.slice(match.index);
            log?.(`   ✅ Inserted premium FAQ before conclusion`);
            return cleaned.replace(/\n{3,}/g, '\n\n').trim();
        }
    }
    
    // Priority 3: Before references section
    const refsPattern = /<(?:section|div)[^>]*>[\s\S]*?(?:References|Sources|Citations)[\s\S]*?<\/(?:section|div)>/i;
    const refsMatch = cleaned.match(refsPattern);
    if (refsMatch && refsMatch.index !== undefined) {
        cleaned = cleaned.slice(0, refsMatch.index) + '\n\n' + premiumFaqHtml + '\n\n' + cleaned.slice(refsMatch.index);
        log?.(`   ✅ Inserted premium FAQ before references`);
        return cleaned.replace(/\n{3,}/g, '\n\n').trim();
    }
    
    // Priority 4: Before last H2
    const h2Matches = [...cleaned.matchAll(/<h2[^>]*>/gi)];
    if (h2Matches.length >= 2) {
        const lastH2 = h2Matches[h2Matches.length - 1];
        if (lastH2.index !== undefined) {
            cleaned = cleaned.slice(0, lastH2.index) + '\n\n' + premiumFaqHtml + '\n\n' + cleaned.slice(lastH2.index);
            log?.(`   ✅ Inserted premium FAQ before final H2`);
            return cleaned.replace(/\n{3,}/g, '\n\n').trim();
        }
    }
    
    // Fallback: Append at end
    cleaned = cleaned + '\n\n' + premiumFaqHtml;
    log?.(`   ✅ Appended premium FAQ at end of content`);
    
    return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}



// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 FAQ DUPLICATE DETECTOR & REMOVER
// ═══════════════════════════════════════════════════════════════════════════════

export function countFAQSections(html: string): number {
    if (!html) return 0;
    
    const patterns = [
        /<section[^>]*class="[^"]*faq[^"]*"[^>]*>/gi,
        /<div[^>]*id="[^"]*faq[^"]*"[^>]*>/gi,
        /<h2[^>]*>[\s\S]*?frequently\s+asked[\s\S]*?<\/h2>/gi,
        /wp-opt-faq-/gi,
    ];
    
    let count = 0;
    for (const pattern of patterns) {
        const matches = html.match(pattern);
        if (matches) count += matches.length;
    }
    
    // Dedupe by checking unique patterns
    return Math.min(count, 5); // Cap at 5 to avoid false positives
}

export function removeDuplicateFAQSections(html: string, log?: (msg: string) => void): string {
    if (!html) return html;
    
    // Track all FAQ section content hashes
    const faqPattern = /<section[^>]*(?:class|id)="[^"]*faq[^"]*"[^>]*>([\s\S]*?)<\/section>/gi;
    const matches = [...html.matchAll(faqPattern)];
    
    if (matches.length <= 1) return html;
    
    // Keep only the LAST (most complete) FAQ section
    const seenHashes = new Set<string>();
    let cleaned = html;
    
    for (let i = 0; i < matches.length - 1; i++) {
        const content = matches[i][1];
        const hash = content.replace(/\s+/g, '').substring(0, 100);
        
        if (seenHashes.has(hash) || true) { // Remove all but last
            cleaned = cleaned.replace(matches[i][0], '<!-- DUPLICATE REMOVED -->');
            log?.(`   ✓ Removed duplicate FAQ section #${i + 1}`);
        }
        seenHashes.add(hash);
    }
    
    return cleaned.replace(/<!-- DUPLICATE REMOVED -->\s*/g, '');
}
    


// ═══════════════════════════════════════════════════════════════════════════════
// 📋 JSON EXTRACTION & VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export function extractJSON(text: string): any {
    if (!text || typeof text !== 'string') {
        throw new Error('Empty or invalid response');
    }
    
    let s = text.trim();
    
    // Remove markdown code blocks
    s = s.replace(/^```(?:json)?\s*/gi, '').replace(/\s*```$/gi, '').trim();
    
    if (s.length < 100) {
        throw new Error(`Response too short: ${s.length} characters`);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ATTEMPT 1: Direct parse
    // ═══════════════════════════════════════════════════════════════════════════
    try {
        const parsed = JSON.parse(s);
        if (parsed?.htmlContent) return parsed;
    } catch {}
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ATTEMPT 2: Find JSON object boundaries
    // ═══════════════════════════════════════════════════════════════════════════
    const jsonStart = s.indexOf('{');
    if (jsonStart === -1) {
        throw new Error('No JSON object found in response');
    }
    
    let json = s.substring(jsonStart);
    
    // Find matching closing brace with proper string handling
    let depth = 0;
    let inString = false;
    let escaped = false;
    let endIndex = -1;
    
    for (let i = 0; i < json.length; i++) {
        const char = json[i];
        
        if (escaped) { 
            escaped = false; 
            continue; 
        }
        
        if (char === '\\') { 
            escaped = true; 
            continue; 
        }
        
        if (char === '"' && !escaped) { 
            inString = !inString; 
            continue; 
        }
        
        if (!inString) {
            if (char === '{') depth++;
            if (char === '}') {
                depth--;
                if (depth === 0) { 
                    endIndex = i + 1; 
                    break; 
                }
            }
        }
    }
    
    if (endIndex > 0) {
        json = json.substring(0, endIndex);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ATTEMPT 3: Parse extracted JSON
    // ═══════════════════════════════════════════════════════════════════════════
    try {
        return JSON.parse(json);
    } catch {}
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ATTEMPT 4: AGGRESSIVE HEALING — FIX TRUNCATED JSON
    // ═══════════════════════════════════════════════════════════════════════════
    
    let healed = json;
    
    // 🔥 FIX: Remove trailing incomplete strings (truncation fix)
    // Find the last complete property
    const lastCompleteProperty = healed.lastIndexOf('",');
    const lastCompleteObject = healed.lastIndexOf('},');
    const lastCompleteArray = healed.lastIndexOf('],');
    
    const lastComplete = Math.max(lastCompleteProperty, lastCompleteObject, lastCompleteArray);
    
    if (lastComplete > healed.length * 0.5) {
        // Truncate to last complete item
        healed = healed.substring(0, lastComplete + 1);
    }
    
    // 🔥 FIX: Handle truncated htmlContent specifically
    const htmlContentMatch = healed.match(/"htmlContent"\s*:\s*"/);
    if (htmlContentMatch) {
        const htmlStart = htmlContentMatch.index! + htmlContentMatch[0].length;
        
        // Find if htmlContent is properly closed
        let htmlEnd = -1;
        let htmlEscaped = false;
        
        for (let i = htmlStart; i < healed.length; i++) {
            const char = healed[i];
            if (htmlEscaped) { 
                htmlEscaped = false; 
                continue; 
            }
            if (char === '\\') { 
                htmlEscaped = true; 
                continue; 
            }
            if (char === '"') {
                // Check if this is the end of htmlContent
                const after = healed.substring(i + 1, i + 10).trim();
                if (after.startsWith(',') || after.startsWith('}')) {
                    htmlEnd = i;
                    break;
                }
            }
        }
        
        // If htmlContent is not properly closed, close it
        if (htmlEnd === -1) {
            // Find a safe truncation point (end of a tag or sentence)
            const safePoints = [
                healed.lastIndexOf('</p>'),
                healed.lastIndexOf('</div>'),
                healed.lastIndexOf('</section>'),
                healed.lastIndexOf('</h2>'),
                healed.lastIndexOf('</h3>'),
                healed.lastIndexOf('</ul>'),
                healed.lastIndexOf('</ol>'),
                healed.lastIndexOf('</table>'),
            ];
            
            const bestSafePoint = Math.max(...safePoints.filter(p => p > htmlStart));
            
            if (bestSafePoint > htmlStart) {
                // Close the htmlContent at safe point
                const closeTagEnd = healed.indexOf('>', bestSafePoint) + 1;
                healed = healed.substring(0, closeTagEnd) + '",';
                
                // Add minimal required fields
                healed += '"faqs":[],"schema":{"@context":"https://schema.org","@graph":[]},"structureVerified":false}';
                
                console.log('[JSON HEALER] Truncated htmlContent recovered at safe point');
            }
        }
    }
    
    // Standard healing
    healed = healed.replace(/,\s*}/g, '}');
    healed = healed.replace(/,\s*]/g, ']');
    healed = healed.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    
    // 🔥 FIX: Escape unescaped control characters in strings
    healed = healed.replace(/[\x00-\x1F]/g, (match) => {
        const code = match.charCodeAt(0);
        if (code === 10) return '\\n';
        if (code === 13) return '\\r';
        if (code === 9) return '\\t';
        return '';
    });
    
    // Count and fix unbalanced brackets
    depth = 0;
    let brackets = 0;
    inString = false;
    escaped = false;
    
    for (let i = 0; i < healed.length; i++) {
        const char = healed[i];
        if (escaped) { escaped = false; continue; }
        if (char === '\\') { escaped = true; continue; }
        if (char === '"' && !escaped) { inString = !inString; continue; }
        if (!inString) {
            if (char === '{') depth++;
            if (char === '}') depth--;
            if (char === '[') brackets++;
            if (char === ']') brackets--;
        }
    }
    
    // Close any unclosed strings
    if (inString) {
        healed += '"';
    }
    
    // Close arrays
    while (brackets > 0) { 
        healed += ']'; 
        brackets--; 
    }
    
    // Close objects
    while (depth > 0) { 
        healed += '}'; 
        depth--; 
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ATTEMPT 5: Parse healed JSON
    // ═══════════════════════════════════════════════════════════════════════════
    try {
        const parsed = JSON.parse(healed);
        console.log('[JSON HEALER] Successfully healed truncated JSON');
        return parsed;
    } catch (e1: any) {
        // ═══════════════════════════════════════════════════════════════════════
        // ATTEMPT 6: LAST RESORT — Extract htmlContent manually
        // ═══════════════════════════════════════════════════════════════════════
        try {
            const htmlMatch = json.match(/"htmlContent"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"faqs"|"\s*,\s*"schema"|"\s*})/);
            const titleMatch = json.match(/"title"\s*:\s*"([^"]+)"/);
            const excerptMatch = json.match(/"excerpt"\s*:\s*"([^"]+)"/);
            const metaMatch = json.match(/"metaDescription"\s*:\s*"([^"]+)"/);
            const slugMatch = json.match(/"slug"\s*:\s*"([^"]+)"/);
            
            if (htmlMatch && htmlMatch[1] && htmlMatch[1].length > 1000) {
                console.log('[JSON HEALER] LAST RESORT: Extracted htmlContent manually');
                
                return {
                    title: titleMatch?.[1] || 'Untitled',
                    excerpt: excerptMatch?.[1] || '',
                    metaDescription: metaMatch?.[1] || '',
                    slug: slugMatch?.[1] || 'untitled',
                    htmlContent: htmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
                    faqs: [],
                    schema: { "@context": "https://schema.org", "@graph": [] },
                    structureVerified: false
                };
            }
        } catch {}
        
        // All attempts failed
        const preview = json.substring(0, 200) + '...' + json.substring(json.length - 200);
        throw new Error(`JSON parse failed after all healing attempts. Preview: ${preview}`);
    }
}


export function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🤖 AI PROVIDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function generateWithGemini(
    apiKey: string, 
    model: string, 
    systemPrompt: string, 
    userPrompt: string, 
    temperature: number = 0.85
): Promise<string> {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: { 
            systemInstruction: systemPrompt, 
            responseMimeType: 'application/json', 
            temperature, 
            topP: 0.95, 
            maxOutputTokens: 65536 
        }
    });
    
    const text = response.text;
    if (!text || text.length < 100) {
        throw new Error('Empty or too short response from Gemini');
    }
    
    return text;
}

async function generateWithOpenRouter(
    apiKey: string, 
    model: string, 
    systemPrompt: string, 
    userPrompt: string, 
    temperature: number = 0.85
): Promise<string> {
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔥 ENHANCED OPENROUTER CALL WITH BETTER ERROR HANDLING
    // ═══════════════════════════════════════════════════════════════════════════
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${apiKey}`, 
                'Content-Type': 'application/json', 
                'HTTP-Referer': 'https://wp-optimizer-pro.app', 
                'X-Title': `WP Optimizer Pro v${APP_VERSION}` 
            },
            body: JSON.stringify({ 
                model, 
                messages: [
                    { role: 'system', content: systemPrompt }, 
                    { role: 'user', content: userPrompt }
                ], 
                max_tokens: 100000, // 🔥 INCREASED: Allow longer responses
                temperature,
                // 🔥 FIX: Only use json_object for models that support it
                ...(model.includes('gpt') || model.includes('claude') ? { response_format: { type: 'json_object' } } : {})
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            
            // Handle specific error codes
            if (response.status === 429) {
                throw new Error(`Rate limited by OpenRouter. Please wait and try again.`);
            }
            if (response.status === 503) {
                throw new Error(`OpenRouter service unavailable. Model may be overloaded.`);
            }
            if (response.status === 400 && errorText.includes('context_length')) {
                throw new Error(`Content too long for model. Try a shorter prompt.`);
            }
            
            throw new Error(`OpenRouter error ${response.status}: ${errorText.substring(0, 500)}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`OpenRouter API error: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
            throw new Error('No content in OpenRouter response');
        }
        
        if (content.length < 500) {
            throw new Error(`Response too short: ${content.length} chars. Model may have refused or truncated.`);
        }
        
        // 🔥 LOG: Show response stats
        console.log(`[OpenRouter] Received ${content.length.toLocaleString()} chars from ${model}`);
        
        return content;
        
    } catch (e: any) {
        clearTimeout(timeoutId);
        
        if (e.name === 'AbortError') {
            throw new Error('OpenRouter request timed out after 5 minutes');
        }
        
        throw e;
    }
}


async function generateWithOpenAI(
    apiKey: string, 
    systemPrompt: string, 
    userPrompt: string, 
    temperature: number = 0.85
): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${apiKey}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            model: 'gpt-4o', 
            messages: [
                { role: 'system', content: systemPrompt }, 
                { role: 'user', content: userPrompt }
            ], 
            response_format: { type: 'json_object' }, 
            max_tokens: 16000, 
            temperature 
        })
    });
    
    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

async function generateWithAnthropic(
    apiKey: string, 
    systemPrompt: string, 
    userPrompt: string, 
    temperature: number = 0.85
): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
            'x-api-key': apiKey, 
            'anthropic-version': '2023-06-01', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            model: 'claude-sonnet-4-20250514', 
            max_tokens: 16000, 
            system: systemPrompt, 
            messages: [
                { role: 'user', content: userPrompt + '\n\nOutput ONLY valid JSON.' }
            ], 
            temperature 
        })
    });
    
    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);
    const data = await response.json();
    return data.content?.[0]?.text || '';
}

async function generateWithGroq(
    apiKey: string, 
    model: string, 
    systemPrompt: string, 
    userPrompt: string, 
    temperature: number = 0.85
): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${apiKey}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            model: model || 'llama-3.3-70b-versatile', 
            messages: [
                { role: 'system', content: systemPrompt }, 
                { role: 'user', content: userPrompt }
            ], 
            response_format: { type: 'json_object' }, 
            max_tokens: 32000, 
            temperature 
        })
    });
    
    if (!response.ok) throw new Error(`Groq error: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥🔥🔥 MAIN AI ORCHESTRATOR CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class AIOrchestrator {
    
        /**
     * Standard single-shot generation
     */
    async generate(
        config: GenerateConfig,
        onProgress?: (msg: string) => void
    ): Promise<{ contract: ContentContract; groundingSources: any[] }> {
        const provider = config.provider || 'google';
        const temperature = config.temperature || 0.85;
        const hasNeuron = config.neuronData?.terms?.length;
        const targetWords = hasNeuron ? config.neuronData!.targetWordCount : 4500;
        
        const systemPrompt = buildSystemPrompt({
            ctx: config.siteContext,
            topic: config.topic,
            mode: config.mode,
            entityGapData: config.entityGapData,
            neuronData: config.neuronData,
            existingAnalysis: config.existingAnalysis,
            allFeedback: config.allFeedback,
            targetKeyword: config.targetKeyword,
            validatedReferences: config.validatedReferences,
            internalLinks: config.internalLinks,
            geoConfig: config.geoConfig,
            attemptNumber: config.previousAttempts
        });

        

        const userPrompt = `Create a premium, comprehensive SEO article about: "${config.topic}"

🚨 CRITICAL REQUIREMENTS — READ CAREFULLY:

1️⃣ WORD COUNT: You MUST write AT LEAST ${targetWords} words. This is MANDATORY.
   • Current minimum: ${targetWords} words
   • Ideal length: ${targetWords + 500} words
   • Each H2 section: 400-600 words
   • Each H3: 150-250 words
   • DO NOT submit content under ${targetWords} words

2️⃣ CONTENT DEPTH:
   • ${Math.ceil(targetWords / 400)}+ main H2 sections required
   • 18+ H3 subheadings
   • Specific examples, statistics, and data points in EVERY section
   • NO filler content — every paragraph must add value

3️⃣ WRITING STYLE:
   • Alex Hormozi style — direct, punchy, human
   • Use contractions (don't, won't, you'll)
   • Short paragraphs (2-4 sentences)
   • Address reader as "you" constantly

4️⃣ STRUCTURE:
   • Premium visual components throughout
   • NO H1 tags (WordPress provides title)
   • Current year: ${CONTENT_YEAR}
   ${hasNeuron ? '• 70%+ NLP term coverage from provided terms' : ''}
   • 7-10 FAQs with detailed answers (100-150 words each)
   • 8-15 authoritative references

⚠️ OUTPUT: Valid JSON only, no markdown. ENSURE ${targetWords}+ words.`;


        const promptTokens = estimateTokens(systemPrompt + userPrompt);
        onProgress?.(`🤖 ${provider.toUpperCase()} | ~${promptTokens.toLocaleString()} tokens`);

        const openRouterModel = config.apiKeys.openrouterModel || 'google/gemini-2.5-flash-preview';
        const groqModel = config.apiKeys.groqModel || 'llama-3.3-70b-versatile';
        const geminiModel = config.model || 'gemini-2.5-flash-preview-05-20';

        const providers: Record<string, { key: string; generate: () => Promise<string> }> = {
            'google': { 
                key: config.apiKeys.google, 
                generate: () => generateWithGemini(config.apiKeys.google, geminiModel, systemPrompt, userPrompt, temperature) 
            },
            'openrouter': { 
                key: config.apiKeys.openrouter, 
                generate: () => generateWithOpenRouter(config.apiKeys.openrouter, openRouterModel, systemPrompt, userPrompt, temperature) 
            },
            'anthropic': { 
                key: config.apiKeys.anthropic, 
                generate: () => generateWithAnthropic(config.apiKeys.anthropic, systemPrompt, userPrompt, temperature) 
            },
            'openai': { 
                key: config.apiKeys.openai, 
                generate: () => generateWithOpenAI(config.apiKeys.openai, systemPrompt, userPrompt, temperature) 
            },
            'groq': { 
                key: config.apiKeys.groq, 
                generate: () => generateWithGroq(config.apiKeys.groq, groqModel, systemPrompt, userPrompt, temperature) 
            }
        };

        const selectedProvider = providers[provider];
        if (!selectedProvider?.key) {
            throw new Error(`Provider "${provider}" is not configured`);
        }

        let rawResponse: string | null = null;
        let lastError = new Error('Generation failed');

        // Calculate adaptive timeout
        const calculateTimeout = (targetWords: number): number => {
            const baseTimeout = 180000; // 3 minutes base
            const wordsPerMinute = 1500;
            const calculatedTimeout = Math.ceil((targetWords / wordsPerMinute) * 60 * 1000);
            return Math.max(baseTimeout, Math.min(calculatedTimeout * 1.5, 600000)); // 3-10 min range
        };
        
        const timeoutMs = calculateTimeout(targetWords);

                for (let attempt = 0; attempt < 4; attempt++) { // 🔥 INCREASED: 4 attempts instead of 3
            try {
                onProgress?.(`   → Generating${attempt > 0 ? ` (retry ${attempt}/${3})` : ''}...`);
                
                // 🔥 INCREASED: Longer timeout for each retry
                const attemptTimeout = timeoutMs * (1 + attempt * 0.5);
                
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error(`Generation timeout after ${Math.round(attemptTimeout / 1000)}s`)), attemptTimeout);
                });
                
                rawResponse = await Promise.race([
                    selectedProvider.generate(),
                    timeoutPromise
                ]);

                if (rawResponse && rawResponse.length > 500) {
                    onProgress?.(`   ✓ Received ${rawResponse.length.toLocaleString()} chars`);
                    
                    // 🔥 VALIDATION: Check if response looks like valid JSON
                    if (rawResponse.includes('"htmlContent"') && rawResponse.includes('"title"')) {
                        break;
                    } else {
                        onProgress?.(`   ⚠️ Response missing required fields, retrying...`);
                        lastError = new Error('Response missing required JSON fields');
                        continue;
                    }
                }
            } catch (e: any) {
                lastError = e;
                onProgress?.(`   ✗ Attempt ${attempt + 1}/4 failed: ${e.message.substring(0, 100)}`);
                
                // 🔥 IMPROVED: Exponential backoff with jitter
                if (attempt < 3) {
                    const baseDelay = 3000; // 3 seconds base
                    const exponentialDelay = baseDelay * Math.pow(2, attempt);
                    const jitter = Math.random() * 1000;
                    const totalDelay = exponentialDelay + jitter;
                    
                    onProgress?.(`   ⏳ Waiting ${Math.round(totalDelay / 1000)}s before retry...`);
                    await new Promise(r => setTimeout(r, totalDelay));
                }
            }
        }


                if (!rawResponse || rawResponse.length < 500) {
            throw new Error(`${provider} generation failed: ${lastError?.message || 'No response received'}`);
        }

        onProgress?.(`📋 Parsing JSON (${rawResponse.length.toLocaleString()} chars)...`);
        
        // 🔥 PRE-VALIDATION: Check response structure before parsing
        const hasTitle = rawResponse.includes('"title"');
        const hasHtmlContent = rawResponse.includes('"htmlContent"');
        const hasClosingBrace = rawResponse.lastIndexOf('}') > rawResponse.length * 0.9;
        
        if (!hasTitle || !hasHtmlContent) {
            onProgress?.(`   ⚠️ Response missing required fields - attempting recovery...`);
        }
        
        if (!hasClosingBrace) {
            onProgress?.(`   ⚠️ Response may be truncated - will attempt healing...`);
        }
        
        // 🔥🔥🔥 CRITICAL FIX: Parse and create MUTABLE deep copy
        let _parsedContract;
        try {
            _parsedContract = extractJSON(rawResponse);
        } catch (parseError: any) {
            onProgress?.(`   ❌ JSON parse failed: ${parseError.message.substring(0, 100)}`);
            
            // 🔥 EMERGENCY: Try to salvage what we can
            const titleMatch = rawResponse.match(/"title"\s*:\s*"([^"]+)"/);
            const htmlMatch = rawResponse.match(/"htmlContent"\s*:\s*"([\s\S]{1000,})(?="\s*[,}])/);
            
            if (titleMatch && htmlMatch) {
                onProgress?.(`   🔧 Emergency recovery: Extracted title and ${htmlMatch[1].length} chars of content`);
                _parsedContract = {
                    title: titleMatch[1],
                    excerpt: '',
                    metaDescription: '',
                    slug: titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50),
                    htmlContent: htmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
                    faqs: [],
                    schema: { "@context": "https://schema.org", "@graph": [] },
                    structureVerified: false
                };
            } else {
                throw parseError;
            }
        }
        
        let contract: ContentContract = JSON.parse(JSON.stringify(_parsedContract));

        
        if (!contract.htmlContent) throw new Error('Missing htmlContent');
        if (contract.htmlContent.length < 2000) throw new Error('Content too short');

        // Remove H1 tags
        const h1CountBefore = (contract.htmlContent.match(/<h1/gi) || []).length;
        contract.htmlContent = removeAllH1Tags(contract.htmlContent);
        if (h1CountBefore > 0) {
            onProgress?.(`   ✓ Removed ${h1CountBefore} H1 tag(s)`);
        }

        // Calculate word count
        const doc = new DOMParser().parseFromString(contract.htmlContent, 'text/html');
        contract.wordCount = (doc.body?.textContent || '').split(/\s+/).filter(Boolean).length;
        
        onProgress?.(`   ✓ ${contract.wordCount.toLocaleString()} words | ${contract.faqs?.length || 0} FAQs`);

        // Optimize title & meta
        contract = optimizeTitleAndMeta(contract, config.topic);

        return { contract, groundingSources: contract.groundingSources || [] };
    }


        /**
     * 🔥 SOTA ENHANCED: Full pipeline with all improvements
     */
    async generateEnhanced(
        config: GenerateConfig & {
            useStagedPipeline?: boolean;
            useSERPGenerators?: boolean;
            useNLPInjector?: boolean;
            targetNLPCoverage?: number;
        },
        onProgress?: (msg: string) => void,
        onStageProgress?: (progress: StageProgress) => void
    ): Promise<{ contract: ContentContract; groundingSources: any[] }> {
        const {
            useSERPGenerators = true,
            useNLPInjector = true,
            targetNLPCoverage = DEFAULT_TARGET_NLP_COVERAGE,
        } = config;

        // Generate base content
        onProgress?.('🚀 Generating optimized content...');
        const result = await this.generate(config, onProgress);
        
        // 🔥🔥🔥 CRITICAL FIX: Create MUTABLE deep copy to avoid "read only property" error
        let contract: ContentContract = JSON.parse(JSON.stringify(result.contract));

        // YouTube Video Integration
        try {
            const youtubeEmbed = await findAndEmbedYouTubeVideo(
                config.topic,
                config.apiKeys.serper || null,
                null,
                onProgress
            );
            
            if (youtubeEmbed) {
                const h2Matches = [...contract.htmlContent.matchAll(/<\/h2>/gi)];
                if (h2Matches.length >= 2 && h2Matches[1].index !== undefined) {
                    const insertPos = h2Matches[1].index + 5;
                    contract.htmlContent = 
                        contract.htmlContent.slice(0, insertPos) + 
                        '\n\n' + youtubeEmbed + '\n\n' + 
                        contract.htmlContent.slice(insertPos);
                    onProgress?.('   ✅ YouTube video embedded');
                }
            }
        } catch (e: any) {
            onProgress?.(`   ⚠️ YouTube integration error: ${e.message}`);
        }

        // NLP Term Injection
        if (useNLPInjector && config.neuronData?.terms?.length) {
            onProgress?.('🧬 Optimizing NLP coverage...');
            
            const initialAnalysis = analyzeNLPCoverage(contract.htmlContent, config.neuronData.terms);
            onProgress?.(`   → Initial: ${initialAnalysis.score}%`);
            
            if (initialAnalysis.score < targetNLPCoverage) {
                const injectionResult = injectMissingNLPTerms(
                    contract.htmlContent,
                    config.neuronData.terms,
                    { targetCoverage: targetNLPCoverage, maxInsertions: MAX_NLP_INJECTIONS }
                );
                
                contract.htmlContent = injectionResult.html;
                onProgress?.(`   ✅ Coverage: ${injectionResult.initialCoverage}% → ${injectionResult.finalCoverage}%`);
            }
        }

                // ═══════════════════════════════════════════════════════════════════════════
        // 🔗 INTERNAL LINK INJECTION — MANDATORY 8-15 LINKS
        // ═══════════════════════════════════════════════════════════════════════════
        if (config.internalLinks && config.internalLinks.length > 0) {
            onProgress?.('🔗 Injecting internal links with rich anchor text...');
            
            const currentUrl = config.siteContext?.url || '';
            
            const linkResult = injectInternalLinks(
                contract.htmlContent,
                config.internalLinks,
                currentUrl,
                {
                    minLinks: 8,
                    maxLinks: 15,
                    minRelevance: 0.55,
                    minDistanceBetweenLinks: 450,
                    maxLinksPerSection: 2,
                    linkStyle: 'color: #3b82f6; text-decoration: none; font-weight: 600; border-bottom: 2px solid rgba(59, 130, 246, 0.3); transition: all 0.2s ease; padding-bottom: 1px;'
                }
            );
            
            contract.htmlContent = linkResult.html;
            contract.internalLinks = linkResult.linksAdded;
            
            onProgress?.(`   ✅ Added ${linkResult.linksAdded.length} internal links`);
            
            // Log details for each link
            linkResult.linksAdded.forEach((link: InternalLinkResult, i: number) => {
                onProgress?.(`      ${i + 1}. "${link.anchorText}" → ${link.url.substring(0, 50)}...`);
            });
            
            // Warn if below minimum
            if (linkResult.linksAdded.length < 8) {
                onProgress?.(`   ⚠️ WARNING: Only ${linkResult.linksAdded.length} links added (target: 8+)`);
                onProgress?.(`   ⚠️ Skipped reasons:`);
                linkResult.skippedReasons.forEach((reason: string, url: string) => {
                    onProgress?.(`      - ${url.substring(0, 40)}: ${reason}`);
                });
            }
        } else {
            onProgress?.('   ⚠️ No internal link targets provided — skipping link injection');
        }



        // Upgrade FAQ to CSS-only accordion
        if (contract.faqs && contract.faqs.length > 0) {
            onProgress?.('🎨 Upgrading FAQ to CSS-only accordion...');
            contract.htmlContent = upgradeFAQSection(contract.htmlContent, contract.faqs, onProgress);
            onProgress?.('   ✅ FAQ upgraded (WordPress CSP compatible)');
        }

        // Ensure references are at end
        if (config.validatedReferences?.length) {
            const hasRefs = contract.htmlContent.toLowerCase().includes('references');
            if (!hasRefs) {
                onProgress?.('📚 Adding references section...');
                const refsHtml = generateReferencesSection(config.validatedReferences);
                contract.htmlContent += '\n\n' + refsHtml;
            }
        }

        // Final optimization
        contract = optimizeTitleAndMeta(contract, config.topic);
        contract.htmlContent = removeAllH1Tags(contract.htmlContent);

        // Remove duplicate FAQ sections
        contract.htmlContent = removeDuplicateFAQSections(contract.htmlContent, onProgress);

        // Recalculate word count
        const doc = new DOMParser().parseFromString(contract.htmlContent, 'text/html');
        contract.wordCount = (doc.body?.textContent || '').split(/\s+/).filter(Boolean).length;
        
        onProgress?.(`📊 Final: ${contract.wordCount.toLocaleString()} words | ${contract.faqs?.length || 0} FAQs`);

        return { contract, groundingSources: contract.groundingSources || [] };
    }

}




// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 VISUAL COMPONENT VALIDATOR v2.0 — VALIDATES REQUIRED VISUAL ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export function validateVisualComponents(html: string): {
    passed: boolean;
    score: number;
    missing: string[];
    found: Record<string, number>;
} {
    const found: Record<string, number> = {};
    const missing: string[] = [];
    
    // Detection patterns for each component type
    const componentPatterns: Record<string, { pattern: RegExp; required: number; name: string }> = {
        quickAnswer: { 
            pattern: /quick\s*answer|⚡.*answer/gi, 
            required: 1, 
            name: 'Quick Answer Box' 
        },
        statsDashboard: { 
            pattern: /grid-template-columns.*repeat.*auto-fit|stats-grid/gi, 
            required: 1, 
            name: 'Statistics Dashboard' 
        },
        proTip: { 
            pattern: /pro\s*tip|💡.*tip/gi, 
            required: 3, 
            name: 'Pro Tip Boxes' 
        },
        warning: { 
            pattern: /⚠️|important.*warning|warning.*important/gi, 
            required: 2, 
            name: 'Warning Boxes' 
        },
        expertQuote: { 
            pattern: /<blockquote[^>]*>.*<cite/gis, 
            required: 2, 
            name: 'Expert Blockquotes' 
        },
        table: { 
            pattern: /<table[^>]*>/gi, 
            required: 2, 
            name: 'Comparison Tables' 
        },
        stepByStep: { 
            pattern: /step-by-step|step\s*1.*step\s*2/gis, 
            required: 1, 
            name: 'Step-by-Step Process' 
        },
        checklist: { 
            pattern: /checklist|✓.*✓.*✓/gis, 
            required: 2, 
            name: 'Checklists' 
        },
        keyTakeaways: { 
            pattern: /key\s*takeaway|🎯.*takeaway/gi, 
            required: 1, 
            name: 'Key Takeaways' 
        },
        cta: { 
            pattern: /ready\s*to\s*get\s*started|call.to.action|cta/gi, 
            required: 1, 
            name: 'CTA Box' 
        }
    };
    
    let totalRequired = 0;
    let totalFound = 0;
    
    for (const [key, config] of Object.entries(componentPatterns)) {
        const matches = html.match(config.pattern) || [];
        const count = matches.length;
        found[config.name] = count;
        totalRequired += config.required;
        totalFound += Math.min(count, config.required);
        
        if (count < config.required) {
            missing.push(`${config.name} (have ${count}, need ${config.required})`);
        }
    }
    
    const score = Math.round((totalFound / totalRequired) * 100);
    
    return {
        passed: missing.length === 0,
        score,
        missing,
        found
    };
}








// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 HUMAN WRITING VALIDATOR
// ═══════════════════════════════════════════════════════════════════════════════

export function validateHumanWriting(text: string): { 
    score: number; 
    issues: string[];
    suggestions: string[];
} {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;
    
    const textLower = text.toLowerCase();
    
    // Check for banned phrases
    for (const phrase of HUMAN_WRITING_PATTERNS.bannedPhrases) {
        if (textLower.includes(phrase.toLowerCase())) {
            issues.push(`Contains AI-detectable phrase: "${phrase}"`);
            score -= 5;
        }
    }
    
    // Check for contractions
    const noContractionPatterns = [
        { pattern: /\bdo not\b/gi, fix: "don't" },
        { pattern: /\bwill not\b/gi, fix: "won't" },
        { pattern: /\bcannot\b/gi, fix: "can't" },
        { pattern: /\bit is\b/gi, fix: "it's" },
    ];
    
    for (const { pattern, fix } of noContractionPatterns) {
        const matches = text.match(pattern);
        if (matches && matches.length > 2) {
            issues.push(`Overuse of formal form (use "${fix}")`);
            score -= 3;
        }
    }
    
    // Check sentence variety
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const avgLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
    
    if (avgLength > 20) {
        issues.push('Sentences too long on average');
        suggestions.push('Break up long sentences');
        score -= 10;
    }
    
    // Check for "you" usage
    const youCount = (text.match(/\byou\b|\byour\b/gi) || []).length;
    const wordCount = text.split(/\s+/).length;
    const youDensity = (youCount / wordCount) * 100;
    
    if (youDensity < 1) {
        issues.push('Not enough "you" - content feels impersonal');
        suggestions.push('Address reader directly more often');
        score -= 10;
    }
    
    return {
        score: Math.max(0, score),
        issues,
        suggestions
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🖼️ IMAGE ALT TEXT OPTIMIZER
// ═══════════════════════════════════════════════════════════════════════════════

export async function generateOptimizedAltText(
    images: Array<{ src: string; alt: string }>,
    topic: string,
    apiKey: string
): Promise<Array<{ src: string; originalAlt: string; optimizedAlt: string }>> {
    if (!images || images.length === 0) return [];
    
    const results: Array<{ src: string; originalAlt: string; optimizedAlt: string }> = [];
    
    for (const img of images.slice(0, 10)) {
        const filename = img.src.split('/').pop()?.split('?')[0] || 'image';
        
        const optimizedAlt = img.alt && img.alt.length > 10 
            ? img.alt 
            : `${topic} - ${filename.replace(/[-_]/g, ' ').replace(/\.\w+$/, '')}`.substring(0, 125);
        
        results.push({
            src: img.src,
            originalAlt: img.alt,
            optimizedAlt
        });
    }
    
    return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📦 SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const orchestrator = new AIOrchestrator();

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 EXPORTS SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

/*
AI ORCHESTRATOR v25.0 EXPORTS:

MAIN CLASS:
- AIOrchestrator: Main orchestration class
- orchestrator: Singleton instance

GENERATION:
- generate(): Standard single-shot generation
- generateEnhanced(): Full SOTA pipeline

CONTENT COMPONENTS:
- generateEnterpriseAccordionFAQ(): CSS-only accordion (no JS)
- generateReferencesSection(): Dark mode references
- generateKeyTakeawaysBox(): Takeaways component

UTILITIES:
- buildSystemPrompt(): System prompt builder
- removeAllH1Tags(): H1 removal
- optimizeTitleAndMeta(): Title/meta optimization
- upgradeFAQSection(): FAQ upgrade utility

NLP:
- analyzeNLPCoverage(): Coverage analysis
- injectMissingNLPTerms(): Term injection

VALIDATION:
- validateHumanWriting(): AI detection check
- extractJSON(): JSON extraction with healing

MEDIA:
- findAndEmbedYouTubeVideo(): YouTube integration
- generateOptimizedAltText(): Alt text optimizer

YEAR HANDLING:
- shouldIncludeYearInTitle(): Smart year detection
- updateExistingYear(): Year updater
- CONTENT_YEAR: Current content year constant
*/
