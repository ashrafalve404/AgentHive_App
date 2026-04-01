export type Channel = 'whatsapp' | 'messenger' | 'instagram';

export type ConversationStatus = 'active' | 'waiting' | 'resolved' | 'archived';

export type HandlerType = 'ai' | 'human';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export type NotificationType =
  | 'new_chat'
  | 'booking_update'
  | 'ai_handoff'
  | 'lead_activity'
  | 'system';

export type UserRole = 'owner' | 'manager' | 'agent' | 'booking_agent';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  businessName: string;
  businessId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  activeChats: number;
  pendingBookings: number;
  totalLeads: number;
  todayConversions: number;
  aiHandledToday: number;
  humanHandledToday: number;
  responseTime: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerAvatar?: string;
  channel: Channel;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: ConversationStatus;
  handlerType: HandlerType;
  tags: string[];
  customerId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'system';
  sender: 'customer' | 'ai' | 'human';
  senderName?: string;
  timestamp: string;
  imageUrl?: string;
  voiceDuration?: number;
}

export interface Booking {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  type: string;
  status: BookingStatus;
  price: number;
  currency: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  serviceDetails: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: string;
  };
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  source: Channel;
  status: LeadStatus;
  tags: string[];
  lastInteraction: string;
  notes?: string;
  createdAt: string;
  conversationsCount: number;
  bookingsCount: number;
  totalSpent: number;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
  data?: {
    conversationId?: string;
    bookingId?: string;
    leadId?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
