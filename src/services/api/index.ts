import type { ApiResponse, DashboardStats, Conversation, Message, Booking, Lead, AppNotification, User } from '@src/types';
import {
  mockDashboardStats,
  mockConversations,
  mockMessages,
  mockBookings,
  mockLeads,
  mockNotifications,
  mockUser,
} from '@src/mocks';

const USE_MOCK = true;

function mockResponse<T>(data: T, delay: number = 800): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, success: true });
    }, delay);
  });
}

export const authService = {
  login: (email: string, _password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    if (USE_MOCK) {
      return mockResponse({
        user: { ...mockUser, email },
        token: 'mock_jwt_token_' + Date.now(),
      }, 1500);
    }
    // Replace with: return api.post('/auth/login', { email, password });
    throw new Error('Not implemented');
  },

  verifyOtp: (code: string): Promise<ApiResponse<{ verified: boolean }>> => {
    if (USE_MOCK) {
      return mockResponse({ verified: code === '1234' });
    }
    throw new Error('Not implemented');
  },

  getProfile: (): Promise<ApiResponse<User>> => {
    if (USE_MOCK) return mockResponse(mockUser);
    throw new Error('Not implemented');
  },

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> => {
    if (USE_MOCK) return mockResponse({ ...mockUser, ...data });
    throw new Error('Not implemented');
  },
};

export const dashboardService = {
  getStats: (): Promise<ApiResponse<DashboardStats>> => {
    if (USE_MOCK) return mockResponse(mockDashboardStats);
    throw new Error('Not implemented');
  },
};

export const conversationService = {
  getAll: (): Promise<ApiResponse<Conversation[]>> => {
    if (USE_MOCK) return mockResponse(mockConversations);
    throw new Error('Not implemented');
  },

  getById: (id: string): Promise<ApiResponse<Conversation | undefined>> => {
    if (USE_MOCK) {
      return mockResponse(mockConversations.find((c) => c.id === id));
    }
    throw new Error('Not implemented');
  },

  getMessages: (conversationId: string): Promise<ApiResponse<Message[]>> => {
    if (USE_MOCK) {
      return mockResponse(mockMessages.filter((m) => m.conversationId === conversationId));
    }
    throw new Error('Not implemented');
  },

  sendMessage: (conversationId: string, content: string): Promise<ApiResponse<Message>> => {
    if (USE_MOCK) {
      const newMessage: Message = {
        id: 'msg_' + Date.now(),
        conversationId,
        content,
        type: 'text',
        sender: 'human',
        senderName: 'Sarah Mitchell',
        timestamp: new Date().toISOString(),
      };
      return mockResponse(newMessage, 300);
    }
    throw new Error('Not implemented');
  },

  handoffToHuman: (conversationId: string): Promise<ApiResponse<Conversation>> => {
    if (USE_MOCK) {
      const conv = mockConversations.find((c) => c.id === conversationId);
      if (conv) conv.handlerType = 'human';
      return mockResponse(conv!, 500);
    }
    throw new Error('Not implemented');
  },

  resumeAI: (conversationId: string): Promise<ApiResponse<Conversation>> => {
    if (USE_MOCK) {
      const conv = mockConversations.find((c) => c.id === conversationId);
      if (conv) conv.handlerType = 'ai';
      return mockResponse(conv!, 500);
    }
    throw new Error('Not implemented');
  },
};

export const bookingService = {
  getAll: (): Promise<ApiResponse<Booking[]>> => {
    if (USE_MOCK) return mockResponse(mockBookings);
    throw new Error('Not implemented');
  },

  getById: (id: string): Promise<ApiResponse<Booking | undefined>> => {
    if (USE_MOCK) {
      return mockResponse(mockBookings.find((b) => b.id === id));
    }
    throw new Error('Not implemented');
  },

  updateStatus: (id: string, status: string): Promise<ApiResponse<Booking>> => {
    if (USE_MOCK) {
      const booking = mockBookings.find((b) => b.id === id);
      if (booking) {
        booking.status = status as Booking['status'];
        booking.updatedAt = new Date().toISOString();
        booking.statusHistory.push({
          status: status as Booking['status'],
          timestamp: new Date().toISOString(),
        });
      }
      return mockResponse(booking!, 500);
    }
    throw new Error('Not implemented');
  },
};

export const leadService = {
  getAll: (): Promise<ApiResponse<Lead[]>> => {
    if (USE_MOCK) return mockResponse(mockLeads);
    throw new Error('Not implemented');
  },

  getById: (id: string): Promise<ApiResponse<Lead | undefined>> => {
    if (USE_MOCK) {
      return mockResponse(mockLeads.find((l) => l.id === id));
    }
    throw new Error('Not implemented');
  },
};

export const notificationService = {
  getAll: (): Promise<ApiResponse<AppNotification[]>> => {
    if (USE_MOCK) return mockResponse(mockNotifications);
    throw new Error('Not implemented');
  },

  markAsRead: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK) {
      const notif = mockNotifications.find((n) => n.id === id);
      if (notif) notif.read = true;
      return mockResponse({ success: true });
    }
    throw new Error('Not implemented');
  },

  markAllAsRead: (): Promise<ApiResponse<{ success: boolean }>> => {
    if (USE_MOCK) {
      mockNotifications.forEach((n) => (n.read = true));
      return mockResponse({ success: true });
    }
    throw new Error('Not implemented');
  },
};
