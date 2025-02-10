import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMx:30*60*1000,
        max:300,
        message:{
            message:'You are blocked, wait 30 minutes'
        }
    }
)