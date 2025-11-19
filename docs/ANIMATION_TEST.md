# Animation and Transition Testing Guide

This document provides comprehensive testing procedures for all animations and transitions in the application.

**Requirements:** 11.2, 11.5

## Animation Inventory

The application includes the following animations defined in `app/globals.css`:

1. **fade-in-scale** - Modal and dropdown entrance
2. **slide-in-right** - Toast notification entrance
3. **fade-in** - General fade-in effect
4. **shimmer** - Loading skeleton animation
5. **animate-on-scroll** - Landing page scroll animations

## Animation Specifications

### 1. Fade In Scale

**Purpose:** Smooth entrance for modals and dropdowns

**Specification:**
- Duration: 0.2s
- Easing: ease-out
- Transform: scale(0.95) → scale(1)
- Opacity: 0 → 1

**Test Cases:**
- [ ] Modal opens with fade-in-scale
- [ ] Dropdown menus use fade-in-scale
- [ ] Animation completes in 0.2s
- [ ] No jank or stuttering
- [ ] Works in both light and dark mode

**Testing Procedure:**
```javascript
// Open DevTools > Performance
// Record while opening modal
// Check animation duration and smoothness
```

### 2. Slide In Right

**Purpose:** Toast notification entrance

**Specification:**
- Duration: 0.3s
- Easing: ease-out
- Transform: translateX(100%) → translateX(0)
- Opacity: 0 → 1

**Test Cases:**
- [ ] Toast slides in from right
- [ ] Animation completes in 0.3s
- [ ] Multiple toasts stack correctly
- [ ] No layout shift during animation
- [ ] Works on mobile devices

**Testing Procedure:**
```javascript
// Trigger success/error toast
// Observe slide-in animation
// Check timing and smoothness
```

### 3. Fade In

**Purpose:** General fade-in effect for page transitions

**Specification:**
- Duration: 0.2s
- Easing: ease-out
- Opacity: 0 → 1

**Test Cases:**
- [ ] Page content fades in on load
- [ ] Animation is subtle and smooth
- [ ] No flash of unstyled content
- [ ] Works on all pages

### 4. Shimmer

**Purpose:** Loading skeleton animation

**Specification:**
- Duration: 2s
- Easing: linear
- Iteration: infinite
- Background: Gradient animation

**Test Cases:**
- [ ] Shimmer effect is visible
- [ ] Animation loops smoothly
- [ ] Gradient moves left to right
- [ ] Works in dark mode
- [ ] Stops when content loads

**Testing Procedure:**
```javascript
// Throttle network to Slow 3G
// Observe loading skeletons
// Verify shimmer animation
```

### 5. Animate On Scroll

**Purpose:** Landing page scroll animations

**Specification:**
- Initial: opacity: 0, translateY(20px)
- Final: opacity: 1, translateY(0)
- Duration: 0.6s
- Easing: ease-out

**Test Cases:**
- [ ] Elements are hidden initially
- [ ] Elements animate when scrolled into view
- [ ] Animation triggers at correct scroll position
- [ ] Works on mobile devices
- [ ] No performance issues

## Component-Level Animation Tests

### Modal Animations

**Open Animation:**
- [ ] Modal fades in with scale effect
- [ ] Backdrop fades in simultaneously
- [ ] Animation is smooth (60fps)
- [ ] Duration: 0.2s

**Close Animation:**
- [ ] Modal fades out with scale effect
- [ ] Backdrop fades out simultaneously
- [ ] Animation is smooth
- [ ] Duration: 0.2s

**Test Components:**
- [ ] AddApplicationModal
- [ ] EditApplicationModal
- [ ] Delete confirmation modal

### Dropdown Animations

**Open Animation:**
- [ ] Dropdown fades in with scale
- [ ] Origin point is correct (top-right for user menu)
- [ ] Animation is smooth
- [ ] Duration: 0.2s

**Close Animation:**
- [ ] Dropdown fades out
- [ ] No layout shift
- [ ] Animation is smooth

**Test Components:**
- [ ] User menu dropdown
- [ ] Filter dropdowns
- [ ] Status filter dropdown

### Toast Animations

**Enter Animation:**
- [ ] Toast slides in from right
- [ ] Opacity fades in
- [ ] Duration: 0.3s
- [ ] Smooth motion

**Exit Animation:**
- [ ] Toast fades out
- [ ] Other toasts adjust position smoothly
- [ ] Duration: 0.2s

**Auto-dismiss:**
- [ ] Toast stays for 5 seconds
- [ ] Progress bar animates (if present)
- [ ] Dismisses automatically

**Test Scenarios:**
- [ ] Single toast
- [ ] Multiple toasts (stacking)
- [ ] Rapid toast creation
- [ ] Manual dismiss

### Button Animations

**Hover Animation:**
- [ ] Background color transitions smoothly
- [ ] Duration: 0.15s
- [ ] Easing: ease-in-out

**Active/Press Animation:**
- [ ] Scale down slightly (0.98)
- [ ] Immediate response
- [ ] Returns to normal on release

**Loading State:**
- [ ] Spinner rotates smoothly
- [ ] Button text fades out
- [ ] Spinner fades in
- [ ] Smooth transition

**Test Buttons:**
- [ ] Primary buttons
- [ ] Secondary buttons
- [ ] Danger buttons
- [ ] Icon buttons

### Card Animations

**Hover Animation:**
- [ ] Shadow increases smoothly
- [ ] Slight scale up (1.02)
- [ ] Duration: 0.2s
- [ ] Easing: ease-out

**Test Cards:**
- [ ] Application cards
- [ ] Summary cards
- [ ] Feature cards (landing page)

### Page Transition Animations

**Page Load:**
- [ ] Content fades in
- [ ] No flash of unstyled content
- [ ] Smooth appearance
- [ ] Duration: 0.2s

**Route Change:**
- [ ] Old content fades out
- [ ] New content fades in
- [ ] No layout shift
- [ ] Smooth transition

**Test Pages:**
- [ ] Dashboard → Applications
- [ ] Applications → Application Details
- [ ] Dashboard → Profile
- [ ] Any page → Auth (logout)

## Performance Testing

### Frame Rate

All animations should maintain 60fps:

**Testing Procedure:**
1. Open Chrome DevTools
2. Go to Performance tab
3. Enable "Screenshots" and "Memory"
4. Record while triggering animations
5. Check FPS counter

**Acceptance Criteria:**
- [ ] Modal animations: 60fps
- [ ] Toast animations: 60fps
- [ ] Scroll animations: 60fps
- [ ] Hover effects: 60fps
- [ ] No dropped frames

### Animation Performance Metrics

**Metrics to Check:**
- [ ] No layout thrashing
- [ ] No forced reflows
- [ ] GPU acceleration used (transform/opacity)
- [ ] No main thread blocking
- [ ] Smooth on low-end devices

### Mobile Performance

**Test on:**
- [ ] iPhone SE (older device)
- [ ] Mid-range Android
- [ ] iPad

**Criteria:**
- [ ] Animations are smooth
- [ ] No jank or stuttering
- [ ] Touch interactions are responsive
- [ ] No performance degradation

## Accessibility Testing

### Reduced Motion

Users with motion sensitivity should have animations reduced:

**Testing Procedure:**
```css
/* Check for prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Test Cases:**
- [ ] Enable reduced motion in OS settings
- [ ] Animations are instant or removed
- [ ] Functionality still works
- [ ] No broken layouts

**Operating Systems:**
- [ ] macOS: System Preferences > Accessibility > Display > Reduce motion
- [ ] Windows: Settings > Ease of Access > Display > Show animations
- [ ] iOS: Settings > Accessibility > Motion > Reduce Motion
- [ ] Android: Settings > Accessibility > Remove animations

### Focus Indicators

**Test Cases:**
- [ ] Focus indicators animate smoothly
- [ ] Visible during animation
- [ ] No lost focus during transitions
- [ ] Keyboard navigation works during animations

## Browser Compatibility

Test animations in:

### Chrome
- [ ] All animations work
- [ ] 60fps maintained
- [ ] No visual glitches

### Firefox
- [ ] All animations work
- [ ] 60fps maintained
- [ ] No visual glitches

### Safari
- [ ] All animations work
- [ ] 60fps maintained
- [ ] No visual glitches
- [ ] iOS Safari works

### Edge
- [ ] All animations work
- [ ] 60fps maintained
- [ ] No visual glitches

## Common Animation Issues

### Issue: Janky Animations

**Symptoms:**
- Stuttering or dropped frames
- Inconsistent timing

**Checks:**
- [ ] Using transform/opacity (GPU accelerated)
- [ ] Not animating width/height/top/left
- [ ] No layout recalculations during animation
- [ ] No heavy JavaScript during animation

### Issue: Animation Delay

**Symptoms:**
- Animation starts late
- Feels unresponsive

**Checks:**
- [ ] No blocking JavaScript
- [ ] CSS animations (not JS)
- [ ] Proper event handling
- [ ] No network requests blocking

### Issue: Layout Shift

**Symptoms:**
- Content jumps during animation
- Other elements move unexpectedly

**Checks:**
- [ ] Fixed dimensions where needed
- [ ] Proper positioning (absolute/fixed)
- [ ] No margin/padding changes
- [ ] Proper z-index

### Issue: Flash of Content

**Symptoms:**
- Content appears before animation
- Wrong state visible briefly

**Checks:**
- [ ] Initial state is set in CSS
- [ ] Animation class applied immediately
- [ ] No race conditions
- [ ] Proper loading states

## Automated Animation Testing

```typescript
// Example animation test
test('modal animates on open', async ({ page }) => {
  await page.goto('/applications');
  
  // Click add button
  await page.click('[data-testid="add-application"]');
  
  // Wait for modal to appear
  const modal = page.locator('[data-testid="add-modal"]');
  await expect(modal).toBeVisible();
  
  // Check animation class
  const hasAnimation = await modal.evaluate(el => 
    el.classList.contains('animate-fade-in-scale')
  );
  expect(hasAnimation).toBe(true);
  
  // Wait for animation to complete
  await page.waitForTimeout(200);
  
  // Verify modal is fully visible
  const opacity = await modal.evaluate(el => 
    window.getComputedStyle(el).opacity
  );
  expect(opacity).toBe('1');
});
```

## Visual Regression Testing

Use tools like Percy or Chromatic to capture screenshots:

**Test Scenarios:**
- [ ] Modal open state
- [ ] Toast notification
- [ ] Hover states
- [ ] Loading states
- [ ] Page transitions

## Manual Testing Checklist

### Quick Test (5 minutes)

- [ ] Open a modal - check fade-in-scale
- [ ] Trigger a toast - check slide-in-right
- [ ] Hover over cards - check hover effects
- [ ] Navigate between pages - check transitions
- [ ] Scroll landing page - check scroll animations

### Comprehensive Test (30 minutes)

- [ ] Test all modals
- [ ] Test all dropdowns
- [ ] Test all toast types
- [ ] Test all button states
- [ ] Test all card hovers
- [ ] Test all page transitions
- [ ] Test loading states
- [ ] Test on mobile
- [ ] Test with reduced motion
- [ ] Test in all browsers

## Performance Benchmarks

**Target Metrics:**
- Modal open: < 200ms
- Toast appear: < 300ms
- Hover effect: < 150ms
- Page transition: < 200ms
- Scroll animation: < 600ms

**Measurement:**
```javascript
// Measure animation duration
const start = performance.now();
// Trigger animation
element.classList.add('animate-fade-in-scale');
// Wait for animation end
element.addEventListener('animationend', () => {
  const duration = performance.now() - start;
  console.log('Animation duration:', duration, 'ms');
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

**Devices tested:**
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

**Performance:**
- [ ] All animations 60fps
- [ ] No jank or stuttering
- [ ] Smooth on mobile

**Accessibility:**
- [ ] Reduced motion works
- [ ] Focus indicators visible
- [ ] Keyboard navigation works

**Issues found:** _________________

**Status:** ☐ Pass ☐ Fail ☐ Needs Review
