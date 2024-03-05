import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { AppDataSource } from "../database/data-source";
import { CreateAppointmentsRequestBody } from "../types/types";
import { Agent } from "../models/Agent";
import { User } from "../models/User";

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
      
    }