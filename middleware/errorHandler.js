const VALIDATION_ERRORS = require("../constants/validationErrors");

const errorHandler = {};

errorHandler.handleError = async (err, req, res, next) => {
    // 1. Validation Errors (400 Bad Request)
    // - Handle mongoose validation errors
       if(err.name === 'ValidationError' || err.name === 'SchemaValidationError'){
        return res.status(400).json({
            status: 400,
            message: VALIDATION_ERRORS.VALIDATION_ERROR,
            error: err.message,
            timestamp: new Date().toISOString()
        });
       }
    // - Handle invalid input data errors
       if(err.name === 'CastError'){
        return res.status(400).json({
            status: 400,
            message: VALIDATION_ERRORS.CAST_ERROR,
            error: err.message,
            timestamp: new Date().toISOString()
        });
       }
       
    // 2. Authentication Errors (401 Unauthorized)
    // - Handle invalid/expired JWT token
    // - Handle unauthorized access attempts
    // - Send auth error messages from AUTH_ERRORS constants
        if(err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'){
            return res.status(401).json({
                status: 401,
                message: 'Invalid or expired token',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }
    
    // 3. Authorization Errors (403 Forbidden) 
    // - Handle insufficient permissions
    // - Handle role-based access control
        if(err.name === 'UnauthorizedError'){
            return res.status(403).json({
                status: 403,
                message: 'Forbidden',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }
    // 4. Not Found Errors (404)
    // - Handle resource not found cases
    // - Handle invalid routes/endpoints
        if(err.name === 'NotFoundError'){
            return res.status(404).json({
                status: 404,
                message: 'Resource not found',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }
    
    // 5. Conflict Errors (409)
    // - Handle duplicate key errors
    // - Handle conflicting resource states
        if(err.name === 'ConflictError'){
            return res.status(409).json({
                status: 409,
                message: 'Conflict',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }
        
    // Send error response
    res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: err.message,
        timestamp: new Date().toISOString()
    });
}
module.exports = errorHandler;



