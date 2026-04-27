import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

export const guestGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const { data } = await supabase.supabase.auth.getSession();
  const user = data.session?.user;

  if (user) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
