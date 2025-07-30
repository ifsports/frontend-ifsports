export default function TruncatedTeamName({ name, maxLength = 3 }: { name: string; maxLength?: number }) {
  const shouldTruncate = name.length > maxLength;
  const displayName = shouldTruncate ? name.substring(0, maxLength).toUpperCase() : name.toUpperCase();

  return <p title={shouldTruncate ? name : undefined}>{displayName}</p>;
};