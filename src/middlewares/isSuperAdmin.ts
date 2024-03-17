import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRoles } from "../constants/UserRoles";

const isSuperAdmin = (req: any, res: Response, next: NextFunction) => {

       console.log(req.tokenData);
    
       const roles = req.tokenData.userRoles;
    
       if (!roles.includes("super_admin")) {
          return res.status(StatusCodes.FORBIDDEN).json({
             message: "You are not allowed to access this resource",
          });
       }
    
       next();
    };
    

export { isSuperAdmin }