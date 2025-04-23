export interface Supplier {
    id: number;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    created_at?: string;  // Optional fields from your database
    updated_at?: string;
  }