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

// router.get("/viewTasks", (req, res) => {
//     con.query("select * from tasks", (er, result) => {
//         if (er) {
//             console.error(er);
//             res.status(500).send("fallo")
//         }

//         res.status(200).json({ result })
//     });
// })

router.get("/viewTasks", (req, res) => {
    con.query("SELECT tasks.id_task, tasks.name, locations.name AS location_name, tasks.status FROM tasks JOIN locations ON tasks.id_location = locations.id_location;", (er, result) => {
        if (er) {
            console.error(er);
            res.status(500).send("fallo")
        }

        res.status(200).json({ result })
    })
});

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

router.put("/updateTask/:id", (req, res) => {
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

router.delete("/deleteTask/:id", (req, res) => {
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