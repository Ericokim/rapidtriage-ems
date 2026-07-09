---
name: build-screen
argument-hint: [screen-name]
description: Build a mobile screen using established UI rules.
---

Build screen: $ARGUMENTS

## Before Coding

Read context/ui-rules.md, context/ui-tokens.md, context/ui-registry.md, context/code-standards.md.

## Rules

Use React Native functional components and TypeScript. Use Expo Router and NativeWind. Use existing UI components. Keep touch targets large. Show loading, empty, and error states where relevant. Do not add persistence or API logic inside the screen.

## Supported Screens

Home, New Triage, Queue, History.

## After Coding

Run typecheck, update progress-tracker.md, recommend `/imprint` for new UI patterns.
