import { Router } from "express";
import { con } from '../../server.js';
const router = Router();

router.put("/updateAllTasks", (req, res) => {
    con.query('update tasks set status = "pendiente"', (er, result) => {
        if(er){
            console.error(er);
        }
    })
})

router.get("/tasks", (req, res) => {
    con.query("select * from tasks", (er, result) => {
        if (er) {
            console.error(er);
            res.status(500).send("fallo")
        }

        res.status(200).json({ result })
    });
})

router.get("/tasksGetEdit/:id", (req, res) => {
    const {id} = req.params

    con.query("SELECT tasks.name, locations.name AS location_name FROM tasks JOIN locations ON tasks.id_location = locations.id_location WHERE tasks.id_task=?",[id], (er, result) => {
        if (er) {
            console.error(er);
            res.status(500).send("fallo")
        }

        res.status(200).json({ result })
    })
})


router.get("/tasksArea", (req, res) => {
    con.query("SELECT tasks.id_task, tasks.name, locations.name AS location_name, tasks.status FROM tasks JOIN locations ON tasks.id_location = locations.id_location;", (er, result) => {
        if (er) {
            console.error(er);
            res.status(500).send("fallo")
        }

        res.status(200).json({ result })
    })
})

router.post("/sendTask", (req, res) => {
    const { name, id_location, status } = req.body;

    con.query("insert into tasks(name, id_location, status) values(?, ?, ?);", [name, id_location, status], (error, result) => {
        if (error) {
            console.log("ERROR".red, error);
            res.status(500).json({
                message: "inasdf"
            });
        }

        res.status(200).json({
            "OK": true,
            "message": "User created"
        });
    });
});

router.put("/tasks/:id", (req, res) => {
    const { id } = req.params
    const { name, id_location, status } = req.body
    con.query("UPDATE tasks SET name = ?, id_location = ?, status = ? WHERE id_task = ?",
        [name, id_location, status, id], (error, result) => {
            if (error) {
                console.log(error);
            }

            res.status(200).json({ result })
        })
})

router.delete("/tasks/:id", (req, res) => {
    const { id } = req.params
    console.log(id);
    con.query("DELETE FROM tasks WHERE id_task = ?", [id],
        (error, result) => {
            if (error) {
                console.log(error);
            }

            res.status(200).json({ result })
        })
});

router.get("/viewTasksAdmin", (req, res) => {
    const query = req.query;

    con.query("select t.id_task, t.name as name_task, l.name as ubication, t.status as status, u.fullname as user \
               from register_task r 	\
               join users u \
               on u.id_user = r.id_user \
               join tasks t \
               on t.id_task = r.id_task \
               join locations l \
               on t.id_location = l.id_location;",

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
    console.log("GET".blue, "/tasks/viewTasksAdmin");
});


router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    con.query("UPDATE tasks SET status = ? WHERE id_task = ?", [status, id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al actualizar la tarea" });
        }

        res.status(200).json({ message: "Tarea actualizada con éxito", result });
    });
});


export default router