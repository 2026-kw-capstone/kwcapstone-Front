import { useNavigate } from "react-router-dom";
import ConversationHeader from "../components/free-conversation/ConversationHeader";
import ConversationInput from "../components/free-conversation/ConversationInput";
import ConversationMessages from "../components/free-conversation/ConversationMessages";
import ConversationSidebar from "../components/free-conversation/ConversationSidebar";
import { useFreeConversationController } from "../hooks/useFreeConversationController";

const FreeConversationPage = () => {
  const navigate = useNavigate();
  const {
    selectedConversationId,
    isMobileConversationListOpen,
    setIsMobileConversationListOpen,
    currentConversationTitle,
    messages,
    recordErrorMessage,
    isMessageBusy,
    isVoiceBusy,
    isRecording,
    listState,
    detailState,
    sidebarMutationState,
    actions,
  } = useFreeConversationController();

  return (
    <div className="h-full min-h-0 w-full overflow-hidden bg-white">
      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-md flex-col overflow-hidden">
        {isMobileConversationListOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-40 bg-slate-900/35"
            aria-label="대화 목록 닫기"
            onClick={() => setIsMobileConversationListOpen(false)}
          />
        ) : null}

        <ConversationSidebar
          conversations={listState.conversations}
          selectedConversationId={selectedConversationId}
          isMobileOpen={isMobileConversationListOpen}
          isLoading={listState.isLoading}
          isError={listState.isError}
          errorMessage={listState.errorMessage}
          onNewConversation={actions.handleNewConversation}
          onRetry={listState.onRetry}
          onSelectConversation={actions.handleSelectConversation}
          onSubmitEditConversation={actions.handleSubmitEditConversation}
          isEditSubmitting={sidebarMutationState.isEditSubmitting}
          editingSubmitConversationId={
            sidebarMutationState.editingSubmitConversationId
          }
          onDeleteConversation={actions.handleDeleteConversation}
          isDeleteSubmitting={sidebarMutationState.isDeleteSubmitting}
          deletingSubmitConversationId={
            sidebarMutationState.deletingSubmitConversationId
          }
        />

        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-white via-[#f8fbff] to-[#edf5f3]">
          <ConversationHeader
            onToggleConversationList={() =>
              setIsMobileConversationListOpen((prev) => !prev)
            }
            currentConversationTitle={currentConversationTitle}
            onBackToPractice={() => navigate("/ai-practice")}
          />

          <div className="relative flex min-h-0 flex-1 flex-col px-2 pb-3 pt-2">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-emerald-100/40 to-transparent" />

            <div className="relative flex-1 overflow-y-auto pr-1">
              <ConversationMessages
                conversationId={selectedConversationId}
                messages={messages}
                isLoading={detailState.isLoading}
                isError={detailState.isError}
                errorMessage={detailState.errorMessage}
                onRetry={detailState.onRetry}
              />
            </div>

            {recordErrorMessage ? (
              <p className="pb-1 text-xs font-semibold text-rose-500">
                {recordErrorMessage}
              </p>
            ) : null}

            <ConversationInput
              isRecording={isRecording}
              isTextBusy={isMessageBusy}
              isVoiceBusy={isVoiceBusy}
              onToggleVoiceRecord={actions.handleToggleVoiceRecord}
              onSubmitText={actions.handleSubmitTextMessage}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FreeConversationPage;
