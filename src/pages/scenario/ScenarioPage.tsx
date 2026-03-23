import { useState, type FormEvent } from "react";
import { Plus, Sparkles, UserRoundPlus } from "lucide-react";
import { useNavigate, useOutlet } from "react-router-dom";
import {
  createScenarioRequest,
  deleteMyScenarioRequest,
  getMyScenariosSnapshot,
} from "../../apis/scenario";
import ScenarioCreateModal from "../../components/scenario/ScenarioCreateModal";
import ScenarioRowCard from "../../components/scenario/ScenarioRowCard";
import { RECOMMENDED_SCENARIOS } from "../../constants/scenario";
import type { ScenarioItem, ScenarioOutletContext } from "../../types/scenarioType";

const ScenarioPage = () => {
  const navigate = useNavigate();

  // TODO: 추후 React Query + 실제 API(DB) 조회/변경으로 교체 예정
  const [myScenarios, setMyScenarios] = useState<ScenarioItem[]>(
    getMyScenariosSnapshot()
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  const scenarioOutletContext: ScenarioOutletContext = { myScenarios };
  const outlet = useOutlet(scenarioOutletContext);

  if (outlet) {
    return outlet;
  }

  const moveToLevelSelect = (scenarioId: string) => {
    navigate(`/ai-practice/scenario/${scenarioId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitleInput("");
    setDescriptionInput("");
  };

  const handleCreateScenario = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = titleInput.trim();
    if (!trimmedTitle) {
      return;
    }

    setIsCreating(true);
    try {
      const createdScenario = await createScenarioRequest({
        title: trimmedTitle,
        description: descriptionInput,
      });
      setMyScenarios((prev) => [createdScenario, ...prev]);
      closeModal();
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteScenario = async (scenarioId: string) => {
    await deleteMyScenarioRequest(scenarioId);
    setMyScenarios((prev) => prev.filter((scenario) => scenario.id !== scenarioId));
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 pb-1 md:gap-8">
        <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-[32px]">
              시나리오 대화 연습
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              연습하고 싶은 시나리오를 선택하세요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-100 transition hover:brightness-105 md:min-w-[162px]"
          >
            <Plus size={18} />
            시나리오 추가
          </button>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <UserRoundPlus size={18} className="text-emerald-500" />
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[26px]">
              나만의 시나리오
            </h2>
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-100 px-2 text-xs font-bold text-emerald-700">
              {myScenarios.length}
            </span>
          </div>

          {myScenarios.length === 0 ? (
            <div className="flex min-h-[210px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400">
                <Plus size={24} />
              </div>
              <p className="text-sm font-medium text-slate-500 sm:text-base">
                아직 추가된 시나리오가 없습니다.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                우측 상단 버튼을 눌러 나만의 상황을 만들어보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-500" />
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[26px]">
              추천 시나리오
            </h2>
          </div>

          <div className="space-y-3">
            {RECOMMENDED_SCENARIOS.map((scenario) => (
              <ScenarioRowCard
                key={scenario.id}
                scenario={scenario}
                onClick={() => moveToLevelSelect(scenario.id)}
              />
            ))}
          </div>
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
