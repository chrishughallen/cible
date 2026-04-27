import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const { data } = await supabase.supabase.auth.getSession();

  const user = data.session?.user;

  if (user) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
