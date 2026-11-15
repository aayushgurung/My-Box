import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Exercise the actual service modules against a deterministic Supabase boundary.
async function service(name, response) {
  const calls = [];
  const query = new Proxy({}, { get(_target, key) {
    if (key === 'then') return (resolve, reject) => Promise.resolve(response).then(resolve, reject);
    return (...args) => { calls.push([key, ...args]); return query; };
  } });
  globalThis.__myboxTestClient = { from: table => { calls.push(['from', table]); return query; }, auth: {
    signInWithPassword: async value => { calls.push(['signIn', value]); return response; },
    signOut: async () => response,
  } };
  const source = await readFile(new URL(`../src/lib/services/${name}.ts`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText
    .replace(/import \{ supabase \} from ['"]\.\.\/supabase['"];?/, 'const supabase = globalThis.__myboxTestClient;');
  return { api: await import(`data:text/javascript;base64,${Buffer.from(compiled + '\n//' + Math.random()).toString('base64')}`), calls };
}
const row = { id: 'uuid', kind: 'driver', full_name: 'Alex', email: 'a@example.com', phone: '123', city: 'Sydney', message: 'Hello', notes: '', status: 'New', created_at: '2026-11-15T09:00:00Z', details: { vehicle: 'Van', custom: 'preserved' } };
test('enquiry mapping and edits preserve additional form details', async () => {
  const { api, calls } = await service('enquiries', { data: row, error: null });
  const mapped = api.toEnquiry(row);
  assert.equal(mapped.name, 'Alex'); assert.equal(mapped.vehicle, 'Van'); assert.equal(mapped.date, '2026-11-15');
  await api.updateEnquiry({ ...mapped, status: 'Approved', notes: 'Reviewed' });
  const payload = calls.find(call => call[0] === 'update')[1];
  assert.equal(payload.details.custom, 'preserved'); assert.equal(payload.notes, 'Reviewed');
  assert.equal(payload.status, 'Approved'); assert.deepEqual(calls.find(call => call[0] === 'eq'), ['eq', 'id', 'uuid']);
});
test('database errors reject instead of showing a successful save', async () => {
  const { api } = await service('enquiries', { data: null, error: { message: 'denied' } });
  await assert.rejects(api.updateEnquiry(api.toEnquiry(row)), /Could not save/);
  await assert.rejects(api.getEnquiries(), /Could not load/);
  await assert.rejects(api.deleteEnquiry('uuid'), /Could not delete/);
});
test('booking update excludes database metadata and keeps schedule and status', async () => {
  const { api, calls } = await service('bookings', { data: { id: 'booking' }, error: null });
  await api.saveBooking({ id: 'untrusted', created_by: 'untrusted', created_at: 'untrusted', customer: ' Alex ', email: 'a@example.com', phone: '123', pickup: ' A ', destination: ' B ', date: '2026-11-16', time: '12:00', size: 'Small parcel', notes: 'Door', status: 'Delivered' }, 'booking');
  const payload = calls.find(call => call[0] === 'update')[1];
  assert.equal(payload.customer, 'Alex'); assert.equal(payload.status, 'Delivered');
  assert.equal(payload.id, undefined); assert.equal(payload.created_by, undefined); assert.equal(payload.created_at, undefined);
  assert.deepEqual(calls.find(call => call[0] === 'eq'), ['eq', 'id', 'booking']);
});
test('new booking uses insert and deletion requires a returned row', async () => {
  const { api, calls } = await service('bookings', { data: null, error: null });
  await api.saveBooking({ customer: 'A', email: 'a@example.com', phone: '123', pickup: 'A', destination: 'B', date: '2026-11-16', time: '12:00', size: 'Small parcel', notes: '', status: 'Scheduled' });
  assert.ok(calls.some(call => call[0] === 'insert'));
  await assert.rejects(api.deleteBooking('missing'), /Could not delete/);
});
test('admin membership is checked against the signed-in user ID', async () => {
  const { api, calls } = await service('auth', { data: null, error: null });
  assert.equal(await api.isAdmin('user-id'), false);
  assert.deepEqual(calls.find(call => call[0] === 'eq'), ['eq', 'user_id', 'user-id']);
});
test('invalid credentials and membership lookup failures are surfaced', async () => {
  const { api } = await service('auth', { data: null, error: { message: 'invalid' } });
  await assert.rejects(api.signInAdmin('a@example.com', 'wrong'), /Sign-in failed/);
  await assert.rejects(api.isAdmin('user-id'), /Unable to verify/);
  await assert.rejects(api.signOutAdmin(), /Could not sign out/);
});
