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
    var taskID = req.body;
    pg.connect(connectionString, function(err, client, done) {
        console.log(taskID);
            if (err) {
                res.sendStatus(500);
            }
            client.query('UPDATE todo SET status = \'COMPLETE\' WHERE id = $1 ',[taskID.id],
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

router.delete('/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
            console.log(req.params);
            if (err) {
                res.sendStatus(500);
            }
            client.query('DELETE from todo WHERE id = $1', [req.params.id],
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
