import { Request, Response } from "express";
import {
  CreateAgentRequestBody,
  CreateUserRequestBody,
  LoginUserRequestBody,
  TokenData,
} from "../types/types";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { AppDataSource } from "../database/data-source";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { UserRoles } from "../constants/UserRoles";
import { Agent } from "../models/Agent";

export class UserController {
  async register(
    req: Request<{}, {}, CreateUserRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const { name, last_name, address, email, phone_number, password } =
      req.body;

    const userRepository = AppDataSource.getRepository(User);

    try {
      const newUser = userRepository.create({
        name,
        last_name,
        address,
        email,
        phone_number,
        password_hash: bcrypt.hashSync(password, 10),
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
  }

  async login(
    req: Request<{}, {}, LoginUserRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const { password, email } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {
      // Validar existencia de email y contraseña
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Email or password is required",
        });
      }
      // Encontrar un usuario por email
      const user = await userRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
        select: {
          id: true,
          password_hash: true,
          role: {
            role_name: true,
          },
        },
      });

      // Verificar usuario inexistente
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Bad email or password",
        });
      }

      // Verificar contraseña si el usuario existe
      const isPasswordValid = bcrypt.compareSync(
        password,
        user.password_hash
      );

      // Verificar contraseña valida
      if (!isPasswordValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Bad email or password",
        });
      }

      // Generar token
      const userRole = user.role.role_name;

      const tokenPayload: TokenData = {
        userId: user.id?.toString() as string,
        userRoles: userRole as string,
      };

      const token = jwt.sign(tokenPayload, "123", {
        expiresIn: "3h",
      });

      res.status(StatusCodes.OK).json({
        message: "Login successfully",
        token,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error while login",
        error,
      });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: id }, // Filtrar citas por el ID del usuario
        select: ["id", "name", "last_name", "phone_number", "email", "address"], // Seleccionar solo los campos necesarios
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error while getting userxdd",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const data = req.body;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.update({ id: id }, data);

      res.status(202).json({
        message: "User updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while updating user",
      });
    }
  }

  async getAllUsers(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 5;

      interface filter {
        [key: string]: any;
      }
      const filter: any = {
        select: {
          id: true,
          name: true,
          last_name: true,
          phone_number: true,
          email: true,
          role: true,
        },
        relations: ["role"],
      };

      if (page && limit) {
        filter.skip = (page - 1) * limit;
      }
      if (limit) {
        filter.take = limit;
      }

      const [allUsers, count] = await userRepository.findAndCount(filter);

      const usersWithRoles = allUsers.map((user) => ({
        ...user,
        role_name: user.role.role_name, // Assuming 'name' is the property for artist's name
      }));
      res.status(200).json({
        count,
        limit,
        page,
        results: usersWithRoles,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while getting users",
      });
    }
  }
  async createAgent(
    req: Request<{}, {}, CreateAgentRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const { name, last_name, phone_number, address, email, password } =
      req.body;
    const { photo, specialty } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const agentRepository = AppDataSource.getRepository(Agent);

    try {
      // Crear nuevo booking
      const newUser = userRepository.create({
        name,
        last_name,
        address,
        email,
        phone_number,
        password_hash: bcrypt.hashSync(password, 10),
        role: UserRoles.AGENT,
      });
      await userRepository.save(newUser);

      // Crear nuevo vuelo asociado al booking
      const newAgent = agentRepository.create({
        user: newUser,
        photo,
        specialty,
      });
     await agentRepository.save(newAgent);

      res.status(201).json(newAgent);
    } catch (error: any) {
      console.error("Error while creating agent:", error);
      res.status(500).json({
        message: "Error while creating agent",
        error: error.message,
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.delete({ id: id });

      res.status(200).json({
        message: "user deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while deleting user",
      });
    }
  }

  async getAllAgents(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const agentRepository = AppDataSource.getRepository(Agent);

      const allAgents = await agentRepository.find({
        relations: ["user"],
      });

      const agentsWithDetails = allAgents.map((agent) => ({
        id: agent.id,
        name: agent.user.name,
        photo: agent.photo,
        specialty: agent.specialty,
      }));

      res.status(200).json(agentsWithDetails);
    } catch (error) {
      res.status(500).json({
        message: "Error while getting agents",
      });
    }
  }


}
