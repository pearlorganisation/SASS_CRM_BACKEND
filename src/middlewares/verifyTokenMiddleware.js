import dotenv from 'dotenv'
dotenv.config()

//==============================================Imports===============================================
import jwt from "jsonwebtoken";
//***************************************************************************************************

const ROLES = JSON.parse(process.env.ROLES);

export const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const cookies = req?.cookies;
    const access_token = cookies[`${process.env.ACCESS_TOKEN_NAME}`];

    if (!access_token) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized! Please Check Your Login Credentials",
      });
    }

    jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, user) => {
        if (error) {
          return res.status(403).json({
            success: false,
            message: "Unauthorized token! Please Check Your Login Credentials",
          });
        }

        req.id = user?.id
        req.role = user?.rId;
        req.plan = user?.plan;

        next();
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const verifySuperAdminTokenMiddleware = async (req, res, next) => {
  try {
    const cookies = req?.cookies;
    const access_token = cookies[`${process.env.ACCESS_TOKEN_NAME}`];
    console.log(cookies)
    if (!access_token) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized! Please Check Your Login Credentials",
      });
    }

    jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, user) => {
        if (error || !user?.rId || user?.rId !== ROLES.SUPER_ADMIN) {
          return res.status(403).json({
            success: false,
            message: "Unauthorized token! Please Check Your Login Credentials",
          });
        }

        next();
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};
