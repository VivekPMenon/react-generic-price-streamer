'use server';

import { RiskReport } from "./model";
import reportsJson from './risk-reports.json';
import uploadedReportsJson from './uploaded-documents.json';

export async function getRiskReports(): Promise<RiskReport[]> {
  return reportsJson;
}

export async function getUploadedReports(): Promise<RiskReport[]> {
  return uploadedReportsJson;
}