# Web Haptics Demo

Minimal Next.js demo for testing two custom button haptic patterns with adjustable intensity.

## What it does

- Shows two buttons with different vibration patterns.
- Lets you tune intensity for each pattern with a slider.
- Includes a debug-audio toggle so the interaction is still testable on devices without vibration support.
- Uses `useWebHaptics` from `web-haptics/react`.

## Stack

- Next.js App Router
- React 19
- Tailwind CSS 4
- web-haptics

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Relevant files

- `app/page.tsx` for the demo UI and haptic triggers
- `app/layout.tsx` for the minimal app shell
- `app/globals.css` for styling

## Example pattern

```ts
trigger([
  { duration: 30 },
  { delay: 60, duration: 40, intensity: 1 },
], { intensity: 0.8 });
```
