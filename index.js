const fs = require("fs/promises");
const path = require("path");
const http = require("http");

//localhost:8000/apiv1/tasks

const PORT = 8000;

const app = http.createServer(async (req, res) => {
  const reqMethod = req.method;
  const reqURL = req.url;
  const jsonPath = path.resolve("./data.json");
  const jsonFile = await fs.readFile(jsonPath, "utf8");

  if (reqURL === "/apiv1/tasks") {
    if (reqMethod === "GET") {
      res.setHeader("Content-Type", "application/json");
      res.write(jsonFile);
    }

    if (reqMethod === "POST") {
      //En el body se envía el id y el status por ejemplo:   {"title": "Prueba", "description": "Tarea", "status": true }
      req.on("data", async (data) => {
        const parsed = JSON.parse(data);
        const arra = JSON.parse(jsonFile);
        arra.push({ ...parsed, id: lastId(arra) });

        try {
          await fs.writeFile(jsonPath, JSON.stringify(arra));
        } catch (error) {
          console.log(error);
        }
      });
    }

    if (reqMethod === "PUT") {
      //En el body se envía el id y el status por ejemplo:   {"id": 2, "status": true }
      req.on("data", async (data) => {
        try {
          const parsed = JSON.parse(data);
          const { id, status } = parsed;
          const taskArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
          const taskIndex = taskArray.findIndex((task) => task.id === id);
          console.log(taskIndex);
          taskArray[taskIndex].status = status;
          await fs.writeFile(jsonPath, JSON.stringify(taskArray));
        } catch (error) {
          console.log(error);
        }
      });
    }

    if (reqMethod === "DELETE") {
      //Para borrar es pasando el id en el body {id: 2}
      req.on("data", async (data) => {
        try {
          const parsed = JSON.parse(data);
          const { id } = parsed;
          const taskArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
          const taskIndex = taskArray.findIndex((task) => task.id === id);
          console.log(taskIndex);
          const filtered = taskArray.filter((task) => task.id !== id);
          await fs.writeFile(jsonPath, JSON.stringify(filtered));
        } catch (error) {
          console.log(error);
        }
      });
    }
  } else {
    res.writeHead(503);
  }

  res.end();
});

const lastId = (arra) => {
  const lastIndex = arra.length - 1;
  return arra[lastIndex].id + 1;
};

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
