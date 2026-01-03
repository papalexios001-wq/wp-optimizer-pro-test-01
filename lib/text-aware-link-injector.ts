import { generateBlogContent, BlogContentResult } from './blog-content-generator';
import { injectContextualLinks, validateLinkQuality } from './context-aware-link-injector';

interface EnhancedBlogContent {
  title: string;
  quickAnswer: string;
  mainContent: string;
  contentSections: Array<{
    heading: string;
    content: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  metadata: {
    wordsCount: number;
    sectionsCount: number;
    internalLinksCount: number;
    linkQualityScore: number;
    averageRelevance: number;
  };
}

export async function generateEnhancedBlogContent(
  topic: string,
  keywords: string[]
): Promise<EnhancedBlogContent> {
  try {
    // Step 1: Generate core blog content with 8-12 sections
    const blogResult: BlogContentResult = await generateBlogContent(topic, keywords);

    // Step 2: Combine all content sections
    let fullContent = `${blogResult.quickAnswer}\n\n`;
    
    blogResult.sections.forEach(section => {
      fullContent += `## ${section.heading}\n${section.content}\n\n`;
    });

    // Step 3: Inject 15-20 contextual links
    const linkResult = await injectContextualLinks(fullContent, topic);
    
    // Step 4: Validate link quality
    const qualityValid = validateLinkQuality(linkResult.links);
    
    if (!qualityValid && linkResult.links.length < 15) {
      console.warn('Warning: Link quality below threshold. Consider enhancing keywords.');
    }

    // Step 5: Calculate average relevance
    const avgRelevance = linkResult.links.length > 0
      ? linkResult.links.reduce((sum, l) => sum + l.relevanceScore, 0) / linkResult.links.length
      : 0;

    // Step 6: Return enhanced content with metadata
    return {
      title: blogResult.title,
      quickAnswer: blogResult.quickAnswer,
      mainContent: linkResult.content,
      contentSections: blogResult.sections,
      faqs: blogResult.faqs,
      metadata: {
        wordsCount: linkResult.content.split(/\s+/).length,
        sectionsCount: blogResult.sections.length,
        internalLinksCount: linkResult.linksInjected,
        linkQualityScore: qualityValid ? 1 : 0.7,
        averageRelevance: parseFloat(avgRelevance.toFixed(2))
      }
    };
  } catch (error) {
    console.error('Error generating enhanced blog content:', error);
    throw error;
  }
}

export function renderBlogHTML(content: EnhancedBlogContent): string {
  const { title, quickAnswer, contentSections, faqs, metadata } = content;
  
  let html = `<article class="blog-post">\n`;
  html += `  <h1>${title}</h1>\n\n`;
  
  // Quick Answer Section
  html += `  <section class="quick-answer">\n`;
  html += `    <h2>Quick Answer</h2>\n`;
  html += `    <p>${quickAnswer}</p>\n`;
  html += `  </section>\n\n`;
  
  // Main Content Sections (8-12 H2 sections)
  html += `  <section class="main-content">\n`;
  contentSections.forEach(section => {
    html += `    <section class="content-section">\n`;
    html += `      <h2>${section.heading}</h2>\n`;
    html += `      <div class="section-body">${section.content}</div>\n`;
    html += `    </section>\n\n`;
  });
  html += `  </section>\n\n`;
  
  // FAQs Section
  html += `  <section class="faqs">\n`;
  html += `    <h2>Frequently Asked Questions</h2>\n`;
  faqs.forEach((faq, index) => {
    html += `    <div class="faq-item" id="faq-${index}">\n`;
    html += `      <h3>${faq.question}</h3>\n`;
    html += `      <p>${faq.answer}</p>\n`;
    html += `    </div>\n`;
  });
  html += `  </section>\n\n`;
  
  // Metadata Footer
  html += `  <footer class="post-metadata">\n`;
  html += `    <p class="word-count">Word Count: ${metadata.wordsCount}</p>\n`;
  html += `    <p class="sections-count">Sections: ${metadata.sectionsCount}</p>\n`;
  html += `    <p class="links-count">Internal Links: ${metadata.internalLinksCount}/20</p>\n`;
  html += `    <p class="link-quality">Link Quality Score: ${(metadata.linkQualityScore * 100).toFixed(1)}%</p>\n`;
  html += `    <p class="relevance">Average Link Relevance: ${(metadata.averageRelevance * 100).toFixed(1)}%</p>\n`;
  html += `  </footer>\n\n`;
  html += `</article>`;
  
  return html;
}

export function validateBlogContent(content: EnhancedBlogContent): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validation checks
  if (!content.title || content.title.length === 0) {
    errors.push('Title is required and cannot be empty');
  }
  
  if (!content.quickAnswer || content.quickAnswer.length < 50) {
    errors.push('Quick answer must be at least 50 characters');
  }
  
  if (content.contentSections.length < 8) {
    warnings.push(`Only ${content.contentSections.length} sections found. Recommended: 8-12`);
  }
  
  if (content.contentSections.length > 12) {
    warnings.push(`${content.contentSections.length} sections found. Maximum recommended: 12`);
  }
  
  if (content.metadata.internalLinksCount < 15) {
    warnings.push(`Only ${content.metadata.internalLinksCount} internal links. Recommended: 15-20`);
  }
  
  if (content.metadata.internalLinksCount > 20) {
    warnings.push(`${content.metadata.internalLinksCount} internal links. Maximum recommended: 20`);
  }
  
  if (content.metadata.averageRelevance < 0.85) {
    warnings.push(`Average link relevance ${(content.metadata.averageRelevance * 100).toFixed(1)}%. Target: 85%+`);
  }
  
  if (content.metadata.wordsCount < 1500) {
    warnings.push(`${content.metadata.wordsCount} words. Recommended: 1500+ for SEO`);
  }
  
  if (content.faqs.length === 0) {
    warnings.push('No FAQ sections found. Consider adding FAQs for better engagement');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
