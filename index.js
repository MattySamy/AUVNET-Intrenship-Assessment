const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });

const { ApiError } = require("./utils/errorHandler");

const { globalErrorHandler } = require("./middlewares/error.middleware");

const { mongoConnect } = require("./config/mongoConnection");

const { createAdmin } = require("./config/automaticAdminCreation");

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const categoryRoute = require("./routes/category.route");
const productRoute = require("./routes/product.route");
const wishlistRoute = require("./routes/wishlist.route");

const app = express();

const PORT = process.env.PORT || 3000;

// Global Usage Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`node: ${process.env.NODE_ENV}`);
}

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// for handling refresh tokens
app.use(cookieparser());

// Routes

app.use("/api/v1/auth", authRoute.router);
app.use("/api/v1/users", userRoute.router);
app.use("/api/v1/categories", categoryRoute.router);
app.use("/api/v1/products", productRoute.router);
app.use("/api/v1/wishlist", wishlistRoute.router);

// Global Error Handling Middleware
app.all("*", (req, res, next) => {
  // Create Error and send it to error handling middleware
  next(
    new ApiError(
      `Can't find this route ${req.originalUrl} on this server!`,
      400
    )
  );
});

// Global Error Handling Middleware for express
app.use(globalErrorHandler);

async function startServer() {
  await mongoConnect()
    .then((conn) =>
      console.log(
        `Database is connected to ${conn.connection.name}db and its host is ${conn.connection.host}`
      )
    )
    .catch((err) => {
      console.error("Database connection error: ", err);
      process.exit(1);
    });

  await createAdmin();
  app.listen(PORT, () => {
    console.log(
      `Server started on port ${PORT} on http://localhost:${PORT}/api/v1/`
    );
  });
}

startServer();
