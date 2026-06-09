import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ title, hint }) {
  return (
    <div className="empty-state">
      <Inbox size={32} strokeWidth={1.5} />
      <strong>{title}</strong>
      {hint && <p>{hint}</p>}
    </div>
  );
}
