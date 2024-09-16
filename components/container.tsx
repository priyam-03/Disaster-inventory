export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex-grow bg-white w-full mx-auto border-l border-r">
      {/* <div className="flex-grow max-w-[1100px] mx-auto border-l border-r w-full"> */}
        {children}
      {/* </div> */}
    </div>
  );
}
