export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl?: string;
  monthlySalary?: number;
}

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  photoUrl: string;
  monthlySalary: string;
}
