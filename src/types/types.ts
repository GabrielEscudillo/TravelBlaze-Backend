export interface CreateUserRequestBody {
    name: string;
    last_name: string;
    address: string;
    email: string;  
    password_hash: string;   
    phone_number: string;
 }

 export interface LoginUserRequestBody {
    email: string;
    password_hash: string;
 }

export interface TokenData {
    userId: string;
    userRoles: string;
 }

 export interface CreateAppointmentsRequestBody {
   user_id: number;
   agent_id: number;
   service_id: number;
   date: Date;
   time: string;
}