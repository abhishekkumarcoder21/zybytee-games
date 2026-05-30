'use client';

import { Gamepad2, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlaceholderGame() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center animate-float">
          <Gamepad2 className="h-12 w-12 text-neon-blue/60" />
        </div>
        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-neon-orange text-white text-xs font-bold">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2 gradient-text">Coming Soon</h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        This game is currently under development. We&apos;re working hard to bring it to you soon!
      </p>

      <Button
        variant="outline"
        className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 gap-2"
        onClick={() => {
          // Future: subscribe to notifications
          alert('We\'ll notify you when this game is ready!');
        }}
      >
        <Bell className="h-4 w-4" />
        Notify Me
      </Button>
    </div>
  );
}
