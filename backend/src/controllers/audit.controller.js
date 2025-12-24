import auditService from '../services/audit.service.js';

/**
 * @desc    Get all system audit logs
 * @route   GET /api/v1/admin/audit-logs
 */
const getAuditLogs = async (req, res, next) => {
  try {
    // Passing nulls to get everything
    const logs = await auditService.getEntityHistory(null, null);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get history for a specific entity (e.g., specific Product)
 * @route   GET /api/v1/admin/audit-logs/:type/:id
 */
const getSpecificEntityHistory = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const logs = await auditService.getEntityHistory(type, id);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

export { getAuditLogs, getSpecificEntityHistory };