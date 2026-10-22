import QuizFlow from "@/components/quiz/QuizFlow";

// El quiz es siempre oscuro, sin importar el tema elegido en la landing.
export default function QuizPage() {
  return (
    <div className="min-h-screen bg-ink font-sans text-white">
      <QuizFlow />
    </div>
  );
}
