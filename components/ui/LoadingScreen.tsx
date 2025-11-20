export default function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  );
}
