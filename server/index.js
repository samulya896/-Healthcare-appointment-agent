const { port } = require("./config");
const app = require("./app");

app.listen(port, () => console.log(`Healthcare Scheduler API listening on port ${port}`));
