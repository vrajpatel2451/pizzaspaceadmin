import { userApiService } from "@/infrastructure/UserApiService";
import type { UserResponse } from "@/types/user.types";
import { useCallback, useEffect, useState } from "react";

type UserDetailsMap = Record<string, UserResponse>;

/**
 * Hook to fetch user details for a list of userIds and return a lookup map.
 * Useful for displaying customer info in tables where only userId is available.
 */
export const useUserDetailsMap = (userIds: string[]) => {
  const [userMap, setUserMap] = useState<UserDetailsMap>({});
  const [isFetching, setIsFetching] = useState(false);

  const fetchUsers = useCallback(async () => {
    // Filter out empty or already-fetched userIds
    const uniqueIds = [...new Set(userIds.filter((id) => id && !userMap[id]))];

    if (uniqueIds.length === 0) return;

    setIsFetching(true);
    try {
      // Fetch users with a high limit to get all needed users
      // In a production app, you might want to implement a batch fetch by IDs
      const response = await userApiService.getUserList({
        limit: 100,
      });

      if (response.success && response.data?.data) {
        const newMap: UserDetailsMap = { ...userMap };
        response.data.data.forEach((user) => {
          if (uniqueIds.includes(user._id)) {
            newMap[user._id] = user;
          }
        });
        setUserMap(newMap);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setIsFetching(false);
    }
  }, [userIds, userMap]);

  useEffect(() => {
    if (userIds.length > 0) {
      fetchUsers();
    }
  }, [userIds.join(",")]); // Re-fetch when userIds change

  const getUserById = useCallback(
    (userId: string): UserResponse | undefined => {
      return userMap[userId];
    },
    [userMap],
  );

  return {
    userMap,
    getUserById,
    isFetching,
  };
};
