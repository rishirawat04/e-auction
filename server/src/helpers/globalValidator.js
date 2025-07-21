import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    req.validatedBody = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message
      }));
      return res.status(400).json({ errors });
    }
    next(err); 
  }
};
