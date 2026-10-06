export type PublicSettings = {
  contactPhone: string;
  paymentCode: string;
  paymentQrCode: string | null;
};

export type PublicSettingsResponse = {
  data: PublicSettings | null;
};
