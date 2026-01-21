export interface ProjectInfo {
  developer: string;
  company: string;
  location: string;
  date: string;
  client: string;
}

export interface PricingItem {
  description: string;
  value: string;
  isTotal?: boolean;
  highlight?: boolean;
}

export interface SignatureData {
  name: string;
  role: string;
  date: string;
  signatureImage: string | null;
}