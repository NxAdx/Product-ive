

---

## 2. Colors & Surface Architecture
The palette is rooted in deep obsidian tones and "White," punctuated by hyper-saturated accents representing neural and kinetic energy.

### The "No-Line" Rule
**Strict Prohibition:** 1px solid borders are forbidden for sectioning or containment. 
Structure must be achieved through:
1.  **Background Shifts:** Placing a `--surface-container-low` object against a `--surface-container-lowest` background.
2.  **Negative Space:** Utilizing 48px gaps to define grouping.
3.  **Subtle Glows:** Using a 135° kinetic gradient to "lift" an element's edge via light rather than ink.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of high-tech materials.
- **Base Layer:** `--bg` (#101010) represents the void/dark lab.
- **Content Blocks:** Use `--surface-container` tiers. For nested data (like a health metric inside a dashboard card), use a *lower* tier (darker) to create an inset, carved-out look, or a *higher* tier to suggest a protruding sensor.
- **Glassmorphism:** For floating overlays (modals, navigation bars), use 60% opacity of the surface token combined with a 24px backdrop blur. This creates the "Clinical Futurism" lens effect.

### Kinetic Accents
- **Primary (Kinetic Orange):** Use for active metabolic states and high-priority CTAs.
- **Secondary (Neurological Blue):** Use for cognitive data and steady-state monitoring.
- **Tertiary (Synthetic Purple):** Use for hormonal/DNA-level insights and recovery states.

---

## 3. Typography
The type system relies on the tension between the wide, technical authority of **Manrope** and the functional clarity of **Inter**.

| Level | Token | Font | Weight | Character Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Manrope | Bold | -0.02em (Wide) |
| **Headline**| `headline-md` | Manrope | Bold | Normal |
| **Title** | `title-lg` | Inter | Medium | +0.01em |
| **Body** | `body-md` | Inter | Regular | Normal |
| **Label** | `label-sm` | Inter | Bold | +0.05em (Caps) |

**Editorial Intent:** Use `display-lg` for single-word biological markers or large numerical data (e.g., "98 BPM"). Use `label-sm` in all-caps with wide tracking for "technical metadata" (e.g., "LATENCY: 24MS").

---

## 4. Elevation & Depth
In this design system, depth is a byproduct of light and density, not drop shadows.

- **The Layering Principle:** Avoid the "Drop Shadow" effect. Instead, use Tonal Layering. A `surface-bright` card sits on a `surface-dim` background. The eye perceives the shift in luminosity as physical height.
- **Ambient Shadows:** If a floating element requires a shadow (e.g., a floating action pill), use a blur of 60px with 6% opacity. The shadow color should be tinted with `--primary` or `--secondary` depending on the context, simulating colored light refracting through glass.
- **Tube-Lit Fills:** For progress bars and charts, use inner glows and 135° gradients to make elements appear "tube-lit," like liquid flowing through a glass vial.

---

## 5. Components

### Buttons & Interaction
- **Primary CTA:** Full Pill shape. Background: Linear gradient (135°) from `--primary` to `--primary-dim`. No border. Text: `--on-primary`.
- **Secondary:** Full Pill. Surface: Glassmorphism (60% opacity + blur). Text: `--text-main`.
- **States:** On hover, increase the `surface-tint` glow. On press, scale the component to 98%.

### Chips (Biometric Tags)
- Used for filtering data streams (e.g., "REM," "Deep Sleep," "Glucose").
- Style: `--surface-container-high` with a 24px radius. When active, use a "Tube-lit" glow in the respective category color.

### Input Fields
- Avoid boxes. Use a single `--surface-variant` background with a `xl` (24px) radius. 
- **Focus State:** Do not add a border. Instead, apply a subtle glow to the background color and shift the label typography to the `--primary` color.

### Data Visualization (The "Vial" Chart)
- Forbid standard line charts. Use "Tube-lit" fills—thick, rounded paths with a 135° gradient and an inner glow to simulate bioluminescent liquid.

### Cards & Lists
- **No Dividers:** Separate list items using 16px of vertical white space and alternating background shifts between `surface-container-low` and `surface-container-lowest`.
- **Asymmetry:** Align headlines to the far left, but place numerical data at unexpected intervals (e.g., 60% width) to break the "grid" feel and create a bespoke, editorial rhythm.

---

## 6. Do's and Don'ts

### Do:
- **Do** embrace the "Void": Let the `--bg` breathe. Use 48px margins frequently.
- **Do** use Glassmorphism for any element that floats over the content stream.
- **Do** use `xl` (24px) or `full` radii. Anything sharper feels "industrial" rather than "clinical."
- **Do** align items to an asymmetrical 12-column grid where elements may span 5 columns on the left and 7 on the right.

### Don't:
- **Don't** use 1px lines to separate anything. If it looks like a spreadsheet, it’s wrong.
- **Don't** use pure grey for shadows. Use tinted translucency.
- **Don't** center-align long-form text. All text should be left-aligned to maintain the "HUD" technical feel.
- **Don't** use standard Material or iOS icons. Use "Thin Line" (1.5pt) custom iconography that matches the Inter font weight.