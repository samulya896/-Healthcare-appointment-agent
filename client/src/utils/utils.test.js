import { describe, expect, it } from 'vitest';
import { firstName, formatDob, formatFee, formatTime, initials, isUpcoming, sortByTime, titleCase } from './format.js';
import { isEmail, isPhone, validateLogin, validatePersonal, validateRegister } from './validation.js';

describe('format utils', () => {
  it('builds initials without the Dr. prefix', () => {
    expect(initials('Dr. Tariq Mehmood')).toBe('TM');
    expect(initials('')).toBe('?');
  });
  it('formats names and titles', () => {
    expect(firstName('Ayesha Khan')).toBe('Ayesha');
    expect(titleCase('general physician')).toBe('General Physician');
  });
  it('formats 24h slots as 12h times', () => {
    expect(formatTime('09:30')).toBe('9:30 AM');
    expect(formatTime('14:00')).toBe('2:00 PM');
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime(undefined)).toBe('—');
  });
  it('formats fees and dates of birth safely', () => {
    expect(formatFee(3500)).toBe('PKR 3,500');
    expect(formatFee(undefined)).toBe('—');
    expect(formatDob('Not specified')).toBe('—');
    expect(formatDob('1990-05-14')).toContain('1990');
  });
  it('splits and sorts appointments by time', () => {
    const past = { startTime: '2020-01-01T10:00:00+05:00' };
    const future = { startTime: '2999-01-01T10:00:00+05:00' };
    expect(isUpcoming(past)).toBe(false);
    expect(isUpcoming(future)).toBe(true);
    expect(sortByTime([future, past])).toEqual([past, future]);
  });
});

describe('validation', () => {
  it('validates email and phone', () => {
    expect(isEmail('a@b.co')).toBe(true);
    expect(isEmail('nope')).toBe(false);
    expect(isPhone('+92 300 1234567')).toBe(true);
    expect(isPhone('abc')).toBe(false);
  });
  it('validates login', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({ email: 'Email is required.', password: 'Password is required.' });
    expect(validateLogin({ email: 'a@b.co', password: 'x' })).toEqual({});
  });
  it('validates registration', () => {
    const ok = { name: 'A', email: 'a@b.co', phone: '+92 300 1234567', password: 'secret1', confirm: 'secret1', dob: '' };
    expect(validateRegister(ok)).toEqual({});
    expect(validateRegister({ ...ok, password: '123', confirm: '123' }).password).toMatch(/6/);
    expect(validateRegister({ ...ok, confirm: 'other' }).confirm).toMatch(/match/);
    expect(validateRegister({ ...ok, dob: '2999-01-01' }).dob).toBeTruthy();
  });
  it('validates personal details', () => {
    const ok = { name: 'A', phone: '+92 300 1234567', dob: '', emergencyContact: { phone: '' } };
    expect(validatePersonal(ok)).toEqual({});
    expect(validatePersonal({ ...ok, name: ' ' }).name).toBeTruthy();
    expect(validatePersonal({ ...ok, emergencyContact: { phone: 'x' } }).emergencyPhone).toBeTruthy();
  });
});
