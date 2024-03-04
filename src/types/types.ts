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