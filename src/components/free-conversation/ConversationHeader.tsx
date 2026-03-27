import { Menu } from "lucide-react";
import BackLinkButton from "../BackLinkButton";

type ConversationHeaderProps = {
  onToggleConversationList: () => void;
  currentConversationTitle: string;
  onBackToPractice: () => void;
};

const ConversationHeader = ({
  onToggleConversationList,
  currentConversationTitle,
  onBackToPractice,
}: ConversationHeaderProps) => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 px-3">
      <div className="flex min-w-0 items-center gap-2">
        <BackLinkButton onClick={onBackToPractice} label="실전대화연습으로" />

        <h1 className="truncate text-base font-extrabold tracking-tight text-slate-800">
          {currentConversationTitle}
        </h1>
      </div>

      <button
        type="button"
        onClick={onToggleConversationList}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600"
        aria-label="대화 목록 열기"
      >
        <Menu size={16} />
      </button>
    </header>
  );
};

export default ConversationHeader;
