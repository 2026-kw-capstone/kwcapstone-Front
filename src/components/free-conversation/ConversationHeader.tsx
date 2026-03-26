import { Menu, X } from "lucide-react";

type ConversationHeaderProps = {
  isMobileConversationListOpen: boolean;
  onToggleConversationList: () => void;
  currentConversationTitle: string;
};

const ConversationHeader = ({
  isMobileConversationListOpen,
  onToggleConversationList,
  currentConversationTitle,
}: ConversationHeaderProps) => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 px-3">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleConversationList}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600"
          aria-label="대화 목록 열기"
        >
          {isMobileConversationListOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        <h1 className="truncate text-base font-extrabold tracking-tight text-slate-800">
          {currentConversationTitle}
        </h1>
      </div>

      <div className="w-8" />
    </header>
  );
};

export default ConversationHeader;
