import type { Metadata } from 'next';
import { ProfileClient } from '@/components/profile/ProfileClient';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View your gaming profile, stats, and achievements on ZyBytee Games.',
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <ProfileClient />
    </div>
  );
}
