# Demo Entry Design

## Goal

Turn `demo.html` into the default launch entry for the Feiyi Gateway Debugging mini program.

## Experience

- Present one focused launch screen with the Feiyi logo, product name, and one primary action.
- The primary action is labeled `进入小程序` and opens `pages/tab-device-bt.html`.
- Do not expose model shortcuts, prototype notes, file paths, requirement descriptions, or implementation guidance.
- Keep the page visually consistent with the existing mobile mini-program UI while allowing it to fill desktop and mobile browser windows cleanly.
- Use restrained brand blue, white, and neutral grays. Avoid decorative gradients and oversized marketing composition.

## Responsive Behavior

- Desktop: center a compact mini-program launch surface in the viewport with clear product identity.
- Mobile: use the full viewport, preserve safe padding, and keep the primary action reachable near the lower portion of the screen.
- The longest visible text must fit without clipping or overlap.

## Verification

- `demo.html` must not redirect automatically.
- The only primary route must remain `pages/tab-device-bt.html`.
- The page must contain `进入小程序` and must not contain prototype-oriented copy.
- Existing UI regression checks must continue to pass.
