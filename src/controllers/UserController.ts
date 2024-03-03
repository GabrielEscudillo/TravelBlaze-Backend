import { Request, Response } from "express";
import {
    CreateUserRequestBody,
    TokenData,
  } from "../types/types";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { AppDataSource } from "../database/data-source";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { UserRoles } from "../constants/UserRoles";


export class UserController {
    async register(
      req: Request<{}, {}, CreateUserRequestBody>,
      res: Response
    ): Promise<void | Response<any>> {
      const { name, last_name, address, email, phone_number, password_hash } =
        req.body;
  
      const userRepository = AppDataSource.getRepository(User);
  
      try {
        const newUser = userRepository.create({
          name,
          last_name,
          address,
          email,
          phone_number,
          password_hash: bcrypt.hashSync(password_hash, 10),
          role: UserRoles.CUSTOMER,
        });
  
        await userRepository.save(newUser);
        res.status(StatusCodes.CREATED).json({
          message: "Register successfully",
        });
      } catch (error: any) {
        console.error("Error while register:", error);
        res.status(500).json({
          message: "Error while register",
          error: error.message,
        });
      }
    }}