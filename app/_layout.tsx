import React, { useEffect } from 'react';
import { useGameStore } from '../src/store/gameStore';
import TabsLayout from './tabs/_layout';
import { Fusion } from './modal/Fusion';

export default function RootLayout() {
  const { activeTab, processTime, creatures, activeCreatureId, setActiveCreature } = useGameStore();

  // Initialize active creature safely
  useEffect(() => {
    if (creatures.length > 0 && !activeCreatureId) {
      setActiveCreature(creatures[0].id);
    }
  }, [creatures, activeCreatureId]);

  // Global Time Ticker
  useEffect(() => {
    // Initial Tick
    processTime();
    const interval = setInterval(() => processTime(), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {activeTab === 'FUSION' ? (
        <Fusion />
      ) : (
        <TabsLayout />
      )}
    </>
  );
}