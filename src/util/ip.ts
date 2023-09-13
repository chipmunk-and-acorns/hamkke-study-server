import { Request } from 'express';

export const getClientIp = (request: Request) => {
  const ipString =
    (request.headers['x-forwarded-for'] as string) || (request.socket.remoteAddress as string);

  let ipAddress: string;

  // ipv6
  if (ipString.includes(':')) {
    const forwardedIps = ipString.split(',');
    ipAddress = forwardedIps[0];
  }
  // ipv4
  else {
    ipAddress = ipString;
  }

  const ip = ipAddress.trim().split(',')[0];

  return ip;
};
