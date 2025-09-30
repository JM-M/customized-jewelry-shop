export const getChannelDisplayName = (channel?: string | null) => {
  if (!channel) return "Unknown";

  switch (channel) {
    case "card":
      return "Card Payment";
    case "bank":
      return "Bank Transfer";
    case "ussd":
      return "USSD";
    case "qr":
      return "QR Code";
    case "mobile_money":
      return "Mobile Money";
    case "bank_transfer":
      return "Bank Transfer";
    default:
      return channel;
  }
};

export const getChannelIcon = (channel?: string | null) => {
  switch (channel) {
    case "card":
      return "💳";
    case "bank":
      return "🏦";
    case "ussd":
      return "📱";
    case "qr":
      return "📱";
    case "mobile_money":
      return "💰";
    case "bank_transfer":
      return "🏦";
    default:
      return "💳";
  }
};

export const formatTransactionDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
