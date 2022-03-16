import { Alert, Button, Form, Modal, Col } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import API from '../API';
import dayjs from 'dayjs';
import { useEffect } from 'react';



function ActivityForm(props) {

    const location = useLocation();

    const defaultValues = {
        description: '', important: 0, private: 0, deadline: '', completed: 0
    }

    const [description, setDescription] = useState(defaultValues.description);
    const [important, setImportant] = useState(defaultValues.important);
    const [privateS, setPrivate] = useState(defaultValues.private);
    const [date, setDate] = useState(defaultValues.deadline);
    const [time, setTime] = useState(defaultValues.deadline);
    const [completed, setCompleted] = useState(defaultValues.completed);
    const [error, setError] = useState('');

    useEffect(() => {
        if (props.action === 'update') {
            API.getActivityById(location.state.id).then(newAc => {
                setDescription(newAc.description);
                setImportant(newAc.important);
                setPrivate(newAc.private);
                setDate(dayjs(newAc.deadline).format('YYYY-MM-DD'));
                setTime(dayjs(newAc.deadline).format('HH:mm'));
                setCompleted(newAc.completed);
            });
        }
    }, []);

    const handleTimePicker = (date, time) => {
        if (date === '') {
            return date;
        } else {
            let tmp = dayjs(date + ' ' + time);
            return tmp.format('YYYY-MM-DD HH:mm');
        }
    }

    const [show, setShow] = useState(location.state.show);
    const handleClose = () => setShow(false);
    const [validated, setValidated] = useState(false);

    var act;

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {

        if (event.currentTarget.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }

        if (event.currentTarget.checkValidity() === true) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(false);

            let dateTime = handleTimePicker(date, time);

            if (props.action === "add") {
                act = { description: description, important: important, private: privateS, deadline: dateTime, completed: completed };
                API.addNewActivity(act).then((err) => { props.setDirty(true) });

            } else {
                act = { id: location.state.id, description: description, important: important, private: privateS, deadline: dateTime, completed: completed };
                API.updateActivity(act).then((err) => { props.setDirty(true) });
            }
            setSubmitted(true);
            handleClose();
        }
    }

    return (
        <> {submitted ? <Redirect to={`/list/${location.state.prevFilter}`} /> :
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title>{props.action === 'add' ? 'Add a new task' : 'Update task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error ? <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert> : false}
                    <Form noValidate validated={validated} onSubmit={handleSubmit} >
                        <Form.Group controlId='Description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control required type="text" placeholder="Task description.." value={description} onChange={ev => setDescription(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a description.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId='selectedPrivate'>
                            <Form.Check type="switch" label="Private" checked={privateS} onChange={() => setPrivate(privateS === 1 ? 0 : 1)}>
                            </Form.Check>
                        </Form.Group>

                        <Form.Group controlId='selectedImportant'>

                            <Form.Check type="switch" label="Important" checked={important} onChange={() => setImportant(important === 1 ? 0 : 1)}>
                            </Form.Check>
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId='selectedDate' >
                                <Form.Label>Date</Form.Label>
                                <Form.Control type='date' value={date} onChange={ev => setDate(ev.target.value)} />
                            </Form.Group>

                            <Form.Group as={Col} controlId='selectTime'>
                                <Form.Label>Time</Form.Label>
                                <Form.Control type='time' value={time} onChange={ev => setTime(ev.target.value)} />
                            </Form.Group>
                        </Form.Row>

                        <Modal.Footer>
                            <Link to={`/list/${location.state.prevFilter}`}>
                                <Button variant="secondary">Close</Button>
                            </Link>
                            <Button variant="success" type="submit">{props.action === 'add' ? 'Add task' : 'Update    task'}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        }
        </>
    )
}

export default ActivityForm;