// import { serve } from "deno.land";
import twilio from 'twilio';
// import { createClient } from '@supabase/supabase-js'

const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");

const client = twilio(accountSid, authToken);

async function findNumbers() {
  try {
    const availableNumbers = await client.availablePhoneNumbers("US").local.list({
    // areaCode: 510,
    limit: 20,
  });

    console.log(availableNumbers);

  } catch (error) {
    console.error('Error fetching numbers:', error);
  }
}

findNumbers();
