import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { Booking } from "../models/Booking";
import { Flight } from "../models/Flight";
import { Hotel } from "../models/Hotel";
import { Cruise } from "../models/Cruise";

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

  async createBooking(
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

  async createCruise(
    req: Request<{}, {}>,
    res: Response
  ): Promise<void | Response<any>> {
    const { date_of_purchase, price, user_id } = req.body;
    const { cruise_line, cabin, route, date_of_departure, date_of_return } =
      req.body;

    const bookingRepository = AppDataSource.getRepository(Booking);
    const cruiseRepository = AppDataSource.getRepository(Cruise);

    try {
      // Crear nuevo booking
      const newBooking = bookingRepository.create({
        user_id,
        date_of_purchase,
        price,
      });
      await bookingRepository.save(newBooking);

      // Crear nuevo vuelo asociado al booking
      const newCruise = cruiseRepository.create({
        booking: newBooking,
        cruise_line,
        cabin,
        route,
        date_of_departure,
        date_of_return,
      });
      const savedCruise = await cruiseRepository.save(newCruise);

      // Obtener el ID del vuelo guardado
      const cruiseId = savedCruise.id;

      // Actualizar el booking con el ID del vuelo generado
      newBooking.cruise_id = cruiseId;
      await bookingRepository.save(newBooking);

      res.status(201).json(savedCruise);
    } catch (error: any) {
      console.error("Error while creating flight:", error);
      res.status(500).json({
        message: "Error while creating flight",
        error: error.message,
      });
    }
  }
  async getMyBookings(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const bookingRepository = AppDataSource.getRepository(Booking);

      const page = req.query.page ? Number(req.query.page) : null;
      const limit = req.query.limit ? Number(req.query.limit) : null;

      const filter: any = {
        where: { user_id: id },
        relations: ["flight", "hotel", "cruise"],
        select: ["id", "date_of_purchase", "price", "user_id"],
      };

      if (page && limit) {
        filter.skip = (page - 1) * limit;
      }
      if (limit) {
        filter.take = limit;
      }

      const [myBookings, count] = await Promise.all([
        bookingRepository.find(filter),
        bookingRepository.count(filter.where),
      ]);

      const bookingWithDetails = myBookings.map((booking) => ({
        id: booking.id,
        date_of_purchase: booking.date_of_purchase,
        price: booking.price,
        flight: booking.flight
          ? {
              id: booking.flight.id,
              airline: booking.flight.airline,
              flight_number: booking.flight.flight_number,
              departure: booking.flight.departure,
              destination: booking.flight.destination,
              date_of_departure: booking.flight.date_of_departure,
              date_of_return: booking.flight.date_of_return,
            }
          : null,
        hotel: booking.hotel
          ? {
              id: booking.hotel.id,
              hotel_name: booking.hotel.hotel_name,
              address: booking.hotel.address,
              guests: booking.hotel.guests,
              check_in_date: booking.hotel.check_in_date,
              check_out_date: booking.hotel.check_out_date,
            }
          : null,
        cruise: booking.cruise
          ? {
              id: booking.cruise.id,
              cabin: booking.cruise.cabin,
              route: booking.cruise.route,
              date_of_departure: booking.cruise.date_of_departure,
              date_of_return: booking.cruise.date_of_return,
            }
          : null,
      }));

      res.status(200).json({
        count,
        limit,
        page,
        results: bookingWithDetails,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while getting bookings",
      });
    }
  }

  async getAllBookings(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const bookingRepository = AppDataSource.getRepository(Booking);

      const page = req.query.page ? Number(req.query.page) : null;
      const limit = req.query.limit ? Number(req.query.limit) : null;

      const filter: any = {
        relations: ["flight", "hotel", "cruise", "user"],
        select: ["id", "date_of_purchase", "price", "user"],
      };

      if (page && limit) {
        filter.skip = (page - 1) * limit;
      }
      if (limit) {
        filter.take = limit;
      }

      const [allBookings, count] = await bookingRepository.findAndCount(filter);

       const bookingWithDetails = allBookings.map((booking) => ({
        id: booking.id,
        date_of_purchase: booking.date_of_purchase,
        price: booking.price,
        user: booking.user,
        flight: booking.flight
          ? {
              id: booking.flight.id,
              airline: booking.flight.airline,
              flight_number: booking.flight.flight_number,
              departure: booking.flight.departure,
              destination: booking.flight.destination,
              date_of_departure: booking.flight.date_of_departure,
              date_of_return: booking.flight.date_of_return,
            }
          : null,
        hotel: booking.hotel
          ? {
              id: booking.hotel.id,
              hotel_name: booking.hotel.hotel_name,
              address: booking.hotel.address,
              guests: booking.hotel.guests,
              check_in_date: booking.hotel.check_in_date,
              check_out_date: booking.hotel.check_out_date,
            }
          : null,
        cruise: booking.cruise
          ? {
              id: booking.cruise.id,
              cabin: booking.cruise.cabin,
              route: booking.cruise.route,
              date_of_departure: booking.cruise.date_of_departure,
              date_of_return: booking.cruise.date_of_return,
            }
          : null,
      }));

      res.status(200).json({
        count,
        limit,
        page,
        results: bookingWithDetails,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while getting bookings",
      });
    }
  }

  async deleteBooking(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const bookingRepository = AppDataSource.getRepository(Booking);
      await bookingRepository.delete(id);

      res.status(200).json({
        message: "booking deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while deleting booking",
      });
    }
  }


}
