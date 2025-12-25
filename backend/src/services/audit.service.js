import { AuditLog } from "../models/auditLog.model.js";

/**
 * Record an audit entry
 * @param {Object} params - Log details
 * @param {string} params.action - Action name (e.g., "CREATE", "UPDATE", "DELETE")
 * @param {string} params.entityType - Resource name (e.g., "Product", "User")
 * @param {string} params.entityId - The ID of the modified document
 * @param {string} params.performedBy - The User ID of the admin performing the action
 * @param {Object} [params.oldValue] - Snapshot of data BEFORE change
 * @param {Object} [params.newValue] - Snapshot of data AFTER change
 * @param {import("express").Request} [params.req] - Request object to capture IP/UserAgent
 */
const log = async ({
  action,
  entityType,
  entityId,
  performedBy,
  oldValue,
  newValue,
  req,
}) => {
  try {
    await AuditLog.create({
      action,
      entityType,
      entityId,
      performedBy,
      oldValue,
      newValue,
      ipAddress: req?.ip || "Unknown", // Handle missing IP
      userAgent: req?.headers["user-agent"] || "Unknown", // Handle missing UA
    });
  } catch (error) {
    console.error("Audit Logging Error:", error);
    // We intentionally swallow the error so a logging failure
    // doesn't crash the main application flow.
  }
};

/**
 * Fetch logs (Flexible: All logs OR specific entity history)
 * @param {string|null} [entityType] - Filter by type (optional)
 * @param {string|null} [entityId] - Filter by ID (optional)
 * @returns {Promise<Array>} List of audit logs
 */
const getEntityHistory = async (entityType = null, entityId = null) => {
  const query = {};

  // Only add to query if they are provided
  if (entityType) query.entityType = entityType;
  if (entityId) query.entityId = entityId;

  return await AuditLog.find(query)
    .populate("performedBy", "name email") // Added email for better context
    .sort({ createdAt: -1 })
    .limit(100);
};

export default {
  log,
  getEntityHistory,
};
