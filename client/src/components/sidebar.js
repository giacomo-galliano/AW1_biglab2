import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse'
import '../App.css';

const filters = [
  { filterId: 'all', description: 'All' },
  { filterId: 'important', description: 'Important' },
  { filterId: 'private', description: 'Private' },
  { filterId: 'today', description: 'Today' },
  { filterId: 'next7days', description: 'Next 7 Days' },
]

function FilterTitle(props) {
  return (<>
    {filters.map((f) => (props.title === f.filterId ?
      <h1 className={"mainTitle"} key={f.filterId}>{f.description}</h1> : ''))}
  </>
  );
}

function MySidebar(props) {
  return (
    <>
      <Collapse in={props.open}>
        <aside className="collapse d-sm-block col-sm-4 col 12 below-nav bg-light" id="left-sidebar">
          <ListGroup variant="flush" defaultActiveKey={props.act}>
            {filters.map(filter =>

              <NavLink
                to={`/list/${filter.filterId}`}
                style={{ textDecoration: 'none' }}
                key={filter.filterId}
                className={'sidebarListItem'}
              >
                <ListGroup.Item action eventKey={filter.filterId}>{filter.description}</ListGroup.Item>
              </NavLink>
            )}
          </ListGroup>
        </aside>
      </Collapse>
    </>
  );
}

export { MySidebar, FilterTitle, filters };