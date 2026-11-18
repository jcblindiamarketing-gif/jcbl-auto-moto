export function cleanMetaDescription(
  value: string | null | undefined
): string {
  if (!value) return "";

  const english = value.match(
    /\[:en\]([\s\S]*?)(?=\[:[a-z]{2}(?:_[A-Z]{2})?\]|\[:\]|$)/i
  );

  return english ? english[1].trim() : value.trim();
}
