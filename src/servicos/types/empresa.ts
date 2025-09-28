export interface IGerarJsonZeroTrust {
  serverAddr: string;
  serverPort: number;
  auth: {
    token: string;
  };
  transport: {
    tls: {
      enable: boolean;
    };
  };
  log: {
    maxDays: number;
  };
  proxies: Array<{
    name: string;
    type: string;
    localPort: number;
    remotePort?: number;
    subdomain?: string;
    plugin?: {
      type: string;
      localAddr: string;
      crtPath: string;
      keyPath: string;
    };
  }>;
}
