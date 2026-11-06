export default function StatusBadge({ status }) {
  const cls = status === "Resolved" ? "badge-resolved" : status === "Reviewed" ? "badge-reviewed" : "badge-pending";
  return <span className={"badge " + cls}>{status}</span>;
}
