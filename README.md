# BigLab 2 - Class: 2021 AW1 A-L

## Team name: 2GCD

Team members:

- s287569 Ciarla Francesco
- s287555 Dimatteo Roberto
- s292482 Galliano Giacomo
- s292474 Gulotta Dario Paolo


## List of APIs offered by the server

### TASK SIDE API


### Load all the activities

URL: `/api/all`

Method: `GET`

Description: Load all the activities related to the logged-in user.

Request body: none.

Response: `200 OK` (success), `500 Internal Server Error` (generic error).

Response body: an array of objects, each oh them describing a task.

```
[{
"id":2,
"description":"Go for a walk",
"important":1,
"private":1,
"deadline":"2021-04-14 08:30",
"completed":1,
"user":1
},
{
"id":4,
"description":"Watch the Express videolecture",
"important":1,
"private":1,
"deadline":"2021-05-24 09:00",
"completed":0,
"user":1
},
...
]
```

### Load filtered activities

URL: `/api/filtered/:filter`

Method: `GET`

Description: Load the filtered activities related to the logged-in user and the chosen filter.

Request body: none.

Response: `200 OK` (success), `500 Internal Server Error` (generic error).

Response body: an array of objects, each oh them describing a task.

```
[{
"id":2,
"description":"Go for a walk",
"important":1,
"private":1,
"deadline":"2021-04-14 08:30",
"completed":1,
"user":1
},
{
"id":4,
"description":"Watch the Express videolecture",
"important":1,
"private":1,
"deadline":"2021-05-24 09:00",
"completed":0,
"user":1
},
...
]
```
### Get task by id

URL: `/api/retrieve/:id`

Method: `GET`

Description: Retrieve all the informations about a specific task given the `id`.

Request body: none.

Response: `200 OK` (success), `404 Not Found` (task not found), `500 Internal Server Error` (generic error).

Response body: an object, describing a single task.

```
{
"id":2,
"description":"Go for a walk",
"important":1,
"private":1,
"deadline":"2021-04-14 08:30",
"completed":1,
"user":1
}
```
### Create task

URL: `/api/create`

Method: `POST`

Description: Create a new task and insert it in the database.

Request body: An object representing a task (Content-Type: application/json).

```
{
"description":"Complete BigLab 2",
"important":1,
"private":0,
"deadline":"2021-05-09 23:59",
"completed":1,
}
```

Response: `201 Created` (success, the task has been created), `401 Unauthorized` (user unauthorised), `422 Unprocessable Entity` (validation of req params failed), `503 Service Unavailable` (The server cannot handle the request, database error).

Response body: none.

### Update Task

URL: `/api/update/:id`

Method: `PUT`

Description: Update some information on a task and save it on the database.

Request body: an object, describing the updated task. (Content-Type: application/json).

```
{
"id":2,
"description":"Go for a walk",
"important":1,
"private":0,
"deadline":"2021-04-07 08:00",
"completed":1,
}
```

Response: `201 OK` (success), `401 Unauthorized` (user unauthorised), `422 Unprocessable Entity` (validation of req params failed), `503 Database error` (database not available error).

Response body: none.

### Delete task

URL: `/api/delete/:id`

Method: `DELETE`

Description: Delete the task with the corresponding id from the database.

Request body: none.

Response: `200 OK` (success, task deleted), `404 Not Found` (task not found), `500 Internal Server Error` (generic error).

Response body: a string that confirms the delete operation.
```
"Task deleted"
```



### Mark a task

URL: `/api/mark/:id`

Method: `PUT`

Description:  Mark a task if completed, unmark if not completed.

Request body: an object, describing the marked task. (Content-Type: application/json).

```
{
"id":2,
"description":"Go for a walk",
"important":1,
"private":1,
"deadline":"2021-04-14 08:30",
"completed":1,
"user":1
}
```

Response: `201 OK` (success), `401 Unauthorized` (user unauthorised), `422 Unprocessable Entity` (validation of req params failed), `503 Database error` (database not available error).

Response body: none.


### USER SIDE API

### Login

URL: `/login`

Method: `POST`

Description: Login the user if in database. 
User: user@sample.it
Password: at leat 6 alphanumeric characters.

Request body: an object including username and password in clear. (Content-Type: application/json).

```
{
"username": "john.doe@polito.it"
"password": "123ciao"
}
```

Response: `200 OK` (success), `401 Unauthorized` (user unauthorised)

Response body: the user object in the database.

```
{
"id":1,
"username":"john.doe@polito.it",
"name":"John"
}
```

### Logout

URL: `logout`

Method: `DELETE`

Description: Delete the corresponding user session.

Request body: none.

Response: `200 OK` (success)

Response body: none.