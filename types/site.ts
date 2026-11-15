/** Legally required seller details for selling online in Serbia. */
export interface SellerDetails {
  name: string;
  address: string;
  /** Registration number (matični broj). */
  mb: string;
  /** Tax number (PIB). */
  pib: string;
}

export interface SiteRaw {
  favicon?: string;
  shop_enabled?: boolean;
  contact_email?: string;
  seller_name?: string;
  seller_address?: string;
  seller_mb?: string;
  seller_pib?: string;
}

export interface SiteContent {
  favicon?: string;
  /** Final say on whether the shop exists: the CMS switch plus the launch safeguard. */
  shop_enabled: boolean;
  /** The switch is on but the shop is held back because seller details are missing. */
  shop_blocked: boolean;
  contact_email?: string;
  /** Present only when every seller field is filled in. */
  seller?: SellerDetails;
}
