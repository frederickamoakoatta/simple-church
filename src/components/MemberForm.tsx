"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { getSelectOptions } from "@/lib/member-form";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Select from "@/components/ui/Select";
import {
  FORM_STEPS,
  MEMBER_FIELDS,
  SECTION_LABELS,
  emptyMemberInput,
  type MemberInput,
} from "@/types/member";

type MemberFormProps = {
  initialData?: MemberInput;
  memberId?: number;
};

function validateRequiredFields(form: MemberInput): string | null {
  if (!form.firstname?.trim() || !form.lastname?.trim()) {
    return "First name and last name are required before saving.";
  }
  return null;
}

export default function MemberForm({ initialData, memberId }: MemberFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<MemberInput>(
    initialData ?? emptyMemberInput(),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(
    memberId ? FORM_STEPS.length - 1 : 0,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentStep = FORM_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === FORM_STEPS.length - 1;
  const stepFields = MEMBER_FIELDS.filter(
    (field) => field.section === currentStep,
  );

  function updateField(key: keyof MemberInput, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value === "" ? null : value,
    }));
  }

  function goToStep(index: number) {
    setError(null);
    setStepIndex(index);
  }

  function advanceToStep(nextIndex: number) {
    setError(null);
    setStepIndex(nextIndex);
    setMaxStepReached((prev) => Math.max(prev, nextIndex));
  }

  function handleContinue() {
    if (currentStep === "personal") {
      const validationError = validateRequiredFields(form);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    advanceToStep(stepIndex + 1);
  }

  function handleSkip() {
    advanceToStep(stepIndex + 1);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isLastStep) {
      return;
    }

    setError(null);

    const validationError = validateRequiredFields(form);
    if (validationError) {
      setError(validationError);
      goToStep(0);
      return;
    }

    setSaving(true);

    try {
      const url = memberId ? `/api/members/${memberId}` : "/api/members";
      const method = memberId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      router.push("/membership");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save member.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || isLastStep) {
      return;
    }

    const target = event.target;
    if (target instanceof HTMLTextAreaElement) {
      return;
    }

    event.preventDefault();
  }

  const progress = ((stepIndex + 1) / FORM_STEPS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <nav aria-label="Form progress">
          <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
            {FORM_STEPS.map((step, index) => {
              const isComplete = index < stepIndex;
              const isCurrent = index === stepIndex;
              const canNavigate = memberId ? true : index <= maxStepReached;

              return (
                <li key={step} className="flex flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (canNavigate) {
                        goToStep(index);
                      }
                    }}
                    disabled={!canNavigate}
                    className={`text-theme-sm flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium transition ${
                      isCurrent
                        ? "bg-brand-50 text-brand-500"
                        : canNavigate
                          ? "text-gray-700 hover:bg-gray-100"
                          : "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isCurrent
                          ? "bg-brand-500 text-white"
                          : isComplete
                            ? "bg-success-500 text-white"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span>{SECTION_LABELS[step]}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-theme-xs shrink-0 text-gray-500">
              Step {stepIndex + 1} of {FORM_STEPS.length}
            </p>
          </div>
        </nav>
      </div>

      <form
        id="member-form"
        noValidate
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-lg font-semibold text-gray-800">
              {SECTION_LABELS[currentStep]}
            </h3>
            <p className="text-theme-sm mt-1 text-gray-500">
              Every field on this step is optional unless marked with an
              asterisk.
            </p>
          </div>

          <div className="border-t border-gray-100 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {stepFields.map((field) => {
                const fieldId = `field-${field.key}`;

                return (
                  <div key={field.key}>
                    <Label htmlFor={fieldId}>
                      {field.label}
                      {field.required && currentStep === "personal" ? (
                        <span className="text-error-500"> *</span>
                      ) : null}
                    </Label>
                    {field.type === "select" ? (
                      <Select
                        id={fieldId}
                        value={form[field.key] ?? ""}
                        onChange={(event) =>
                          updateField(field.key, event.target.value)
                        }
                      >
                        {getSelectOptions(field.options, form[field.key]).map(
                          (option) => (
                            <option key={option || "empty"} value={option}>
                              {option || "— Select —"}
                            </option>
                          ),
                        )}
                      </Select>
                    ) : (
                      <Input
                        id={fieldId}
                        type={field.type}
                        value={form[field.key] ?? ""}
                        onChange={(event) =>
                          updateField(field.key, event.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </form>

      {error ? (
        <Alert variant="error" title="Could not continue">
          {error}
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/membership")}
        >
          Cancel
        </Button>

        <div className="flex flex-wrap gap-3">
          {!isFirstStep ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => goToStep(stepIndex - 1)}
            >
              Back
            </Button>
          ) : null}

          {!isLastStep ? (
            <>
              <Button type="button" variant="ghost" onClick={handleSkip}>
                Skip step
              </Button>
              <Button type="button" onClick={handleContinue}>
                Continue
              </Button>
            </>
          ) : (
            <Button type="submit" form="member-form" disabled={saving}>
              {saving
                ? "Saving..."
                : memberId
                  ? "Update Member"
                  : "Save Member"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
