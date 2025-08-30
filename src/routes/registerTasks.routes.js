import { Router } from "express";
import { con } from '../../server.js';
const router = Router();

router.post("/", (req, res) => {
    const { id_task, id_user, registration_date, observation, result } = req.body;

    con.query("insert into register_task (id_task, id_user, registration_date, observation, result) values(?, ?, ?, ?, ?);", [id_task, id_user, registration_date, observation, result], (error, result) => {
        if (error) {
            console.log("ERROR".red, error);
            res.status(500).json({
              message:"inasdf"
            });
        }

        res.status(200).json({
            "OK":true,
            "message":"User created"
        });
    });
});

export default router;
