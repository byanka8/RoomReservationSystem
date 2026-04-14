import Log from "@/models/Log";
import connectToDatabase from "./db";

export type LogEventType =
  | "AUTH_LOGIN_SUCCESS"
  | "AUTH_LOGIN_FAILURE"
  | "AUTH_REGISTER_SUCCESS"
  | "AUTH_REGISTER_FAILURE"
  | "AUTH_LOGOUT"
  | "AUTH_TOKEN_EXPIRED"
  | "AUTH_INVALID_TOKEN"
  | "ACCESS_DENIED"
  | "ACCESS_SUCCESS"
  | "VALIDATION_FAILURE"
  | "SECURITY_QUESTION_SUCCESS"
  | "SECURITY_QUESTION_FAILURE"
  | "PASSWORD_CHANGE_SUCCESS"
  | "PASSWORD_CHANGE_FAILURE"
  | "PASSWORD_RESET_SUCCESS"
  | "PASSWORD_RESET_FAILURE"
  | "ACCOUNT_DISABLED"
  | "ACCOUNT_ENABLED"
  | "RESOURCE_CREATED"
  | "RESOURCE_UPDATED"
  | "RESOURCE_DELETED";

export interface LogEntry {
  eventType: LogEventType;
  userId?: string | null;
  userEmail?: string;
  ipAddress?: string;
  method?: string;
  endpoint?: string;
  status: "success" | "failure";
  message: string;
  errorDetails?: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

/**
 * Create a log entry in the database
 */
export async function createLog(logData: LogEntry): Promise<void> {
  try {
    await connectToDatabase();
    await Log.create({
      eventType: logData.eventType,
      userId: logData.userId || null,
      userEmail: logData.userEmail,
      ipAddress: logData.ipAddress,
      method: logData.method,
      endpoint: logData.endpoint,
      status: logData.status,
      message: logData.message,
      errorDetails: logData.errorDetails,
      resourceType: logData.resourceType,
      resourceId: logData.resourceId,
      metadata: logData.metadata,
    });
  } catch (error) {
    // Log to console as fallback if database logging fails
    console.error("Failed to create log entry:", error);
    console.log("Log data that failed:", logData);
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Log authentication success
 */
export async function logAuthSuccess(
  userId: string,
  userEmail: string,
  ipAddress: string
): Promise<void> {
  await createLog({
    eventType: "AUTH_LOGIN_SUCCESS",
    userId,
    userEmail,
    ipAddress,
    endpoint: "/api/login",
    method: "POST",
    status: "success",
    message: `User ${userEmail} logged in successfully`,
  });
}

/**
 * Log authentication failure
 */
export async function logAuthFailure(
  userEmail: string,
  ipAddress: string,
  reason: string
): Promise<void> {
  await createLog({
    eventType: "AUTH_LOGIN_FAILURE",
    userEmail,
    ipAddress,
    endpoint: "/api/login",
    method: "POST",
    status: "failure",
    message: `Failed login attempt for ${userEmail}`,
    errorDetails: reason,
  });
}

/**
 * Log registration
 */
export async function logRegistration(
  userEmail: string,
  ipAddress: string,
  success: boolean,
  reason?: string
): Promise<void> {
  await createLog({
    eventType: success ? "AUTH_REGISTER_SUCCESS" : "AUTH_REGISTER_FAILURE",
    userEmail,
    ipAddress,
    endpoint: "/api/register",
    method: "POST",
    status: success ? "success" : "failure",
    message: success
      ? `New user registered: ${userEmail}`
      : `Registration failed for ${userEmail}`,
    errorDetails: reason,
  });
}

/**
 * Log validation failure
 */
export async function logValidationFailure(
  userEmail: string | undefined,
  ipAddress: string,
  endpoint: string,
  validationError: string,
  userId?: string
): Promise<void> {
  await createLog({
    eventType: "VALIDATION_FAILURE",
    userId,
    userEmail,
    ipAddress,
    endpoint,
    method: "POST",
    status: "failure",
    message: `Validation failed on ${endpoint}`,
    errorDetails: validationError,
  });
}

/**
 * Log access control event
 */
export async function logAccessControl(
  userId: string,
  userEmail: string,
  ipAddress: string,
  endpoint: string,
  allowed: boolean,
  reason?: string
): Promise<void> {
  await createLog({
    eventType: allowed ? "ACCESS_SUCCESS" : "ACCESS_DENIED",
    userId,
    userEmail,
    ipAddress,
    endpoint,
    method: "POST",
    status: allowed ? "success" : "failure",
    message: allowed
      ? `Access granted to ${endpoint} for ${userEmail}`
      : `Access denied to ${endpoint} for ${userEmail}`,
    errorDetails: reason,
  });
}

/**
 * Log logout
 */
export async function logLogout(
  userId: string,
  userEmail: string,
  ipAddress: string
): Promise<void> {
  await createLog({
    eventType: "AUTH_LOGOUT",
    userId,
    userEmail,
    ipAddress,
    endpoint: "/api/logout",
    method: "POST",
    status: "success",
    message: `User ${userEmail} logged out`,
  });
}

/**
 * Log account disabled
 */
export async function logAccountDisabled(
  userId: string,
  userEmail: string,
  ipAddress: string,
  reason: string
): Promise<void> {
  await createLog({
    eventType: "ACCOUNT_DISABLED",
    userId,
    userEmail,
    ipAddress,
    status: "success",
    message: `Account disabled for ${userEmail}`,
    errorDetails: reason,
  });
}

/**
 * Log password change
 */
export async function logPasswordChange(
  userId: string,
  userEmail: string,
  ipAddress: string,
  success: boolean,
  reason?: string
): Promise<void> {
  await createLog({
    eventType: success ? "PASSWORD_CHANGE_SUCCESS" : "PASSWORD_CHANGE_FAILURE",
    userId,
    userEmail,
    ipAddress,
    endpoint: "/api/changePassword",
    method: "POST",
    status: success ? "success" : "failure",
    message: success
      ? `Password changed for ${userEmail}`
      : `Password change failed for ${userEmail}`,
    errorDetails: reason,
  });
}

/**
 * Log security question verification
 */
export async function logSecurityQuestion(
  userId: string,
  userEmail: string,
  ipAddress: string,
  success: boolean
): Promise<void> {
  await createLog({
    eventType: success
      ? "SECURITY_QUESTION_SUCCESS"
      : "SECURITY_QUESTION_FAILURE",
    userId,
    userEmail,
    ipAddress,
    endpoint: "/api/verifySecurity",
    method: "POST",
    status: success ? "success" : "failure",
    message: success
      ? `Security question verified for ${userEmail}`
      : `Security question verification failed for ${userEmail}`,
  });
}

/**
 * Log resource operation (CRUD)
 */
export async function logResourceOperation(
  operation: "CREATED" | "UPDATED" | "DELETED",
  userId: string,
  userEmail: string,
  resourceType: string,
  resourceId: string,
  ipAddress: string,
  success: boolean,
  reason?: string
): Promise<void> {
  await createLog({
    eventType: `RESOURCE_${operation}` as LogEventType,
    userId,
    userEmail,
    ipAddress,
    status: success ? "success" : "failure",
    message: `${resourceType} ${operation.toLowerCase()} by ${userEmail}`,
    resourceType,
    resourceId,
    errorDetails: reason,
  });
}
