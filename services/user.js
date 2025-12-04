/* Auth service
 * - Default base URL is read from NEXT_PUBLIC_API_BASE (client-side env)
 * - Provides register/login/me helpers that call /api/auth/* on the configured base
 * - Sends cookies using `credentials: 'include'` so server-set cookies are preserved
 */

import { get, post, put, del} from './http'


export function getAllUsers(opts = {}) {
  return get('/api/user', opts);
}

export function getAllUserTypes(opts = {}) {
  return get('/api/user/types', opts);
}



export default { getAllUsers, getAllUserTypes  };
