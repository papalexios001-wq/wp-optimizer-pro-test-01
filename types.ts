// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v25.0 — ENTERPRISE SOTA TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════
// SOTA Features:
// • First-class InternalLinkPlan with constraints
// • ContentBlock union types for structured content
// • SerpLengthPolicy for dynamic word counts
// • Zod runtime validation for all external boundaries
// • Versioned ScoreBreakdown with explicit weights
// • Job queue model with cancellation tokens
// ═══════════════════════════════════════════════════════════════════════════════

import { z } from 'zod';

export const APP_VERSION = "25.0.0";
export const APP_NAME = "WP Optimizer Pro";
export const SCORE_VERSION = "2.0.0"; // Track scoring algorithm changes

// ═══════════════════════════════════════════════════════════════════════════════
// 🔐 ZOD SCHEMAS — RUNTIME VALIDATION FOR EXTERNAL BOUNDARIES
// ═══════════════════════════════════════════════════════════════════════════════

// WordPress REST API Response Schemas
export const WPPostSchema = z.object({
    id: z.number(),
    date: z.string().optional(),
    date_gmt: z.string().optional(),
    modified: z.string().optional(),
    modified_gmt: z.string().optional(),
    slug: z.string(),
    status: z.enum(['publish', 'draft', 'pending', 'private', 'future', 'trash']),
    type: z.string().default('post'),
    link: z.string().url(),
    title: z.object({
        rendered: z.string(),
        raw: z.string().optional()
    }).or(z.string()),
    content: z.object({
        rendered: z.string(),
        raw: z.string().optional(),
        protected: z.boolean().optional()
    }).or(z.string()),
    excerpt: z.object({
        rendered: z.string(),
        raw: z.string().optional()
    }).or(z.string()).optional(),
    featured_media: z.number().optional(),
    categories: z.array(z.number()).optional(),
    tags: z.array(z.number()).optional(),
    meta: z.record(z.unknown()).optional()
});

export const WPMediaSchema = z.object({
    id: z.number(),
    source_url: z.string().url(),
    alt_text: z.string().optional(),
    title: z.object({
        rendered: z.string()
    }).or(z.string()).optional(),
    media_details: z.object({
        width: z.number().optional(),
        height: z.number().optional(),
        file: z.string().optional()
    }).optional()
});

export const WPCategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    count: z.number().optional(),
    parent: z.number().optional()
});

export const WPErrorSchema = z.object({
    code: z.string(),
    message: z.string(),
    data: z.object({
        status: z.number()
    }).optional()
});

// Serper API Response Schemas
export const SerperOrganicResultSchema = z.object({
    title: z.string(),
    link: z.string().url(),
    snippet: z.string(),
    position: z.number(),
    date: z.string().optional(),
    sitelinks: z.array(z.object({
        title: z.string(),
        link: z.string().url()
    })).optional()
});

export const SerperPAASchema = z.object({
    question: z.string(),
    snippet: z.string(),
    link: z.string().url().optional()
});

export const SerperKnowledgeGraphSchema = z.object({
    title: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
    attributes: z.record(z.string()).optional()
});

export const SerperResponseSchema = z.object({
    organic: z.array(SerperOrganicResultSchema).optional(),
    peopleAlsoAsk: z.array(SerperPAASchema).optional(),
    relatedSearches: z.array(z.object({ query: z.string() })).optional(),
    knowledgeGraph: SerperKnowledgeGraphSchema.optional(),
    answerBox: z.object({
        title: z.string().optional(),
        answer: z.string().optional(),
        snippet: z.string().optional(),
        link: z.string().url().optional()
    }).optional(),
    searchParameters: z.object({
        q: z.string(),
        gl: z.string().optional(),
        hl: z.string().optional()
    }).optional()
});

// NeuronWriter API Response Schemas
export const NeuronTermSchema = z.object({
    term: z.string(),
    type: z.enum(['header', 'basic', 'extended', 'title']),
    count: z.number(),
    recommended: z.number(),
    isUsed: z.boolean().optional(),
    importance: z.number().min(0).max(100)
});

export const NeuronAnalysisResponseSchema = z.object({
    status: z.string(),
    terms: z.array(NeuronTermSchema),
    targetWordCount: z.number().optional(),
    competitors: z.array(z.unknown()).optional(),
    contentScore: z.number().optional()
});

// AI JSON-mode Response Schemas
export const AIContentResponseSchema = z.object({
    title: z.string().min(10).max(100),
    excerpt: z.string().min(50).max(200),
    metaDescription: z.string().min(100).max(180),
    slug: z.string().min(3).max(100),
    htmlContent: z.string().min(1000),
    faqs: z.array(z.object({
        question: z.string().min(10),
        answer: z.string().min(50)
    })).min(5),
    schema: z.object({
        '@context': z.literal('https://schema.org'),
        '@graph': z.array(z.record(z.unknown()))
    }),
    expertInsight: z.string().optional(),
    internalLinkSuggestions: z.array(z.string()).optional(),
    groundingSources: z.array(z.object({
        uri: z.string().url(),
        title: z.string()
    })).optional(),
    featuredImagePrompt: z.string().optional(),
    categoryNames: z.array(z.string()).optional(),
    structureVerified: z.boolean().optional()
});

// Type exports from schemas
export type WPPost = z.infer<typeof WPPostSchema>;
export type WPMedia = z.infer<typeof WPMediaSchema>;
export type WPCategory = z.infer<typeof WPCategorySchema>;
export type WPError = z.infer<typeof WPErrorSchema>;
export type SerperResponse = z.infer<typeof SerperResponseSchema>;
export type SerperOrganicResult = z.infer<typeof SerperOrganicResultSchema>;
export type NeuronAnalysisResponse = z.infer<typeof NeuronAnalysisResponseSchema>;
export type AIContentResponse = z.infer<typeof AIContentResponseSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 INTERNAL LINKING — FIRST-CLASS TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface InternalLinkTarget {
    url: string;
    title: string;
    slug: string;
    relevanceScore?: number;
    keywords?: string[];
    categories?: string[];
    lastModified?: string;
}

export interface AnchorVariant {
    text: string;
    wordCount: number;
    meaningfulWords: number;
    qualityScore: number; // 0-100
    preferredPosition?: 'early' | 'middle' | 'late';
}

export interface InternalLinkResult {
    url: string;
    anchorText: string;
    context: string;
    relevanceScore: number;
    sectionId?: string;
    matchType: 'exact' | 'semantic' | 'contextual';
    insertedAt: number; // HTML position
}


// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CONTENT QUALITY METRICS — ENTERPRISE GRADE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContentQualityMetrics {
    // Readability scores
    fleschKincaidScore: number;
    fleschKincaidGrade: number;
    smogIndex: number;
    gunningFogIndex: number;
    averageSentenceLength: number;
    averageWordLength: number;
    
    // Structure metrics
    paragraphCount: number;
    averageParagraphLength: number;
    longParagraphCount: number;   // > 100 words
    shortParagraphCount: number;  // < 30 words
    
    // Engagement metrics
    questionCount: number;
    exclamationCount: number;
    personalPronounDensity: number;  // "you", "your" per 100 words
    
    // Variety metrics
    uniqueWordRatio: number;
    transitionWordCount: number;
    powerWordCount: number;
    
    // Technical metrics
    passiveVoicePercentage: number;
    adverbDensity: number;
}

export interface ContentQualityReport {
    metrics: ContentQualityMetrics;
    overallScore: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    issues: Array<{
        severity: 'critical' | 'warning' | 'info';
        category: string;
        message: string;
        suggestion: string;
        location?: { start: number; end: number };
    }>;
    strengths: string[];
    improvements: string[];
}



export interface InternalLinkPlan {
    targetUrl: string;
    targetTitle: string;
    anchorVariants: AnchorVariant[];
    insertionRules: {
        minDistanceFromOtherLinks: number; // chars
        avoidSections: string[]; // section IDs to skip
        preferredSections: string[]; // section IDs to prefer
        maxPerSection: number;
    };
    sectionBudgets: Record<string, number>; // sectionId -> max links
    totalBudget: number;
    priority: number; // 0-100
}

export interface LinkInjectionConfig {
    minLinks: number;
    maxLinks: number;
    minRelevance: number;
    linkStyle: string;
    noInjectZones: string[]; // CSS selectors
    minAnchorWords: number;
    maxAnchorWords: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📦 CONTENT BLOCKS — STRUCTURED CONTENT MODEL
// ═══════════════════════════════════════════════════════════════════════════════

interface BaseBlock {
    id: string;
    type: string;
    order: number;
    sectionId?: string;
}

export interface QuickAnswerBlock extends BaseBlock {
    type: 'quick_answer';
    content: string;
    wordCount: number;
    targetWords: 50 | 70;
}

export interface SectionBlock extends BaseBlock {
    type: 'section';
    h2Heading: string;
    h3Subheadings: string[];
    htmlContent: string;
    wordCount: number;
    targetWords: number;
    nlpTermsUsed: string[];
    nlpTermsMissed: string[];
    visualComponents: string[];
    internalLinksAdded: number;
}

export interface TakeawaysBlock extends BaseBlock {
    type: 'takeaways';
    title: string;
    items: Array<{
        icon: string;
        text: string;
    }>;
}

export interface FAQAccordionBlock extends BaseBlock {
    type: 'faq_accordion';
    title: string;
    items: Array<{
        question: string;
        answer: string;
        isExpanded?: boolean;
    }>;
    schema: object;
}

export interface ReferencesBlock extends BaseBlock {
    type: 'references';
    title: string;
    sources: ValidatedReference[];
}

export interface TableBlock extends BaseBlock {
    type: 'table';
    title?: string;
    headers: string[];
    rows: string[][];
    tableType: 'comparison' | 'data' | 'pricing' | 'specs';
}

export interface CalloutBlock extends BaseBlock {
    type: 'callout';
    variant: 'tip' | 'warning' | 'info' | 'expert' | 'stat';
    icon: string;
    title?: string;
    content: string;
}

export interface VideoEmbedBlock extends BaseBlock {
    type: 'video_embed';
    platform: 'youtube' | 'vimeo' | 'other';
    videoId: string;
    title: string;
    thumbnailUrl?: string;
    embedHtml?: string;
}

export interface StatsGridBlock extends BaseBlock {
    type: 'stats_grid';
    stats: Array<{
        value: string;
        label: string;
        trend?: 'up' | 'down' | 'neutral';
        color?: string;
    }>;
}

export interface StepsBlock extends BaseBlock {
    type: 'steps';
    title: string;
    steps: Array<{
        number: number;
        title: string;
        description: string;
    }>;
}

export interface IntroBlock extends BaseBlock {
    type: 'intro';
    hook: string;
    content: string;
    wordCount: number;
}

export interface ConclusionBlock extends BaseBlock {
    type: 'conclusion';
    title: string;
    content: string;
    cta?: {
        text: string;
        url?: string;
    };
}

export type ContentBlock =
    | QuickAnswerBlock
    | SectionBlock
    | TakeawaysBlock
    | FAQAccordionBlock
    | ReferencesBlock
    | TableBlock
    | CalloutBlock
    | VideoEmbedBlock
    | StatsGridBlock
    | StepsBlock
    | IntroBlock
    | ConclusionBlock;

// ═══════════════════════════════════════════════════════════════════════════════
// 📏 SERP LENGTH POLICY — DYNAMIC WORD COUNT STRATEGY
// ═══════════════════════════════════════════════════════════════════════════════

export interface SerpLengthPolicy {
    // Word count targets
    minWordCount: number;
    maxWordCount: number;
    targetWordCount: number;
    
    // Section budgets
    sectionBudgets: {
        intro: { min: number; max: number; target: number };
        mainSections: { min: number; max: number; target: number };
        conclusion: { min: number; max: number; target: number };
        faq: { min: number; max: number; target: number };
    };
    
    // Structural targets
    minH2Count: number;
    maxH2Count: number;
    minH3Count: number;
    minFAQCount: number;
    
    // SERP feature adjustments
    adjustments: {
        featuredSnippetPresent: number; // word count modifier
        paaPresent: number;
        localPackPresent: number;
        videoCarouselPresent: number;
        knowledgePanelPresent: number;
    };
    
    // Confidence & source
    confidenceScore: number; // 0-100
    source: 'serp_analysis' | 'competitor_average' | 'niche_default' | 'manual';
    analyzedCompetitors: number;
    analysisTimestamp: number;
}

export interface SerpEvidence {
    query: string;
    locale: string;
    device: 'desktop' | 'mobile';
    analyzedUrls: Array<{
        url: string;
        position: number;
        wordCount: number;
        h2Count: number;
        h3Count: number;
        hasFAQ: boolean;
        hasSchema: boolean;
    }>;
    detectedFeatures: Array<{
        type: string;
        present: boolean;
        targetable: boolean;
    }>;
    paaQuestions: string[];
    relatedSearches: string[];
    policy: SerpLengthPolicy;
    timestamp: number;
    ttl: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 VERSIONED SCORE BREAKDOWN — TRACKABLE SCORING
// ═══════════════════════════════════════════════════════════════════════════════

export interface ScoreWeights {
    version: string;
    effective_from: string; // ISO date
    weights: {
        critical: number;      // e.g., 0.45
        seo: number;           // e.g., 0.25
        aeo: number;           // e.g., 0.10
        geo: number;           // e.g., 0.10
        enhancement: number;   // e.g., 0.10
    };
    thresholds: {
        pass: number;          // e.g., 70
        excellent: number;     // e.g., 85
        perfect: number;       // e.g., 95
    };
}

export const CURRENT_SCORE_WEIGHTS: ScoreWeights = {
    version: SCORE_VERSION,
    effective_from: '2025-01-01',
    weights: {
        critical: 0.45,
        seo: 0.25,
        aeo: 0.10,
        geo: 0.10,
        enhancement: 0.10
    },
    thresholds: {
        pass: 70,
        excellent: 85,
        perfect: 95
    }
};

export interface ScoreBreakdown {
    version: string;
    timestamp: number;
    
    // Category scores (0-100)
    categories: {
        critical: { score: number; weight: number; checks: number; passed: number };
        seo: { score: number; weight: number; checks: number; passed: number };
        aeo: { score: number; weight: number; checks: number; passed: number };
        geo: { score: number; weight: number; checks: number; passed: number };
        enhancement: { score: number; weight: number; checks: number; passed: number };
    };
    
    // Computed totals
    totalScore: number;
    weightedScore: number;
    
    // Pass/fail
    passed: boolean;
    criticalFailures: number;
    
    // Comparison (if available)
    previousScore?: number;
    improvement?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📄 CONTENT CONTRACT — ENHANCED WITH BLOCKS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContentContract {
    // Meta
    title: string;
    excerpt: string;
    metaDescription: string;
    slug: string;
    
    // Content (dual storage)
    blocks: ContentBlock[];           // Structured content
    htmlContent: string;               // Derived/rendered HTML
    
    // FAQs
    faqs: FAQItem[];
    
    // Schema
    schema: SchemaGraph;
    
    // Links
    internalLinks: InternalLinkResult[];  // 🔥 NEW: Replaces internalLinkSuggestions
    
    // Sources
    groundingSources: GroundingSource[];
    validatedReferences: ValidatedReference[];
    
    // AI assistance
    expertInsight: string;
    featuredImagePrompt: string;
    
    // Taxonomy
    categoryNames: string[];
    
    // Metrics
    wordCount?: number;
    readabilityScore?: number;
    nlpCoverage?: number;
    
    // Scores
    scoreBreakdown?: ScoreBreakdown;
    
    // Validation
    structureVerified: boolean;
    h1Count: number;                   // Should always be 0
    
    // GEO
    geoSignals?: GeoSignal[];
    aeoScore?: number;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface SchemaGraph {
    "@context": string;
    "@graph": SchemaEntity[];
}

export interface SchemaEntity {
    "@type": string;
    [key: string]: unknown;
}

export interface GeoSignal {
    type: 'local_business' | 'service_area' | 'location_mention' | 'local_keyword';
    value: string;
    context?: string;
}

export interface ValidatedReference {
    url: string;
    title: string;
    source: string;
    year: string;
    status: number;
    isValid: boolean;
    domain: string;
    isAuthority: boolean;
    citationId?: number;  // For inline citation tracking
    citedInSections?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔄 JOB QUEUE MODEL — CANCELLATION & CHECKPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface JobQueueItem {
    id: string;
    targetId: string;
    priority: number;        // Higher = more urgent
    status: 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
    createdAt: number;
    startedAt?: number;
    completedAt?: number;
    
    // Cancellation
    cancellationToken: string;
    isCancellationRequested: boolean;
    
    // Checkpoints for resumability
    checkpoint?: JobCheckpoint;
    
    // Progress
    phase: GodModePhase;
    progress: number;        // 0-100
    
    // Results
    result?: {
        score: number;
        wordCount: number;
        errors: string[];
    };
    
    // Error tracking
    lastError?: string;
    errorCount: number;
    retryAfter?: number;
}

export interface JobCheckpoint {
    phase: GodModePhase;
    timestamp: number;
    data: {
        outline?: ContentOutline;
        sections?: GeneratedSection[];
        entityGap?: EntityGapAnalysis;
        neuronData?: NeuronAnalysisResult;
        references?: ValidatedReference[];
        partialContent?: string;
    };
}

export interface JobQueue {
    items: JobQueueItem[];
    maxConcurrency: number;
    activeCount: number;
    isPaused: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔄 PIPELINE PHASES & CHECKPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export type GodModePhase = 
    | 'idle' 
    | 'initializing'
    | 'crawling'
    | 'resolving_post'
    | 'analyzing_existing'
    | 'collect_intel'
    | 'strategic_intel'        // ← ADD THIS
    | 'entity_gap_analysis'
    | 'reference_discovery'
    | 'reference_validation'
    | 'neuron_analysis'
    | 'competitor_deep_dive'
    | 'outline_generation'
    | 'section_drafts'
    | 'link_plan'
    | 'section_finalize'
    | 'merge_content'
    | 'prompt_assembly'        // ← ADD THIS
    | 'content_synthesis'      // ← ADD THIS
    | 'qa_validation'
    | 'auto_fix_loop'
    | 'self_improvement'       // ← ADD THIS
    | 'internal_linking'       // ← ADD THIS
    | 'schema_generation'
    | 'final_polish'
    | 'publishing'
    | 'completed'
    | 'failed';



export interface PipelineCheckpoint {
    phase: GodModePhase;
    timestamp: number;
    duration: number;
    success: boolean;
    data?: Record<string, unknown>;
    errors?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 PROMPT REGISTRY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PromptTemplate {
    id: string;
    version: string;
    name: string;
    description: string;
    
    // Template
    systemPrompt: string;
    userPrompt: string;
    
    // Variables
    requiredVariables: string[];
    optionalVariables: string[];
    
    // Config
    expectedOutputFormat: 'json' | 'text' | 'html';
    outputSchema?: z.ZodSchema;
    
    // Metadata
    createdAt: string;
    updatedAt: string;
    author: string;
    
    // Testing
    testCases?: Array<{
        input: Record<string, string>;
        expectedOutput?: Record<string, unknown>;
        shouldContain?: string[];
        shouldNotContain?: string[];
    }>;
}

export interface PromptRegistry {
    prompts: Record<string, PromptTemplate>;
    defaultVersion: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 QA VALIDATION TYPES — ENHANCED
// ═══════════════════════════════════════════════════════════════════════════════

export interface QARule {
    id: string;
    name: string;
    category: 'critical' | 'seo' | 'aeo' | 'geo' | 'enhancement';
    severity: 'error' | 'warning' | 'info';
    
    // Detection
    detect: (content: ContentContract, context: QARuleContext) => QADetectionResult;
    
    // Auto-fix (optional)
    fix?: (content: ContentContract, detection: QADetectionResult) => ContentContract;
    
    // Scoring
    scoreImpact: number; // Points to deduct if failed
    weight: number;      // Relative importance
    
    // Metadata
    description: string;
    fixSuggestion: string;
    enabled: boolean;
}

export interface QARuleContext {
    targetKeyword?: string;
    neuronTerms?: NeuronTerm[];
    serpPolicy?: SerpLengthPolicy;
    siteContext?: SiteContext;
}

export interface QADetectionResult {
    passed: boolean;
    score: number;
    message: string;
    details?: Record<string, unknown>;
    autoFixable: boolean;
}

export interface QAValidationResult {
    agent: string;
    ruleId: string;
    category: 'critical' | 'important' | 'enhancement' | 'seo' | 'aeo' | 'geo';
    status: 'passed' | 'failed' | 'warning';
    feedback: string;
    score: number;
    details?: Record<string, unknown>;
    fixSuggestion?: string;
    autoFixed?: boolean;
}

export interface QASwarmResult {
    passed: boolean;
    results: QAValidationResult[];
    score: number;
    criticalFailures: number;
    recommendations: string[];
    seoScore: number;
    aeoScore: number;
    geoScore: number;
    contentQualityScore: number;
    scoreBreakdown: ScoreBreakdown;
    rulesRun: number;
    rulesPassed: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 SEO METRICS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SeoMetrics {
    titleOptimization: number;
    metaOptimization: number;
    headingStructure: number;
    readability: number;
    readabilityGrade: number;
    linkDensity: number;
    semanticDensity: number;
    eeatSignals: number;
    aeoScore: number;
    geoScore: number;
    keywordDensity: number;
    entityDensity: number;
    serpFeatureTargeting: number;
    answerEngineVisibility: number;
    schemaDetected: boolean;
    schemaTypes: string[];
    mobileOptimized: boolean;
    powerWordsUsed: string[];
    wordCount: number;
    uniquenessScore: number;
    contentDepth: number;
    topicalAuthority: number;
    internalLinkScore: number;
    externalLinkScore: number;
}

export interface OpportunityScore {
    total: number;
    commercialIntent: number;
    temporalDecay: number;
    strikingDistance: number;
    competitionLevel: number;
    trafficPotential: number;
    aeoOpportunity: number;
    geoOpportunity: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 NEURON NLP TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NeuronTerm {
    term: string;
    type: 'header' | 'basic' | 'extended' | 'title';
    count: number;
    recommended: number;
    isUsed?: boolean;
    importance: number;
}

export interface NeuronAnalysisResult {
    status: string;
    terms: NeuronTerm[];
    targetWordCount: number;
    competitors: unknown[];
    contentScore?: number;
}

export interface NeuronCoverageReport {
    timestamp: number;
    query: string;
    totalTerms: number;
    usedTerms: number;
    coverage: number;
    weightedCoverage: number;
    termDetails: Array<{
        term: string;
        type: string;
        required: number;
        actual: number;
        met: boolean;
        insertedAt?: string[]; // Section IDs where inserted
        missedReason?: string;
    }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 COMPETITOR & ENTITY ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CompetitorAnalysis {
    url: string;
    title: string;
    wordCount: number;
    headings: string[];
    entities: string[];
    snippet: string;
    position: number;
    domain: string;
    hasSchema: boolean;
    hasFAQ: boolean;
}

export interface EntityGapAnalysis {
    competitorEntities: string[];
    missingEntities: string[];
    topKeywords: string[];
    paaQuestions: string[];
    contentGaps: string[];
    avgWordCount: number;
    serpFeatures: SerpFeature[];
    competitorUrls: string[];
    competitors: CompetitorAnalysis[];
    recommendedWordCount: number;
    topicClusters: string[];
    semanticTerms: string[];
    validatedReferences: ValidatedReference[];
    knowledgeGraphData?: KnowledgeGraphData;
    featuredSnippetOpportunity: boolean;
    localPackPresent: boolean;
}

export interface SerpFeature {
    type: 'featured_snippet' | 'knowledge_panel' | 'local_pack' | 'paa' | 'video' | 'image' | 'news' | 'shopping';
    present: boolean;
    targetable: boolean;
}

export interface KnowledgeGraphData {
    title?: string;
    type?: string;
    description?: string;
    attributes?: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 EXISTING CONTENT ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ExistingContentAnalysis {
    wordCount: number;
    headings: HeadingInfo[];
    hasSchema: boolean;
    hasFAQ: boolean;
    hasConclusion: boolean;
    hasReferences: boolean;
    hasQuickAnswer: boolean;
    internalLinkCount: number;
    externalLinkCount: number;
    imageCount: number;
    tableCount: number;
    listCount: number;
    readabilityScore: number;
    preserveableContent: string[];
    weakSections: string[];
    entities: string[];
    mainTopics: string[];
    missingElements: string[];
    strengthScore: number;
}

export interface HeadingInfo {
    level: number;
    text: string;
    hasKeyword?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔄 JOB STATE
// ═══════════════════════════════════════════════════════════════════════════════

export type PublishMode = 'draft' | 'autopublish';

export interface GodModeJobState {
    targetId: string;
    status: 'idle' | 'running' | 'validating' | 'publishing' | 'completed' | 'failed' | 'reverted' | 'cancelled';
    phase: GodModePhase;
    log: string[];
    intel?: { text: string; groundingSources: GroundingSource[] };
    contract?: ContentContract;
    qaResults: QAValidationResult[];
    postId?: number;
    mediaId?: number;
    error?: string;
    lastUpdated: number;
    attempts: number;
    previousScores: number[];
    entityGapData?: EntityGapAnalysis;
    neuronData?: NeuronAnalysisResult;
    existingAnalysis?: ExistingContentAnalysis;
    allFeedback: string[];
    processingTime?: number;
    validatedReferences?: ValidatedReference[];
    startTime?: number;
    
    // Checkpoints
    checkpoints: PipelineCheckpoint[];
    
    // Cancellation
    cancellationToken?: string;
    isCancellationRequested?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📄 PAGE & SITEMAP TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SitemapPage {
    id: string;
    title: string;
    slug: string;
    lastMod: string | null;
    wordCount: number | null;
    crawledContent: string | null;
    healthScore: number | null;
    status: 'idle' | 'analyzing' | 'analyzed' | 'error' | 'syncing' | 'queued' | 'processing';
    seoMetrics?: SeoMetrics;
    opportunity?: OpportunityScore;
    wpPostId?: number;
    jobState?: GodModeJobState;
    lastPublishedAt?: number;
    improvementHistory: ImprovementRecord[];
    categories?: string[];
    tags?: string[];
    targetKeyword?: string;
    existingAnalysis?: ExistingContentAnalysis;
}

export interface ImprovementRecord {
    timestamp: number;
    score: number;
    action: string;
    wordCount?: number;
    qaScore?: number;
    version: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ⚙️ CONFIGURATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type Provider = 'google' | 'openai' | 'anthropic' | 'openrouter' | 'groq';

export interface ApiKeys {
    google: string;
    openai: string;
    anthropic: string;
    openrouter: string;
    groq: string;
    serper: string;
    neuronwriter: string;
    neuronProject: string;
    openrouterModel: string;
    groqModel: string;
}

export interface WpConfig {
    url: string;
    username: string;
    password?: string;
    orgName: string;
    logoUrl: string;
    authorName: string;
    authorPageUrl: string;
    defaultCategory?: number;
    industry?: string;
    targetAudience?: string;
}

export interface AutonomousConfig {
    enabled: boolean;
    targetScore: number;
    maxRetriesPerPage: number;
    delayBetweenPages: number;
    processNewPagesOnly: boolean;
    pauseOnError: boolean;
    prioritizeByOpportunity: boolean;
    minWordCount: number;
    maxConcurrent: number;
    enableAEO: boolean;
    enableGEO: boolean;
    geoTargeting?: GeoTargetConfig;
}

export interface GeoTargetConfig {
    enabled: boolean;
    country: string;
    region: string;
    city: string;
    language: string;
    radius?: number;
    serviceAreas?: string[];
}

export interface SiteContext {
    orgName: string;
    url: string;
    authorName: string;
    logoUrl?: string;
    authorPageUrl?: string;
    industry?: string;
    targetAudience?: string;
    brandVoice?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 GENERATION CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export interface GenerateConfig {
    prompt: string;
    topic: string;
    searchQuery?: string;
    mode: 'surgical' | 'writer';
    siteContext: SiteContext;
    model?: string;
    useSearch?: boolean;
    provider?: string;
    apiKeys: ApiKeys;
    entityGapData?: EntityGapAnalysis;
    neuronData?: NeuronAnalysisResult;
    existingAnalysis?: ExistingContentAnalysis;
    previousAttempts?: number;
    allFeedback?: string[];
    internalLinks?: InternalLinkTarget[];
    targetKeyword?: string;
    validatedReferences?: ValidatedReference[];
    geoConfig?: GeoTargetConfig;
    temperature?: number;
    serpPolicy?: SerpLengthPolicy;
}

export interface EnhancedGenerateConfig extends GenerateConfig {
    useStagedPipeline?: boolean;
    useSERPGenerators?: boolean;
    useNLPInjector?: boolean;
    targetNLPCoverage?: number;
    maxNLPInjections?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 CONTENT OUTLINE & SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContentOutline {
    title: string;
    metaDescription: string;
    slug: string;
    introduction: {
        hook: string;
        quickAnswerPoints: string[];
        targetWords: number;
    };
    sections: SectionOutline[];
    conclusion: {
        keyTakeaways: string[];
        callToAction: string;
        targetWords: number;
    };
    faqTopics: string[];
    totalTargetWords: number;
}

export interface SectionOutline {
    id: string;
    h2Heading: string;
    h3Subheadings: string[];
    keyPoints: string[];
    nlpTermsToInclude: string[];
    visualComponents: ('stats' | 'tip' | 'warning' | 'expert' | 'table' | 'steps' | 'checklist')[];
    targetWords: number;
    referencesToCite: number[];
}

export interface GeneratedSection {
    id: string;
    heading: string;
    htmlContent: string;
    wordCount: number;
    nlpTermsUsed: string[];
    nlpTermsMissed: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🖼️ IMAGE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ImageOptimizationResult {
    originalSrc: string;
    originalAlt: string;
    optimizedAlt: string;
    mediaId?: number;
    updated: boolean;
}

export interface PostImagePreservation {
    featuredImageId: number | null;
    contentImages: Array<{
        src: string;
        alt: string;
        newAlt?: string;
        mediaId?: number;
    }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 OPTIMIZATION MODE
// ═══════════════════════════════════════════════════════════════════════════════

export type OptimizationMode = 'full_rewrite' | 'surgical';

export interface OptimizationModeConfig {
    mode: OptimizationMode;
    preserveImages: boolean;
    optimizeAltText: boolean;
    preserveFeaturedImage: boolean;
    preserveSlug: boolean;
    preserveCategories: boolean;
    preserveTags: boolean;
    preserveGoodSections: boolean;
    minSectionWordCount: number;
}

export const DEFAULT_OPTIMIZATION_CONFIG: OptimizationModeConfig = {
    mode: 'surgical',
    preserveImages: true,
    optimizeAltText: true,
    preserveFeaturedImage: true,
    preserveSlug: true,
    preserveCategories: true,
    preserveTags: true,
    preserveGoodSections: true,
    minSectionWordCount: 150
};


// ═══════════════════════════════════════════════════════════════════════════════
// ENTERPRISE CONTENT QUALITY TYPES
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

export interface ContentQualityOptions {
  minLinks?: number;
  maxLinks?: number;
  minRelevance?: number;
  minDistanceBetweenLinks?: number;
  maxLinksPerSection?: number;
  enableFAQAccordion?: boolean;
  enableReferenceCards?: boolean;
  fixCTAButtons?: boolean;
}



// ═══════════════════════════════════════════════════════════════════════════════
// 🔔 UI TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🛠️ UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ProcessingLock {
    isLocked: boolean;
    lockedAt: number | null;
    lockedBy: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🌍 ENVIRONMENT PROFILES
// ═══════════════════════════════════════════════════════════════════════════════

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentProfile {
    name: Environment;
    wpConfig: Partial<WpConfig>;
    apiEndpoints: {
        wordpress: string;
        serper: string;
        neuronwriter: string;
    };
    features: {
        enableDebugLogging: boolean;
        enableAnalytics: boolean;
        enablePreviewMode: boolean;
        maxConcurrentJobs: number;
    };
    rateLimits: {
        aiCallsPerMinute: number;
        wpCallsPerMinute: number;
        serperCallsPerDay: number;
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 ANALYTICS & TELEMETRY
// ═══════════════════════════════════════════════════════════════════════════════

export interface JobTelemetry {
    jobId: string;
    startTime: number;
    endTime?: number;
    phases: Array<{
        name: GodModePhase;
        duration: number;
        success: boolean;
        error?: string;
    }>;
    tokensUsed: number;
    apiCalls: number;
    finalScore?: number;
    wordCount?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔐 VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export function validateWPResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error('[WP Validation Error]', result.error.flatten());
        throw new Error(`WordPress API response validation failed: ${result.error.message}`);
    }
    return result.data;
}

export function validateSerperResponse(data: unknown): SerperResponse {
    const result = SerperResponseSchema.safeParse(data);
    if (!result.success) {
        console.error('[Serper Validation Error]', result.error.flatten());
        throw new Error(`Serper API response validation failed: ${result.error.message}`);
    }
    return result.data;
}

export function validateNeuronResponse(data: unknown): NeuronAnalysisResponse {
    const result = NeuronAnalysisResponseSchema.safeParse(data);
    if (!result.success) {
        console.error('[Neuron Validation Error]', result.error.flatten());
        throw new Error(`NeuronWriter API response validation failed: ${result.error.message}`);
    }
    return result.data;
}

export function validateAIContentResponse(data: unknown): AIContentResponse {
    const result = AIContentResponseSchema.safeParse(data);
    if (!result.success) {
        console.error('[AI Content Validation Error]', result.error.flatten());
        throw new Error(`AI content response validation failed: ${result.error.message}`);
    }
    return result.data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📦 EXPORTS SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

/*
This types.ts exports:

ZOD SCHEMAS (Runtime Validation):
- WPPostSchema, WPMediaSchema, WPCategorySchema, WPErrorSchema
- SerperResponseSchema, SerperOrganicResultSchema, SerperPAASchema
- NeuronTermSchema, NeuronAnalysisResponseSchema
- AIContentResponseSchema

INTERNAL LINKING:
- InternalLinkTarget, AnchorVariant, InternalLinkResult, InternalLinkPlan
- LinkInjectionConfig

CONTENT BLOCKS:
- ContentBlock (union type)
- QuickAnswerBlock, SectionBlock, TakeawaysBlock, FAQAccordionBlock
- ReferencesBlock, TableBlock, CalloutBlock, VideoEmbedBlock
- StatsGridBlock, StepsBlock, IntroBlock, ConclusionBlock

SERP POLICY:
- SerpLengthPolicy, SerpEvidence

SCORING:
- ScoreWeights, CURRENT_SCORE_WEIGHTS, ScoreBreakdown

JOB QUEUE:
- JobQueueItem, JobCheckpoint, JobQueue
- GodModePhase, PipelineCheckpoint

QA:
- QARule, QARuleContext, QADetectionResult
- QAValidationResult, QASwarmResult

VALIDATION HELPERS:
- validateWPResponse, validateSerperResponse
- validateNeuronResponse, validateAIContentResponse

...and many more types for complete type safety
*/
