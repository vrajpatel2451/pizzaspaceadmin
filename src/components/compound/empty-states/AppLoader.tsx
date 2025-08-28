import { Bike } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./index.css";

interface AppLoaderProps {
  isLoading: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading }) => {
  const [isVisible, setIsVisible] = useState(isLoading);
  const [isExiting, setIsExiting] = useState(false);

  const foodEmojis = ["🍕", "🍔", "🥗", "🛒", "🥖", "🍎"];

  // Precompute all streak data once
  const streakData = useMemo(() => {
    const left = Array.from({ length: 4 }, () => ({
      offset: Math.random() * 20 - 10,
      lines: Array.from({ length: 3 }, () => ({
        width: Math.random() * 40 + 20,
      })),
    }));
    const right = Array.from({ length: 4 }, () => ({
      offset: Math.random() * 20 - 10,
      lines: Array.from({ length: 3 }, () => ({
        width: Math.random() * 40 + 20,
      })),
    }));
    return { left, right };
  }, []);

  useEffect(() => {
    if (!isLoading && isVisible && !isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 800);
    } else if (isLoading && !isVisible) {
      setIsVisible(true);
      setIsExiting(false);
    }
  }, [isLoading, isVisible, isExiting]);

  if (!isVisible) return null;

  return (
    <div
      className={`bg-nl-50 dark:bg-nd-900 fixed inset-0 z-50 flex items-center justify-center transition-all duration-800 ease-in-out ${
        isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="via-nl-100 dark:via-nd-900 absolute inset-0 bg-gradient-to-b from-purple-100/60 to-purple-100/60 dark:from-purple-900/20 dark:to-purple-900/20" />

      <div className="relative flex flex-col items-center space-y-8">
        {/* Speed lines and bike */}
        <div className="relative flex w-[300px] items-center justify-center">
          {/* Left streaks */}
          <div className="absolute left-0 flex w-[80px] flex-col space-y-2 opacity-10 dark:opacity-90">
            {streakData.left.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="flex space-x-1"
                style={{ marginLeft: `${group.offset}px` }}
              >
                {group.lines.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="h-1 rounded-full bg-gradient-to-r from-gray-600 via-purple-800 to-purple-900 opacity-40"
                    style={{
                      width: `${line.width}px`,
                      filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.3))",
                      animation: "speed-streak 0.4s ease-out infinite",
                      animationDelay: `-${Math.random() * 0.4}s`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Bike */}
          <div className="relative z-10">
            <Bike
              className="text-pl-600 dark:text-pl-400 h-16 w-16"
              style={{
                filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))",
                animation: "bike-bounce 1.5s ease-in-out infinite",
              }}
            />
            <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-purple-400/30 blur-xl" />
            <div
              className="absolute inset-2 h-12 w-12 animate-pulse rounded-full bg-purple-300/20 blur-lg"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          {/* Right streaks */}
          <div className="absolute right-0 flex w-[80px] flex-col space-y-2 opacity-10 dark:opacity-90">
            {streakData.right.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="flex space-x-1"
                style={{ marginRight: `${group.offset}px` }}
              >
                {group.lines.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="h-1 rounded-full bg-gradient-to-l from-gray-600 via-purple-800 to-purple-900 opacity-40"
                    style={{
                      width: `${line.width}px`,
                      filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.3))",
                      animation: "speed-streak 0.4s ease-out infinite",
                      animationDelay: `-${Math.random() * 0.4}s`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Brand text */}
        <div className="space-y-2 text-center">
          <h1 className="text-nl-700 dark:text-nd-50 text-4xl font-bold tracking-wide">
            Foodboss
          </h1>
          <p className="text-lg font-medium text-gray-400">
            Loading Admin Panel
          </p>
        </div>

        {/* Emojis */}
        <div className="flex space-x-4">
          {foodEmojis.map((emoji, index) => (
            <div
              key={index}
              className="text-2xl"
              style={{
                animation: `smooth-wave 2.5s ease-in-out infinite`,
                animationDelay: `${index * 0.3}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
