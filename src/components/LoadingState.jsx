import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState({ text = "Đang tải..." }) {
  return (
    <div className="loading-state">
      <Loader2 className="spin" size={28} />
      <span>{text}</span>
    </div>
  );
}
