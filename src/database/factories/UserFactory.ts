import { faker } from "@faker-js/faker";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import bcrypt from "bcrypt";
import { UserRoles } from "../../constants/UserRoles";
import { BaseFactory } from "./BaseFactory";

// -----------------------------------------------------------------------------

export class UserFactory extends BaseFactory<User> {
   static createMany(artistCount: number, arg1: { roles: Role[]; }) {
       throw new Error("Method not implemented.");
   }
   protected  generateSpecifics(user: User): User {
      user.name = faker.person.firstName();
      user.last_name = faker.person.lastName();
      user.address = faker.location.streetAddress();
      user.phone_number = faker.string.numeric(9) // '943228';
      user.password_hash = bcrypt.hashSync("12345678", 10);
      user.email = faker.internet.email({
         allowSpecialCharacters: true
      });
      return user;
   }
}