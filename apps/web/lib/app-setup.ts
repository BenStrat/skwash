export const phase0MigrationPath = 'packages/db/migrations/001_initial.sql';

const missingDatabaseSchemaMessage = `Skwash is connected to Supabase, but the Phase 0 tables are missing. Run ${phase0MigrationPath} against your Supabase project, then reload.`;

const missingSchemaPatterns = [
  /Could not find the table ['"][^'"]+['"] in the schema cache/i,
  /relation ['"]?[\w.]+['"]? does not exist/i,
  /schema cache/i
];

export class AppSetupError extends Error {
  readonly status: number;

  constructor(message = missingDatabaseSchemaMessage, status = 503) {
    super(message);
    this.name = 'AppSetupError';
    this.status = status;
  }
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return null;
}

export function getAppSetupError(error: unknown) {
  const message = getErrorMessage(error);

  if (!message) {
    return null;
  }

  if (error instanceof AppSetupError) {
    return error;
  }

  if (missingSchemaPatterns.some((pattern) => pattern.test(message))) {
    return new AppSetupError();
  }

  return null;
}

export function isAppSetupError(error: unknown): error is AppSetupError {
  return error instanceof AppSetupError;
}
