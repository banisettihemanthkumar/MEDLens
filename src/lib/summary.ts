import { ObservationStatus } from "./validation";

export interface SummaryReportStats {
  totalObservations: number;
  normalCount: number;
  outOfRangeCount: number;
  notAssessedCount: number;
  highCount: number;
  lowCount: number;
  testNamesOutOfRange: string[];
}

export const RESPONSIBLE_AI_SUMMARY_DISCLAIMER =
  "Important: This summary describes information found in the uploaded medical report. It is strictly for organizational and review purposes and does not constitute a medical diagnosis, treatment plan, medication recommendation, or clinical evaluation. Always consult a licensed healthcare provider.";

export function generatePatientFriendlySummary(
  observations: Array<{
    testName: string;
    value: string;
    unit?: string | null;
    status: string;
    referenceText?: string | null;
  }>,
  reportTitle?: string
): {
  overviewText: string;
  inRangeText: string;
  outOfRangeText: string;
  notAssessedText: string;
  disclaimer: string;
  stats: SummaryReportStats;
} {
  const total = observations.length;
  let normal = 0;
  let high = 0;
  let low = 0;
  let notAssessed = 0;
  const outOfRangeNames: string[] = [];

  for (const obs of observations) {
    if (obs.status === "NORMAL") {
      normal++;
    } else if (obs.status === "HIGH") {
      high++;
      outOfRangeNames.push(`${obs.testName} (High: ${obs.value} ${obs.unit || ""})`.trim());
    } else if (obs.status === "LOW") {
      low++;
      outOfRangeNames.push(`${obs.testName} (Low: ${obs.value} ${obs.unit || ""})`.trim());
    } else {
      notAssessed++;
    }
  }

  const outOfRange = high + low;

  const overviewText = `The report "${reportTitle || "Medical Document"}" contains ${total} structured laboratory observation${
    total === 1 ? "" : "s"
  } extracted and parsed from the source record.`;

  const inRangeText =
    normal > 0
      ? `${normal} result${normal === 1 ? "" : "s"} fell within the specific numerical reference interval${
          normal === 1 ? "" : "s"
        } printed on the source report.`
      : "No results matched source-provided standard reference intervals.";

  const outOfRangeText =
    outOfRange > 0
      ? `${outOfRange} result${
          outOfRange === 1 ? "" : "s"
        } fell outside the reference interval${
          outOfRange === 1 ? "" : "s"
        } printed on the source report (${outOfRangeNames.join(", ")}).`
      : "None of the reported values fell outside the source-printed reference intervals.";

  const notAssessedText =
    notAssessed > 0
      ? `${notAssessed} result${
          notAssessed === 1 ? "" : "s"
        } could not be classified because the source report did not provide a reference interval.`
      : "All extracted results included a verifiable source reference interval.";

  return {
    overviewText,
    inRangeText,
    outOfRangeText,
    notAssessedText,
    disclaimer: RESPONSIBLE_AI_SUMMARY_DISCLAIMER,
    stats: {
      totalObservations: total,
      normalCount: normal,
      outOfRangeCount: outOfRange,
      notAssessedCount: notAssessed,
      highCount: high,
      lowCount: low,
      testNamesOutOfRange: outOfRangeNames,
    },
  };
}
