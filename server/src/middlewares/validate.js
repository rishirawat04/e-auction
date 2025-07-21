import { ZodError } from "zod";

export const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      const firstError = err.errors?.[0];
      return res.status(400).json({
        status: "fail",
        message: firstError?.message || "Invalid input",
        field: firstError?.path?.[0] || null,
        errors: err.flatten?.() || err.errors || [],
      });
    }
    console.error("Unexpected validation error:", err);
    return res.status(500).json({ message: "Unexpected error in validation middleware" });
  }
};
