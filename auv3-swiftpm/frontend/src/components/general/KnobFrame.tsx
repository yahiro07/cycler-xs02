export const KnobFrame = ({
  children,
  onPointerDown,
}: {
  children: React.ReactNode;
  onPointerDown?: (e: React.PointerEvent<HTMLElement>) => void;
}) => {
  return (
    <div onPointerDown={onPointerDown} className="cursor-pointer">
      {children}
    </div>
  );
};
