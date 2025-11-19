# Visual Comparison Guide

This document provides a systematic approach to comparing the integrated Next.js application with the original frontend design to ensure pixel-perfect preservation.

**Requirements:** 11.1, 11.2, 11.4

## Comparison Methodology

### 1. Screenshot Comparison

**Tools:**
- Browser DevTools (F12)
- Screenshot extensions (Full Page Screen Capture)
- Image comparison tools (Beyond Compare, DiffChecker)

**Process:**
1. Take screenshots of original frontend (if available)
2. Take screenshots of integrated application
3. Compare side-by-side
4. Document differences

### 2. Visual Inspection

**Process:**
1. Open both applications side-by-side
2. Navigate through each page
3. Compare visual elements
4. Document discrepancies

### 3. Automated Visual Testing

**Tools:**
- Percy (visual regression testing)
- Chromatic (Storybook visual testing)
- BackstopJS (screenshot comparison)

## Page-by-Page Comparison

### Landing Page

**Elements to Compare:**

**Hero Section:**
- [ ] Heading text size and weight
- [ ] Gradient text effect
- [ ] Subheading text
- [ ] CTA button styling
- [ ] Background color
- [ ] Spacing and padding

**Features Section:**
- [ ] Feature card layout (3 columns)
- [ ] Icon size and color
- [ ] Card background and shadow
- [ ] Text alignment
- [ ] Spacing between cards

**Footer:**
- [ ] Footer layout
- [ ] Link colors
- [ ] Copyright text
- [ ] Social media icons

**Comparison Checklist:**
```
☐ Hero heading: Same size, weight, color
☐ Gradient effect: Identical gradient
☐ CTA buttons: Same size, color, hover effect
☐ Feature cards: Same layout and spacing
☐ Icons: Same size and color
☐ Footer: Same layout and content
```

### Authentication Page

**Elements to Compare:**

**Form Container:**
- [ ] Container width and centering
- [ ] Background color
- [ ] Border radius
- [ ] Shadow effect
- [ ] Padding

**Form Elements:**
- [ ] Input field styling
- [ ] Label positioning
- [ ] Button styling
- [ ] Link colors
- [ ] Error message styling

**Tab Navigation:**
- [ ] Tab button styling
- [ ] Active tab indicator
- [ ] Tab spacing

**Comparison Checklist:**
```
☐ Form container: Same dimensions and styling
☐ Input fields: Same height, border, focus state
☐ Labels: Same position and color
☐ Buttons: Same size, color, hover effect
☐ Tabs: Same styling and active state
☐ Error messages: Same color and position
```

### Dashboard Page

**Elements to Compare:**

**Summary Cards:**
- [ ] Card layout (4 columns)
- [ ] Card background and border
- [ ] Icon size and color
- [ ] Number font size
- [ ] Label text size
- [ ] Spacing

**Recent Applications:**
- [ ] Section heading
- [ ] List item styling
- [ ] Status badge styling
- [ ] Date formatting
- [ ] Hover effects

**Charts/Graphs:**
- [ ] Chart colors
- [ ] Legend styling
- [ ] Axis labels
- [ ] Grid lines

**Comparison Checklist:**
```
☐ Summary cards: Same layout and styling
☐ Card icons: Same size and color
☐ Numbers: Same font size and weight
☐ Recent list: Same item styling
☐ Status badges: Same colors
☐ Charts: Same colors and styling
```

### Applications List Page

**Elements to Compare:**

**Search and Filter Bar:**
- [ ] Search input styling
- [ ] Filter button styling
- [ ] View toggle buttons
- [ ] Spacing and alignment

**Application Cards:**
- [ ] Card dimensions
- [ ] Background and border
- [ ] Shadow effect
- [ ] Content layout
- [ ] Status badge position
- [ ] Action button styling
- [ ] Hover effect

**List View:**
- [ ] Row height
- [ ] Column widths
- [ ] Border styling
- [ ] Hover effect

**Pagination:**
- [ ] Button styling
- [ ] Active page indicator
- [ ] Spacing

**Comparison Checklist:**
```
☐ Search bar: Same styling and size
☐ Filter buttons: Same styling
☐ View toggle: Same styling
☐ Application cards: Same dimensions and layout
☐ Status badges: Same position and color
☐ Action buttons: Same styling
☐ Hover effects: Same animation
☐ Pagination: Same styling
```

### Application Details Page

**Elements to Compare:**

**Header Section:**
- [ ] Title size and weight
- [ ] Status badge styling
- [ ] Action buttons layout
- [ ] Spacing

**Details Section:**
- [ ] Label styling
- [ ] Value styling
- [ ] Section spacing
- [ ] Border styling

**Files Section:**
- [ ] File item styling
- [ ] Icon size
- [ ] Download button
- [ ] Spacing

**Notes Section:**
- [ ] Textarea styling
- [ ] Save button
- [ ] Spacing

**Comparison Checklist:**
```
☐ Page title: Same size and weight
☐ Status badge: Same styling
☐ Action buttons: Same layout and styling
☐ Detail labels: Same styling
☐ Detail values: Same styling
☐ File items: Same layout
☐ Notes section: Same styling
```

### Profile Page

**Elements to Compare:**

**Tab Navigation:**
- [ ] Tab button styling
- [ ] Active tab indicator
- [ ] Tab spacing

**Personal Info Tab:**
- [ ] Form layout
- [ ] Input styling
- [ ] Avatar upload area
- [ ] Save button

**Work Experience Tab:**
- [ ] List item styling
- [ ] Add button
- [ ] Edit/Delete buttons
- [ ] Date formatting

**Education Tab:**
- [ ] List item styling
- [ ] Add button
- [ ] Edit/Delete buttons

**Skills Tab:**
- [ ] Skill tag styling
- [ ] Add skill input
- [ ] Remove button

**Comparison Checklist:**
```
☐ Tabs: Same styling and active state
☐ Form inputs: Same styling
☐ Avatar area: Same styling
☐ List items: Same layout and styling
☐ Action buttons: Same styling
☐ Skill tags: Same styling
```

## Component-Level Comparison

### Button Component

**Variants to Compare:**
- [ ] Primary button
- [ ] Secondary button
- [ ] Danger button
- [ ] Icon button
- [ ] Loading state
- [ ] Disabled state

**Properties:**
- [ ] Height and padding
- [ ] Font size and weight
- [ ] Border radius
- [ ] Background color
- [ ] Text color
- [ ] Hover effect
- [ ] Active/pressed state
- [ ] Focus outline

### Input Component

**Variants to Compare:**
- [ ] Text input
- [ ] Email input
- [ ] Password input
- [ ] Textarea
- [ ] Select dropdown

**Properties:**
- [ ] Height and padding
- [ ] Font size
- [ ] Border color and width
- [ ] Border radius
- [ ] Background color
- [ ] Placeholder color
- [ ] Focus state
- [ ] Error state

### Card Component

**Properties:**
- [ ] Background color
- [ ] Border radius
- [ ] Shadow
- [ ] Padding
- [ ] Hover effect

### Status Badge Component

**Variants to Compare:**
- [ ] Applied badge
- [ ] Interview badge
- [ ] Offer badge
- [ ] Rejected badge
- [ ] Withdrawn badge

**Properties:**
- [ ] Background color
- [ ] Text color
- [ ] Font size
- [ ] Padding
- [ ] Border radius

### Modal Component

**Properties:**
- [ ] Modal width
- [ ] Background color
- [ ] Border radius
- [ ] Shadow
- [ ] Backdrop color and opacity
- [ ] Close button styling
- [ ] Header styling
- [ ] Footer button layout

### Toast Component

**Variants to Compare:**
- [ ] Success toast
- [ ] Error toast
- [ ] Info toast

**Properties:**
- [ ] Width
- [ ] Background color
- [ ] Text color
- [ ] Icon size and color
- [ ] Border radius
- [ ] Shadow
- [ ] Position

## Color Comparison

### Primary Colors

| Color Name | Expected Value | Actual Value | Match |
|------------|---------------|--------------|-------|
| Primary Blue | #2563EB | | ☐ |
| Primary Dark | #1E40AF | | ☐ |
| Primary Light | #DBEAFE | | ☐ |

### Status Colors

| Color Name | Expected Value | Actual Value | Match |
|------------|---------------|--------------|-------|
| Applied | #3B82F6 | | ☐ |
| Interview | #F59E0B | | ☐ |
| Offer | #10B981 | | ☐ |
| Rejected | #EF4444 | | ☐ |
| Withdrawn | #6B7280 | | ☐ |

### Neutral Colors (Light Mode)

| Color Name | Expected Value | Actual Value | Match |
|------------|---------------|--------------|-------|
| Background | #F9FAFB | | ☐ |
| Card Background | #FFFFFF | | ☐ |
| Border | #E5E7EB | | ☐ |
| Text Primary | #111827 | | ☐ |
| Text Secondary | #6B7280 | | ☐ |

### Neutral Colors (Dark Mode)

| Color Name | Expected Value | Actual Value | Match |
|------------|---------------|--------------|-------|
| Background | #111827 | | ☐ |
| Card Background | #1F2937 | | ☐ |
| Border | #374151 | | ☐ |
| Text Primary | #F9FAFB | | ☐ |
| Text Secondary | #9CA3AF | | ☐ |

## Typography Comparison

### Font Families

| Element | Expected Font | Actual Font | Match |
|---------|--------------|-------------|-------|
| Body Text | Inter, Roboto | | ☐ |
| Headings | Inter, Roboto | | ☐ |
| Code | Fira Code, JetBrains Mono | | ☐ |

### Font Sizes

| Element | Expected Size | Actual Size | Match |
|---------|--------------|-------------|-------|
| Display | 3rem (48px) | | ☐ |
| H1 | 2.25rem (36px) | | ☐ |
| H2 | 1.875rem (30px) | | ☐ |
| H3 | 1.5rem (24px) | | ☐ |
| H4 | 1.25rem (20px) | | ☐ |
| Body Large | 1.125rem (18px) | | ☐ |
| Body | 1rem (16px) | | ☐ |
| Body Small | 0.875rem (14px) | | ☐ |
| Caption | 0.75rem (12px) | | ☐ |

## Spacing Comparison

### Component Spacing

| Component | Expected Padding | Actual Padding | Match |
|-----------|-----------------|----------------|-------|
| Button | 12px 24px | | ☐ |
| Input | 12px 16px | | ☐ |
| Card | 24px | | ☐ |
| Modal | 32px | | ☐ |

### Layout Spacing

| Element | Expected Margin | Actual Margin | Match |
|---------|----------------|---------------|-------|
| Section | 48px | | ☐ |
| Card Grid Gap | 24px | | ☐ |
| Form Field | 16px | | ☐ |

## Border Radius Comparison

| Element | Expected Radius | Actual Radius | Match |
|---------|----------------|---------------|-------|
| Button | 8px | | ☐ |
| Input | 8px | | ☐ |
| Card | 12px | | ☐ |
| Modal | 16px | | ☐ |
| Badge | 6px | | ☐ |

## Shadow Comparison

| Element | Expected Shadow | Actual Shadow | Match |
|---------|----------------|---------------|-------|
| Card | 0 1px 3px rgba(0,0,0,0.1) | | ☐ |
| Card Hover | 0 4px 6px rgba(0,0,0,0.1) | | ☐ |
| Modal | 0 20px 25px rgba(0,0,0,0.15) | | ☐ |
| Dropdown | 0 10px 15px rgba(0,0,0,0.1) | | ☐ |

## Automated Comparison Tools

### Using Browser DevTools

```javascript
// Get computed styles
const element = document.querySelector('.button');
const styles = window.getComputedStyle(element);

console.log('Background:', styles.backgroundColor);
console.log('Color:', styles.color);
console.log('Padding:', styles.padding);
console.log('Border Radius:', styles.borderRadius);
console.log('Font Size:', styles.fontSize);
```

### Using Percy

```bash
# Install Percy
npm install --save-dev @percy/cli @percy/playwright

# Run visual tests
npx percy exec -- npx playwright test
```

### Using BackstopJS

```bash
# Install BackstopJS
npm install --save-dev backstopjs

# Initialize
npx backstop init

# Create reference screenshots
npx backstop reference

# Run comparison
npx backstop test
```

## Discrepancy Documentation

When you find differences, document them:

**Template:**
```markdown
### Discrepancy #1

**Location:** Dashboard > Summary Cards
**Element:** Card shadow
**Expected:** 0 1px 3px rgba(0,0,0,0.1)
**Actual:** 0 2px 4px rgba(0,0,0,0.15)
**Severity:** Minor
**Action Required:** Update shadow to match original
**Status:** ☐ Fixed ☐ Accepted ☐ Pending
```

## Sign-off

**Compared by:** _________________

**Date:** _________________

**Pages compared:**
- [ ] Landing page
- [ ] Auth page
- [ ] Dashboard
- [ ] Applications list
- [ ] Application details
- [ ] Profile page

**Components compared:**
- [ ] Buttons
- [ ] Inputs
- [ ] Cards
- [ ] Modals
- [ ] Toasts
- [ ] Status badges

**Discrepancies found:** _________________

**Status:** ☐ Pixel Perfect ☐ Minor Differences ☐ Major Differences

**Notes:**
_________________________________________________________________
_________________________________________________________________
