const express = require("express");
const cors = require("cors");

const {
  chainRouter,
  mineRouter,
  newTransactionRouter,
} = require("./controllers");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.get("/mine", mineRouter);
app.post("/transactions/new", newTransactionRouter);
app.get("/chain", chainRouter);

app.all("/", (_, res) => {
  return res.json({ message: "Server is OK" });
});

// Global error handler
app.use((err, req, res, _) => {
  console.error(err);
  return res.status(500).json({
    message: err.message || "INTERNAL SERVER ERROR",
  });
});

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
