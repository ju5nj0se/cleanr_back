import { Router } from "express";
import { con } from '../../server.js';
const router = Router();

router.post("/sendRegister", (req, res) => {
    const { id_task, id_user, registration_date, observation, result } = req.body;

    con.query("insert into register_task (id_task, id_user, registration_date, observation, result) values(?, ?, ?, ?, ?);", [id_task, id_user, registration_date, observation, result], (error, result) => {
        if (error) {
            console.log("ERROR".red, error);
            res.status(500).json({
                message: "inasdf"
            });
        }

        res.status(200).json({
            "OK": true,
            "message": "Register created"
        });
    });
});

router.get("/viewRegistersAdmin", (req, res) => {
    const query = req.query;
    con.query("select t.id_task, \
       t.name as name_task, \
       l.name as ubication, \
       t.status as status, \
       u.fullname as user, \
       r.registration_date\
        from tasks t \
        join locations l \
        on t.id_location = l.id_location \
        left join register_task r \
        on t.id_task = r.id_task \
       and DATE(r.registration_date) = CURDATE() \
        left join users u \
        on u.id_user = r.id_user;",

        (er, result) => {
            if (er) {
                console.error(er);
                res.status(500).json({
                    OK: false,
                    message: "Internal server error"
                });
            }

            res.status(200).json({
                OK: true,
                body: result
            });
        });
});


export default router;
