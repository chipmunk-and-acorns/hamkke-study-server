const required = <T>(key: string, defaultValue?: T) => {
  const value = process.env[key] || defaultValue;

  return value;
};

export const env = {
  server: {
    port: Number(required('SERVER_PORT', 8080)),
  },
};
