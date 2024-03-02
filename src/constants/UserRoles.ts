import { Role } from "../models/Role";

export const UserRoles = {
   CUSTOMER: { id: 1, role_name: "customer" } as Role,
   AGENT: { id: 2, role_name: "agent" } as Role,
   SUPER_ADMIN: { id: 3, role_name: "super_admin" } as Role,
};