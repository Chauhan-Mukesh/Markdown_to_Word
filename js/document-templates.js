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
      },

      resume: {
        name: '📋 Professional Resume',
        content: `# [Your Name]

**Email:** [your.email@example.com] | **Phone:** [Your Phone] | **Location:** [Your City, State]  
**LinkedIn:** [linkedin.com/in/yourprofile] | **GitHub:** [github.com/yourusername]

---

## Professional Summary
Brief 2-3 sentence summary highlighting your key skills and experience.

## Experience

### **Job Title** | *Company Name* | *Location*
**Duration:** *Start Date - End Date*
- Achievement or responsibility with measurable impact
- Key project or initiative you led
- Technical skills or tools used

### **Previous Job Title** | *Previous Company* | *Location*
**Duration:** *Start Date - End Date*
- Notable accomplishment with quantified results
- Problem you solved or process you improved
- Technologies or methodologies used

## Education

### **Degree Name** | *University Name* | *Location*
**Duration:** *Start Year - End Year*
- GPA: *X.X/4.0* (if 3.5+)
- Relevant coursework: *Course 1, Course 2, Course 3*

## Skills

**Technical:** *Language 1, Language 2, Framework 1, Tool 1, Tool 2*  
**Tools:** *Software 1, Software 2, Platform 1, Platform 2*  
**Soft Skills:** *Communication, Leadership, Project Management*

## Projects

### **Project Name** | *Technology Stack*
- Brief description of the project and your role
- Key features you implemented
- Results or impact achieved

## Certifications
- *Certification Name* - *Issuing Organization* (*Date*)
- *Another Certification* - *Issuing Organization* (*Date*)`
      },

      changelog: {
        name: '📝 Change Log',
        content: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features that have been added

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security improvements

## [1.0.0] - ${new Date().toISOString().split('T')[0]}

### Added
- Initial release
- Core functionality implemented
- Basic user interface
- Documentation

### Security
- Input validation added
- Security headers implemented`
      },

      apiDoc: {
        name: '🔌 API Documentation',
        content: `# API Documentation

## Overview
Brief description of your API and its purpose.

**Base URL:** \`https://api.example.com/v1\`  
**Authentication:** Bearer Token  
**Response Format:** JSON

## Authentication

All API requests require authentication using a Bearer token:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/v1/endpoint
\`\`\`

## Endpoints

### GET /users
Retrieve a list of users.

**Parameters:**
- \`page\` (optional): Page number (default: 1)
- \`limit\` (optional): Number of results per page (default: 20)

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100
  }
}
\`\`\`

### POST /users
Create a new user.

**Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Invalid token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist |
| 500  | Internal Server Error |

## Rate Limiting
- **Limit:** 1000 requests per hour
- **Headers:** \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`

## SDKs and Libraries
- [JavaScript SDK](https://github.com/example/js-sdk)
- [Python Library](https://github.com/example/python-lib)
- [PHP Package](https://github.com/example/php-package)`
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
   * Create template selector dropdown with improved styling
   */
  createTemplateSelector(container, onSelect) {
    const select = document.createElement('select');
    select.className = 'template-selector';
    select.style.cssText = `
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      color: #333;
      margin-right: 0.5rem;
      min-width: 150px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
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
        
        // Add confirmation for non-empty editor using custom modal
        const currentContent = document.getElementById('markdown-input')?.value?.trim();
        if (currentContent && currentContent.length > 50) {
          // Use the existing custom confirmation modal instead of window.confirm()
          if (typeof showCustomConfirm === 'function') {
            showCustomConfirm(
              '📋 Replace Content',
              'Replace current content with template? This action cannot be undone.',
              (confirmed) => {
                if (confirmed) {
                  onSelect(template.content);
                  this.showTemplateNotification(`✅ Applied ${template.name} template`);
                }
                e.target.value = ''; // Reset selector
              }
            );
          } else {
            // Fallback for custom confirmation
            const proceed = window.confirm('Replace current content with template? This action cannot be undone.');
            if (!proceed) {
              e.target.value = ''; // Reset selector
              return;
            }
            onSelect(template.content);
            this.showTemplateNotification(`✅ Applied ${template.name} template`);
            e.target.value = ''; // Reset selector
          }
        } else {
          onSelect(template.content);
          e.target.value = ''; // Reset selector
          
          // Show success notification
          this.showTemplateNotification(`✅ Applied ${template.name} template`);
        }
      }
    });

    container.appendChild(select);
    return select;
  }

  /**
   * Show template application notification
   */
  showTemplateNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      font-size: 0.9rem;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

window.DocumentTemplates = DocumentTemplates;