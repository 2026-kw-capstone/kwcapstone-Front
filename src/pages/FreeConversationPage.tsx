import { useMemo, useState } from "react";
import ConversationHeader from "../components/free-conversation/ConversationHeader";
import ConversationInput from "../components/free-conversation/ConversationInput";
import ConversationMessages from "../components/free-conversation/ConversationMessages";
import ConversationSidebar from "../components/free-conversation/ConversationSidebar";
import {
  MOCK_CONVERSATION_LIST,
  MOCK_MESSAGES_BY_CONVERSATION,
} from "../constants/freeConversation";

const FreeConversationPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    null
  );
  const [isMobileConversationListOpen, setIsMobileConversationListOpen] =
    useState(false);

  const selectedMessages = useMemo(() => {
    if (!selectedConversationId) {
      return [];
    }

    return MOCK_MESSAGES_BY_CONVERSATION[selectedConversationId] ?? [];
  }, [selectedConversationId]);

  const currentConversationTitle = useMemo(() => {
    if (!selectedConversationId) {
      return "새 대화";
    }

    return (
      MOCK_CONVERSATION_LIST.find(
        (conversation) => conversation.id === selectedConversationId
      )?.title ?? "새 대화"
    );
  }, [selectedConversationId]);

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setIsMobileConversationListOpen(false);
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsMobileConversationListOpen(false);
  };

  return (
    <div className="h-full min-h-0 w-full overflow-hidden bg-white">
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        {isMobileConversationListOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/35"
            aria-label="대화 목록 닫기"
            onClick={() => setIsMobileConversationListOpen(false)}
          />
        ) : null}

        <ConversationSidebar
          conversations={MOCK_CONVERSATION_LIST}
          selectedConversationId={selectedConversationId}
          isMobileOpen={isMobileConversationListOpen}
          onNewConversation={handleNewConversation}
          onSelectConversation={handleSelectConversation}
          onEditConversation={() => void 0}
          onDeleteConversation={() => void 0}
        />

        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-white via-[#f8fbff] to-[#edf5f3]">
          <ConversationHeader
            isMobileConversationListOpen={isMobileConversationListOpen}
            onToggleConversationList={() =>
              setIsMobileConversationListOpen((prev) => !prev)
            }
            currentConversationTitle={currentConversationTitle}
          />

          <div className="relative flex min-h-0 flex-1 flex-col px-2 pb-3 pt-2">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-emerald-100/40 to-transparent" />

            <div className="relative flex-1 overflow-y-auto pr-1">
              <ConversationMessages messages={selectedMessages} />
            </div>

            <ConversationInput />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FreeConversationPage;
