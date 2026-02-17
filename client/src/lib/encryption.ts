/**
 * Client-Side Encryption Utility
 * تشفير البيانات الحساسة على جانب العميل
 * 
 * يستخدم crypto API الموجود في المتصفح
 */

/**
 * تشفير بيانات النص باستخدام AES-GCM
 * @param data البيانات المراد تشفيرها
 * @param password كلمة المرور (أو المفتاح)
 * @returns البيانات المشفرة كـ base64
 */
export async function encryptData(data: string, password: string): Promise<string> {
  try {
    // تحويل كلمة المرور إلى مفتاح
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    // إنشاء مفتاح من كلمة المرور
    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    // اشتقاق مفتاح تشفير قوي
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(16), // ملح ثابت للبساطة (في الإنتاج استخدم ملح عشوائي)
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // إنشاء IV عشوائي
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // التشفير
    const encodedData = encoder.encode(data);
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      encodedData
    );

    // دمج IV والبيانات المشفرة وتحويلها إلى base64
    const combined = new Uint8Array([
      ...iv,
      ...new Uint8Array(encryptedData)
    ]);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('❌ Encryption error:', error);
    throw new Error('فشل تشفير البيانات');
  }
}

/**
 * فك تشفير البيانات
 * @param encryptedData البيانات المشفرة (base64)
 * @param password كلمة المرور (أو المفتاح)
 * @returns البيانات الأصلية
 */
export async function decryptData(encryptedData: string, password: string): Promise<string> {
  try {
    // فك ترميز base64
    const binaryData = atob(encryptedData);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    // استخراج IV والبيانات المشفرة
    const iv = bytes.slice(0, 12);
    const encrypted = bytes.slice(12);

    // تحويل كلمة المرور إلى مفتاح
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    // اشتقاق نفس المفتاح
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(16),
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // فك التشفير
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      encrypted
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('❌ Decryption error:', error);
    throw new Error('فشل فك تشفير البيانات');
  }
}

/**
 * حفظ البيانات المشفرة في localStorage
 * @param key مفتاح التخزين
 * @param data البيانات
 * @param encryptionPassword كلمة التشفير
 */
export async function secureLocalStorage(
  key: string,
  data: string | null,
  encryptionPassword: string
): Promise<void> {
  if (data === null) {
    // حذف البيانات
    localStorage.removeItem(`encrypted_${key}`);
    return;
  }

  try {
    const encrypted = await encryptData(data, encryptionPassword);
    localStorage.setItem(`encrypted_${key}`, encrypted);
  } catch (error) {
    console.error('❌ Failed to save encrypted data:', error);
    throw error;
  }
}

/**
 * استرجاع البيانات المشفرة من localStorage
 * @param key مفتاح التخزين
 * @param encryptionPassword كلمة التشفير
 * @returns البيانات الأصلية أو null
 */
export async function secureFetchLocalStorage(
  key: string,
  encryptionPassword: string
): Promise<string | null> {
  try {
    const encrypted = localStorage.getItem(`encrypted_${key}`);
    if (!encrypted) return null;

    return await decryptData(encrypted, encryptionPassword);
  } catch (error) {
    console.error('❌ Failed to retrieve encrypted data:', error);
    return null;
  }
}

/**
 * تشفير الـ auth token وحفظه
 * @param token الـ token
 * @param userEmail البريد الإلكتروني (يستخدم كمفتاح تشفير)
 */
export async function secureAuthToken(
  token: string,
  userEmail: string
): Promise<void> {
  try {
    await secureLocalStorage('auth_token', token, userEmail);
    console.log('✅ Auth token secured and stored');
  } catch (error) {
    console.error('❌ Failed to secure auth token:', error);
    localStorage.setItem('auth_token', token); // Fallback: تخزين بدون تشفير
  }
}

/**
 * استرجاع الـ auth token
 * @param userEmail البريد الإلكتروني
 * @returns الـ token أو null
 */
export async function retrieveAuthToken(userEmail: string): Promise<string | null> {
  try {
    return await secureFetchLocalStorage('auth_token', userEmail);
  } catch (error) {
    console.error('❌ Failed to retrieve auth token:', error);
    // Fallback: محاولة الحصول على الـ token غير المشفر
    return localStorage.getItem('auth_token');
  }
}

/**
 * مسح الـ auth token من التخزين
 */
export async function clearAuthToken(): Promise<void> {
  try {
    localStorage.removeItem('encrypted_auth_token');
    localStorage.removeItem('auth_token'); // Fallback
    console.log('✅ Auth token cleared');
  } catch (error) {
    console.error('❌ Failed to clear auth token:', error);
  }
}

/**
 * تشفير بيانات المستخدم الحساسة
 * @param userData البيانات
 * @param encryptionKey المفتاح
 */
export async function encryptUserData(
  userData: Record<string, any>,
  encryptionKey: string
): Promise<string> {
  try {
    const jsonData = JSON.stringify(userData);
    return await encryptData(jsonData, encryptionKey);
  } catch (error) {
    console.error('❌ Failed to encrypt user data:', error);
    throw error;
  }
}

/**
 * فك تشفير بيانات المستخدم
 * @param encryptedData البيانات المشفرة
 * @param encryptionKey المفتاح
 */
export async function decryptUserData(
  encryptedData: string,
  encryptionKey: string
): Promise<Record<string, any>> {
  try {
    const jsonData = await decryptData(encryptedData, encryptionKey);
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('❌ Failed to decrypt user data:', error);
    throw error;
  }
}

// ============================================================================
// استخدام سريع:
// ============================================================================
/*
// 1. تشفير وحفظ الـ token
import { secureAuthToken, retrieveAuthToken } from '@/lib/encryption';

// عند تسجيل الدخول:
await secureAuthToken(loginResponse.token, userEmail);

// عند استرجاع الـ token:
const token = await retrieveAuthToken(userEmail);

// 2. تشفير بيانات حساسة
import { secureLocalStorage, secureFetchLocalStorage } from '@/lib/encryption';

// حفظ البيانات:
await secureLocalStorage('user_address', userData.address, encryptionKey);

// استرجاع البيانات:
const address = await secureFetchLocalStorage('user_address', encryptionKey);

// 3. مسح البيانات:
await secureLocalStorage('user_address', null, encryptionKey);
*/
