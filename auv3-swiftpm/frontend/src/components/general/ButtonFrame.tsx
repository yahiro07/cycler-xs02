export const ButtonFrame = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <button type="button" onClick={onClick} className="cursor-pointer block">
      {children}
    </button>
  );
};
