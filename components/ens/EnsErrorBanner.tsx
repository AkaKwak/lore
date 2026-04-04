import type { EnsLoadError } from "@/lib/ens";

const titles: Record<EnsLoadError["code"], string> = {
  CONFIG: "Configuration",
  INVALID_NAME: "Invalid name",
  NOT_FOUND: "Not found",
  RPC_ERROR: "Network error",
};

export function EnsErrorBanner({ error }: { error: EnsLoadError }) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
      role="alert"
    >
      <p className="font-medium">{titles[error.code]}</p>
      <p className="mt-1 text-red-800 dark:text-red-200">{error.message}</p>
    </div>
  );
}
