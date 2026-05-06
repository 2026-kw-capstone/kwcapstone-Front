import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useOutlet } from "react-router-dom";
import {
  createScenarioRequest,
  deleteMyScenarioRequest,
  getMyScenariosRequest,
  getMyScenariosSnapshot,
} from "../../apis/scenario";
import ScenarioCreateModal from "../../components/scenario/ScenarioCreateModal";
import ScenarioOnboarding from "../../components/scenario/ScenarioOnboarding";
import ScenarioRowCard from "../../components/scenario/ScenarioRowCard";
import type { ScenarioItem, ScenarioOutletContext } from "../../types/scenarioType";

const ScenarioPage = () => {
  const navigate = useNavigate();

  const [myScenarios, setMyScenarios] = useState<ScenarioItem[]>(
    getMyScenariosSnapshot()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  const scenarioOutletContext: ScenarioOutletContext = { myScenarios };
  const outlet = useOutlet(scenarioOutletContext);

  const refreshScenarios = async () => {
    setIsLoading(true);
    try {
      const nextScenarios = await getMyScenariosRequest();
      setMyScenarios(nextScenarios);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshScenarios();
  }, []);

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

  const handleCreateScenario = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = titleInput.trim();
    const trimmedDescription = descriptionInput.trim();
    if (!trimmedTitle || !trimmedDescription) {
      return;
    }

    setIsCreating(true);
    try {
      await createScenarioRequest({
        title: trimmedTitle,
        description: trimmedDescription,
      });
      await refreshScenarios();
      closeModal();
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteScenario = async (scenarioId: string) => {
    await deleteMyScenarioRequest(scenarioId);
    await refreshScenarios();
  };

  if (!isLoading && myScenarios.length === 0) {
    return (
      <ScenarioOnboarding
        title={titleInput}
        description={descriptionInput}
        isCreating={isCreating}
        onSubmit={handleCreateScenario}
        onTitleChange={setTitleInput}
        onDescriptionChange={setDescriptionInput}
      />
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
              내가 만든 맞춤 상황으로 연습해요.
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

        <section className="flex flex-col gap-3">
          {myScenarios.map((scenario) => (
            <ScenarioRowCard
              key={scenario.id}
              scenario={scenario}
              onClick={() => moveToLevelSelect(scenario.id)}
              onDelete={() => {
                void handleDeleteScenario(scenario.id);
              }}
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
    </>
  );
};

export default ScenarioPage;
