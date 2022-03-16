'use strict'

const dayjs = require('dayjs');

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('./tasks.db', (err) => {
    if (err) throw err;
});

//get all activities
exports.listAllActivities = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE user=?';
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const activities = rows.map((a) => ({ id: a.id, description: a.description, important: a.important, private: a.private, deadline: a.deadline, completed: a.completed, user: a.user }));
            resolve(activities);
        });
    });
};

//get an activity by the user id
exports.getActivity = (id, user) => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE id=? AND user=?';
        db.get(sql, [id, user], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({ error: 'ID not found.' });
            } else {
                const activities = { id: row.id, description: row.description, important: row.important, private: row.private, deadline: row.deadline, completed: row.completed, user: row.user };
                resolve(activities);
            }
        });
    });
};


//get activity by filter
exports.getActivitybyFilter = (filter, id) => {
    return new Promise((resolve, reject) => {
        if (filter === "important") {
            const sql = 'SELECT * FROM tasks WHERE important = 1 AND user=?';
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows == undefined) {
                    resolve({ error: 'Activity by Filter important not found.' });
                } else {

                    const activities = rows.map((a) => ({ id: a.id, description: a.description, important: a.important, private: a.private, deadline: a.deadline, completed: a.completed, user: a.user }));
                    resolve(activities);
                }
            });
        } else if (filter === "private") {
            const sql = 'SELECT * FROM tasks WHERE private = 1 AND user=?';
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows === undefined) {
                    resolve({ error: 'Activity bu Filter private not found.' });
                } else {
                    const activities = rows.map((a) => ({ id: a.id, description: a.description, important: a.important, private: a.private, deadline: a.deadline, completed: a.completed, user: a.user }));
                    resolve(activities);
                }
            });
        } else if (filter === "today") {
            const sql = 'SELECT * FROM tasks WHERE user=?';
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows == undefined) {
                    resolve({ error: 'Activity by Filter today not found.' });
                } else {
                    const activities = rows
                        .map((a) => ({ id: a.id, description: a.description, important: a.important, private: a.private, deadline: a.deadline, completed: a.completed, user: a.user }))
                        .filter((r) => dayjs(r.deadline).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD"));
                    resolve(activities);
                }
            });
        } else if (filter === "next7days") {
            const sql = 'SELECT * FROM tasks WHERE user=?';
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows == undefined) {
                    resolve({ error: 'Activity by Filter./server/server.js today not found.' });
                } else {

                    const activities = rows
                        .map((a) => ({ id: a.id, description: a.description, important: a.important, private: a.private, deadline: a.deadline, completed: a.completed, user: a.user }))
                        .filter((line) => dayjs(line.deadline).isBefore(dayjs().add(7, 'day')) && dayjs(line.deadline).isAfter(dayjs()));
                    resolve(activities);
                }
            });
        } else {
            resolve({ error: "This filter doesn't exist" });
        }
    });
}


// add a new activity
exports.createActivity = (tasks, userid) => {
    return new Promise((resolve, reject) => {


        let idn = '';

        if (tasks.deadline === "") { tasks.deadline = null };

        db.get('SELECT max(id) as newid FROM tasks', [], (err, res) => {
            if (err) {

                reject(err);
                return;
            }
            if (res == undefined) {
                reject('max ID not found.');
                return;
            } else {

                idn = res.newid;
                idn++;


                const sql = 'INSERT INTO tasks(id, description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?, ?)';
                db.run(sql, [idn, tasks.description, tasks.important, tasks.private, tasks.deadline, tasks.completed, userid], function (err) {
                    if (err) {

                        reject(err);
                        return;
                    }
                    resolve(this.id);
                });
            }
        });

    });
};

// update an existing activity
exports.updateActivity = (act, user) => {
    return new Promise((resolve, reject) => {

        const sql = 'UPDATE tasks SET description = ?, important = ?, private = ?, deadline=?, completed = ? WHERE id = ? and user=?';
        db.run(sql, [act.description, act.important, act.private, act.deadline, act.completed, act.id, user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.id);
        });
    });
};

//Delete an activity given the id
exports.deleteActivity = (activityId, user) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tasks WHERE id = ? and user=?';
        db.run(sql, [activityId, user], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve("Task deleted");
        });
    });
}

// Mark a task
exports.markTask = (task, user) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET completed= ? WHERE id=? and user=?';

        db.run(sql, [task.completed, task.id, user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve("marked");
        });
    });
};