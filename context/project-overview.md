# Project Overview — RapidTriage EMS

## Project Name

RapidTriage EMS

## Project Type

Offline-first React Native mobile technical assessment with a lightweight backend sync API.

## Product Summary

RapidTriage EMS is an offline-first paramedic triage intake application. It allows paramedics to create patient triage records in the field, save them locally using SQLite, and sync them to PostgreSQL when connectivity returns.

## Primary User

Field paramedic or emergency medical responder.

## User Environment

The user may be working under intense pressure, handling critical patients, wearing gloves, holding the phone one-handed, moving between locations, outdoors in bright light, on unstable mobile data or completely offline, and unable to troubleshoot technical errors.

## Core Product Rule

A submitted triage record must never be lost because of network failure.

## Assessment Requirements

- Single-screen triage submission form
- Patient name input
- Condition description input
- Priority level selection from 1 to 5
- Status selection: Pending or In-Transit
- Validation before submission
- High-visibility color coding for priority 1 and 2
- Offline interception and immediate local persistence
- Background sync queue and connectivity monitoring
- Proper state management and separation of UI, persistence, and sync logic
- Device lifecycle handling
- Unit tests
- Public GitHub repository
- README explaining architecture and sync behavior
- Short demo video or GIF showing Airplane Mode save and automatic sync after reconnect

## Final Stack

- **Mobile:** React Native, Expo, Expo Router, TypeScript, NativeWind, Expo SQLite, Drizzle ORM, TanStack Query, React Hook Form, Zod, NetInfo, React Context.
- **Backend:** Express, PostgreSQL, Drizzle ORM, Zod.
- **Shared:** TypeScript types, Zod schemas, constants.

## Business Goal

Demonstrate that the developer can build a resilient, production-minded mobile workflow with proper offline handling, state management, local persistence, backend sync, and clean architecture.

## Functional Requirements

Create a triage record; enter patient name, condition, priority (1–5), and status; submit the form; save locally when offline; see pending sync records; auto-sync when online; see successful sync state; continue using the app while sync happens.

## Non-Functional Requirements

Fast, offline-first, reliable, testable, maintainable, mobile-friendly, easy to demo, simple to understand.

## Out of Scope

Authentication, maps, push notifications, file uploads, admin dashboard, complex analytics, ambulance tracking, payment features, full hospital management.

## Success Criteria

The app runs locally, the API runs locally, PostgreSQL connection works, the form validates correctly, offline submissions save locally, pending records sync automatically after reconnect, the UI does not freeze during sync, unit tests pass, the README is clear, and the demo proves offline behavior.
