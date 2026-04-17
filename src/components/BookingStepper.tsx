"use client";

interface Props {
  /** 1 = Trip details, 2 = Your info, 3 = Payment, 4 = Done */
  current: 1 | 2 | 3 | 4;
}

const STEPS: { id: 1 | 2 | 3 | 4; label: string }[] = [
  { id: 1, label: "Trip" },
  { id: 2, label: "Your info" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Done" },
];

export default function BookingStepper({ current }: Props) {
  return (
    <ol className="mx-auto flex w-full max-w-3xl items-center gap-2 px-6 py-6 sm:gap-3">
      {STEPS.map((step, i) => {
        const isDone = step.id < current;
        const isCurrent = step.id === current;
        const isPending = step.id > current;

        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                isDone
                  ? "bg-sunset-orange text-white"
                  : isCurrent
                  ? "bg-gradient-to-br from-sunset-red via-sunset-orange to-sunset-gold text-white shadow-md shadow-sunset-orange/30 ring-4 ring-sunset-orange/15"
                  : "bg-black/5 text-foreground/40"
              }`}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isDone ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`hidden text-sm font-semibold sm:inline ${
                isPending ? "text-foreground/40" : "text-foreground"
              }`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-1 h-0.5 flex-1 rounded-full transition ${
                  isDone ? "bg-sunset-orange" : "bg-black/5"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
