export const API_MESSAGES = {
  SUCCESS: 'Request processed successfully',
  VALIDATION_ERROR: 'Validation failed',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  UNEXPECTED_ERROR: 'An unexpected server error occurred',
  METHOD_NOT_ALLOWED: 'HTTP method not allowed',
  COMPANY_REQUIRED: 'Company name or ticker is required',
  PIPELINE_ERROR: 'Research pipeline execution failed',
} as const;
