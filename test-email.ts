import 'dotenv/config';
import { sendAdminOTPEmail } from './src/lib/email.js';

async function testEmail() {
    console.log("Testing email...");
    const res = await sendAdminOTPEmail("shibu95085@gmail.com", "123456");
    console.log("Result:", res);
}

testEmail();
