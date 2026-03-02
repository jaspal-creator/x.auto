export enum STATUS {
  /* eslint-disable */
  // Authentication and Authorization Errors
  Unauthorized = 'Unauthorized', // Generic error when the user is not authorized (e.g., not logged in)
  InvalidCredentials = 'Invalid Credentials', // When the user provides wrong credentials (username/password)
  UserNotFound = 'User Not Found', // When the system cannot find the user
  LoginFailed = 'Login Failed', // User-friendly message for login failures (username not found or wrong credentials)
  TokenExpired = 'Token Expired', // When an authentication token has expired
  Forbidden = 'Forbidden', // When the user does not have permission to access the resource

  // Validation Errors
  ValidationError = 'Validation Error', // Generic validation failure
  MissingFields = 'Missing Fields', // When required fields are missing in the request
  InvalidEmailFormat = 'Invalid Email Format', // When an email doesn't have a valid format
  InvalidPhoneNumber = 'Invalid Phone Number', // When a phone number is not in the correct format
  PasswordTooWeak = 'Password Too Weak', // When the password is too weak (e.g., doesn't meet complexity requirements)

  // Database or Internal Errors
  InternalServerError = 'Internal Server Error', // Generic server error
  DatabaseConnectionError = 'Database Connection Error', // When there is a database connection failure
  RecordNotFound = 'Record Not Found', // When the requested record cannot be found in the database
  DatabaseQueryError = 'Database Query Error', // When a database query fails for some reason

  // Business Logic Errors
  InsufficientFunds = 'Insufficient Funds', // For financial applications, when the user has insufficient funds
  ItemNotAvailable = 'Item Not Available', // When a requested item is out of stock or unavailable
  MaxAttemptsExceeded = 'Max Attempts Exceeded', // When the user exceeds the max allowed attempts (e.g., for login)

  // External Service Errors
  ExternalServiceTimeout = 'External Service Timeout', // When a third-party service times out
  ExternalServiceUnavailable = 'External Service Unavailable', // When a third-party service is unavailable

  // Resource Errors
  ResourceNotFound = 'Resource Not Found', // When a specific resource cannot be found
  FileUploadFailed = 'File Upload Failed', // When a file upload fails
  FileTooLarge = 'File Too Large', // When the uploaded file exceeds the maximum allowed size

  // PDF Generation Errors
  PdfGenerationError = 'PDF Generation Error', // When PDF generation fails
  PdfLoadError = 'PDF Load Error', // When PDF data loading fails
  PdfSaveError = 'PDF Save Error', // When PDF saving fails

  // Rate Limiting Errors
  TooManyRequests = 'Too Many Requests', // When too many requests are made in a short time (rate limiting)

  // Success/Error Codes
  Success = 'Success', // For success responses (e.g., data successfully retrieved or updated)
  Error = 'Error', // For a generic error

  // Custom Status
  CarAlreadyInDatabase = 'Car Already In Database', // When a car is already present in the database
  CustomerAlreadyInDatabase = 'Customer Already In Database',
  CustomerHasInvoices = 'This customer has invoices!',
  UserAlreadyExists = 'A user with this login already exists',
  AdminUserCannotBeDeleted = 'Administrator accounts cannot be deleted. Please change the role to USER first, then delete.',

  // Edit Report Expired
  ReportExpired = 'The report has expired. The editing time window is limited to 7 days from creation.'

  /* eslint-enable */
}

export interface Response<T = any> {
  Success?: T;
  Error?: {
    msg: any;
  };
}
