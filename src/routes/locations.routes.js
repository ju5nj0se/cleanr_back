import { Router } from "express";
import { con } from "../../server.js";

const router = Router();  

// Endpoint to get all locations
router.get("/locations", (req, res) => {
  con.query("SELECT id_location, name FROM locations", (er, result) => {
    if (er) {
      console.error("Error en la consulta:", er);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    // devolvemos solo el array de ubicaciones
    res.status(200).json(result);
  });
});

export default router;


