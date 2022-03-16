import { Form, FormControl, Button, Navbar, NavDropdown } from 'react-bootstrap';
import icons from './icons';
import { Redirect } from 'react-router';

function MyNavbar(props) {

  const handleLogout = async () => {
    await props.logout();
    props.setLogged(false);
    props.setUser('');
    <Redirect to="/" />;
  }

  return (
    <>
      <Navbar bg="success" variant="dark" expand="sm" >

        <Navbar.Toggle
          onClick={() => props.setOpen(!props.open)}
          aria-controls="left-sidebar"
          aria-expanded={props.open}
        ></Navbar.Toggle>

        <Navbar.Brand>
          {icons.iconBrand}{' '}
          ToDo Manager</Navbar.Brand>

        <Form inline className="mx-auto d-none d-sm-block">
          <FormControl type="text" placeholder="Search" className="mr-sm-2 navbarRounded" />
          <Button variant="outline-light" className='navbarRounded'>Search</Button>
        </Form>


        <NavDropdown alignRight id='user-dropdown' title={icons.iconUser}>
          {props.logged ? <>
            <NavDropdown.Header>User informations</NavDropdown.Header>
            <p align='center'>{props.username}{' '}{ }</p>
            <p align='center'>
              <Button variant="danger" size='sm' onClick={handleLogout}>Logout</Button>
            </p>
          </>
            : <>
              <NavDropdown.Header>Not logged in</NavDropdown.Header>
              <p align='center'>You must log-in to access user informations. </p>
            </>}
        </NavDropdown>
      </Navbar>
    </>
  );
}

export default MyNavbar;