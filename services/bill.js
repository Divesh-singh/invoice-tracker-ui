/* Auth service
 * - Default base URL is read from NEXT_PUBLIC_API_BASE (client-side env)
 * - Provides register/login/me helpers that call /api/auth/* on the configured base
 * - Sends cookies using `credentials: 'include'` so server-set cookies are preserved
 */

import { get, post, put, del} from './http'


export function getAllBills(opts = {}) {
  return get('/api/bill', opts);
}

export function getBillById(billId, opts = {}) {
  return get(`/api/bill/${billId}`, opts);
}

export function getbillReport(startTime, endTime, opts = {}) {
  return get(`/api/bill/report?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`, opts);
}

export function createBill(data, opts = {}) {
  return post('/api/bill', data, opts);
}



export default { getAllBills, getBillById, getbillReport, createBill };
