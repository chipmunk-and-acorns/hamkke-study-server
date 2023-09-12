import { Request } from 'express';
import * as ipAddr from 'ipaddr.js';

// export const getClientIp = (request: Request) => {
//   const ipString =
//     (request.headers['x-forwarded-for'] as string) || (request.socket.remoteAddress as string);
//   console.log(ipString);
//   const ip = ipAddr.IPv4.parse(ipString);

//   return ip.toString();
// };

export const getClientIp = (request: Request) => {
  const ipString =
    (request.headers['x-forwarded-for'] as string) || (request.socket.remoteAddress as string);
  console.log(ipString);

  // Parse the IP address
  let ipAddress: string;
  if (ipString.includes(':')) {
    // If the IP address contains a colon, it is an IPv6 address.
    // In this case, we can extract the client's IP address from the x-forwarded-for header.
    const forwardedIps = ipString.split(',');
    ipAddress = forwardedIps[0];
  } else {
    // If there is no colon in the IP address, it is an IPv4 address.
    ipAddress = ipString;
  }

  // Get only the first valid IP if there are multiple IPs in x-forwarded-for header
  const ip = ipAddress.trim().split(',')[0];

  return ip;
};
