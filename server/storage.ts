import {
  type InsertBeneficiary,
  type InsertJobApplication,
  type InsertContactMessage,
  type Beneficiary,
  type JobApplication,
  type ContactMessage,
} from "@shared/schema";
import fs from "fs";
import path from "path";

// Donor & Donation types (file-based storage)
export type Donor = {
  id: number;
  email: string;
  name: string;
  phone: string;
  createdAt: Date;
  lastLoginAt?: Date;
};

export type Donation = {
  id: number;
  email: string;
  amount: number;
  method: string;
  code?: string;
  createdAt: Date;
};

export interface IStorage {
  createBeneficiary(beneficiary: InsertBeneficiary): Promise<Beneficiary>;
  createJobApplication(
    application: InsertJobApplication
  ): Promise<JobApplication>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  upsertDonor(donor: { email: string; name: string; phone: string; lastLogin?: boolean }): Promise<Donor>;
  createDonation(donation: { email: string; amount: number; method: string; code?: string }): Promise<Donation>;
  getDonationsByEmail(email: string, limit?: number): Promise<Donation[]>;
  getDonorByEmail(email: string): Promise<Donor | undefined>;
  getBeneficiariesCount(): Promise<number>;
  getJobApplicationsCount(): Promise<number>;
  getContactMessagesCount(): Promise<number>;
  getRecentBeneficiaries(limit?: number): Promise<Beneficiary[]>;
  getRecentJobApplications(limit?: number): Promise<JobApplication[]>;
  getRecentContactMessages(limit?: number): Promise<ContactMessage[]>;
}

// File paths for persistent storage
const beneficiariesPath = path.join(process.cwd(), "server", "beneficiaries.json");
const jobsPath = path.join(process.cwd(), "server", "jobs.json");
const contactsPath = path.join(process.cwd(), "server", "contacts.json");
const donorsPath = path.join(process.cwd(), "server", "donors.json");
const donationsPath = path.join(process.cwd(), "server", "donations.json");

// Database types
type BeneficiariesDB = { beneficiaries: Beneficiary[]; nextId: number };
type JobsDB = { jobs: JobApplication[]; nextId: number };
type ContactsDB = { contacts: ContactMessage[]; nextId: number };
type DonorsDB = { donors: Donor[]; nextId: number };
type DonationsDB = { donations: Donation[]; nextId: number };

// File utilities
function ensureFile(filePath: string, defaultData: any) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

function readBeneficiaries(): BeneficiariesDB {
  ensureFile(beneficiariesPath, { beneficiaries: [], nextId: 1 });
  const raw = fs.readFileSync(beneficiariesPath, "utf8");
  const parsed = JSON.parse(raw) as BeneficiariesDB;
  // Convert date strings back to Date objects
  parsed.beneficiaries = parsed.beneficiaries.map(b => ({
    ...b,
    createdAt: new Date(b.createdAt),
  }));
  return parsed;
}

function writeBeneficiaries(db: BeneficiariesDB) {
  fs.writeFileSync(beneficiariesPath, JSON.stringify(db, null, 2), "utf8");
}

function readJobs(): JobsDB {
  ensureFile(jobsPath, { jobs: [], nextId: 1 });
  const raw = fs.readFileSync(jobsPath, "utf8");
  const parsed = JSON.parse(raw) as JobsDB;
  parsed.jobs = parsed.jobs.map(j => ({
    ...j,
    createdAt: new Date(j.createdAt),
  }));
  return parsed;
}

function writeJobs(db: JobsDB) {
  fs.writeFileSync(jobsPath, JSON.stringify(db, null, 2), "utf8");
}

function readContacts(): ContactsDB {
  ensureFile(contactsPath, { contacts: [], nextId: 1 });
  const raw = fs.readFileSync(contactsPath, "utf8");
  const parsed = JSON.parse(raw) as ContactsDB;
  parsed.contacts = parsed.contacts.map(c => ({
    ...c,
    createdAt: new Date(c.createdAt),
  }));
  return parsed;
}

function writeContacts(db: ContactsDB) {
  fs.writeFileSync(contactsPath, JSON.stringify(db, null, 2), "utf8");
}

function readDonors(): DonorsDB {
  ensureFile(donorsPath, { donors: [], nextId: 1 });
  const raw = fs.readFileSync(donorsPath, "utf8");
  const parsed = JSON.parse(raw) as DonorsDB;
  parsed.donors = parsed.donors.map((d) => ({
    ...d,
    createdAt: new Date(d.createdAt),
    lastLoginAt: d.lastLoginAt ? new Date(d.lastLoginAt) : undefined,
  }));
  return parsed;
}

function writeDonors(db: DonorsDB) {
  fs.writeFileSync(donorsPath, JSON.stringify(db, null, 2), "utf8");
}

function readDonations(): DonationsDB {
  ensureFile(donationsPath, { donations: [], nextId: 1 });
  const raw = fs.readFileSync(donationsPath, "utf8");
  const parsed = JSON.parse(raw) as DonationsDB;
  parsed.donations = parsed.donations.map((d) => ({
    ...d,
    createdAt: new Date(d.createdAt),
  }));
  return parsed;
}

function writeDonations(db: DonationsDB) {
  fs.writeFileSync(donationsPath, JSON.stringify(db, null, 2), "utf8");
}

// Persistent file-based storage
class FileStorage implements IStorage {
  async createBeneficiary(beneficiary: InsertBeneficiary): Promise<Beneficiary> {
    const db = readBeneficiaries();
    const newBeneficiary: Beneficiary = {
      ...beneficiary,
      id: db.nextId++,
      createdAt: new Date(),
    };
    db.beneficiaries.push(newBeneficiary);
    writeBeneficiaries(db);
    console.log(`[Storage] New beneficiary added: ${newBeneficiary.id}`);
    return newBeneficiary;
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const db = readJobs();
    const newApplication: JobApplication = {
      ...application,
      id: db.nextId++,
      createdAt: new Date(),
    };
    db.jobs.push(newApplication);
    writeJobs(db);
    console.log(`[Storage] New job application added: ${newApplication.id}`);
    return newApplication;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const db = readContacts();
    const newMessage: ContactMessage = {
      ...message,
      id: db.nextId++,
      createdAt: new Date(),
    };
    db.contacts.push(newMessage);
    writeContacts(db);
    console.log(`[Storage] New contact message added: ${newMessage.id}`);
    return newMessage;
  }

  async upsertDonor(donor: { email: string; name: string; phone: string; lastLogin?: boolean }): Promise<Donor> {
    const db = readDonors();
    const existing = db.donors.find((d) => d.email.toLowerCase() === donor.email.toLowerCase());

    if (existing) {
      existing.name = donor.name || existing.name;
      existing.phone = donor.phone || existing.phone;
      if (donor.lastLogin) {
        existing.lastLoginAt = new Date();
      }
      writeDonors(db);
      return existing;
    }

    const newDonor: Donor = {
      id: db.nextId++,
      email: donor.email,
      name: donor.name,
      phone: donor.phone,
      createdAt: new Date(),
      lastLoginAt: donor.lastLogin ? new Date() : undefined,
    };

    db.donors.push(newDonor);
    writeDonors(db);
    console.log(`[Storage] New donor added: ${newDonor.email}`);
    return newDonor;
  }

  async createDonation(donation: { email: string; amount: number; method: string; code?: string }): Promise<Donation> {
    const db = readDonations();
    const newDonation: Donation = {
      id: db.nextId++,
      email: donation.email,
      amount: Number(donation.amount) || 0,
      method: donation.method,
      code: donation.code,
      createdAt: new Date(),
    };

    db.donations.push(newDonation);
    writeDonations(db);
    console.log(`[Storage] New donation logged: ${newDonation.id}`);
    return newDonation;
  }

  async getDonationsByEmail(email: string, limit = 20): Promise<Donation[]> {
    const db = readDonations();
    return db.donations
      .filter((d) => d.email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getDonorByEmail(email: string): Promise<Donor | undefined> {
    const db = readDonors();
    return db.donors.find((d) => d.email.toLowerCase() === email.toLowerCase());
  }

  async getBeneficiariesCount(): Promise<number> {
    const db = readBeneficiaries();
    return db.beneficiaries.length;
  }

  async getJobApplicationsCount(): Promise<number> {
    const db = readJobs();
    return db.jobs.length;
  }

  async getContactMessagesCount(): Promise<number> {
    const db = readContacts();
    return db.contacts.length;
  }

  async getRecentBeneficiaries(limit = 10): Promise<Beneficiary[]> {
    const db = readBeneficiaries();
    return db.beneficiaries
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getRecentJobApplications(limit = 10): Promise<JobApplication[]> {
    const db = readJobs();
    return db.jobs
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getRecentContactMessages(limit = 10): Promise<ContactMessage[]> {
    const db = readContacts();
    return db.contacts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new FileStorage();
