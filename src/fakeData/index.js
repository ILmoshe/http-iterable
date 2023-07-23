import { faker } from "@faker-js/faker";
import internals, { connectDb } from "../clients/db.js";

export const buildFlight = () => {
  const flight = {};
  flight.pilotName = faker.person.fullName();
  flight.aircraftType = faker.airline.aircraftType();
  flight.airline = faker.airline.airline();
  flight.flightNumber = `${faker.airline.airline().iataCode
    }${faker.airline.flightNumber({ addLeadingZeros: true })}`; // 'AA0798'
  flight.start = faker.date.anytime();
  flight.end = faker.date.future();
  flight.numberOfPassengers = faker.number.int({ min: 1, max: 1000 });
  flight.numberOfCrewMembers = faker.number.int({ min: 1, max: 40 });
  flight.airplane = faker.airline.airplane();
  flight.priority = faker.number.int({ min: 1, max: 200 })
  return flight;
};

const insertAirPlanesToDb = async (n = 10) => {
  await connectDb();
  await internals.collection.createIndex({ 'airplane.name': 1, priority: 1 })
  for (let index = 0; index < n; index++) {
    await internals.collection.insertOne(buildFlight())
  }
  console.log("FINISHED")
};

insertAirPlanesToDb(20000);
