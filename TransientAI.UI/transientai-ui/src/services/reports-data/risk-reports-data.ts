'use server';

import { RiskReport } from "./model";
import reportsJson from './risk-reports.json';

export async function getRiskReports(): Promise<RiskReport[]> {
  return reportsJson;
}