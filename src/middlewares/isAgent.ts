// import { NextFunction, Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";

// export const isArtist = (req: Request, res: Response, next: NextFunction) => {

//    const roles = req.tokenData.userRoles;

//    if (!roles.includes("artist")) {
//       return res.status(StatusCodes.FORBIDDEN).json({
//          message: "You are not allowed to access this resource",
//       });
//    }

//    next();
// };