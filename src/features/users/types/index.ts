export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    favoriteCategories: string[];
    notificationSettings: {
      email: boolean;
      push: boolean;
    };
  };
}

export interface UserResponse {
  data: User;
}

export interface ReadingHistoryItem {
  bookId: string;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'abandoned';
}

export interface ReadingHistoryResponse {
  data: ReadingHistoryItem[];
}
