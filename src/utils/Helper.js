import { toast } from "react-toastify";

export const handleCopyToClipboard = (text, index, t) => {
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      if (typeof t === "function") {
        toast.success(t("linkCopied"));
      } else {
        toast.success("Link copied");
      }
    } catch {
      fallbackCopy(text, t);
    }
  };

  const fallbackCopy = (text, t) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    if (typeof t === "function") {
      toast.success(t("linkCopied"));
    } else {
      toast.success("Link copied");
    }
  };

  copyText();
};

export const extractNameFromConfigURL = (url) => {
  const namePattern = /#([^#]*)/;
  const match = url.match(namePattern);

  if (match) return decodeURIComponent(match[1]);

  if (url.startsWith("vmess://")) {
    const encodedString = url.replace("vmess://", "");
    const decodedString = atob(encodedString);
    try {
      return JSON.parse(decodedString).ps;
    } catch (error) {
      console.error("Invalid vmess URL format:", error);
      return null;
    }
  }
  return null;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const tehranOffset = 3.5 * 60 * 1000;
  const tehranTime = new Date(date.getTime() + tehranOffset);

  const formattedDate = tehranTime.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = tehranTime.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} - ${formattedTime}`;
};

export const formatExpireDate = (expire) => {
  if (!expire) return "نامشخص";

  let date;
  if (typeof expire === "number") {
    date = new Date(expire * 1000);
  } else if (typeof expire === "string") {
    date = new Date(expire);
  } else {
    throw new Error("Invalid expire format");
  }

  const formattedDate = date.toLocaleDateString("fa-IR", {
    month: "long",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} - ${formattedTime}`; 
};

export const calculateRemainingTime = (expire) => {
  if (!expire) return "نامشخص";

  let expireTimestamp;
  if (typeof expire === "number") {
    expireTimestamp = expire;
  } else if (typeof expire === "string") {
    expireTimestamp = Math.floor(new Date(expire).getTime() / 1000);
  } else {
    throw new Error("Invalid expire format");
  }

  const remainingSeconds = expireTimestamp - Math.floor(Date.now() / 1000);
  if (remainingSeconds <= 0) return "تمام شده";

  const days = Math.floor(remainingSeconds / (60 * 60 * 24));
  const hours = Math.floor((remainingSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);

  if (days > 0) return `${days} روز `;
  if (hours > 0) return `${hours} ساعت`;
  return `${minutes} دقیقه`;
};
export const calculateUsedTimePercentage = (expireTimestamp) => {
  let expireTimeInSeconds;

  if (typeof expireTimestamp === "string") {
    expireTimeInSeconds = Math.floor(
      new Date(expireTimestamp).getTime() / 1000
    );
  } else if (typeof expireTimestamp === "number") {
    expireTimeInSeconds = expireTimestamp;
  } else {
    throw new Error("Invalid expireTimestamp format");
  }

  const remainingSeconds = expireTimeInSeconds - Math.floor(Date.now() / 1000);

  if (remainingSeconds <= 0) return 100;

  const daysRemaining = Math.floor(remainingSeconds / (60 * 60 * 24));

  if (daysRemaining < 1) {
    return 99;
  }

  if (daysRemaining <= 30) {
    return ((30 - daysRemaining) / 30) * 100;
  }

  if (daysRemaining <= 90) {
    return ((90 - daysRemaining) / 90) * 100;
  }

  if (daysRemaining <= 180) {
    return ((180 - daysRemaining) / 180) * 100;
  }

  return 0;
};

export const formatTraffic = (bytes, t) => {
  if (bytes === null) {
    return t("infinity");
  }

  if (bytes < 0) {
    return t("gigabytes");
  }

  const units = [t("B"), t("KB"), t("MB"), t("GB"), t("TB")];
  const thresholds = [1, 1024, 1024 ** 2, 1024 ** 3];

  for (let i = 0; i < thresholds.length; i++) {
    if (bytes < thresholds[i] * 1024) {
      return `${(bytes / thresholds[i]).toFixed()} ${units[i]}`;
    }
  }
  return `${(bytes / 1024 ** 4).toFixed(2)} ${t("TB")}`;
};
