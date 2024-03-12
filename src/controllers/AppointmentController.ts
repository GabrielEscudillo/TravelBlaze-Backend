import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { AppDataSource } from "../database/data-source";
import { CreateAppointmentsRequestBody } from "../types/types";
import { Agent } from "../models/Agent";
import { User } from "../models/User";
import { Service } from "../models/Service";

export class AppointmentController {
  async create(
    req: Request<{}, {}, CreateAppointmentsRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const data = req.body;
      const appointmentRepository = AppDataSource.getRepository(Appointment);

      // Verificar si el agenta con el agent_id proporcionado existe en la base de datos
      const agentRepository = AppDataSource.getRepository(Agent);
      const agent = await agentRepository.findOne({
        where: { id: data.agent_id },
      });
      if (!agent) {
        return res
          .status(400)
          .json({ message: "El agenta especificado no existe." });
      }

      const newAppointment = await appointmentRepository.save(data);
      res.status(201).json({
        message: "Appointment created successfully",
        appointment: newAppointment,
      });
    } catch (error: any) {
      console.error("Error while creating Appointment:", error);
      res.status(500).json({
        message: "Error while creating Appointment",
        error: error.message,
      });
    }
  }

  async updateAppointment(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const data = req.body;

      const appointmentRepository = AppDataSource.getRepository(Appointment);
      await appointmentRepository.update({ id: id }, data);

      res.status(202).json({
        message: "Appointment updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while updating appointment",
      });
    }
  }

  async deleteAppointment(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const appointmentRepository = AppDataSource.getRepository(Appointment);
      await appointmentRepository.delete(id);

      res.status(200).json({
        message: "Appointment deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while deleting appointment",
      });
    }
  }

  async getByAgent(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userId = +req.params.id; // Obtener el user_id de los parámetros de la ruta
      const userRepository = AppDataSource.getRepository(User);

      // Buscar el usuario con la relación con el agenta
      const user = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.agent", "agent")
        .where("user.id = :userId", { userId })
        .getOne();

      // Si el usuario no existe, devuelve un error 404
      if (!user || !user.agent) {
        return res
          .status(404)
          .json({ message: "User or associated agent not found" });
      }

      const agentId = user.agent.id; // Obtener el agent_id asociado al usuario

      const appointmentRepository = AppDataSource.getRepository(Appointment);
      const myAppointments = await appointmentRepository.find({
        where: { agent_id: agentId }, // Filtrar citas por el agent_id obtenido
        relations: ["user", "service"], // Cargar la relación con el usuario asociado a la cita
        select: ["id", "date", "time", "agent_id", "service_id"], // Seleccionar solo los campos necesarios
      });

      // Mapear las citas para incluir el nombre del usuario
      const appointmentsWithUserName = myAppointments.map((appointment) => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        agent_id: appointment.agent_id,
        service: {
          id: appointment.service.id,
          service_name: appointment.service.service_name,
        },
        user: {
          id: appointment.user.id,
          name: appointment.user.name,
          last_name: appointment.user.last_name,
          phone_number: appointment.user.phone_number,
        },
      }));

      res.status(200).json(appointmentsWithUserName);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error while getting appointments",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const appointmentRepository = AppDataSource.getRepository(Appointment);
      const myAppointments = await appointmentRepository.find({
        where: { user_id: id }, // Filtrar citas por el ID del usuario
        relations: ["agent", "agent.user", "service"], // Cargar las relaciones del agenta y del usuario asociado
        select: ["id", "date", "time", "agent"], // Seleccionar solo los campos necesarios
      });

      // Mapear las citas para incluir el nombre del agenta
      const appointmentsWithAgentName = myAppointments.map((appointment) => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        agent: {
          id: appointment.agent.id,
          name: appointment.agent.user.name,
          specialty: appointment.agent.specialty,
        },
        service: {
          id: appointment.service.id,
          service_name: appointment.service.service_name,
        },
      }));

      res.status(200).json(appointmentsWithAgentName);
    } catch (error) {
      res.status(500).json({
        message: "Error while getting appointments",
      });
    }
  }

  async getAllAppointments(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const appointmentRepository = AppDataSource.getRepository(Appointment);

      const page = req.query.page ? Number(req.query.page) : null;
      const limit = req.query.limit ? Number(req.query.limit) : null;

      interface filter {
        [key: string]: any;
      }
      const filter: any = {
        select: {
          date: true,
          time: true,
          user_id: true,
          agent_id: true,
          service_id: true,
          id: true,
        },
        relations: ["agent", "agent.user", "user", "service"],
      };

      if (page && limit) {
        filter.skip = (page - 1) * limit;
      }
      if (limit) {
        filter.take = limit;
      }

      const [allAppointments, count] = await appointmentRepository.findAndCount(
        filter
      );

      //   const appointmentsWithAgentNames = allAppointments.map(appointment => ({
      //     ...appointment,
      //     artist_name: appointment.agent.user.name, // Assuming 'name' is the property for artist's name
      //     user_name: appointment.user.name,
      //     user_last_name: appointment.user.last_name,

      // }));

      res.status(200).json({
        count,
        limit,
        page,
        results: allAppointments,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while getting users",
      });
    }
  }

  async getAllServices(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const serviceRepository = AppDataSource.getRepository(Service);

      const allServices = await serviceRepository.find({
        select: ["id", "service_name"],
      });

      res.status(200).json(allServices);
    } catch (error) {
      res.status(500).json({
        message: "Error while getting agents",
      });
    }
  }
}
