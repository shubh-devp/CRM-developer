export function buildMappingPrompt(
  headers: string[],
  sampleRows: Record<string, string | undefined>[]
): string {
  const sampleRowsJson = JSON.stringify(sampleRows, null, 2);
  const headersJson = JSON.stringify(headers);

  return `You are a CRM data mapping assistant. Your task is to map CSV data to a standardized CRM schema.

INPUT:
CSV Headers: ${headersJson}
Sample Rows (first 5): ${sampleRowsJson}

RULES:
1. Map each row to the following schema:
   - created_at: ISO date string or original date format
   - name: Full name of the lead (combine first_name and last_name if separate)
   - email: Primary email address
   - country_code: Country code for phone (e.g., "+1", "+91")
   - mobile_without_country_code: Phone number without country code
   - company: Company name
   - city: City name
   - state: State name
   - country: Country name
   - lead_owner: Person responsible for the lead
   - crm_status: One of: "GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE", or "" (blank)
   - crm_note: Additional notes
   - data_source: One of: "leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots", or "" (blank)
   - possession_time: Time of possession or blank
   - description: Description of the lead

2. EMAIL HANDLING:
   - If multiple emails found, use ONLY the first email in the "email" field
   - Place remaining emails in "crm_note" field, prefixed with "Additional emails: "

3. PHONE HANDLING:
   - If multiple phone numbers found, use ONLY the first phone in "mobile_without_country_code" (with "country_code" extracted)
   - Place remaining phone numbers in "crm_note" field, appended after any additional emails

4. SKIP CONDITION:
   - If a row has NEITHER email NOR phone (mobile_without_country_code), mark it as skipped with reason "Missing both email and phone"

5. CRITICAL:
   - Only use the exact values listed for crm_status and data_source
   - If a value doesn't match, leave it blank ("")
   - NEVER hallucinate data. If a field is not found in the CSV data, leave it blank.
   - Return valid JSON ONLY. No markdown, no explanation, no code fences.

OUTPUT FORMAT (return a JSON array of objects):
{
  "records": [
    {
      "created_at": "2024-01-15",
      "name": "John Doe",
      "email": "john@example.com",
      "country_code": "+1",
      "mobile_without_country_code": "5551234567",
      "company": "Acme Corp",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "lead_owner": "Jane Smith",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "",
      "data_source": "leads_on_demand",
      "possession_time": "",
      "description": "Interested in premium package"
    }
  ],
  "skipped": [
    {
      "index": 0,
      "reason": "Missing both email and phone"
    }
  ]
}`;
}
