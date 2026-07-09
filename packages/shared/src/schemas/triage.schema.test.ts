import {
  triageFormSchema,
  triageSyncRequestSchema,
} from "./triage.schema";

const validForm = {
  patientName: "John Kamau",
  conditionDescription: "Chest pain and shortness of breath",
  priorityLevel: 1,
  status: "In-Transit" as const,
};

describe("triageFormSchema", () => {
  it("accepts a valid triage form", () => {
    const result = triageFormSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it("rejects a blank patient name", () => {
    const result = triageFormSchema.safeParse({ ...validForm, patientName: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects a blank condition description", () => {
    const result = triageFormSchema.safeParse({
      ...validForm,
      conditionDescription: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a priority below 1", () => {
    const result = triageFormSchema.safeParse({ ...validForm, priorityLevel: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a priority above 5", () => {
    const result = triageFormSchema.safeParse({ ...validForm, priorityLevel: 6 });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status", () => {
    const result = triageFormSchema.safeParse({
      ...validForm,
      status: "Discharged",
    });
    expect(result.success).toBe(false);
  });
});

describe("triageSyncRequestSchema", () => {
  const validRecord = {
    ...validForm,
    clientId: "local-1",
    createdAt: "2026-07-09T20:00:00.000Z",
    updatedAt: "2026-07-09T20:00:00.000Z",
  };

  it("accepts a valid sync payload", () => {
    const result = triageSyncRequestSchema.safeParse({ records: [validRecord] });
    expect(result.success).toBe(true);
  });

  it("accepts an empty records array", () => {
    const result = triageSyncRequestSchema.safeParse({ records: [] });
    expect(result.success).toBe(true);
  });

  it("rejects a record missing clientId", () => {
    const { clientId, ...noId } = validRecord;
    const result = triageSyncRequestSchema.safeParse({ records: [noId] });
    expect(result.success).toBe(false);
  });

  it("rejects a non-ISO timestamp", () => {
    const result = triageSyncRequestSchema.safeParse({
      records: [{ ...validRecord, createdAt: "yesterday" }],
    });
    expect(result.success).toBe(false);
  });
});
