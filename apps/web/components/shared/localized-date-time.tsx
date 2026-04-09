"use client";

import { useEffect, useState } from "react";

const serverFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

function formatServerDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return serverFormatter.format(date);
}

function formatClientDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function LocalizedDateTime({ value }: { value: string }) {
  const [formattedValue, setFormattedValue] = useState(() =>
    formatServerDateTime(value),
  );

  useEffect(() => {
    setFormattedValue(formatClientDateTime(value));
  }, [value]);

  return (
    <time dateTime={value} suppressHydrationWarning>
      {formattedValue}
    </time>
  );
}
