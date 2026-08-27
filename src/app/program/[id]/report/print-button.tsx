"use client";

/** Minimal client island for the report page: the only JS is window.print(). */
export function PrintButton() {
  return (
    <button
      type="button"
      className="rp-btn"
      onClick={() => window.print()}
      data-testid="print"
    >
      Print
    </button>
  );
}
