export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  order_index: number;
  created_at: string;
  links?: Link[];
}

export interface Link {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  url: string;
  favicon: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, color: string) => Promise<void>;
  updateCategory: (id: string, name: string, color: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
}

export interface LinkState {
  links: Link[];
  isLoading: boolean;
  fetchLinks: (categoryId?: string) => Promise<void>;
  createLink: (title: string, url: string, categoryId?: string) => Promise<void>;
  updateLink: (id: string, title: string, url: string, categoryId?: string) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (linkIds: string[]) => Promise<void>;
}
