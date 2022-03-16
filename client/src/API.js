const url = 'http://localhost:3000';

async function loadAllActivities() {
  const response = await fetch(url + '/api/all');
  const activities = await response.json();

  return activities.map((act) => ({ ...act }));
  // ERROR HANDLING
}

async function loadFilteredActivities(filter) {
  const response = await fetch(url + '/api/filtered/' + filter);
  const activities = await response.json();
  return activities.map((act) => ({ ...act }));

}

async function deleteActivity(id) {
  const response = await fetch(url + '/api/delete/' + id, {
    method: 'DELETE'
  });
  if (response.ok) {
    return null;
  } else return { 'err': 'DELETE error' };
}

async function addNewActivity(act) {

  const response = await fetch(url + '/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...act })
  });
  if (response.ok) {
    return null;
  } else return { 'err': 'POST error' };
}

async function updateActivity(act) {
  const response = await fetch(url + '/api/update/' + act.id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(act)
  });
  if (response.ok) {
    return null;
  } else return { 'err': 'PUT error' };
}

async function markActivity(act) {

  const response = await fetch(url + '/api/mark/' + act.id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(act)
  });
  if (response.ok) {
    return null;
  } else return { 'err': 'PUT error' };
}

async function getActivityById(id) {
  const response = await fetch(url + '/api/retrieve/' + id);
  const activity = await response.json();

  if (response.ok) {

    return activity;
  } else return { 'err': 'getElByID error' };
}

async function login(credentials) {
  let response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user.name;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

async function logout() {
  const response = await fetch(url + '/logout', {
    method: 'DELETE'
  });
  if (response.ok) {
    return null;
  } else return { 'err': 'DELETE error' };
}


const API = { loadAllActivities, loadFilteredActivities, deleteActivity, addNewActivity, markActivity, getActivityById, updateActivity, login, /*getUserInfo*/ logout };

export default API;