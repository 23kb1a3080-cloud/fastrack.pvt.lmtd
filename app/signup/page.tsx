import { Suspense } from 'react';
import { AuthContent } from '../login/page';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-xs text-[#000000]">Loading Registration...</div>}>
      <AuthContent defaultMode="signup" />
    </Suspense>
  );
}
