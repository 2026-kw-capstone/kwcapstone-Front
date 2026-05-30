import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useOutlet } from "react-router-dom";
import { getApiErrorMessage } from "../../apis/apiError";
import ScenarioCreateModal from "../../components/scenario/ScenarioCreateModal";
import ScenarioDeleteConfirmModal from "../../components/scenario/ScenarioDeleteConfirmModal";
import ScenarioOnboarding from "../../components/scenario/ScenarioOnboarding";
import ScenarioRowCard from "../../components/scenario/ScenarioRowCard";
import { useDeleteScenario } from "../../hooks/mutations/useDeleteScenario";
import { usePostScenario } from "../../hooks/mutations/usePostScenario";
import { useGetScenarios } from "../../hooks/queries/useGetScenarios";
import type { ScenarioItem, ScenarioOutletContext } from "../../types/scenarioType";

const ScenarioPage = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ScenarioItem | null>(null);

  const {
    data: myScenarios = [],
    isLoading,
    isError,
    error,
  } = useGetScenarios();
  const { createScenario, isPending: isCreating } = usePostScenario();
  const { deleteScenario, isPending: isDeleting } = useDeleteScenario();
  const scenarioOutletContext: ScenarioOutletContext = { myScenarios };
  const outlet = useOutlet(scenarioOutletContext);

  useEffect(() => {
    if (!isError) {
      setErrorMessage("");
      return;
    }

    setErrorMessage(getApiErrorMessage(error));
  }, [error, isError]);

  if (outlet) {
    return outlet;
  }

  const moveToLevelSelect = (scenarioId: string) => {
    navigate(`/ai-practice/scenario/${scenarioId}`);
  };

  const resetForm = () => {
    setTitleInput("");
    setDescriptionInput("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const openDeleteConfirmModal = (scenario: ScenarioItem) => {
    setDeleteTarget(scenario);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteTarget(null);
  };

  const handleDeleteScenario = async () => {
    if (!deleteTarget) {
      return;
    }

    const scenarioId = Number(deleteTarget.id);
    if (!Number.isFinite(scenarioId)) {
      setErrorMessage("삭제할 시나리오 정보를 확인할 수 없습니다.");
      return;
    }

    try {
      setErrorMessage("");
      await deleteScenario({ scenarioId });
      closeDeleteConfirmModal();
    } catch (submitError) {
      setErrorMessage(getApiErrorMessage(submitError));
    }
  };

  const handleCreateScenario = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = titleInput.trim();
    const trimmedDescription = descriptionInput.trim();
    if (!trimmedTitle || !trimmedDescription) {
      return;
    }

    try {
      setErrorMessage("");
      await createScenario({
        title: trimmedTitle,
        description: trimmedDescription,
      });
      closeModal();
    } catch (submitError) {
      setErrorMessage(getApiErrorMessage(submitError));
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-md items-center justify-center">
        <p className="text-[14px] font-bold text-slate-400">
          시나리오 목록을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (!isLoading && myScenarios.length === 0) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col gap-3">
        {errorMessage ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
            {errorMessage}
          </p>
        ) : null}
        <ScenarioOnboarding
          title={titleInput}
          description={descriptionInput}
          isCreating={isCreating}
          onSubmit={handleCreateScenario}
          onTitleChange={setTitleInput}
          onDescriptionChange={setDescriptionInput}
        />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 animate-fade-in">
        <section className="mb-1 flex items-center justify-between gap-4 px-1">
          <div>
            <h1 className="mb-1 text-[24px] font-black leading-tight text-slate-900">
              시나리오 목록
            </h1>
            <p className="text-[14px] font-medium text-slate-500">
              내가 만든 맞춤 상황으로 연습해보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#278DFD] text-white shadow-[0_8px_16px_rgba(39,141,253,0.3)] transition-all hover:scale-105 active:scale-95"
            aria-label="시나리오 추가"
          >
            <Plus size={26} />
          </button>
        </section>

        {errorMessage ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
            {errorMessage}
          </p>
        ) : null}

        <section className="flex flex-col gap-3">
          {myScenarios.map((scenario) => (
            <ScenarioRowCard
              key={scenario.id}
              scenario={scenario}
              onClick={() => moveToLevelSelect(scenario.id)}
              onOpenDeleteConfirm={() => openDeleteConfirmModal(scenario)}
            />
          ))}
        </section>
      </div>

      <ScenarioCreateModal
        isOpen={isModalOpen}
        title={titleInput}
        description={descriptionInput}
        isCreating={isCreating}
        onClose={closeModal}
        onSubmit={handleCreateScenario}
        onTitleChange={setTitleInput}
        onDescriptionChange={setDescriptionInput}
      />
      <ScenarioDeleteConfirmModal
        scenario={deleteTarget}
        isSubmitting={isDeleting}
        onClose={closeDeleteConfirmModal}
        onDelete={handleDeleteScenario}
      />
    </>
  );
};

export default ScenarioPage;
