import { Keyboard, Mouse, Smartphone, Gamepad } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Game } from '@/types/game';

interface GameInfoProps {
  game: Game;
}

const controlIcons = {
  keyboard: Keyboard,
  mouse: Mouse,
  touch: Smartphone,
  gamepad: Gamepad,
};

export function GameInfo({ game }: GameInfoProps) {
  const ControlIcon = controlIcons[game.controls.type];

  return (
    <div className="rounded-xl border border-white/5 bg-card p-6 space-y-5">
      <div>
        <h3 className="font-semibold mb-2">About this game</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{game.description}</p>
      </div>

      <Separator className="bg-white/5" />

      <div>
        <h3 className="font-semibold mb-2">How to play</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{game.instructions}</p>
      </div>

      <Separator className="bg-white/5" />

      <div>
        <h3 className="font-semibold mb-3">Controls</h3>
        <div className="flex items-center gap-2 mb-3">
          <ControlIcon className="h-4 w-4 text-neon-blue" />
          <span className="text-sm capitalize">{game.controls.type}</span>
        </div>
        {game.controls.keys && (
          <div className="space-y-1.5">
            {Object.entries(game.controls.keys).map(([key, action]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <kbd className="px-2 py-0.5 rounded bg-white/5 text-xs font-mono">{key}</kbd>
                <span className="text-muted-foreground">{action}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="bg-white/5" />

      <div>
        <h3 className="font-semibold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-1.5">
          {game.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-white/10 text-xs capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
        <span>Developer: {game.developer}</span>
        <span>Updated: {new Date(game.lastUpdated).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
