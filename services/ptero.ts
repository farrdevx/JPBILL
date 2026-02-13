
import { PteroConfig, PteroServer } from '../types';

export interface PteroServerExtended extends PteroServer {
  node?: string;
}

export interface PteroNode {
  id: number;
  name: string;
  location_id: number;
  fqdn: string;
  scheme: string;
  behind_proxy: boolean;
  maintenance_mode: boolean;
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  upload_size: number;
  daemon_listen: number;
  daemon_sftp: number;
  relationships?: {
    location?: {
      attributes: {
        short: string;
        long: string | null;
      };
    };
    allocations?: {
      data: any[];
    };
  };
}

export interface PteroConfigExtended extends PteroConfig {
  useProxy?: boolean;
}

export class PteroService {
  private config: PteroConfigExtended;
  private type: 'client' | 'application';

  constructor(config: PteroConfigExtended, type: 'client' | 'application' = 'client') {
    this.config = config;
    this.type = type;
  }

  private async request(endpoint: string, method: string = 'GET', body?: any) {
    const apiType = this.type === 'client' ? 'client' : 'application';
    const baseUrl = this.config.baseUrl.trim().endsWith('/') 
      ? this.config.baseUrl.trim() 
      : `${this.config.baseUrl.trim()}/`;
    
    // Construct the direct Ptero API URL
    const targetUrl = `${baseUrl}api/${apiType}${endpoint}`;
    
    // Use a robust CORS proxy
    // corsproxy.io is generally more reliable for custom headers like Pterodactyl's
    const finalUrl = this.config.useProxy 
      ? `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
      : targetUrl;

    try {
      const response = await fetch(finalUrl, {
        method,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey.trim()}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json',
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        // Attempt to parse Ptero's specific error format
        const errData = await response.json().catch(() => ({}));
        const detail = errData.errors?.[0]?.detail || response.statusText;
        throw new Error(`API_ERROR: ${detail} (Status: ${response.status})`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.toLowerCase().includes('fetch')) {
        // This is the common "Failed to fetch" which usually means CORS blocked it
        throw new Error('CORS_OR_NETWORK_ERROR: Permintaan diblokir browser. Pastikan Proxy Aktif (Toggle di bawah) atau tambahkan domain ini ke whitelist CORS panel.');
      }
      throw error;
    }
  }

  /**
   * Cek kesehatan API tanpa beban data besar
   */
  async validateConnection(): Promise<boolean> {
    try {
      // Endpoint /users?per_page=1 adalah yang paling ringan untuk Application API
      if (this.type === 'application') {
        await this.request('/users?per_page=1');
      } else {
        await this.request('/account');
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async listNodes(): Promise<PteroNode[]> {
    if (this.type !== 'application') throw new Error("Requires Application API Key");
    // Sesuai dengan pengujian Postman user: include location & allocations
    const data = await this.request('/nodes?include=location,allocations&per_page=25');
    return data.data.map((item: any) => ({
      ...item.attributes,
      relationships: item.relationships
    }));
  }

  async listUsers() {
    if (this.type !== 'application') throw new Error("Requires Application API Key");
    const data = await this.request('/users');
    return data.data.map((item: any) => ({
      ...item.attributes,
      avatar: item.attributes.email.substring(0, 1)
    }));
  }

  async createServer(payload: any) {
    if (this.type !== 'application') throw new Error("Requires Application API Key");
    return this.request('/servers', 'POST', payload);
  }
}

const DEFAULT_APP_CONFIG: PteroConfigExtended = {
  baseUrl: 'https://jpshop.tech/',
  apiKey: 'ptla_iQ2j0a8ZKzLfojs1ABuTlRhesofkUQxzh8cZW57B0AG',
  useProxy: true
};

export const getStoredConfig = (type: 'client' | 'application'): PteroConfigExtended => {
  const saved = localStorage.getItem(`ptero_config_${type}`);
  if (saved) return JSON.parse(saved);
  if (type === 'application') return DEFAULT_APP_CONFIG;
  return {
    baseUrl: '',
    apiKey: '',
    useProxy: true
  };
};

export const mockServers: (PteroServer & { node: string })[] = [
  {
    id: 'hub-01',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Production Hub',
    status: 'running',
    ip: '142.250.190.46',
    port: 25565,
    node: 'Singapore-01',
    limits: { memory: 8192, swap: 0, disk: 51200, io: 500, cpu: 200 },
    resources: { memory_bytes: 4294967296, cpu_absolute: 45.2, disk_bytes: 10737418240, network_rx_bytes: 1024, network_tx_bytes: 2048 }
  }
];
