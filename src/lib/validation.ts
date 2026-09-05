export type ObservationStatus = "LOW" | "NORMAL" | "HIGH" | "NOT_ASSESSED";

export interface ParsedReferenceRange {
  low: number | null;
  high: number | null;
  rawText: string;
  isProvided: boolean;
}

export const REFERENCE_RANGE_DISCLAIMER =
  "Status is calculated only from the reference range printed in the source report. MedLens does not diagnose or determine clinical normalcy.";

/**
 * Parses reference range string strictly from source text.
 * NEVER invents a default or generic medical range.
 */
export function parseSourceReferenceRange(rangeText?: string | null): ParsedReferenceRange {
  if (!rangeText || rangeText.trim() === "" || rangeText.toLowerCase().includes("not provided")) {
    return {
      low: null,
      high: null,
      rawText: "Not provided in source",
      isProvided: false,
    };
  }

  const cleaned = rangeText.trim();

  // Pattern: "12.0 - 16.0", "12.0-16.0", "12.0 – 16.0", "12.0 to 16.0"
  const rangeMatch = cleaned.match(/^([<>]?=?\s*[-+]?\d*\.?\d+)\s*(?:-|–|to)\s*([-+]?\d*\.?\d+)/i);
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]);
    const high = parseFloat(rangeMatch[2]);
    return {
      low: isNaN(low) ? null : low,
      high: isNaN(high) ? null : high,
      rawText: cleaned,
      isProvided: true,
    };
  }

  // Pattern: "< 100", "<= 100", "> 50"
  const singleMatch = cleaned.match(/^([<>]=?)\s*([-+]?\d*\.?\d+)/);
  if (singleMatch) {
    const op = singleMatch[1];
    const val = parseFloat(singleMatch[2]);
    if (!isNaN(val)) {
      if (op.startsWith("<")) {
        return { low: null, high: val, rawText: cleaned, isProvided: true };
      }
      if (op.startsWith(">")) {
        return { low: val, high: null, rawText: cleaned, isProvided: true };
      }
    }
  }

  return {
    low: null,
    high: null,
    rawText: cleaned,
    isProvided: true,
  };
}

/**
 * Evaluates numeric value against source-provided range only.
 * If range is missing or unparseable, returns NOT_ASSESSED.
 */
export function evaluateReferenceStatus(
  valStr?: string | null,
  rangeText?: string | null,
  refLow?: number | null,
  refHigh?: number | null
): { status: ObservationStatus; note: string } {
  const parsedRange = parseSourceReferenceRange(rangeText);
  
  if (!parsedRange.isProvided || (refLow == null && refHigh == null && parsedRange.low == null && parsedRange.high == null)) {
    return {
      status: "NOT_ASSESSED",
      note: "No reference range was printed in the source document.",
    };
  }

  if (!valStr) {
    return {
      status: "NOT_ASSESSED",
      note: "Observation value is non-numeric or absent.",
    };
  }

  // Extract numeric part from value
  const numMatch = valStr.replace(/,/g, "").match(/[-+]?\d*\.?\d+/);
  if (!numMatch) {
    return {
      status: "NOT_ASSESSED",
      note: "Value format is qualitative or non-numeric.",
    };
  }

  const numVal = parseFloat(numMatch[0]);
  const low = refLow ?? parsedRange.low;
  const high = refHigh ?? parsedRange.high;

  if (low != null && numVal < low) {
    return {
      status: "LOW",
      note: `Value (${numVal}) is below source lower limit (${low}).`,
    };
  }

  if (high != null && numVal > high) {
    return {
      status: "HIGH",
      note: `Value (${numVal}) exceeds source upper limit (${high}).`,
    };
  }

  if (low != null || high != null) {
    return {
      status: "NORMAL",
      note: "Value falls within the printed source reference range.",
    };
  }

  return {
    status: "NOT_ASSESSED",
    note: "Reference bounds could not be evaluated.",
  };
}
