/**
 * @file document-templates.js
 * @description Professional document templates for various business and personal use cases
 * @version 2.1.0
 * @author Markdown to Word Exporter Team
 * @license MIT
 * 
 * @overview
 * Provides a comprehensive collection of document templates including:
 * - Business reports and proposals
 * - Meeting notes and documentation
 * - Technical documentation templates
 * - Personal correspondence formats
 * - Academic and research templates
 * - Resume and professional formats
 * - API and software documentation
 * 
 * All templates are designed to be professional, well-structured,
 * and easily customizable for specific needs.
 */

/**
 * Document templates manager class
 * @class
 * @description Manages a collection of professional document templates with metadata
 * @since 2.1.0
 */
class DocumentTemplates {
  /**
   * Constructor for DocumentTemplates
   * @description Initializes the template collection with comprehensive business and personal templates
   * @since 2.1.0
   */
  constructor() {
    /** @type {Object} Collection of document templates with metadata */
    this.templates = {
      blank: {
        name: '📄 Blank Document',
        description: 'Start with a clean, empty document',
        category: 'general',
        content: ''
      },
      
      report: {
        name: '📊 Business Report',
        description: 'Professional business report with executive summary',
        category: 'business',
        content: `# Executive Summary

## Overview
Brief overview of the report contents and key findings.

## Methodology
Description of how the analysis was conducted.

## Key Findings
- **Finding 1**: Description of first key finding with supporting data
- **Finding 2**: Description of second key finding with supporting data  
- **Finding 3**: Description of third key finding with supporting data

## Recommendations
1. **Priority Recommendation**: Detailed description and expected impact
2. **Secondary Recommendation**: Detailed description and timeline
3. **Long-term Recommendation**: Detailed description and resource requirements

## Conclusion
Summary of conclusions and next steps.

## Appendix
- Data sources
- Methodology details
- Supporting documentation

---

*Report prepared on ${new Date().toLocaleDateString()}*  
*Document Classification: [Internal/Confidential/Public]*`
      },

      meeting: {
        name: '🤝 Meeting Notes',
        description: 'Structured meeting documentation template',
        category: 'business',
        content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}  
**Time:** [Start Time] - [End Time]  
**Location:** [Physical/Virtual Location]  
**Meeting Type:** [Regular/Ad-hoc/Emergency]  

## Attendees
- **Chair:** [Name, Title]
- **Attendees:**
    - [Name, Title, Department]
    - [Name, Title, Department]
    - [Name, Title, Department]
- **Absent:** [Names if applicable]

## Agenda
1. **Review of Previous Action Items** *(10 min)*
2. **[Agenda Item 1]** *(15 min)*
3. **[Agenda Item 2]** *(20 min)*
4. **[Agenda Item 3]** *(15 min)*
5. **Next Steps & Action Items** *(10 min)*

## Discussion Points

### [Topic 1]
- **Discussion:** Key points discussed
- **Decisions Made:** 
    - Decision 1 with rationale
    - Decision 2 with rationale
- **Concerns Raised:** Any unresolved issues

### [Topic 2]
- **Discussion:** Key points discussed
- **Decisions Made:** 
    - Decision 1 with rationale
- **Follow-up Required:** Next steps needed

## Action Items
| Action Item | Owner | Due Date | Priority | Status |
|-------------|-------|----------|----------|--------|
| [Specific action item] | [Name] | [Date] | [High/Medium/Low] | [Not Started] |
| [Specific action item] | [Name] | [Date] | [High/Medium/Low] | [Not Started] |
| [Specific action item] | [Name] | [Date] | [High/Medium/Low] | [Not Started] |

## Next Meeting
**Date:** [Date]  
**Time:** [Time]  
**Location:** [Location]  
**Agenda Items:** 
- Review action items from this meeting
- [Planned agenda items]

---
*Minutes prepared by: [Name]*  
*Document Status: [Draft/Final]*`
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
        description: 'Comprehensive project documentation template',
        category: 'technical',
        content: `# Project Name

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/user/repo/releases)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/user/repo/actions)

> Brief, compelling description of what this project does and why it matters.

## ✨ Features

- 🚀 **Feature 1**: Description of key feature with benefits
- 📦 **Feature 2**: Description of second feature
- 🔧 **Feature 3**: Description of third feature
- 🎯 **Feature 4**: Description of fourth feature

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ or Python 3.8+
- Git
- [Other specific requirements]

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project-name.git

# Navigate to project directory
cd project-name

# Install dependencies
npm install
# or
pip install -r requirements.txt
\`\`\`

### Basic Usage

\`\`\`javascript
// JavaScript example
const project = require('project-name');

// Initialize and use
const instance = new project.ClassName({
    option1: 'value1',
    option2: 'value2'
});

const result = instance.doSomething();
console.log(result);
\`\`\`

\`\`\`python
# Python example
from project_name import ClassName

# Initialize and use
instance = ClassName(
    option1='value1',
    option2='value2'
)

result = instance.do_something()
print(result)
\`\`\`

## 📚 Documentation

### API Reference

#### \`ClassName(options)\`
Creates a new instance of the main class.

**Parameters:**
- \`options\` (Object): Configuration options
  - \`option1\` (string): Description of option 1
  - \`option2\` (number): Description of option 2

**Returns:** \`ClassName\` instance

**Example:**
\`\`\`javascript
const instance = new ClassName({
    option1: 'example',
    option2: 42
});
\`\`\`

#### \`instance.doSomething(input)\`
Performs the main operation.

**Parameters:**
- \`input\` (string): Input data to process

**Returns:** \`Promise<Object>\` - Processing result

### Configuration

Create a \`.env\` file in the root directory:

\`\`\`env
API_KEY=your_api_key_here
DEBUG=true
PORT=3000
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/specific-test.js
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork: \`git clone https://github.com/yourusername/project-name.git\`
3. Create a feature branch: \`git checkout -b feature/amazing-feature\`
4. Install dependencies: \`npm install\`
5. Make your changes
6. Run tests: \`npm test\`
7. Commit your changes: \`git commit -m 'Add amazing feature'\`
8. Push to the branch: \`git push origin feature/amazing-feature\`
9. Open a Pull Request

### Code Style

- Follow existing code style
- Run \`npm run lint\` before committing
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Library/Tool Name](https://example.com) - Description of what it provides
- [Contributor Name](https://github.com/username) - Specific contribution
- [Resource Name](https://example.com) - Inspiration or guidance

## 📞 Support

- 📖 [Documentation](https://docs.example.com)
- 🐛 [Issue Tracker](https://github.com/username/project-name/issues)
- 💬 [Discussions](https://github.com/username/project-name/discussions)
- 📧 [Email Support](mailto:support@example.com)

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**`
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
        const templateKey = e.target.value;
        const template = this.getTemplate(templateKey);
        
        // Call the onSelect callback with template content
        // The main script (script.js) will handle confirmation logic
        onSelect(template.content);
        
        // Show success notification
        this.showTemplateNotification(`✅ Applied ${template.name} template`);
        
        // Reset selector to default state
        setTimeout(() => {
          select.value = '';
        }, 100);
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