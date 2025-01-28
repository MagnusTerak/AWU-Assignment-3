import { app } from "./static/js/app.js";

const PORT = 5080;

app.listen(PORT, () => {
    console.log("Server is up at: http://localhost:5080");
});