const app = require("./src/app");
const env = require("./src/config/env");

app.listen(env.port, () => {
  console.log(`Vicosoft backend listening on http://localhost:${env.port}`);
  console.log(`  Public API : http://localhost:${env.port}/api`);
  console.log(`  Admin panel: http://localhost:${env.port}/admin`);
});
