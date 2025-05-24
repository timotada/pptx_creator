const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });
const suffixes: Record<Intl.LDMLPluralRule, string> = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};

export function formatDateLong(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "long" });
  const year = date.getFullYear();
  const suffix = suffixes[ordinalRules.select(day)];
  return `${day}${suffix} ${month}, ${year}`;
}
