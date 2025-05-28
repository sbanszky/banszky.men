export const generateRandomIp = (): string => {
  return Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 256))
    .join('.');
};