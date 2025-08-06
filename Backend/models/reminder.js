const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weekStartDate: {
    type: Date,
    required: true,
  },
  weekEndDate: {
    type: Date,
    required: true,
  },
  reminders: [{
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['medication', 'checkup', 'nutrition', 'appointment', 'exercise', 'monitoring'],
      required: true,
    },
    icon: {
      type: String,
      default: '💊'
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  completionTracking: [{
    reminderId: String,
    date: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  compliancePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  aiGenerated: {
    type: Boolean,
    default: true
  },
  basedOnSymptoms: [String],
  basedOnConditions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Index for efficient queries
reminderSchema.index({ userId: 1, weekStartDate: 1 });

// Method to calculate compliance percentage
reminderSchema.methods.calculateCompliance = function() {
  const totalPossibleCompletions = this.reminders.length * 7; // 7 days per week
  const actualCompletions = this.completionTracking.filter(track => track.completed).length;
  
  this.compliancePercentage = totalPossibleCompletions > 0 
    ? Math.round((actualCompletions / totalPossibleCompletions) * 100)
    : 0;
    
  return this.compliancePercentage;
};

// Method to get current week's completion status
reminderSchema.methods.getCurrentWeekStatus = function() {
  const today = new Date();
  const weekStart = new Date(this.weekStartDate);
  const weekEnd = new Date(this.weekEndDate);
  
  if (today < weekStart || today > weekEnd) {
    return { active: false, daysRemaining: 0 };
  }
  
  const daysElapsed = Math.floor((today - weekStart) / (1000 * 60 * 60 * 24)) + 1;
  const daysRemaining = 7 - daysElapsed;
  
  return { 
    active: true, 
    daysElapsed, 
    daysRemaining,
    currentDay: daysElapsed 
  };
};

module.exports = mongoose.model('Reminder', reminderSchema);
