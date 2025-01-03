import os from "os";

export let publicIP;

export async function getLanIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ips = interfaces[name];

    if (!ips) {
      continue;
    }

    for (const { family, address, internal } of ips) {
      if (
        internal ||
        family !== "IPv4" ||
        name.startsWith("tailscale") ||
        name.startsWith("cni")
      ) {
        continue;
      }

      return address;
    }
  }
}

export async function getPublicIP() {
  try {
    const response = await fetch("https://checkip.amazonaws.com");

    publicIP = (await response.text()).replace(/\n/, "");
  } catch (error) {
    console.warn("unable to get ipv4 address", error);
  }
}
