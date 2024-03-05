import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { Booking } from "../models/Booking";
import { Flight } from "../models/Flight";
import { Hotel } from "../models/Hotel";

export class BookingController {
  // async createFlight(
  //     req: Request<{}, {}>,
  //     res: Response
  //   ): Promise<void | Response<any>> {
  //     const { date_of_purchase, price, user_id } = req.body;
  //     const { airline, flight_number, departure, destination, date_of_departure, date_of_return } = req.body;

  //     const bookingRepository = AppDataSource.getRepository(Booking);
  //     const flightRepository = AppDataSource.getRepository(Flight);

  //     try {
  //         // Crear nuevo booking
  //         const newBooking = await bookingRepository.create({
  //           user_id,
  //           date_of_purchase,
  //           price,
  //           created_at: new Date(),
  //           updated_at: new Date(),
  //         });
  //         await bookingRepository.save(newBooking);

  //         // Crear nuevo vuelo asociado al booking
  //         const newFlight = flightRepository.create({
  //           booking: newBooking,
  //           airline,
  //           flight_number,
  //           departure,
  //           destination,
  //           date_of_departure,
  //           date_of_return
  //         });
  //         const savedFlight = await flightRepository.save(newFlight);

  //         // Obtener el ID del vuelo guardado
  //         const flightId = savedFlight.id;

  //         // Actualizar el booking con el ID del vuelo generado
  //         newBooking.flight_id = flightId;
  //         await bookingRepository.save(newBooking);

  //         res.status(201).json(savedFlight);
  //       } catch (error: any) {
  //         console.error("Error while creating flight:", error);
  //         res.status(500).json({
  //           message: "Error while creating flight",
  //           error: error.message,
  //         });
  //       }

  async createFlight(
    req: Request<{}, {}>,
    res: Response
  ): Promise<void | Response<any>> {
    const { date_of_purchase, price, user_id } = req.body;
    const {
      airline,
      flight_number,
      departure,
      destination,
      date_of_departure,
      date_of_return,
    } = req.body;

    const bookingRepository = AppDataSource.getRepository(Booking);
    const flightRepository = AppDataSource.getRepository(Flight);
    const hotelRepository = AppDataSource.getRepository(Hotel);

    try {
      // Crear nuevo booking
      const newBooking = await bookingRepository.create({
        user_id,
        date_of_purchase,
        price,
      });
      await bookingRepository.save(newBooking);

      let newFlight;
      let newHotel;

      // Verificar si hay datos de vuelo en la solicitud
      if (
        airline &&
        flight_number &&
        departure &&
        destination &&
        date_of_departure &&
        date_of_return
      ) {
        // Crear nuevo vuelo asociado al booking
        newFlight = flightRepository.create({
          booking: newBooking,
          airline,
          flight_number,
          departure,
          destination,
          date_of_departure,
          date_of_return,
        });
        const savedFlight = await flightRepository.save(newFlight);
        // Obtener el ID del vuelo guardado
        const flightId = savedFlight.id;

        // Actualizar el booking con el ID del vuelo generado
        newBooking.flight_id = flightId;
        await bookingRepository.save(newBooking);
      }

      // Verificar si hay datos de hotel en la solicitud
      if (
        req.body.hotel_name &&
        req.body.address &&
        req.body.guests &&
        req.body.check_in_date &&
        req.body.check_out_date
      ) {
        // Crear nuevo hotel asociado al booking
        newHotel = hotelRepository.create({
          booking: newBooking,
          hotel_name: req.body.hotel_name,
          address: req.body.address,
          guests: req.body.guests,
          check_in_date: req.body.check_in_date,
          check_out_date: req.body.check_out_date,
        });
        const savedHotel = await hotelRepository.save(newHotel);

        // Obtener el ID del vuelo guardado
        const hotelId = savedHotel.id;

        // Actualizar el booking con el ID del vuelo generado
        newBooking.hotel_id = hotelId;
        await bookingRepository.save(newBooking);
      }

      res.status(201).json({ flight: newFlight, hotel: newHotel });
    } catch (error: any) {
      console.error("Error while creating flight:", error);
      res.status(500).json({
        message: "Error while creating flight",
        error: error.message,
      });
    }
  }
}
