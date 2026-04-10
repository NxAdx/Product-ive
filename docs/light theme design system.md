## 2. Color & Atmospheric Theory
Our palette is rooted in a white foundation, punctuated by "Kinetic" accents that represent different states: Action (Orange), Logic (Blue), and Synthesis (Purple).

### The "No-Line" Rule
**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning or containment. 
Structure is defined solely through background shifts. Use the `surface-container` tiers to create hierarchy. A `surface-container-lowest` card (#ffffff) should sit atop a `surface-container-low` (#f2f4f7) section to create a soft, natural edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers. 
- **Base Layer:** `background` (#f7f9fc)
- **Sectional Foundations:** `surface-container-low` (#f2f4f7)
- **Active Interactive Elements:** `surface-container-lowest` (#ffffff)
- **Deep Insets (Data Tables/Inputs):** `surface-container-high` (#e6e8eb)

### The "Glass & Gradient" Rule
Floating elements (Modals, Hover Menus, Navigation Bars) must utilize **Glassmorphism**. Use a 60% opacity on your surface color with a `24px` backdrop-blur. 
- **Liquid Gradients:** For data visualization and charts, use vertical gradients transitioning from `primary` (#a93102) to `primary-container` (#cb491d). This mimics "tube-lit" liquids, giving the data a physical, translucent quality.

---

## 3. Typography: The Editorial Authority
The typography bridges the gap between human readability and machine-grade precision.

- **Display & Headlines (Manrope Bold/Wide):** These are your "specimen labels." Use `display-lg` and `headline-lg` with generous tracking (letter-spacing) to command the page. Manrope’s wide stance provides an authoritative, modern-industrial feel.
- **Body & Labels (Inter Medium):** Inter provides the "diagnostic" clarity required for high-density information. By using the `Medium` weight (500) as the default for body text, we ensure legibility against the clinical white backgrounds without needing high-contrast black.
- **Visual Hierarchy:** Use `label-sm` in all-caps with `0.05em` tracking for metadata to mimic laboratory serialized tags.

---

## 4. Elevation & Depth: Tonal Layering
In this system, "Up" is not indicated by a shadow, but by a shift toward pure white (`#ffffff`). 

### The Layering Principle
Depth is achieved by "stacking" tones. 
1. **Level 0 (Floor):** `surface-dim` (#d8dadd) - used for global footers or recessed backgrounds.
2. **Level 1 (Foundation):** `surface` (#f7f9fc) - the default canvas.
3. **Level 2 (Elevated):** `surface-container-lowest` (#ffffff) - cards and primary content blocks.

### Ambient Shadows
When a component must float (e.g., a critical diagnostic popover), use a "Biological Shadow":
- **Blur:** 40px to 60px.
- **Opacity:** 4% - 6%.
- **Color:** Use `surface-tint` (#ad3305) at 5% opacity instead of grey to simulate ambient light refraction within the lab.

### The "Ghost Border" Fallback
If accessibility requirements demand a container boundary, use the **Ghost Border**: `outline-variant` (#e1bfb6) at **15% opacity**. Never use a 100% opaque stroke.

---

## 5. Component Logic

### Buttons (The Kinetic Pill)
- **Shape:** Full Pill (`rounded-full`).
- **Primary:** `primary` (#a93102) background with `on-primary` (#ffffff) text. No shadow.
- **Secondary:** `secondary-container` (#5e65e8) with a glass effect.
- **Interaction:** On hover, the button should not get darker; it should increase in "glow" (slight opacity increase or a subtle `primary-fixed` halo).

### Cards (The Specimen Container)
- **Radius:** `lg` (2rem / 24px) for all primary containers.
- **Structure:** No dividers. Separate header, body, and footer using `24px` to `32px` of vertical padding. 
- **Background:** Always `surface-container-lowest` (#ffffff) to "pop" against the clinical base.

### Input Fields (The Data Portal)
- **Style:** Background-filled using `surface-container-high` (#e6e8eb). 
- **Radius:** `md` (1.5rem).
- **Active State:** A subtle `2px` inner glow of `secondary` (#444bce) rather than an outside stroke.

### Specialized Component: The "Bio-Chart"
Charts should never be flat lines. Use a `4px` stroke width with a vertical gradient. The area fill beneath the line should use the **Glassmorphism rule**: 20% opacity of the accent color with a background blur, making the chart look like a liquid level inside a glass vial.

---

## 6. Do's and Don'ts

### Do
- **Use Asymmetry:** Place high-level stats off-center to create a bespoke, non-template feel.
- **Embrace White Space:** Treat negative space as a functional element that prevents "analytical fatigue."
- **Nesting:** Put a `surface-container-highest` small tag inside a `surface-container-lowest` card to show containment without lines.

### Don't
- **No 1px Borders:** This is the most common failure point. If it looks "boxed in," remove the stroke and adjust the background color of the parent container instead.
- **No Pure Black:** Never use #000000. Use `on-surface` (#191c1e) for text to maintain the soft-medical atmosphere.
- **No Sharp Corners:** Avoid the `none` or `sm` roundedness scale for primary UI elements. It breaks the "Biological" metaphor.