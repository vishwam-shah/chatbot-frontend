// components/ThemeToggle.tsx
import { FaSun, FaMoon } from 'react-icons/fa';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeToggle = ({ isDarkMode, toggleTheme }: ThemeToggleProps) => {
  return (
    <button
      className="absolute top-4 right-4 p-2 rounded-full shadow-md"
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
    </button>
  );
};