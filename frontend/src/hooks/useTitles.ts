import TitleService from '@/services/titleService';
import { Title, UserTitle } from '@/types/titles';
import { useEffect, useState } from 'react';

export function useTitles(
  userId: string,
  userStats?: {
    problemsSolved: number;
    streakDays: number;
    starsEarned: number;
    skillsMastered: number;
    timeSpent: number;
    perfectScores: number;
    achievementsUnlocked: number;
  }
) {
  const [userTitles, setUserTitles] = useState<UserTitle[]>([]);
  const [equippedTitle, setEquippedTitle] = useState<Title | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTitles();
  }, [userId]);

  useEffect(() => {
    if (userStats) {
      checkForNewTitles();
    }
  }, [userStats, userId]); // Removed checkForNewTitles from dependencies to avoid infinite loop

  const loadTitles = () => {
    try {
      const titles = TitleService.getUserTitles();
      const equipped = TitleService.getEquippedTitle();

      setUserTitles(titles);
      setEquippedTitle(equipped);
    } catch (error) {
      console.error('Error loading titles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNewTitles = () => {
    if (!userStats) return;

    try {
      const newlyUnlocked = TitleService.checkAndUnlockTitles(
        userId,
        userStats
      );
      if (newlyUnlocked.length > 0) {
        loadTitles(); // Reload titles after unlocking new ones
        return newlyUnlocked;
      }
    } catch (error) {
      console.error('Error checking for new titles:', error);
    }
    return [];
  };

  const equipTitle = (titleId: string) => {
    try {
      const success = TitleService.equipTitle(titleId);
      if (success) {
        loadTitles();
        return true;
      }
    } catch (error) {
      console.error('Error equipping title:', error);
    }
    return false;
  };

  const unequipTitle = () => {
    try {
      const success = TitleService.unequipTitle();
      if (success) {
        loadTitles();
        return true;
      }
    } catch (error) {
      console.error('Error unequipping title:', error);
    }
    return false;
  };

  const initializeDemoTitles = () => {
    try {
      TitleService.initializeDemoTitles(userId);
      loadTitles();
    } catch (error) {
      console.error('Error initializing demo titles:', error);
    }
  };

  return {
    userTitles,
    equippedTitle,
    isLoading,
    loadTitles,
    equipTitle,
    unequipTitle,
    initializeDemoTitles,
    checkForNewTitles,
  };
}
