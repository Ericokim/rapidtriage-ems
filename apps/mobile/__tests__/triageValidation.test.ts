import { triageFormSchema } from "@rapidtriage/shared";

const valid = {
  patientName: "John Kamau",
  conditionDescription: "Chest pain and shortness of breath",
  priorityLevel: 1,
  status: "In-Transit" as const,
};

describe("triage form validation", () => {
  it("passes for valid input", () => {
    expect(triageFormSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a patient name", () => {
    expect(
      triageFormSchema.safeParse({ ...valid, patientName: "" }).success
    ).toBe(false);
  });

  it("requires a condition description", () => {
    expect(
      triageFormSchema.safeParse({ ...valid, conditionDescription: "  " }).success
    ).toBe(false);
  });

  it("requires a priority level", () => {
    const { priorityLevel, ...noPriority } = valid;
    expect(triageFormSchema.safeParse(noPriority).success).toBe(false);
  });

  it("rejects a priority outside 1-5", () => {
    expect(triageFormSchema.safeParse({ ...valid, priorityLevel: 7 }).success).toBe(
      false
    );
  });

  it("rejects an unknown status", () => {
    expect(
      triageFormSchema.safeParse({ ...valid, status: "Discharged" }).success
    ).toBe(false);
  });
});
