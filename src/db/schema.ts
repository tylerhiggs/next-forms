import {
  integer,
  text,
  boolean,
  pgTable,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

// Form tables
export const form = pgTable("form", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});
export const fieldTypeEnum = pgEnum("field_type", [
  "text",
  "email",
  "number",
  "select",
  "textarea",
]);

export const formField = pgTable("form_field", {
  id: integer("id").primaryKey(),
  formId: integer("form_id")
    .references(() => form.id)
    .notNull(),
  label: text("label").notNull(),
  type: fieldTypeEnum("type").notNull(),
  required: boolean("required").default(false),
  options: text("options"), // JSON string for select/radio options
  order: integer("order").notNull(),
});

export const formSubmission = pgTable("form_submission", {
  id: integer("id").primaryKey(),
  formId: integer("form_id")
    .references(() => form.id)
    .notNull(),
  submittedAt: integer("submitted_at").notNull(), // timestamp
});

export const fieldAnswer = pgTable("field_answer", {
  id: integer("id").primaryKey(),
  submissionId: integer("submission_id")
    .references(() => formSubmission.id)
    .notNull(),
  fieldId: integer("field_id")
    .references(() => formField.id)
    .notNull(),
  value: text("value"),
});
