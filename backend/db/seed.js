// backend/db/seed.js

import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import pool from "./client.js";

const BCRYPT_SALT_ROUNDS = 10;

async function createProperties() {
  const {
    rows: [property],
  } = await pool.query(
    `INSERT INTO properties(property_name) VALUES($1) RETURNING *`,
    ["Oakwood Apartments"]
  );
  return property;
}

async function createUnits(property) {
  const createdUnits = [];
  for (let i = 1; i <= 10; i++) {
    const unitData = {
      property_id: property.id,
      unit_number: 100 + i,
      rent_amount: faker.commerce.price({ min: 1200, max: 2500, dec: 0 }),
    };
    const {
      rows: [newUnit],
    } = await pool.query(
      "INSERT INTO units(property_id, unit_number, rent_amount) VALUES($1, $2, $3) RETURNING *",
      Object.values(unitData)
    );
    createdUnits.push(newUnit);
  }
  return createdUnits;
}

async function createUsers(units) {
  const createdUsers = [];
  const usersForLogin = [];
  const availableUnits = [...units];

  const managerPassword = "password1";
  const managerHashedPassword = await bcrypt.hash(
    managerPassword,
    BCRYPT_SALT_ROUNDS
  );
  const managerData = {
    username: "manager1",
    password_hash: managerHashedPassword,
    first_name: "Alex",
    last_name: "Manager",
    email: "manager@test.com",
    unit: availableUnits.pop().id,
    is_manager: true,
    is_current_user: true,
  };
  const {
    rows: [manager],
  } = await pool.query(
    `INSERT INTO users(username, password_hash, first_name, last_name, email, unit, is_manager, is_current_user) 
     VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    Object.values(managerData)
  );
  createdUsers.push(manager);
  usersForLogin.push({
    username: managerData.username,
    password: managerPassword,
  });

  for (let i = 1; i <= 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = `password${i}`;
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const tenantData = {
      username: `user${i}`,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }),
      unit: availableUnits.pop().id,
      is_manager: false,
      is_current_user: true,
    };
    const {
      rows: [tenant],
    } = await pool.query(
      `INSERT INTO users(username, password_hash, first_name, last_name, email, unit, is_manager, is_current_user) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      Object.values(tenantData)
    );
    createdUsers.push(tenant);
    usersForLogin.push({ username: tenantData.username, password });
  }
  return { createdUsers, usersForLogin };
}

async function createTransactions(users, units) {
  const tenants = users.filter((u) => !u.is_manager);

  for (const tenant of tenants) {
    const unit = units.find((u) => u.id === tenant.unit);
    const rent = parseFloat(unit.rent_amount);

    for (let i = 3; i >= 1; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const description = `Monthly Rent for ${date.toLocaleString("default", {
        month: "long",
      })}`;

      await pool.query(
        `INSERT INTO transactions(user_id, unit_id, type, description, amount, created_at) VALUES($1, $2, 'Rent', $3, $4, $5)`,
        [tenant.id, unit.id, description, rent, date]
      );

      if (i > 1) {
        await pool.query(
          `INSERT INTO transactions(user_id, unit_id, type, description, amount, created_at) VALUES($1, $2, 'Payment', 'Online Payment', $3, $4)`,
          [tenant.id, unit.id, -rent, date]
        );
      }
    }

    if (tenants.indexOf(tenant) === 0) {
      const utilityAmount = parseFloat(
        faker.commerce.price({ min: 50, max: 150 })
      );
      await pool.query(
        `INSERT INTO transactions(user_id, unit_id, type, description, amount) VALUES($1, $2, 'Utility', 'Monthly Utilities', $3)`,
        [tenant.id, unit.id, utilityAmount]
      );
    }
  }
}

async function seedDatabase() {
  try {
    console.log("Starting data seed...");

    const properties = await createProperties();
    const units = await createUnits(properties);
    const { createdUsers, usersForLogin } = await createUsers(units);
    await createTransactions(createdUsers, units);

    console.log("\nDatabase has been successfully seeded!");
    console.log("Here are the test user logins:");
    console.table(usersForLogin);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
