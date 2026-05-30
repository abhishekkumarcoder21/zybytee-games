import type { Metadata } from 'next';
import { Settings, User, Bell, Shield, Monitor } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences on ZyBytee Games.',
};

const settingsSections = [
  {
    icon: User,
    title: 'Account',
    description: 'Manage your account details and sign-in methods.',
    action: 'Sign In',
    disabled: true,
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure game update and achievement notifications.',
    action: 'Configure',
    disabled: true,
  },
  {
    icon: Monitor,
    title: 'Display',
    description: 'Theme, language, and accessibility preferences.',
    action: 'Customize',
    disabled: true,
  },
  {
    icon: Shield,
    title: 'Privacy',
    description: 'Data, analytics, and privacy settings.',
    action: 'Manage',
    disabled: true,
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-500 to-gray-600">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your preferences</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-card overflow-hidden">
          {settingsSections.map((section, i) => (
            <div key={section.title}>
              {i > 0 && <Separator className="bg-white/5" />}
              <div className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 shrink-0">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{section.title}</h3>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={section.disabled}
                  className="border-white/10 text-xs"
                >
                  {section.action}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Settings will be fully available when account system launches.
        </p>
      </div>
    </div>
  );
}
