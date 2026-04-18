"use client"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CommonService } from "@/services/commonService";
import { AllCategoriesData } from "@/types/common-types";

interface CommonContextProps {
  categories: AllCategoriesData | null;
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
}

const CommonContext = createContext<CommonContextProps>({
  categories: null,
  loading: false,
  error: null,
  refreshCategories: async () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const CommonProvider = ({ children }: ProviderProps) => {
  const [categories, setCategories] = useState<AllCategoriesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CommonService.getAllCategories();
      setCategories(data);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CommonContext.Provider
      value={{ categories, loading, error, refreshCategories: fetchCategories }}
    >
      {children}
    </CommonContext.Provider>
  );
};

// Custom hook for easy access
export const useCommon = () => useContext(CommonContext);
