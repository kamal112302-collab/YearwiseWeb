export function PromoBanner({ message }: { message: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-brand-green px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      <p className="text-balance leading-snug">{message}</p>
    </div>
  );
}
