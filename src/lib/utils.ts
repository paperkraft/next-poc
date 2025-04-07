import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { js_beautify } from 'js-beautify'
import { UAParser } from 'ua-parser-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to capitalize the first letter
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to lowercase the first letter
export const lowercaseFirstLetter = (string: string): string => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

export const sentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function formatJSXCode(code: string): string {
  const formattedCode = js_beautify(code, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 2,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 0,
    comma_first: false,
    e4x: true,
    indent_empty_lines: false,
    // indent_scripts: "normal",
    // brace_style: "collapse,preserve-inline",
    // indent_inner_html: false,
  });
  return formattedCode
}


export async function getIpAddress() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim()
}

export function getDeviceDetails(userAgent: string | null): Record<string, string | undefined> {
  const parser = new UAParser(userAgent || '');
  return {
    browser: parser.getBrowser().name,
    os: parser.getOS().name,
    device: getDeviceType(userAgent as string),
  };
}

export function getDeviceType(userAgent: string): string {
  if (!userAgent) return 'Unknown device';

  // Check for mobile devices
  if (/mobile/i.test(userAgent)) {
    return 'Mobile device';
  }
  // Check for tablet devices
  else if (/tablet/i.test(userAgent)) {
    return 'Tablet device';
  }
  // Check for specific operating systems and browsers
  else if (/windows/i.test(userAgent)) {
    return 'Windows (Desktop)';
  }
  else if (/macintosh/i.test(userAgent)) {
    return 'MacOS (Desktop)';
  }
  else if (/linux/i.test(userAgent)) {
    return 'Linux (Desktop)';
  }
  else if (/android/i.test(userAgent)) {
    return 'Android device';
  }
  else if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent)) {
    return 'iOS device';
  }
  // General fallback
  else {
    return 'Desktop device';
  }
}
