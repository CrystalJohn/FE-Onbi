export default function PomodoroPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Pomodoro</h1>
      {/* TODO: Pomodoro config (studyDuration, shortBreakDuration, longBreakDuration, cyclesBeforeLongBreak) + study session history */}
    </div>
  );
}
