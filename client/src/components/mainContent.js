import { ListGroup, Button, Toast } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PrintLine } from "./printLine";
import { FilterTitle } from "./sidebar";
import ActivityForm from "./activityForm";
import API from '../API'
import '../App.css';


function CheckActivity(props) {
    const location = useLocation();

    if (location.state !== undefined && props.action !== undefined) {

        return (
            <ActivityForm action={props.action} setDirty={props.setDirty} />);

    } else {
        return "";
    }
}

function MyMain(props) {

    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true); // still loading at mount
    const [dirty, setDirty] = useState(true); // activities are dirty -> stato corrente dell'applicazione è da ricaricare dal server


    //Rehydratate activities at mount 
    useEffect(() => {
        if (props.filterState === 'all') {
            if (dirty) {
                API.loadAllActivities().then(newAc => {
                    setActivities(newAc);
                    setLoading(false);
                    setDirty(false);
                })
            }
        } else {
            if (dirty) {
                API.loadFilteredActivities(props.filterState).then(newAc => {
                    setActivities(newAc);
                    setLoading(false);
                    setDirty(false);
                })
            }
        }
    }, [dirty]);    //quando cambia la variabile dirty viene rieseguita la useEffect

    useEffect(() => {
        if (props.filterState === 'all') {
            API.loadAllActivities().then(newAc => {
                setActivities(newAc);
                setLoading(false);
                setDirty(false);
            })

        } else {
            API.loadFilteredActivities(props.filterState).then(newAc => {
                setActivities(newAc);
                setLoading(false);
                setDirty(false);
            })
        }

    }, [props.filterState]);


    return (
        <>
            <main className="col-sm-8 col-12 below-nav">
                <Toast onClose={() => props.setFa(false)} show={props.fa} delay={5000} autohide style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }} >
                    <Toast.Header>Welcome, {props.username}!</Toast.Header>
                </Toast>

                <FilterTitle title={props.filterState} />
                <ListGroup variant="flush">
                    {loading ? <span>Please wait while loading your activities...</span> :
                        <PrintLine db={activities} prevFilter={props.filterState} setDirty={setDirty} />
                    }
                </ListGroup>
            </main>

            <Link to={{
                pathname: `/list/${props.filterState}/add`,
                state: { prevFilter: props.filterState, show: true },
            }}>
                <Button variant="success" className="fixed-right-bottom">+</Button>
            </Link>

            <CheckActivity action={props.action} setDirty={setDirty} />
        </>
    );
}

export { MyMain };