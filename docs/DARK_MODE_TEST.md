# Dark Mode Testing Guide

This document provides comprehensive testing procedures for dark mode functionality.

**Requirements:** 11.3

## Dark Mode Configuration

The application uses Tailwind CSS class-based dark mode:

```javascript
// tailwind.config.js
darkMode: 'class'
```

This means dark mode is activated by adding the `dark` class to the root HTML element.

## Testing Dark Mode Toggle

### Theme Toggle Functionality

1. **Initial State:**
   - [ ] Check system preference is detected
   - [ ] Theme matches system preference on first load
   - [ ] Theme preference is stored in localStorage

2. **Toggle Button:**
   - [ ] Toggle button is visible in header
   - [ ] Icon changes (sun ↔ moon)
   - [ ] Click toggles theme immediately
   - [ ] No flash of wrong theme

3. **Persistence:**
   - [ ] Theme preference persists after page reload
   - [ ] Theme preference persists across sessions
   - [ ] localStorage key is correct (`theme`)

### Testing Procedure

```bash
# 1. Open browser DevTools
# 2. Go to Application > Local Storage
# 3. Check for 'theme' key
# 4. Toggle theme and verify:
#    - localStorage updates
#    - HTML class changes
#    - UI updates immediately
```

## Color Validation in Dark Mode

### Background Colors

**Light Mode:**
- [ ] Page background: `#F9FAFB` (neutral-bg-light)
- [ ] Card background: `#FFFFFF` (white)
- [ ] Hover background: `#F3F4F6` (gray-100)

**Dark Mode:**
- [ ] Page background: `#111827` (neutral-bg-dark)
- [ ] Card background: `#1F2937` (neutral-surface-dark)
- [ ] Hover background: `#374151` (neutral-border-dark)

### Text Colors

**Light Mode:**
- [ ] Primary text: `#111827` (neutral-text-primary-light)
- [ ] Secondary text: `#6B7280` (neutral-gray)
- [ ] Muted text: `#9CA3AF` (gray-400)

**Dark Mode:**
- [ ] Primary text: `#F9FAFB` (neutral-text-primary-dark)
- [ ] Secondary text: `#9CA3AF` (neutral-text-secondary-dark)
- [ ] Muted text: `#6B7280` (neutral-gray)

### Border Colors

**Light Mode:**
- [ ] Default border: `#E5E7EB` (neutral-border-light)
- [ ] Focus border: `#2563EB` (primary-blue)

**Dark Mode:**
- [ ] Default border: `#374151` (neutral-border-dark)
- [ ] Focus border: `#2563EB` (primary-blue)

### Status Colors (Same in Both Modes)

- [ ] Applied: `#3B82F6` (blue)
- [ ] Interview: `#F59E0B` (amber)
- [ ] Offer: `#10B981` (green)
- [ ] Rejected: `#EF4444` (red)
- [ ] Withdrawn: `#6B7280` (gray)

## Component-Level Dark Mode Tests

### Header Component

**Light Mode:**
- [ ] White background
- [ ] Dark text
- [ ] Light border

**Dark Mode:**
- [ ] Dark background (#1F2937)
- [ ] Light text
- [ ] Dark border
- [ ] Logo is visible
- [ ] Icons are visible

### Sidebar Component

**Light Mode:**
- [ ] White background
- [ ] Dark text
- [ ] Light border
- [ ] Hover state is visible

**Dark Mode:**
- [ ] Dark background
- [ ] Light text
- [ ] Dark border
- [ ] Hover state is visible
- [ ] Active state is highlighted

### Button Component

**Primary Button - Light Mode:**
- [ ] Blue background (#2563EB)
- [ ] White text
- [ ] Darker blue on hover

**Primary Button - Dark Mode:**
- [ ] Blue background (#2563EB)
- [ ] White text
- [ ] Darker blue on hover
- [ ] Sufficient contrast

**Secondary Button - Light Mode:**
- [ ] White background
- [ ] Blue border
- [ ] Blue text

**Secondary Button - Dark Mode:**
- [ ] Dark background
- [ ] Blue border
- [ ] Blue text
- [ ] Visible border

### Card Component

**Light Mode:**
- [ ] White background
- [ ] Light shadow
- [ ] Dark text
- [ ] Light border

**Dark Mode:**
- [ ] Dark surface background (#1F2937)
- [ ] Subtle shadow
- [ ] Light text
- [ ] Dark border
- [ ] Hover effect visible

### Form Components

**Input Fields - Light Mode:**
- [ ] White background
- [ ] Dark text
- [ ] Light border
- [ ] Blue focus ring

**Input Fields - Dark Mode:**
- [ ] Dark background
- [ ] Light text
- [ ] Dark border
- [ ] Blue focus ring
- [ ] Placeholder is visible

**Select Dropdowns - Light Mode:**
- [ ] White background
- [ ] Dark text
- [ ] Light border

**Select Dropdowns - Dark Mode:**
- [ ] Dark background
- [ ] Light text
- [ ] Dark border
- [ ] Options are readable

### Modal Component

**Light Mode:**
- [ ] White background
- [ ] Dark text
- [ ] Semi-transparent backdrop

**Dark Mode:**
- [ ] Dark background
- [ ] Light text
- [ ] Semi-transparent backdrop
- [ ] Close button is visible

### Toast Notifications

**Success Toast - Light Mode:**
- [ ] Green background
- [ ] White text
- [ ] Checkmark icon visible

**Success Toast - Dark Mode:**
- [ ] Green background
- [ ] White text
- [ ] Checkmark icon visible
- [ ] Sufficient contrast

**Error Toast - Light Mode:**
- [ ] Red background
- [ ] White text
- [ ] X icon visible

**Error Toast - Dark Mode:**
- [ ] Red background
- [ ] White text
- [ ] X icon visible
- [ ] Sufficient contrast

### Status Badge Component

Test all status badges in both modes:

**Light Mode:**
- [ ] Applied badge: Blue background, white text
- [ ] Interview badge: Amber background, white text
- [ ] Offer badge: Green background, white text
- [ ] Rejected badge: Red background, white text
- [ ] Withdrawn badge: Gray background, white text

**Dark Mode:**
- [ ] All badges maintain same colors
- [ ] Text remains readable
- [ ] Sufficient contrast maintained

## Page-Level Dark Mode Tests

### Landing Page

**Light Mode:**
- [ ] Hero section is readable
- [ ] Feature cards have white background
- [ ] Text is dark
- [ ] CTA buttons are prominent

**Dark Mode:**
- [ ] Hero section is readable
- [ ] Feature cards have dark background
- [ ] Text is light
- [ ] CTA buttons are prominent
- [ ] Gradient text is visible

### Auth Page

**Light Mode:**
- [ ] Form has white background
- [ ] Inputs are readable
- [ ] Links are visible

**Dark Mode:**
- [ ] Form has dark background
- [ ] Inputs are readable
- [ ] Links are visible
- [ ] Focus states work

### Dashboard Page

**Light Mode:**
- [ ] Summary cards are white
- [ ] Charts are readable
- [ ] Recent applications list is clear

**Dark Mode:**
- [ ] Summary cards are dark
- [ ] Charts adapt to dark mode
- [ ] Recent applications list is clear
- [ ] All text is readable

### Applications List Page

**Light Mode:**
- [ ] Search bar is white
- [ ] Filter buttons are visible
- [ ] Application cards are white
- [ ] Status badges are visible

**Dark Mode:**
- [ ] Search bar is dark
- [ ] Filter buttons are visible
- [ ] Application cards are dark
- [ ] Status badges are visible
- [ ] All interactive elements work

### Application Details Page

**Light Mode:**
- [ ] Details section is readable
- [ ] File attachments are visible
- [ ] Notes section is clear

**Dark Mode:**
- [ ] Details section is readable
- [ ] File attachments are visible
- [ ] Notes section is clear
- [ ] Edit button is visible

### Profile Page

**Light Mode:**
- [ ] Tabs are visible
- [ ] Forms are readable
- [ ] Lists are clear

**Dark Mode:**
- [ ] Tabs are visible
- [ ] Forms are readable
- [ ] Lists are clear
- [ ] All sections adapt properly

## Contrast Ratio Testing

Use browser DevTools or online tools to verify contrast ratios meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

### Light Mode Contrast

- [ ] Primary text on background: ≥ 4.5:1
- [ ] Secondary text on background: ≥ 4.5:1
- [ ] Button text on button background: ≥ 4.5:1
- [ ] Link text on background: ≥ 4.5:1

### Dark Mode Contrast

- [ ] Primary text on background: ≥ 4.5:1
- [ ] Secondary text on background: ≥ 4.5:1
- [ ] Button text on button background: ≥ 4.5:1
- [ ] Link text on background: ≥ 4.5:1

## Icon Visibility

### Light Mode
- [ ] All icons are visible
- [ ] Icon colors are appropriate
- [ ] Hover states work

### Dark Mode
- [ ] All icons are visible
- [ ] Icon colors adapt to dark mode
- [ ] Hover states work
- [ ] No invisible icons

## Image Handling

- [ ] Images are visible in both modes
- [ ] Image borders adapt to theme
- [ ] Image shadows adapt to theme
- [ ] No jarring bright images in dark mode

## Animation and Transition

- [ ] Theme transition is smooth
- [ ] No flash of wrong theme
- [ ] Animations work in both modes
- [ ] Hover effects work in both modes

## Browser Testing

Test dark mode in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## System Preference Detection

### macOS/Windows

1. **Enable system dark mode:**
   - [ ] App detects and applies dark mode
   - [ ] No manual toggle needed

2. **Disable system dark mode:**
   - [ ] App detects and applies light mode
   - [ ] No manual toggle needed

3. **Manual override:**
   - [ ] User can override system preference
   - [ ] Manual preference persists

### Testing Code

```javascript
// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log('System prefers dark mode:', prefersDark);

// Check current theme
const currentTheme = localStorage.getItem('theme');
console.log('Current theme:', currentTheme);

// Check HTML class
const isDarkMode = document.documentElement.classList.contains('dark');
console.log('Dark mode active:', isDarkMode);
```

## Common Dark Mode Issues

### Issue: Flash of Wrong Theme
- [ ] Verify theme is applied before render
- [ ] Check script in HTML head
- [ ] Verify localStorage is read early

### Issue: Inconsistent Colors
- [ ] Check all components use dark: classes
- [ ] Verify Tailwind config is correct
- [ ] Check for hardcoded colors

### Issue: Poor Contrast
- [ ] Use contrast checker tool
- [ ] Adjust colors if needed
- [ ] Test with actual users

### Issue: Icons Not Visible
- [ ] Check icon colors
- [ ] Use currentColor where appropriate
- [ ] Test all icon states

## Automated Testing

```typescript
// Example dark mode test
test('dark mode toggle works', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Check initial state
  const html = page.locator('html');
  const initialTheme = await html.getAttribute('class');
  
  // Toggle theme
  await page.click('[data-testid="theme-toggle"]');
  
  // Verify theme changed
  const newTheme = await html.getAttribute('class');
  expect(newTheme).not.toBe(initialTheme);
  
  // Verify localStorage
  const theme = await page.evaluate(() => localStorage.getItem('theme'));
  expect(theme).toBeTruthy();
});
```

## Sign-off

**Tested by:** _________________

**Date:** _________________

**Browsers tested:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Issues found:** _________________

**Status:** ☐ Pass ☐ Fail ☐ Needs Review
