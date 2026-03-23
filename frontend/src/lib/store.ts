import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import api, { assertApiConfigured } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
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
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project | null) => void;
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
          assertApiConfigured();
          const response = await api.post("/auth/login", { email, password });
          const data = response.data;
          const token = data.access_token as string;
          const apiUser = data.user;

          Cookies.set("auth_token", token, { expires: 7, sameSite: "lax" });

          set({
            user: {
              id: apiUser.id,
              email: apiUser.email,
              username: apiUser.username,
              name: apiUser.username || apiUser.email,
            },
            token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        Cookies.remove("auth_token");
        set({ user: null, token: null });
      },
      setUser: (user: User | null) => {
        set({ user });
      },
      setToken: (token: string | null) => {
        if (token) {
          Cookies.set("auth_token", token, { expires: 7, sameSite: "lax" });
        } else {
          Cookies.remove("auth_token");
        }
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
  setCurrentProject: (project: Project | null) => {
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

export type { Project, User };
