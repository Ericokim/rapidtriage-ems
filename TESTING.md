# Testing Guide — RapidTriage EMS

## Testing Goal

The tests prove the assessment-critical behavior. This project does not need hundreds of tests — it needs focused tests for the offline-first workflow.

## Test Priorities

1. Validation
2. Local save
3. Pending queue
4. Sync engine
5. API sync endpoint
6. Error handling
7. Retry behavior

## Shared Package Tests

File: `packages/shared/src/schemas/triage.schema.test.ts`

- Shared schema accepts valid payload
- Shared schema rejects blank name
- Shared schema rejects blank condition
- Shared schema rejects invalid priority
- Shared schema rejects invalid status

## Mobile Tests

### Validation — `apps/mobile/__tests__/triageValidation.test.ts`

- Patient name is required
- Condition description is required
- Priority level is required and must be 1 to 5
- Status must be Pending or In-Transit
- Valid input passes

### Local Save — `apps/mobile/__tests__/createLocalTriageRecord.test.ts`

- Valid triage record is saved locally
- Saved record has sync_status = pending
- Saved record has retry_count = 0
- Saved record has created_at and updated_at
- Invalid record is rejected before local save

### Sync Engine — `apps/mobile/__tests__/syncEngine.test.ts`

- Sync does nothing when there are no pending records
- Sync reads pending records
- Sync marks records as syncing
- Sync marks records as synced after API success
- Sync marks records as failed after API error (records preserved)
- Sync does not run concurrently

## API Tests

File: `apps/api/src/tests/triageRoutes.test.ts`

- `POST /api/v1/triage/sync` accepts valid payload
- Invalid payload returns 400
- Duplicate clientId does not create duplicate rows (idempotent)
- Response includes syncedIds

## Running Tests

```bash
npm run test                             # all workspaces
npm --workspace @rapidtriage/shared run test
npm --workspace apps/mobile run test
npm --workspace apps/api run test
npm run typecheck
```

## Minimum Test Coverage for Submission

- [ ] Shared validation tests
- [ ] Mobile validation tests
- [ ] Local save tests
- [ ] Sync engine tests
- [ ] API sync tests

## Testing Philosophy

Test the behavior that matters, not implementation details. The most important behavior is:

```text
A valid triage record is saved locally before any network request.
```
