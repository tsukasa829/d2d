"use client";

export default function ChoiceButtons({
  choices,
  disabled,
  onSelect,
}: {
  choices: { label: string; value: string }[];
  disabled?: boolean;
  onSelect: (value: string) => void;
}) {
  if (!choices?.length) return null;
  return (
    <div className="flex flex-col gap-2 mt-3">
      {choices.map((c) => (
        <button
          key={c.value}
          disabled={disabled}
          onClick={() => onSelect(c.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
