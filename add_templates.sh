#!/bin/bash

# Add the new templates before the closing brace
sed -i '992i\      },\
\
      todo: {\
        name: '\''✅ To-Do List'\'',\
        description: '\''Task management template'\'',\
        category: '\''productivity'\'',\
        content: `# To-Do List\
\
## 🎯 Today'\''s Priorities\
- [ ] [Critical task 1]\
- [ ] [Critical task 2]\
\
## 📋 Medium Priority\
- [ ] [Important task 1]\
- [ ] [Important task 2]\
\
## 🔹 Low Priority\
- [ ] [Nice to have task 1]\
\
## ✅ Completed\
- [x] [Completed task 1]`\
      },\
\
      featureDoc: {\
        name: '\''🚀 Feature Documentation'\'',\
        description: '\''Feature specification template'\'',\
        category: '\''technical'\'',\
        content: `# Feature: [Feature Name]\
\
## Overview\
**Status**: [Planning/Development/Released]\
**Owner**: [Team/Person]\
\
## Summary\
[Brief description of the feature]\
\
## Requirements\
1. [Requirement 1]\
2. [Requirement 2]\
\
## Implementation Plan\
- [ ] [Task 1]\
- [ ] [Task 2]`' js/document-templates.js

