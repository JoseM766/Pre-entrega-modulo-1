// Nunca incluye password, aunque el documento de Mongoose lo tenga.
export const toUserDTO = (user) => {
  if (!user) return null;

  return {
    id: user._id ?? user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };
};

// Para GET /current: el payload viene del JWT (solo id/email/role, sin nombre),
// así que es un DTO distinto — no hay que inventar campos que no existen ahí.
export const toCurrentUserDTO = (payload) => {
  if (!payload) return null;

  return {
    id: payload.id ?? payload._id,
    email: payload.email,
    role: payload.role,
  };
};
