// context/CurrencyContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate from USD to this currency
  flag?: string;
}

// Available currencies - most commonly used
// Available currencies - most commonly used for Sri Lankan travel agency (Alphabetical by code)
export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1, flag: "🇺🇸" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67, flag: "🇦🇪" },
  { code: "ARS", symbol: "$", name: "Argentine Peso", rate: 850, flag: "🇦🇷" },
  {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    rate: 1.51,
    flag: "🇦🇺",
  },
  {
    code: "BHD",
    symbol: ".د.ب",
    name: "Bahraini Dinar",
    rate: 0.38,
    flag: "🇧🇭",
  },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 5.05, flag: "🇧🇷" },
  {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    rate: 1.36,
    flag: "🇨🇦",
  },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", rate: 0.91, flag: "🇨🇭" },
  { code: "CLP", symbol: "$", name: "Chilean Peso", rate: 950, flag: "🇨🇱" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.2, flag: "🇨🇳" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", rate: 6.95, flag: "🇩🇰" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", rate: 48.5, flag: "🇪🇬" },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.93, flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79, flag: "🇬🇧" },
  {
    code: "IDR",
    symbol: "Rp",
    name: "Indonesian Rupiah",
    rate: 15600,
    flag: "🇮🇩",
  },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel", rate: 3.75, flag: "🇮🇱" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12, flag: "🇮🇳" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 148.5, flag: "🇯🇵" },
  {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    rate: 1330.0,
    flag: "🇰🇷",
  },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", rate: 0.31, flag: "🇰🇼" },
  {
    code: "LKR",
    symbol: "Rs",
    name: "Sri Lankan Rupee",
    rate: 300,
    flag: "🇱🇰",
  },
  { code: "MUR", symbol: "₨", name: "Mauritian Rupee", rate: 46.5, flag: "🇲🇺" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", rate: 17.2, flag: "🇲🇽" },
  {
    code: "MYR",
    symbol: "RM",
    name: "Malaysian Ringgit",
    rate: 4.73,
    flag: "🇲🇾",
  },
  {
    code: "NOK",
    symbol: "kr",
    name: "Norwegian Krone",
    rate: 11.05,
    flag: "🇳🇴",
  },
  {
    code: "NZD",
    symbol: "NZ$",
    name: "New Zealand Dollar",
    rate: 1.67,
    flag: "🇳🇿",
  },
  { code: "OMR", symbol: "﷼", name: "Omani Rial", rate: 0.38, flag: "🇴🇲" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", rate: 56.5, flag: "🇵🇭" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", rate: 4.05, flag: "🇵🇱" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", rate: 3.64, flag: "🇶🇦" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", rate: 92.5, flag: "🇷🇺" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 3.75, flag: "🇸🇦" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", rate: 10.85, flag: "🇸🇪" },
  {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    rate: 1.34,
    flag: "🇸🇬",
  },
  { code: "THB", symbol: "฿", name: "Thai Baht", rate: 35.5, flag: "🇹🇭" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", rate: 32.5, flag: "🇹🇷" },
  {
    code: "VND",
    symbol: "₫",
    name: "Vietnamese Dong",
    rate: 25400,
    flag: "🇻🇳",
  },
  {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    rate: 18.8,
    flag: "🇿🇦",
  },
];

// Store the latest exchange rates
let EXCHANGE_RATES: Record<string, number> = { USD: 1 };

interface CurrencyContextType {
  currencies: Currency[];
  currentCurrency: Currency;
  setCurrentCurrency: (currency: Currency) => void;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
  isLoading: boolean;
  error: string | null;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

// Hook with default values during prerendering
export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    // Default currency is USD
    const defaultCurrency = SUPPORTED_CURRENCIES[0];

    return {
      currencies: SUPPORTED_CURRENCIES,
      currentCurrency: defaultCurrency,
      setCurrentCurrency: () => {},
      convertPrice: (priceInUSD: number) => priceInUSD,
      formatPrice: (priceInUSD: number) => `$${priceInUSD.toFixed(2)}`,
      isLoading: false,
      error: null,
      refreshRates: async () => {},
    };
  }

  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currencies, setCurrencies] =
    useState<Currency[]>(SUPPORTED_CURRENCIES);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(
    SUPPORTED_CURRENCIES[0],
  ); // USD as default
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load saved currency preference
  useEffect(() => {
    if (!isMounted) return;

    try {
      const savedCurrencyCode = localStorage.getItem("preferredCurrency");
      if (savedCurrencyCode) {
        const savedCurrency = SUPPORTED_CURRENCIES.find(
          (c) => c.code === savedCurrencyCode,
        );
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
      }
    } catch (err) {
      console.error("Error accessing localStorage:", err);
    }
  }, [isMounted]);

  // Save currency preference
  useEffect(() => {
    if (!isMounted) return;

    try {
      localStorage.setItem("preferredCurrency", currentCurrency.code);
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }, [currentCurrency, isMounted]);

  // Update currencies with latest rates
  const updateCurrenciesWithRates = (rates: Record<string, number>) => {
    const updatedCurrencies = SUPPORTED_CURRENCIES.map((currency) => {
      const rate = rates[currency.code.toLowerCase()];
      if (rate) {
        return { ...currency, rate };
      }
      return currency;
    });
    setCurrencies(updatedCurrencies);

    // Update current currency if it changed
    setCurrentCurrency((prev) => {
      const updated = updatedCurrencies.find((c) => c.code === prev.code);
      return updated || prev;
    });
  };

  // Fetch latest exchange rates
  const refreshRates = async () => {
    if (typeof window === "undefined") return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch USD to all currencies
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      const data = await response.json();
      const rates = data.usd;

      // Store rates for later use
      EXCHANGE_RATES = rates;

      // Update currencies with new rates
      updateCurrenciesWithRates(rates);
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
      setError("Failed to fetch exchange rates. Using cached rates.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rates on mount
  useEffect(() => {
    if (isMounted) {
      refreshRates();
    }
  }, [isMounted]);

  /**
   * Convert price from USD to selected currency
   * Formula: USD → Target Currency
   */
  const convertPrice = (priceInUSD: number): number => {
    if (currentCurrency.code === "USD") {
      return priceInUSD;
    }

    // Convert USD directly to target currency
    const priceInTargetCurrency = priceInUSD * currentCurrency.rate;

    // Return with 2 decimal places
    return Number(priceInTargetCurrency.toFixed(2));
  };

  // Format price with currency symbol
  const formatPrice = (priceInUSD: number): string => {
    const converted = convertPrice(priceInUSD);
    const { symbol, code } = currentCurrency;

    // Format based on currency
    if (code === "JPY" || code === "KRW") {
      // No decimals for Yen and Won
      return `${symbol}${Math.round(converted)}`;
    }

    if (code === "LKR" || code === "INR") {
      // No decimals for Rupees
      return `${symbol} ${Math.round(converted)}`;
    }

    // 2 decimal places for most currencies
    return `${symbol} ${converted.toFixed(2)}`;
  };

  const value = {
    currencies,
    currentCurrency,
    setCurrentCurrency,
    convertPrice,
    formatPrice,
    isLoading,
    error,
    refreshRates,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
