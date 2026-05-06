import { MessageSquare, Sparkles } from "lucide-react";

interface HomeMessageCardProps {
  message: string;
}

const HomeMessageCard = ({ message }: HomeMessageCardProps) => {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-blue-600 to-[#278DFD] p-6 text-white shadow-[0_8px_30px_rgba(39,141,253,0.3)] transition-transform hover:scale-[1.02]">
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2 text-blue-100 opacity-90">
          <Sparkles size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            오늘의 메시지
          </span>
        </div>
        <h2 className="break-keep text-[19px] font-extrabold leading-relaxed">
          "{message}"
        </h2>
      </div>

      <div className="absolute -bottom-4 -right-4 opacity-10">
        <MessageSquare size={140} color="#FFFFFF" />
      </div>
    </section>
  );
};

export default HomeMessageCard;
