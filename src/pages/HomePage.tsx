import { useState } from "react";
import ContinueTrainingSection from "../components/home/ContinueTrainingSection";
import HomeMessageCard from "../components/home/HomeMessageCard";
import WeeklySummarySection from "../components/home/WeeklySummarySection";
import { getRandomEncouragementMessage } from "../constants/homeMessages";

const HomePage = () => {
  const [encouragementMessage] = useState(getRandomEncouragementMessage);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-7 animate-fade-in">
      <HomeMessageCard message={encouragementMessage} />
      <ContinueTrainingSection />
      <WeeklySummarySection />
    </div>
  );
};

export default HomePage;
