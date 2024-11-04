import { randomBytes, scrypt } from "node:crypto";
import { Buffer } from 'node:buffer';
import type { IEncryptHash } from "../../core/ports/encrypt/IEncryptHash.js";

const pepper = Buffer.from([
   0xab, 0x72, 0x37, 0x62, 0x0a, 0xd0, 0x43, 0x79, 0x81, 0x26, 0x68, 0xa4, 0xe8, 0xb2, 0xac, 0x68,
]).toString("hex");

export class HashEncrypt implements IEncryptHash {
   hash(password: string): Promise<string> {
      const salt = randomBytes(16).toString("hex");

      return new Promise((resolve, reject) => {
         scrypt(password, salt + pepper, 64, (err, derivedKey) => {
            if (err) {
               reject(err);
            } else {
               resolve(`${salt}:${derivedKey.toString("hex")}`);
            }
         });
      });
   }
   compare(comparePassword: string, hashedPassword: string): Promise<boolean> {
      const [salt, hash] = hashedPassword.split(":");
      return new Promise((resolve, reject) => {
         scrypt(comparePassword, salt + pepper, 64, (err, derivedKey) => {
            if (err) {
               reject(err);
            } else {
               resolve(hash === derivedKey.toString("hex"));
            }
         });
      });
   }
}
