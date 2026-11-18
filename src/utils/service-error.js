// Error de negocio con un código identificable. Lo lanzan los services y
// error.middleware.js lo traduce al status HTTP correspondiente.
export class ServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
