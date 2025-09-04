export class CookieTool {
  private static cookieName = 'currentPlayerKey';

  // Helper function to get a cookie by name
  private static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length);
      }
    }
    return null;
  }

  // Helper function to set a cookie with optional expiration in days
  private static setCookie(name: string, value: string, days: number = 7): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  // Fetch the current player key from the cookie.
  public static getCurrentPlayerKey(): string | null {
    return this.getCookie(this.cookieName);
  }

  // Store the player's key in the cookie.
  public static setCurrentPlayerKey(key: string, days?: number): void {
    this.setCookie(this.cookieName, key, days);
  }
}