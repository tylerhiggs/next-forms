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
import { relations } from "drizzle-orm";

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
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description"),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const formRelations = relations(form, ({ many }) => ({
  formFields: many(formField),
}));

export const fieldTypeEnum = pgEnum("field_type", [
  "text",
  "email",
  "number",
  "address",
  "select",
  "textarea",
  "checkbox",
  "radio",
  "date",
]);

export const formField = pgTable("form_field", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  formId: integer("form_id")
    .references(() => form.id)
    .notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  label: text("label").notNull(),
  type: fieldTypeEnum("type").notNull(),
  required: boolean("required").default(false),
  options: text("options"), // JSON string for select/radio options
  order: integer("order").notNull(),
  placeholder: text("placeholder"),
  defaultValue: text("default_value"),
  min: integer("min"),
  max: integer("max"),
});

export const formFieldRelations = relations(formField, ({ one }) => ({
  form: one(form, {
    fields: [formField.formId],
    references: [form.id],
  }),
}));

export const formSubmission = pgTable("form_submission", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  formId: integer("form_id")
    .references(() => form.id)
    .notNull(),
  submittedAt: integer("submitted_at").notNull(), // timestamp
});

export const fieldAnswer = pgTable("field_answer", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  submissionId: integer("submission_id")
    .references(() => formSubmission.id)
    .notNull(),
  fieldId: integer("field_id")
    .references(() => formField.id)
    .notNull(),
  value: text("value"),
});
