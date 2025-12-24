import { AuditLog } from "../models/auditLog.model.js";

/**
 * Record an audit entry
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
      ipAddress: req?.ip,
      userAgent: req?.headers["user-agent"],
    });
  } catch (error) {
    console.error("Audit Logging Error:", error);
    // We usually don't throw an error here because we don't want to
    // crash the main request if the logging fails.
  }
};
/**
 * Fetch logs (Flexible: All logs OR specific entity history)
 */
const getEntityHistory = async (entityType = null, entityId = null) => {
  const query = {};

  // Only add to query if they are provided
  if (entityType) query.entityType = entityType;
  if (entityId) query.entityId = entityId;

  return await AuditLog.find(query)
    .populate("performedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(100);
};

export default {
  log,
  getEntityHistory,
};
