# Responsive Design Testing Guide

This document provides detailed instructions for testing responsive design across different device sizes.

**Requirements:** 11.4, 11.5

## Testing Breakpoints

The application uses the following Tailwind CSS breakpoints:

| Breakpoint | Min Width | Device Type | Test Resolution |
|------------|-----------|-------------|-----------------|
| `sm` | 640px | Large phones | 640x1136 |
| `md` | 768px | Tablets | 768x1024 |
| `lg` | 1024px | Small laptops | 1024x768 |
| `xl` | 1280px | Desktops | 1280x720 |
| `2xl` | 1536px | Large desktops | 1920x1080 |

## Browser DevTools Testing

### Chrome DevTools

1. Open Chrome DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Test the following preset devices:
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - iPad Pro (1024x1366)
   - Desktop (1920x1080)

### Firefox Responsive Design Mode

1. Open Firefox DevTools (F12)
2. Click the Responsive Design Mode icon (Ctrl+Shift+M)
3. Test custom dimensions:
   - 375px (Mobile)
   - 640px (Large Mobile)
   - 768px (Tablet)
   - 1024px (Desktop)
   - 1920px (Large Desktop)

## Component-Level Responsive Tests

### Header Component

**Mobile (< 640px):**
- [ ] Logo is visible and appropriately sized
- [ ] Navigation collapses to hamburger menu
- [ ] Menu icon is visible and clickable
- [ ] Mobile menu slides in from side
- [ ] User menu is accessible

**Tablet (640px - 1024px):**
- [ ] Logo and navigation visible
- [ ] Navigation items may wrap or condense
- [ ] User menu is accessible

**Desktop (> 1024px):**
- [ ] Full navigation menu visible
- [ ] All menu items displayed horizontally
- [ ] User dropdown works correctly

### Sidebar Component

**Mobile (< 1024px):**
- [ ] Sidebar is hidden by default
- [ ] Toggle button is visible
- [ ] Sidebar slides in as overlay
- [ ] Backdrop closes sidebar
- [ ] Content is not pushed

**Desktop (> 1024px):**
- [ ] Sidebar is always visible
- [ ] Content area adjusts width
- [ ] Sidebar can be collapsed
- [ ] Icons remain visible when collapsed

### Application Cards

**Mobile (< 640px):**
- [ ] Cards stack vertically (1 column)
- [ ] Full width with proper padding
- [ ] All information is readable
- [ ] Actions are accessible

**Tablet (640px - 1024px):**
- [ ] Cards display in 2 columns
- [ ] Proper gap between cards
- [ ] Content doesn't overflow

**Desktop (> 1024px):**
- [ ] Cards display in 3+ columns
- [ ] Optimal card width maintained
- [ ] Hover effects work

### Forms

**Mobile (< 640px):**
- [ ] Inputs are full width
- [ ] Labels are above inputs
- [ ] Buttons are full width
- [ ] Touch targets are 44x44px minimum

**Tablet & Desktop:**
- [ ] Forms have max-width constraint
- [ ] Multi-column layouts work
- [ ] Inline labels work where appropriate

## Page-Level Responsive Tests

### Landing Page

**Mobile:**
- [ ] Hero section is readable
- [ ] CTA buttons are prominent
- [ ] Feature cards stack vertically
- [ ] Images scale appropriately
- [ ] Footer is accessible

**Tablet:**
- [ ] Hero section uses more space
- [ ] Feature cards in 2 columns
- [ ] Navigation is accessible

**Desktop:**
- [ ] Hero section is full-width
- [ ] Feature cards in 3 columns
- [ ] All content is optimally spaced

### Dashboard Page

**Mobile:**
- [ ] Summary cards stack vertically
- [ ] Charts are scrollable if needed
- [ ] Recent applications list is readable
- [ ] Quick actions are accessible

**Tablet:**
- [ ] Summary cards in 2 columns
- [ ] Charts display properly
- [ ] Sidebar can be toggled

**Desktop:**
- [ ] Summary cards in 4 columns
- [ ] Full dashboard layout visible
- [ ] Sidebar always visible
- [ ] Charts use available space

### Applications List Page

**Mobile:**
- [ ] Search bar is full width
- [ ] Filters collapse to dropdown
- [ ] List view is default
- [ ] Cards stack vertically
- [ ] Pagination is accessible

**Tablet:**
- [ ] Search and filters in row
- [ ] Grid view shows 2 columns
- [ ] Pagination is visible

**Desktop:**
- [ ] Full filter bar visible
- [ ] Grid view shows 3+ columns
- [ ] All controls accessible
- [ ] Optimal layout

### Application Details Page

**Mobile:**
- [ ] All sections stack vertically
- [ ] Action buttons are accessible
- [ ] File attachments are visible
- [ ] Edit modal is full-screen

**Tablet:**
- [ ] Two-column layout possible
- [ ] Modals are centered
- [ ] All content is accessible

**Desktop:**
- [ ] Optimal reading width
- [ ] Sidebar with quick actions
- [ ] Modals are appropriately sized

### Profile Page

**Mobile:**
- [ ] Tabs are scrollable
- [ ] Forms are full width
- [ ] CV upload is accessible
- [ ] Lists are readable

**Tablet:**
- [ ] Tabs display in row
- [ ] Forms have max-width
- [ ] Two-column layouts work

**Desktop:**
- [ ] Full tab navigation
- [ ] Optimal form width
- [ ] Side-by-side layouts

## Touch Target Testing (Mobile)

All interactive elements should meet minimum touch target size:

- [ ] Buttons: 44x44px minimum
- [ ] Links: 44x44px minimum
- [ ] Form inputs: 44px height minimum
- [ ] Icons: 44x44px minimum
- [ ] Checkboxes/Radio: 44x44px minimum

## Orientation Testing

Test both portrait and landscape orientations on mobile devices:

**Portrait:**
- [ ] Content is readable
- [ ] Navigation is accessible
- [ ] Forms work correctly

**Landscape:**
- [ ] Layout adapts appropriately
- [ ] Content doesn't overflow
- [ ] Navigation remains accessible

## Text Readability

**Mobile:**
- [ ] Minimum font size: 16px (prevents zoom on iOS)
- [ ] Line height: 1.5 minimum
- [ ] Paragraph width: readable
- [ ] Contrast ratio: 4.5:1 minimum

**Tablet & Desktop:**
- [ ] Optimal line length: 50-75 characters
- [ ] Proper heading hierarchy
- [ ] Adequate spacing between sections

## Image and Media Responsiveness

- [ ] Images scale proportionally
- [ ] Images don't overflow containers
- [ ] Images have appropriate resolution
- [ ] Videos are responsive
- [ ] Icons scale appropriately

## Performance on Mobile

- [ ] Page loads in < 3 seconds on 3G
- [ ] Images are optimized
- [ ] No layout shift during load
- [ ] Smooth scrolling
- [ ] Animations are performant

## Common Responsive Issues to Check

### Horizontal Scrolling
- [ ] No horizontal scrollbar on any page
- [ ] Content fits within viewport
- [ ] Tables are scrollable or responsive

### Text Overflow
- [ ] Long words break appropriately
- [ ] Text doesn't overflow containers
- [ ] Ellipsis used where appropriate

### Fixed Elements
- [ ] Fixed headers don't cover content
- [ ] Fixed footers work correctly
- [ ] Modals are properly positioned

### Z-Index Issues
- [ ] Overlays appear above content
- [ ] Dropdowns appear above other elements
- [ ] Modals appear above everything

## Testing Checklist by Device

### iPhone SE (375px)
- [ ] Landing page
- [ ] Auth page
- [ ] Dashboard
- [ ] Applications list
- [ ] Application details
- [ ] Profile page

### iPad (768px)
- [ ] Landing page
- [ ] Auth page
- [ ] Dashboard
- [ ] Applications list
- [ ] Application details
- [ ] Profile page

### Desktop (1920px)
- [ ] Landing page
- [ ] Auth page
- [ ] Dashboard
- [ ] Applications list
- [ ] Application details
- [ ] Profile page

## Automated Responsive Testing

You can use the following tools for automated testing:

### Playwright (Recommended)

```typescript
// Example responsive test
test('dashboard is responsive', async ({ page }) => {
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/dashboard');
  await expect(page.locator('.sidebar')).toBeHidden();
  
  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page.locator('.sidebar')).toBeVisible();
});
```

### Manual Testing Script

```bash
# Test different viewport sizes
npm run dev

# Then in browser console:
# Mobile
window.resizeTo(375, 667)

# Tablet
window.resizeTo(768, 1024)

# Desktop
window.resizeTo(1920, 1080)
```

## Sign-off

**Tested by:** _________________

**Date:** _________________

**Devices tested:**
- [ ] iPhone SE
- [ ] iPhone 12 Pro
- [ ] iPad
- [ ] iPad Pro
- [ ] Desktop (1920x1080)

**Issues found:** _________________

**Status:** ☐ Pass ☐ Fail ☐ Needs Review
