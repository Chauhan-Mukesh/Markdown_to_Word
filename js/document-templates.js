/**
 * @file document-templates.js
 * @description Pre-defined document templates for different use cases
 */

class DocumentTemplates {
  constructor() {
    this.templates = {
      blank: {
        name: '📄 Blank Document',
        content: ''
      },
      
      report: {
        name: '📊 Business Report',
        content: `# Executive Summary

## Overview
Brief overview of the report contents and key findings.

## Methodology
Description of how the analysis was conducted.

## Key Findings
- Finding 1
- Finding 2
- Finding 3

## Recommendations
1. Recommendation 1
2. Recommendation 2
3. Recommendation 3

## Conclusion
Summary of conclusions and next steps.

---

*Report prepared on ${new Date().toLocaleDateString()}*`
      },

      meeting: {
        name: '🤝 Meeting Notes',
        content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Time:** 
**Attendees:** 
**Meeting Chair:** 

## Agenda
1. Item 1
2. Item 2
3. Item 3

## Discussion Points

### Topic 1
- Discussion notes
- Key points raised

### Topic 2
- Discussion notes
- Decisions made

## Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
| Action 1 | Name | Date |
| Action 2 | Name | Date |

## Next Meeting
**Date:** 
**Time:** 
**Location:** `
      },

      proposal: {
        name: '💼 Project Proposal',
        content: `# Project Proposal: [Project Name]

## Executive Summary
Brief summary of the proposed project.

## Problem Statement
Description of the problem this project aims to solve.

## Proposed Solution
Detailed description of the proposed solution.

## Scope and Deliverables
- Deliverable 1
- Deliverable 2
- Deliverable 3

## Timeline
| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1 | 2 weeks | Initial setup |
| Phase 2 | 4 weeks | Core development |
| Phase 3 | 2 weeks | Testing & deployment |

## Budget
Estimated budget and resource requirements.

## Risk Assessment
Potential risks and mitigation strategies.

## Success Metrics
How success will be measured.

## Conclusion
Summary and call to action.`
      },

      readme: {
        name: '📖 README Documentation',
        content: `# Project Name

Brief description of what this project does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`javascript
const project = require('project-name');
project.doSomething();
\`\`\`

## API Reference

### Method 1
Description of method 1.

**Parameters:**
- \`param1\` (string): Description
- \`param2\` (number): Description

**Returns:** Description of return value

### Method 2
Description of method 2.

## Contributing
Guidelines for contributing to this project.

## License
This project is licensed under the MIT License.`
      },

      tutorial: {
        name: '📚 Tutorial Guide',
        content: `# Tutorial: [Topic Name]

## Introduction
What you'll learn in this tutorial.

## Prerequisites
- Prerequisite 1
- Prerequisite 2
- Prerequisite 3

## Step 1: Getting Started
Detailed instructions for the first step.

\`\`\`
Code example
\`\`\`

## Step 2: [Step Name]
Detailed instructions for the second step.

> **Tip:** Helpful tip for users

## Step 3: [Step Name]
Detailed instructions for the third step.

⚠️ **Warning:** Important warning

## Troubleshooting
Common issues and solutions:

### Problem 1
**Symptoms:** Description of symptoms
**Solution:** How to fix it

### Problem 2
**Symptoms:** Description of symptoms
**Solution:** How to fix it

## Conclusion
Summary of what was accomplished.

## Next Steps
- What to do next
- Additional resources
- Related tutorials`
      },

      letter: {
        name: '✉️ Formal Letter',
        content: `${new Date().toLocaleDateString()}

[Recipient Name]
[Title]
[Company/Organization]
[Address]

Dear [Recipient Name],

## Introduction
Brief introduction and purpose of the letter.

## Body
Main content of the letter with supporting details and information.

## Conclusion
Summary and call to action or next steps.

Sincerely,

[Your Name]
[Your Title]
[Your Contact Information]`
      }
    };
  }

  /**
   * Get all available templates
   */
  getTemplates() {
    return this.templates;
  }

  /**
   * Get a specific template by key
   */
  getTemplate(key) {
    return this.templates[key] || this.templates.blank;
  }

  /**
   * Create template selector dropdown
   */
  createTemplateSelector(container, onSelect) {
    const select = document.createElement('select');
    select.className = 'template-selector';
    select.style.cssText = `
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      margin-right: 0.5rem;
      min-width: 150px;
    `;

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '📋 Choose Template';
    select.appendChild(defaultOption);

    // Add template options
    Object.keys(this.templates).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = this.templates[key].name;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      if (e.target.value) {
        const template = this.getTemplate(e.target.value);
        onSelect(template.content);
        e.target.value = ''; // Reset selector
      }
    });

    container.appendChild(select);
    return select;
  }
}

window.DocumentTemplates = DocumentTemplates;