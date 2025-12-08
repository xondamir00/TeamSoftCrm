
export interface Room {
  id: string;
  name: string;
  capacity?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface CreateRoomPayload {
  name: string;
  capacity?: number;
}

export interface UpdateRoomPayload {
  name?: string;
  capacity?: number;
  isActive?: boolean;
}

