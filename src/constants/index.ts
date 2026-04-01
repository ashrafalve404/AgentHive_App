export const APP_NAME = 'AgentHive';
export const BUSINESS_NAME = 'Your Business';

export const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  messenger: 'Messenger',
  instagram: 'Instagram',
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  lost: 'Lost',
};

export const CONVERSATION_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  waiting: 'Waiting',
  resolved: 'Resolved',
  archived: 'Archived',
};

export const QUICK_REPLIES = [
  "Thank you for reaching out!",
  "Let me look into that for you.",
  "I'll get back to you shortly.",
  "Could you provide more details?",
  "Your booking has been confirmed.",
];

export const FILTER_TABS = {
  conversations: ['All', 'Active', 'Waiting', 'AI Handled', 'Human'],
  bookings: ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed'],
  leads: ['All', 'New', 'Contacted', 'Qualified', 'Converted'],
};

export const ANIMATION_DURATION = 300;
export const DEBOUNCE_DELAY = 300;
export const PAGE_SIZE = 20;
