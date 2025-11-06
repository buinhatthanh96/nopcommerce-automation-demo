export class Helpers {
  static async waitForTimeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static isSortedAscending(arr: (string | number)[]): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  static isSortedDescending(arr: (string | number)[]): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] < arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  static isWithinRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static extractPrice(priceText: string): number {
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
  }

  static formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }
}
