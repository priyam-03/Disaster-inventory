export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-grow w-full">
      {children}
    </div>
  );
}
