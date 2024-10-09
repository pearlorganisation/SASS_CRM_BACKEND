const availableRoles = {
  SUPER_ADMIN: "66b758464892ce3d994745c5",
  ADMIN: "66b7584c4892ce3d994745c8",
  EMPLOYEE_SALES: "66b758544892ce3d994745cb",
  EMPLOYEE_REMINDER: "66b7585d4892ce3d994745ce",
};

// isSuperAdmin -- function to check whether the user is super admin or not
export const isSuperAdmin = (role) => {
  return (req, res, next) => {
    if (role !== availableRoles.SUPER_ADMIN) {
      return res.status(400).json({
        success: false,
        message: "Un-Authorized Access to the resource",
      });
    }
    next();
  };
};

// isAdmin -- function to check whether the user is admin or not
export const isAdmin = (role) => {
  return (req, res, next) => {
    if (role !== availableRoles.ADMIN) {
      return res.status(400).json({
        success: false,
        message: "Un-Authorized Access to the resource",
      });
    }
    next();
  };
};

// isEmployee -- function to check whether the user is employee or not
export const isEmployee = (role) => {
  return (req, res, next) => {
    if (role !== availableRoles.EMPLOYEE) {
      return res.status(400).json({
        success: false,
        message: "Un-Authorized Access to the resource",
      });
    }
    next();
  };
};

// isCoder -- function to check whether the user is coder or not
export const isCoder = () => {
  return (req, res, next) => {
    if (role !== availableRoles.CODER) {
      return res.status(400).json({
        success: false,
        message: "Un-Authorized Access to the resource",
      });
    }
    next();
  };
};
