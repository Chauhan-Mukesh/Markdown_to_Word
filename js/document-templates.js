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
1. **Data Collection**
    1. Primary sources identification
    2. Data gathering processes
    3. Quality assurance measures
2. **Analysis Framework**
    1. Analytical models used
    2. Key performance indicators
    3. Benchmarking criteria
3. **Validation Process**
    1. Peer review procedures
    2. Stakeholder feedback integration
    3. Final verification steps

## Key Findings
1. **Finding 1**: Description of first key finding with supporting data
    1. Supporting evidence
        - Statistical data
        - Market research
        - Customer feedback
    2. Impact analysis
        - Short-term implications
        - Long-term consequences
        - Risk assessment
2. **Finding 2**: Description of second key finding with supporting data  
    1. Quantitative analysis
    2. Qualitative insights
    3. Comparative benchmarks
3. **Finding 3**: Description of third key finding with supporting data
    1. Market trends
    2. Competitive landscape
    3. Opportunities identified

## Recommendations
1. **Priority Recommendation**: Detailed description and expected impact
    1. Implementation strategy
        - Phase 1: Initial setup (Timeline: [X weeks])
        - Phase 2: Rollout (Timeline: [X weeks])
        - Phase 3: Optimization (Timeline: [X weeks])
    2. Resource requirements
        - Human resources
        - Technology needs
        - Budget allocation
    3. Success metrics
        - KPI targets
        - Measurement methods
        - Reporting schedule
2. **Secondary Recommendation**: Detailed description and timeline
    1. Strategic alignment
    2. Implementation roadmap
    3. Risk mitigation
3. **Long-term Recommendation**: Detailed description and resource requirements
    1. Vision and objectives
    2. Investment requirements
    3. Expected ROI

## Risk Assessment
1. **High Priority Risks**
    1. Market volatility
        - Impact: High
        - Probability: Medium
        - Mitigation: [Strategy]
    2. Resource constraints
        - Impact: Medium
        - Probability: High
        - Mitigation: [Strategy]
2. **Medium Priority Risks**
    1. Technology dependencies
    2. Regulatory changes
    3. Competitive responses

## Conclusion
Summary of conclusions and next steps.

## Appendix
1. **Data Sources**
    1. Internal databases
    2. Market research reports
    3. Industry publications
2. **Methodology Details**
    1. Statistical methods
    2. Sampling procedures
    3. Analysis tools used
3. **Supporting Documentation**
    1. Raw data files
    2. Detailed calculations
    3. Additional charts and graphs

---

*Report prepared on ${new Date().toLocaleDateString()}*  
*Document Classification: [Internal/Confidential/Public]*  
*Version: 1.0*`
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
    1. [Name, Title, Department]
    2. [Name, Title, Department]
    3. [Name, Title, Department]
- **Absent:** [Names if applicable]

## Agenda
1. **Review of Previous Action Items** *(10 min)*
    1. Review completed items
    2. Discuss pending items
    3. Update status and timelines
2. **[Agenda Item 1]** *(15 min)*
    1. Discussion points
    2. Decision required
    3. Next steps
3. **[Agenda Item 2]** *(20 min)*
    1. Background information
    2. Options analysis
    3. Recommendation and approval
4. **[Agenda Item 3]** *(15 min)*
5. **Next Steps & Action Items** *(10 min)*
    1. Review new action items
    2. Assign ownership
    3. Set deadlines

## Discussion Points

### [Topic 1]
- **Discussion:** Key points discussed
- **Decisions Made:** 
    1. Decision 1 with rationale
        - Impact assessment
        - Implementation timeline
    2. Decision 2 with rationale
        - Resource requirements
        - Success metrics
- **Concerns Raised:** Any unresolved issues

### [Topic 2]
- **Discussion:** Key points discussed
- **Decisions Made:** 
    1. Decision 1 with rationale
- **Follow-up Required:** Next steps needed

## Action Items
| Action Item | Owner | Due Date | Priority | Status |
|-------------|-------|----------|----------|--------|
| [Specific action item] | [Name] | [Date] | [High/Medium/Low] | [Not Started] |
| [Specific action item] | [Name] | [Date] | [High/Medium/Low] | [Not Started] |
| [Specific action item] | [Name] | [Date] | [High/Medium/Low] | [Not Started] |

## Risks and Blockers
1. **Risk/Blocker 1**
    1. Description and impact
    2. Mitigation plan
    3. Owner and timeline
2. **Risk/Blocker 2**
    1. Description and impact
    2. Mitigation plan

## Next Meeting
**Date:** [Date]  
**Time:** [Time]  
**Location:** [Location]  
**Agenda Items:** 
1. Review action items from this meeting
2. [Planned agenda items]
    1. Sub-item details
    2. Required preparations

---
*Minutes prepared by: [Name]*  
*Document Status: [Draft/Final]*  
*Distribution: [List recipients]*`
      },

      proposal: {
        name: '💼 Project Proposal',
        description: 'Comprehensive project proposal template',
        category: 'business',
        content: `# Project Proposal: [Project Name]

## Executive Summary
Brief summary of the proposed project, its objectives, and expected outcomes.

## Problem Statement
Description of the problem this project aims to solve.
1. **Current State Analysis**
    1. Existing challenges
    2. Impact on business operations
    3. Cost of inaction
2. **Root Cause Analysis**
    1. Primary factors
    2. Contributing elements
    3. System dependencies
3. **Stakeholder Impact**
    1. Customer implications
    2. Internal team effects
    3. Partner/vendor considerations

## Proposed Solution
Detailed description of the proposed solution.
1. **Solution Overview**
    1. Core approach
    2. Key innovations
    3. Success criteria
2. **Technical Approach**
    1. Architecture design
        - System components
        - Integration points
        - Security considerations
    2. Technology stack
        - Frontend technologies
        - Backend systems
        - Database solutions
    3. Development methodology
        - Agile practices
        - Quality assurance
        - Testing strategies
3. **Implementation Strategy**
    1. Phased rollout plan
    2. Change management
    3. Training requirements

## Scope and Deliverables
1. **Phase 1: Foundation** (Weeks 1-4)
    1. Project setup and planning
        - Team formation
        - Environment setup
        - Documentation framework
    2. Requirements analysis
        - Stakeholder interviews
        - Technical specifications
        - Acceptance criteria
    3. Design and architecture
        - System design
        - UI/UX mockups
        - Database schema
2. **Phase 2: Development** (Weeks 5-12)
    1. Core functionality
    2. Integration components
    3. Testing and validation
3. **Phase 3: Deployment** (Weeks 13-16)
    1. Production setup
    2. User training
    3. Go-live support

## Timeline
| Phase | Duration | Key Deliverables | Milestones |
|-------|----------|------------------|------------|
| Phase 1 | 4 weeks | Requirements, Design | Requirements Approved |
| Phase 2 | 8 weeks | Core System, Testing | MVP Complete |
| Phase 3 | 4 weeks | Deployment, Training | Production Ready |

## Budget and Resources
1. **Human Resources**
    1. Development team
        - Project Manager (1.0 FTE)
        - Senior Developer (2.0 FTE)
        - UI/UX Designer (0.5 FTE)
    2. Support roles
        - Business Analyst (0.5 FTE)
        - QA Engineer (1.0 FTE)
        - DevOps Engineer (0.3 FTE)
2. **Technology Costs**
    1. Software licenses
    2. Cloud infrastructure
    3. Third-party services
3. **Total Budget Estimate**
    - Personnel: $[Amount]
    - Technology: $[Amount]
    - Contingency (10%): $[Amount]
    - **Total: $[Amount]**

## Risk Assessment
1. **Technical Risks**
    1. Integration complexity
        - Probability: Medium
        - Impact: High
        - Mitigation: Proof of concept development
    2. Performance requirements
        - Probability: Low
        - Impact: Medium
        - Mitigation: Load testing and optimization
2. **Business Risks**
    1. Stakeholder alignment
    2. Resource availability
    3. Market changes
3. **Mitigation Strategies**
    1. Regular stakeholder reviews
    2. Flexible architecture design
    3. Agile development approach

## Success Metrics
1. **Performance Metrics**
    1. System performance
        - Response time < 2 seconds
        - 99.9% uptime
        - Support for 1000+ concurrent users
    2. Business metrics
        - User adoption rate > 80%
        - Process efficiency improvement > 25%
        - Cost reduction > 15%
2. **Quality Metrics**
    1. Bug rate < 1% post-launch
    2. User satisfaction score > 4.5/5
    3. Training completion rate > 95%

## Conclusion
Summary and call to action for project approval.

---

*Proposal prepared by: [Your Name]*  
*Date: ${new Date().toLocaleDateString()}*  
*Status: [Draft/Under Review/Approved]*`
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
        description: 'Comprehensive step-by-step tutorial template',
        category: 'educational',
        content: `# Tutorial: [Topic Name]

## Introduction
What you'll learn in this tutorial and why it's important.

## Prerequisites
Before starting this tutorial, you should have:
1. **Basic Knowledge**
    1. Understanding of [concept 1]
    2. Familiarity with [concept 2]
    3. Experience with [tool/technology]
2. **Required Tools**
    1. Software installation
        - [Tool 1] version [X.X] or higher
        - [Tool 2] with [specific configuration]
        - Text editor or IDE
    2. Hardware requirements
        - Minimum [X]GB RAM
        - [X]GB available disk space
        - Internet connection
3. **Account Setup**
    1. Create account at [platform]
    2. Download required materials
    3. Verify installation

## Learning Objectives
By the end of this tutorial, you will be able to:
1. **Core Skills**
    1. [Skill 1] with confidence
    2. [Skill 2] following best practices
    3. [Skill 3] troubleshooting common issues
2. **Advanced Concepts**
    1. Apply [concept] in real-world scenarios
    2. Optimize for performance and security
    3. Extend functionality with custom solutions

## Step 1: Getting Started
Detailed instructions for the first step.

### 1.1 Initial Setup
1. Open your development environment
2. Create a new project
    1. Choose appropriate template
    2. Configure project settings
    3. Initialize version control
3. Verify everything is working

\`\`\`bash
# Example commands
mkdir tutorial-project
cd tutorial-project
git init
\`\`\`

### 1.2 Configuration
Configure your environment with these steps:
1. **Environment Variables**
    1. Set development variables
    2. Configure API keys
    3. Test connectivity
2. **Project Structure**
    1. Create folder hierarchy
    2. Set up configuration files
    3. Initialize documentation

## Step 2: [Core Implementation]
Detailed instructions for the main implementation.

### 2.1 Building the Foundation
1. **Create core files**
    1. Main application file
        - Import required libraries
        - Set up basic structure
        - Add error handling
    2. Configuration files
        - Database connections
        - API configurations
        - Environment settings
2. **Implement basic functionality**
    1. User interface components
    2. Business logic
    3. Data persistence

\`\`\`javascript
// Example code with explanation
function initializeApp() {
  // Initialize your application
  console.log('App initialized');
}
\`\`\`

> **Tip:** Always test each component as you build it to catch issues early.

### 2.2 Adding Advanced Features
1. **Enhanced functionality**
    1. User authentication
        - Login/logout system
        - Session management
        - Security measures
    2. Data validation
        - Input sanitization
        - Error handling
        - User feedback
2. **Performance optimization**
    1. Code optimization
    2. Database indexing
    3. Caching strategies

## Step 3: Testing and Validation
Comprehensive testing approach.

### 3.1 Unit Testing
1. **Test Setup**
    1. Install testing framework
    2. Configure test environment
    3. Create test data
2. **Write Tests**
    1. Function-level tests
        - Input validation
        - Output verification
        - Edge case handling
    2. Integration tests
        - Component interaction
        - API endpoints
        - Database operations

### 3.2 User Acceptance Testing
1. **Test Planning**
    1. Define test scenarios
    2. Create test data
    3. Prepare test environment
2. **Execute Tests**
    1. Functional testing
    2. Usability testing
    3. Performance testing

⚠️ **Warning:** Always backup your data before running tests that modify the database.

## Step 4: Deployment and Go-Live
Prepare for production deployment.

1. **Pre-deployment Checklist**
    1. Code review completed
    2. All tests passing
    3. Documentation updated
2. **Deployment Process**
    1. **Staging Environment**
        1. Deploy to staging
        2. Run smoke tests
        3. Stakeholder review
    2. **Production Deployment**
        1. Schedule maintenance window
        2. Deploy application
        3. Monitor system health
3. **Post-deployment Tasks**
    1. Monitor logs and metrics
    2. User training and support
    3. Gather feedback

## Troubleshooting
Common issues and their solutions:

### Problem 1: Installation Issues
**Symptoms:** Error messages during setup
**Possible Causes:**
1. Incompatible software versions
2. Missing dependencies
3. Permission issues

**Solutions:**
1. **Check Version Compatibility**
    1. Verify software versions
    2. Update to compatible versions
    3. Check release notes
2. **Install Dependencies**
    1. Install missing packages
    2. Update package managers
    3. Clear cache if needed

### Problem 2: Performance Issues
**Symptoms:** Slow response times, timeouts
**Solutions:**
1. **Database Optimization**
    1. Add appropriate indexes
    2. Optimize queries
    3. Implement caching
2. **Code Optimization**
    1. Profile application performance
    2. Optimize algorithms
    3. Reduce memory usage

### Problem 3: Connectivity Issues
**Symptoms:** Cannot connect to external services
**Solutions:**
1. Check network connectivity
2. Verify API keys and credentials
3. Review firewall settings

## Conclusion
Summary of what was accomplished and key takeaways.

## Next Steps
1. **Immediate Actions**
    1. Practice with different scenarios
    2. Experiment with advanced features
    3. Join community forums
2. **Advanced Learning**
    1. Explore related technologies
    2. Build more complex projects
    3. Consider certification programs
3. **Additional Resources**
    1. Official documentation: [link]
    2. Community tutorials: [link]
    3. Best practices guide: [link]

## Appendix
1. **Quick Reference**
    1. Key commands and shortcuts
    2. Configuration templates
    3. Troubleshooting checklist
2. **Additional Resources**
    1. Related tutorials
    2. Documentation links
    3. Community resources

---

*Tutorial created by: [Author Name]*  
*Last updated: ${new Date().toLocaleDateString()}*  
*Difficulty Level: [Beginner/Intermediate/Advanced]*`
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
      },

      todo: {
        name: '✅ To-Do List',
        description: 'Task management template',
        category: 'productivity',
        content: `# To-Do List

## 🎯 Today's Priorities
- [ ] [Critical task 1]
- [ ] [Critical task 2]

## 📋 Medium Priority
- [ ] [Important task 1]
- [ ] [Important task 2]

## 🔹 Low Priority
- [ ] [Nice to have task 1]

## ✅ Completed
- [x] [Completed task 1]`
      },

      featureDoc: {
        name: '🚀 Feature Documentation',
        description: 'Feature specification template',
        category: 'technical',
        content: `# Feature: [Feature Name]

## Overview
**Status**: [Planning/Development/Released]
**Owner**: [Team/Person]

## Summary
[Brief description of the feature]

## Requirements
1. [Requirement 1]
2. [Requirement 2]

## Implementation Plan
- [ ] [Task 1]
- [ ] [Task 2]`
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