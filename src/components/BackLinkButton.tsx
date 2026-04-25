import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BackLinkButtonProps {
  to?: string;
  onClick?: () => void;
  label?: string;
}

const baseClassName =
  "inline-flex shrink-0 items-center justify-center p-0 text-slate-900 transition hover:text-slate-600";

const BackLinkButton = ({ to, onClick, label }: BackLinkButtonProps) => {
  const accessibleLabel = label ?? "뒤로가기";

  if (to) {
    return (
      <Link to={to} aria-label={accessibleLabel} title={accessibleLabel} className={baseClassName}>
        <ArrowLeft size={28} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      className={baseClassName}
    >
      <ArrowLeft size={28} />
    </button>
  );
};

export default BackLinkButton;
