import express from "express";
import userRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";
console.log("userRouter imported:", userRouter); // Add this line

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(getUserFromToken);

// Add this test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.use("/users", userRouter);

export default app;

// import express from "express";

// const app = express();

// app.get("/test", (req, res) => {
//   res.json({ message: "Basic Express is working!" });
// });

// export default app;
