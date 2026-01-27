# SVG Icons

- Name each icon file as `name.svg` and reference it via `icon("name")`.
- Use a 24x24 viewBox and stroke-based paths.
- Base attributes are expected to be:
  - `viewBox="0 0 24 24"`
  - `fill="none"`
  - `stroke="currentColor"`
  - `stroke-width="2"`
  - `stroke-linecap="round"`
  - `stroke-linejoin="round"`

The helper injects width/height/class/aria attributes at render time.
