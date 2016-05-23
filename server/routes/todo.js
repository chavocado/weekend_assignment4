var express = require('express');
var router = express.Router();
var pg = require('pg');
//should match SQL
var connectionString = 'postgres://localhost:5432/mu';

router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }
        client.query("SELECT * FROM todo", function(err, result) {
            if (err) {
                console.log(err, "FOOL");
            }
            done();
            res.send(result.rows);
        });
    });

});

router.post('/', function(req, res) {
    var task = req.body;
    console.log(task);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('INSERT into todo (task_name, description, status) VALUES ($1, $2, $3)', [task.name, task.description, task.status],
            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(201);
            });
    });
});

router.put('/status', function(req, res) {
  //console.log('HERE FOOL', req.body);
    var statusID = req.body;
    pg.connect(connectionString, function(err, client, done) {
        console.log(statusID);
            if (err) {
                res.sendStatus(500);
            }
            client.query('UPDATE todo SET status = $2 WHERE id = $1 ',[statusID.taskID, statusID.status],
                function(err, result) {
                    done();
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                    res.sendStatus(201);
                });
    });
});

module.exports = router;
