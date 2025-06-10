import { error } from "console";
import { Response } from "express";


export class ResponseHandler {
  static success = (res: Response, message = 'success', payload = {}) => {
    return res.status(200).json({
      success: true,
      message,
      data: payload,
    });
  };

  static created = (res: Response, message: 'Resource created successfully', payload = {}) => {
    return res.status(201).json({
        success: true,
        message,
        data: payload
    })
  }

  static badRequest = (res: Response, message = 'Bad request', errors = []) => {
    return res.status(400).json({
        success: false,
        message,
        errors
    })
  }
  static unauthorized = (res:Response, message = 'Unauthorized access') => {
    return res.status(401).json({
        success: false,
        message
    });
}

static forbidden = (res: Response, message = 'Access forbidden') => {
    return res.status(403).json({
        success: false,
        message
    });
}

static notFound = (res: Response, message = 'Resource not found') => {
    return res.status(404).json({
        success: false,
        message
    });
}
static serverError = (res: Response, message = 'Internal server error') => {
    return res.status(500).json({
        success: false,
        message
    });
}
}
