import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  narrativeMode: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
}

interface UIState {
  sidebarOpen: boolean;
  activeTab: string;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // API call would go here
          // const response = await api.post("/auth/login", { email, password });
          // set({ user: response.data.user, token: response.data.token });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null });
      },
      setUser: (user: User) => {
        set({ user });
      },
      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export const useProjectStore = create<ProjectState>()((set) => ({
  currentProject: null,
  projects: [],
  setCurrentProject: (project: Project) => {
    set({ currentProject: project });
  },
  setProjects: (projects: Project[]) => {
    set({ projects });
  },
  addProject: (project: Project) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },
}));

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  activeTab: "overview",
  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },
  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
  },
}));
