import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("MP"), // Member of Parliament, Minister, Prime Minister
  budget: integer("budget").default(1000000), // Starting budget
  createdAt: timestamp("created_at").defaultNow(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
  status: text("status").default("draft"), // draft, proposed, passed, rejected
  proposerId: integer("proposer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});
