import { ListGroup, Form, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import API from '../API';
import '../App.css';
import icons from './icons';

function RowControls(props) {
    const location = useLocation();

    return <>
        <Link to={{
            pathname: location.pathname + "/update",
            state: { prevFilter: props.prevFilter, show: true, id: props.id }
        }}>{icons.iconEdit}
        </Link>
        {" "}
        <span className="space-between-icons" onClick={() => { API.deleteActivity(props.id).then((err) => { props.setDirty(true) }) }}>{icons.iconDelete}</span>
    </>
}

const handleCheck = (event, props) => {

    API.getActivityById(event.target.id.substring(7)).then((ac) => {

        API.markActivity(ac).then(props.setDirty(true));
        props.setDirty(true);

    });

}

function PrintLine(props) {
    return <>
        {props.db.map(listItem => (
            <ListGroup.Item key={listItem.id} className={listItem.completed ? 'd-flex w-100 justify-content-between complT' : 'd-flex w-100 justify-content-between'} >
                <Col md={4}>
                    <Form.Check label={listItem.description} id={"check-t" + listItem.id} className={listItem.important ? 'important' : ''} onChange={(event) => handleCheck(event, props)} checked={listItem.completed} />
                </Col>
                <Col md={2} align="center">
                    {listItem.private ? icons.iconPrivate : ''}
                </Col>
                <Col md={4} align="center">
                    <small>{listItem.deadline ? listItem.deadline : ''}</small>
                </Col>
                <Col md={2}>
                    <RowControls description={listItem.description} important={listItem.important} id={listItem.id}
                        private={listItem.private} deadline={listItem.deadline ? listItem.deadline.toString() : ''}
                        prevFilter={props.prevFilter} setDirty={props.setDirty} />
                </Col>
            </ListGroup.Item>
        ))}
    </>
}

export { PrintLine };
