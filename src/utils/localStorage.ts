import { UserType } from "../models/auth"

const STORAGE_KEY = "user"

export const userStorage = {
  getUser(): UserType | null {
    // 1) On SSR or no window, bail out
    if (typeof window === "undefined") {
      return null
    }

    // 2) Grab the raw string; may be null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    // 3) Parse with try/catch
    try {
      return JSON.parse(raw) as UserType
    } catch (e) {
      console.error("userStorage.getUser: failed to parse JSON:", e)
      // Corrupted data — clear it so we don’t try again
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
  },

  setUser(user: UserType): void {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    }
  },

  clearUser(): void {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  },
}