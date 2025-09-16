export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-full h-auto w-full flex flex-col pb-32" id="content">
      {children}
    </main>
  );
}
