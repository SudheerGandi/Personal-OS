import { HistoryEvent } from '../../types';

export interface HistoryStudyEvent {
  id: number;
  event: string;
  why: string;
  sources: string;
  sessions: number;
}

export const historicalCurriculum: HistoryStudyEvent[] = [
  { id: 1, event: "1991 India Liberalisation", why: "Every industry you're targeting was shaped by this.", sources: "Montek Singh Ahluwalia account, India Unbound — Gurcharan Das, Ch.8–10, RBI history", sessions: 3 },
  { id: 2, event: "India IT Boom 1990s–2000s", why: "TCS/Infosys/Wipro scaled from zero to global giants in 15 years. Sahaya.AI rides this wave 30 years later.", sources: "Nasscom archives, The Turn of the Tortoise — T.N. Ninan, YourStory archives", sessions: 2 },
  { id: 3, event: "2004–2008 Infrastructure Supercycle + 2008 Crash", why: "Shows which infrastructure bets survive macro shocks. Cold storage, solar, port fintech are infrastructure-adjacent.", sources: "RBI Annual Reports 2004–2009, ET archives search 'India infrastructure 2006'", sessions: 2 },
  { id: 4, event: "Jio Telecom Revolution 2016", why: "When foundational layer becomes cheap, value moves to applications. Jio shows the 6-month window before markets get crowded.", sources: "TRAI data archives, The Ken archives 'Jio impact', search 'India internet economy 2016 2020'", sessions: 2 },
  { id: 5, event: "PLI Scheme History — What Worked, What Didn't", why: "You read PLI announcements every week. Without studying this, you can't tell a real opportunity from government theatre.", sources: "NITI Aayog PLI reports, ET + Business Standard PLI coverage, Ministry of Commerce annual reports", sessions: 3 },
  { id: 6, event: "China Manufacturing Rise 1990–2010", why: "India is running China's 1995 playbook right now. SEZs near ports, PLI, export incentives.", sources: "How China Escaped Shock Therapy — Isabella Weber, World Bank China data archives", sessions: 3 },
  { id: 7, event: "Semiconductor Geopolitics — 30 Years", why: "When you see India's chip import data, you need to know where this is in a 30-year cycle.", sources: "Chip War — Chris Miller, Stratechery semiconductor archives, semi.org", sessions: 3 },
  { id: 8, event: "Commodity Supercycles — Oil 1970, Metals 2000, Lithium Now", why: "Is lithium early innings or peak? Past cycles give the calibration.", sources: "The Prize — Daniel Yergin, Macrotrends, Goldman Sachs research", sessions: 2 },
  { id: 9, event: "Fintech Disruption — M-Pesa to UPI", why: "PortFintech sits on top of India's digital payment and trade infrastructure.", sources: "M-Pesa Harvard Business School case, NPCI UPI journey, RBI Payment Vision documents", sessions: 2 },
  { id: 10, event: "E-commerce Disruption — Amazon, Alibaba, Flipkart", why: "AI is doing to knowledge work exactly what e-commerce did to retail. Disruption pattern is identical.", sources: "The Everything Store — Brad Stone, Jack Ma interviews, The Ken archives", sessions: 2 }
];

export const sectorHistory = [
  { month: 7, sector: "Aquaculture", study: "Global shrimp industry scaling. Why some countries became dominant exporters.", sources: "MPEDA reports, FAO aquaculture data" },
  { month: 8, sector: "Cold Chain Logistics", study: "How cold chain developed in US/EU. Which policy triggered buildout. Why India is 15 years behind.", sources: "NCCD report, USDA case studies, IBEF report" },
  { month: 9, sector: "Solar Energy", study: "How panel costs fell 99% in 20 years. Who won and lost. India's PLI response.", sources: "IRENA database, MNRE reports, Waaree/Adani Green reports" },
  { month: 10, sector: "Port + Trade Finance", study: "How SWIFT, trade finance, and letters of credit evolved. Broken for SMEs.", sources: "ICC gap report, M1xchange case studies, IFC reports" },
  { month: 11, sector: "Defence Manufacturing", study: "How South Korea and Israel built defence export industries. What India is doing differently.", sources: "DRDO annual reports, DefExpo coverage" },
  { month: 12, sector: "Agricultural Commodities", study: "India's edible oil import dependency history. The groundnut/mustard/palm oil cycles.", sources: "SEAI report, APEDA data" }
];
