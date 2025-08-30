import { Router } from "express";
import { con } from '../../server.js';
const router = Router();

// Alerts in process with the place name and not the id
router.get("/alerts", (req, res) => {
  const query = `
    SELECT 
      a.id_alert,
      a.alert_type,
      a.message,
      l.name AS location_name
    FROM alerts a
    JOIN locations l ON a.id_location = l.id_location
    WHERE a.status = 'en proceso';  -- Filtrar solo alertas en proceso
  `;
  con.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener alertas:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json({ result });
  });
});



// first check if there is already such an alert and then if not, create it
router.post("/newAlerts", (req, res) => {
  const { alert_type, message, id_location, id_user } = req.body;

  const alertCheck = `
    SELECT * FROM alerts 
    WHERE id_user = ? 
      AND alert_type = ?
      AND message = ? 
      AND created_at >= NOW() - INTERVAL 5 MINUTE;
  `;

  con.query(alertCheck, [id_user, alert_type, message], (err, results) => {
    if (err) {
      console.error("Error en consulta:", err.sqlMessage);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Ya hiciste esta alerta recientemente, espera 5 minutos."
      });
    }

    const alertInsert = `
      INSERT INTO alerts (message, id_location, id_user, status, created_at, alert_type)
      VALUES (?, ?, ?, 'en proceso', NOW(), ?)
    `;

    con.query(alertInsert, [message, id_location, id_user, alert_type], (err, result) => {
      if (err) {
        console.error("Error insertando:", err.sqlMessage);
        return res.status(500).json({ error: "Error al crear alerta" });
      }

      res.status(201).json({
        id_alert: result.insertId,
        message,
        id_location,
        id_user,
        status: "en proceso",
        alert_type
      });
    });
  });
});

// VER ALERTAS PROPIAS
router.get("/alerts/user/:id_user", (req, res) => {
  const id_user = req.params.id_user;
  const query = `
    SELECT 
      a.id_alert,
      a.alert_type,
      a.message,
      l.name AS location_name
    FROM alerts a
    JOIN locations l ON a.id_location = l.id_location
    WHERE a.id_user = ?
    ORDER BY a.created_at DESC
  `;
  con.query(query, [id_user], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// ELIMINAR ALERTA 
router.delete('/alerts/:id_alert', (req, res) => {
  const id_alert = req.params.id_alert;
  const query = 'DELETE FROM alerts WHERE id_alert = ?';
  con.query(query, [id_alert], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: 'Alerta eliminada correctamente' });
  });
});


//When you click on "the ready button" it goes from in process to ready
router.put("/alerts/:id/status", (req, res) => {
  const id = parseInt(req.params.id);

  const change = "UPDATE alerts SET status = 'listo' WHERE id_alert = ?";

  con.query(change, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar alerta" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Alerta no encontrada" });

    res.json({ message: "Alerta completada" });
  });
});

// See that they are ready
router.get("/alerts/listo", (req, res) => {
  con.query("SELECT * FROM alerts WHERE status = 'listo'", (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ result });
  });
});


export default router
