import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'LOGIN']
  },
  entityType: {
    type: String,
    required: true, // e.g., 'Product', 'User', 'Role'
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  oldValue: { type: Object }, // State before the change
  newValue: { type: Object }, // State after the change
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);