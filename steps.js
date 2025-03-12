import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js';


export function getMain() {
  const res = http.get(BASE_URL + "/webtours");
  check(res, { 'status code is 200': (r) => r.status === 200 });
}

export function getUserSession() {
  const res = http.get(BASE_URL + "/cgi-bin/nav.pl?in=home");
  check(res, { 'status code is 200': (r) => r.status === 200 });

  return res.html().find('input[name="userSession"]').attr('value');
}

export function login(userSession) {
  const formData = { userSession, username: 'batman', password: 'imbatman' };
  const res = http.post(BASE_URL + "/cgi-bin/login.pl", formData);

  check(res, { 'verify successful login': (r) => r.body.includes('User password was correct') });
}

export function openFlightsPage() {
  const res = http.get(BASE_URL + "/cgi-bin/welcome.pl?page=search");
  check(res, { 'status code is 200': (r) => r.status === 200 });
}

export function getCities() {
  const res = http.get(BASE_URL + "/cgi-bin/reservations.pl?page=welcome");
  check(res, { 'status code is 200': (r) => r.status === 200 });

  let citiesSet = new Set();
  res.html().find('option').each((_, el) => citiesSet.add(el.getAttribute('value')));

  let cities = Array.from(citiesSet);
  let departCity = cities[Math.floor(Math.random() * cities.length)];
  let arriveCity = cities[Math.floor(Math.random() * cities.length)];

  while (departCity === arriveCity) {
    arriveCity = cities[Math.floor(Math.random() * cities.length)];
  }

  return [departCity, arriveCity];
}

export function selectFlight(departCity, arriveCity) {
  const formData = { depart: departCity, arrive: arriveCity, departDate: "06/06/2023", numPassengers: "1", "findFlights.x": "46" };
  const res = http.post(BASE_URL + "/cgi-bin/reservations.pl", formData);

  check(res, { 'verify successful flights query': (r) => r.body.includes('Flight departing from') });

  return res.html().find('input[name="outboundFlight"]').attr('value');
}

export function selectTicket(outboundFlight) {
  const formData = { outboundFlight, "reserveFlights.x": 34 };
  const res = http.post(BASE_URL + "/cgi-bin/reservations.pl", formData);

  check(res, { 'verify successful ticket selection': (r) => r.body.includes('Flight Reservation') });
}

export function buyTicket(outboundFlight) {
  const formData = { outboundFlight, firstName: "batman", lastName: "imbatman", "buyFlights.x": 69 };
  const res = http.post(BASE_URL + "/cgi-bin/reservations.pl", formData);

  check(res, { 'verify successful ticket purchase': (r) => r.body.includes('Reservation Made!') });
}

export function visitHome() {
  const res = http.get(BASE_URL + "/cgi-bin/login.pl?intro=true");
  check(res, { 'verify successful redirect to home': (r) => r.body.includes("Don't forget to sign off") });
}
