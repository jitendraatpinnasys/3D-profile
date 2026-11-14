# JITENDRA.SPACE — Beyond Code, Into Intelligence

An immersive, scroll-driven 3D portfolio for **Jitendra Saini**, AI Engineer & Full-Stack Developer.
One continuous Three.js world; scrolling flies the camera between seven environments while the
page content (in the dark, editorial style of the reference) stays readable on top.

```
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/ — deploy anywhere (Netlify, Vercel, S3, GitHub Pages)
npm run preview
```

## Editing content (no code changes needed)

All content lives in typed files under [src/data/](src/data/):

| File | What it holds |
|---|---|
| `profile.ts` | name, titles, summary, hero slides, info cards, LinkedIn, **email**, **resume**, **photo** |
| `skills.ts` | categories (with station colours) and technologies with descriptions |
| `experience.ts` | roles, dates, responsibilities, technologies |
| `projects.ts` | case studies — add an object and a new 3D exhibit + page card appear automatically |
| `certifications.ts` | certifications and achievements |
| `navigation.ts` | nav labels and 3D world names |

### Placeholders waiting for you

- **Email** — `profile.email` is empty. Once set, it appears in the contact panel and footer, and a mail-composer form is enabled.
- **Resume** — put `public/resume/Jitendra-Saini-Resume.pdf`, then set `resume.available: true`. Until then the buttons show a "coming soon" toast.
- **Photo** — put e.g. `public/images/profile.jpg` and set `photo: '/images/profile.jpg'`. Until then a "JS" monogram card is shown.
- **Certificate image** — put it in `public/certificates/` and set `image` (and optionally `date`, `credentialUrl`) in `certifications.ts`. The 3D panel and detail view will show it.
- **Project screenshots / links** — fill `images` and `links` in `projects.ts`. Nothing is shown until real values exist.

## How it works

- **Camera timeline** — [src/scenes/timeline.ts](src/scenes/timeline.ts) lists the stops; each is bound to a DOM anchor (`kf-*`). [useScrollTimeline](src/hooks/useScrollTimeline.ts) maps scroll → a continuous stop index (with a dwell at each stop). [CameraRig](src/scenes/CameraRig.tsx) rides a spline through [worldLayout.ts](src/scenes/worldLayout.ts) positions with crane arcs, hero orbit, pointer parallax, intro fly-in and focus on selected objects.
- **Scenes** — one folder per environment in [src/scenes/](src/scenes/). Far-away environments are hidden by `Zone` for performance.
- **Interaction** — hovering/clicking 3D objects or page elements updates a shared Zustand store, which opens the [DetailPanel](src/components/overlays/DetailPanel.tsx).
- **No network** — fonts are bundled, in-world text is drawn to canvas textures, the environment map is built from local light panels. There are no runtime requests and no backend.

## Responsive & accessibility

- Desktop: full world, bloom and vignette. Tablet / low-core devices: reduced world, no post-processing. Phones or no WebGL: a clean 2D layout with all content.
- The cube button toggles the 3D world off. `prefers-reduced-motion` disables ambient motion and smoothing. The sound toggle (generated ambient pad) is off by default.
- Keyboard: Enter starts the experience, Esc closes panels and menus, every 3D item is also reachable from the page.
