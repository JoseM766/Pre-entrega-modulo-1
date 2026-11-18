import passport from "passport";
import { ERROR_STATUS_MAP } from "./error.middleware.js";

// Ejecuta una estrategia de passport (register / login) y, si falla, responde con el
// status que corresponda. Antes esta lógica vivía dentro de sessions.router.js.
export const authenticateStrategy = (strategyName, defaultErrorStatus, fixedMessage) => {
  return (req, res, next) => {
    passport.authenticate(strategyName, { session: false }, (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        const statusCode = ERROR_STATUS_MAP[info?.code] || defaultErrorStatus;
        const message = fixedMessage || info?.message || "Error de autenticación";
        return res.status(statusCode).json({ status: "error", message });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};
