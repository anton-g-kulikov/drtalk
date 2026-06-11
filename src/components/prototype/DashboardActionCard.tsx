type DashboardActionCardProps = {
  label: string;
  description: string;
  onClick?: () => void;
};

export function DashboardActionCard({
  label,
  description,
  onClick,
}: DashboardActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="wireframe-card p-4 bg-white hover:bg-black hover:text-white cursor-pointer transition-all group text-left w-full"
    >
      <h4 className="font-bold uppercase text-[10px] tracking-tight">{label}</h4>
      <p className="text-[8px] uppercase opacity-70 group-hover:opacity-100">{description}</p>
    </button>
  );
}
