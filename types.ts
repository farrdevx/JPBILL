
export type ServerStatus = 'running' | 'starting' | 'stopped' | 'suspended' | 'offline';

export interface PteroServer {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  status: ServerStatus;
  ip: string;
  port: number;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  resources?: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
  };
}

export interface PteroConfig {
  baseUrl: string;
  apiKey: string;
}

export interface DatabaseConfig {
  host: string;
  user: string;
  pass: string;
  database: string;
  port: number;
  status: 'connected' | 'disconnected' | 'error';
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  cpu: number;
  memory: number;
  disk: number;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface SubCategory {
  id: string;
  name: string;
  icon: string; 
  packages: Plan[];
}

export interface StoreCategory {
  id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
}
