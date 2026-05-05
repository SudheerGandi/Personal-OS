import { Archetype } from '../../types';

export const businessArchetypes: Archetype[] = [
  {
    name: "Toll Booth",
    howMoneyFlows: "Sits between two parties, charges for the connection",
    margin: "50-90%",
    examples: ["IRCTC", "Visa", "Adani Ports", "App stores"],
    yourVentures: ["PortFintech", "FishDirect marketplace"]
  },
  {
    name: "Subscription Lock-in",
    howMoneyFlows: "Recurring fees, switching is painful",
    margin: "60-80% after CAC",
    examples: ["Zerodha", "Tally", "Any SaaS"],
    yourVentures: ["Sahaya.AI", "PharmaCold SaaS"]
  },
  {
    name: "Razor + Blades",
    howMoneyFlows: "Cheap platform, expensive consumable",
    margin: "Low on platform, 50%+ on consumable",
    examples: ["Nespresso", "Gillette", "AWS"],
    yourVentures: ["SolarShrimp (panels=razor, service=blades)"]
  },
  {
    name: "Aggregator",
    howMoneyFlows: "Aggregate fragmented supply, take commission",
    margin: "15-30% commission",
    examples: ["Zomato", "OYO", "Uber", "IndiaMART"],
    yourVentures: ["FishDirect", "ArakuBrew D2C"]
  },
  {
    name: "Leverage Play",
    howMoneyFlows: "Borrow at X%, deploy at Y%, keep spread",
    margin: "Depends on spread x leverage",
    examples: ["Banks", "Real estate developers"],
    yourVentures: ["SolarShrimp asset financing model"]
  }
];
