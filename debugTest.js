import * as steps from './steps.js';
import { group } from 'k6';

export default function () {
  let userSession;
  let departCity;
  let arriveCity;
  let outboundFlight;

  group('getMain', () => { steps.getMain(); });
  group('getUserSession', () => { userSession = steps.getUserSession(); });
  group('login', () => { steps.login(userSession); });
  group('openFlightsPage', () => { steps.openFlightsPage(); });
  group('getCities', () => {
    [departCity, arriveCity] = steps.getCities();
  });
  group('selectFlight', () => { outboundFlight = steps.selectFlight(departCity, arriveCity); });
  group('selectTicket', () => { steps.selectTicket(outboundFlight); });
  group('buyTicket', () => { steps.buyTicket(outboundFlight); });
  group('visitHome', () => { steps.visitHome(); });
}
