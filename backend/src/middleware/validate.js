const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = req[source];

      const result = schema.safeParse(data);

      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }

      // Replace request data with validated/sanitized data
      req[source] = result.data;

      next();

    } catch (error) {
      console.error("Validation middleware error:", error);

      return res.status(500).json({
        message: "Validation error"
      });
    }
  };
};

module.exports = validate;