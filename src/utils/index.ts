import { themes } from "@/registry/theme";

export function getLocalTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: true });
}

export function getFormattedDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function getFormattedDateTime(date:Date): string {
    return `${getFormattedDate(date)}, ${getLocalTime(date)}`
}

export function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
   
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  export function getLightValues(themeName: string) {
    const theme = themes.find(t => t.name === themeName);
    return theme ? theme.activeColor.light : null;
  }