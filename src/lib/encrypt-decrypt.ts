import type { Storage } from 'redux-persist';
import CryptoJS from 'crypto-js';

import { SECRET_KEY } from '@/constants';

const KEY = CryptoJS.SHA256(SECRET_KEY as string).toString();          // 256-bit key
const HMAC_KEY = CryptoJS.SHA256(KEY + 'hmac_salt').toString();   // separate MAC key

const makeHmac = (cipher: string) => CryptoJS.HmacSHA256(cipher, HMAC_KEY).toString();

const encrypt = (plaintext: string) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const cipher = CryptoJS.AES.encrypt(plaintext, KEY, { iv }).toString();
    const hmac = makeHmac(cipher);
    return JSON.stringify({ v: 1, iv: iv.toString(), cipher, hmac });
};

const decrypt = (blob: string): string | null => {
    const { cipher, hmac } = JSON.parse(blob);

    if (makeHmac(cipher) !== hmac) throw new Error('HMAC mismatch');

    const bytes = CryptoJS.AES.decrypt(cipher, KEY);
    const utf8 = bytes.toString(CryptoJS.enc.Utf8);
    if (!utf8) throw new Error('Decrypt failed / empty');

    return utf8;
};

export const encryptedStorage: Storage =
    typeof window === 'undefined'
        ? {
            getItem: async () => Promise.resolve(null),
            setItem: async () => Promise.resolve(),
            removeItem: async () => Promise.resolve(),
        }
        : {
            getItem: async (key) => {
                try {
                    const raw = localStorage.getItem(key);
                    return raw ? decrypt(raw) : null;
                } catch (error) {
                    console.error('[encryptedStorage] getItem error:', error);
                    localStorage.removeItem(key);
                    return null;
                }
            },

            setItem: async (key, value) => {
                try {
                    localStorage.setItem(key, encrypt(value));
                } catch (err) {
                    console.error('[encryptedStorage] setItem error:', err);
                }
            },

            removeItem: async (key) => {
                localStorage.removeItem(key);
            },
        };
