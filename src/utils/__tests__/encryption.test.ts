import { describe, it, expect } from 'vitest'
import {
  encryptPrivateKey,
  decryptPrivateKey,
  encryptWithChecksum,
  verifyChecksum,
  generateKeystoreJSON,
} from '../encryption'

const TEST_KEY = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const PASSWORD = 'strong-password-42!'

describe('encryption.ts', () => {
  describe('encryptPrivateKey / decryptPrivateKey (AES-256-GCM)', () => {
    it('roundtrip encrypt/decrypt returns the original key', async () => {
      const encrypted = await encryptPrivateKey(TEST_KEY, PASSWORD)
      expect(typeof encrypted).toBe('string')
      expect(encrypted).not.toBe(TEST_KEY)

      const decrypted = await decryptPrivateKey(encrypted, PASSWORD)
      expect(decrypted).toBe(TEST_KEY)
    })

    it('produces different ciphertexts for the same input (random IV)', async () => {
      const a = await encryptPrivateKey(TEST_KEY, PASSWORD)
      const b = await encryptPrivateKey(TEST_KEY, PASSWORD)
      expect(a).not.toBe(b)
    })

    it('fails with wrong password', async () => {
      const encrypted = await encryptPrivateKey(TEST_KEY, PASSWORD)
      await expect(decryptPrivateKey(encrypted, 'wrong-password')).rejects.toThrow()
    })

    it('handles empty key', async () => {
      const encrypted = await encryptPrivateKey('', PASSWORD)
      const decrypted = await decryptPrivateKey(encrypted, PASSWORD)
      expect(decrypted).toBe('')
    })

    it('requires a strong password', async () => {
      await expect(encryptPrivateKey(TEST_KEY, 'short')).rejects.toThrow(/at least 12/)
    })

    it('generates a keystore JSON payload from encrypted key material', async () => {
      const encrypted = await encryptPrivateKey(TEST_KEY, PASSWORD)
      const keystore = generateKeystoreJSON('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', encrypted, { id: 'ethereum' })
      expect(keystore.version).toBe(3)
      expect(keystore.crypto.cipher).toBe('aes-256-gcm')
      expect(keystore.crypto.cipherparams.iv).toHaveLength(24)
      expect(keystore.crypto.kdfparams.salt).toHaveLength(32)
      expect(keystore.address).toBe('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef')
    })
  })

  describe('encryptWithChecksum / verifyChecksum', () => {
    it('creates a verifiable checksum', () => {
      const payload = encryptWithChecksum('hello world', 'secret')
      expect(payload.data).toBeDefined()
      expect(payload.checksum).toBeDefined()
      expect(payload.format).toBe('base64-aes')
      expect(verifyChecksum(payload, 'secret')).toBe(true)
    })

    it('fails with wrong password', () => {
      const payload = encryptWithChecksum('hello world', 'secret')
      expect(verifyChecksum(payload, 'wrong')).toBe(false)
    })
  })
})
