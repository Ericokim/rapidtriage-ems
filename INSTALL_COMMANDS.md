# Install Commands — RapidTriage EMS

This file lists the install commands used to build the project. In this repository the workspaces are already scaffolded, so a plain `npm install` from the root installs everything.

## From the Root

```bash
npm install
npm run build:shared
```

## Mobile Libraries (reference)

Runtime:

```bash
npx expo install expo-router expo-sqlite \
  react-native-safe-area-context react-native-screens \
  react-native-gesture-handler react-native-reanimated \
  @react-native-community/netinfo
npm install drizzle-orm @tanstack/react-query \
  react-hook-form @hookform/resolvers zod nativewind react-native-css
```

Dev:

```bash
npm install -D drizzle-kit tailwindcss @tailwindcss/postcss postcss \
  jest jest-expo @testing-library/react-native @types/jest \
  prettier prettier-plugin-tailwindcss
```

> NativeWind v5 uses Tailwind v4 via PostCSS + Metro (`withNativewind`). There is no `nativewind/babel` plugin and no `tailwind.config.js`.

## Backend Libraries (reference)

Runtime:

```bash
npm install express cors helmet morgan zod pg drizzle-orm
```

Dev:

```bash
npm install -D typescript tsx drizzle-kit jest ts-jest supertest eslint prettier \
  @types/node @types/express @types/cors @types/morgan @types/jest @types/supertest @types/pg
```

## Shared Package (reference)

```bash
npm install zod
npm install -D typescript
```

## Run Commands

```bash
npm run mobile
npm run api
npm run test
npm run typecheck
npm run lint
```
