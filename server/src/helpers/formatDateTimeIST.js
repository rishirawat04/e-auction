export const formatDateTimeIST = (timestampInSeconds) => {
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return new Date(timestampInSeconds * 1000).toLocaleString('en-IN', options);
};
