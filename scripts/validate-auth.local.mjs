// Disposable local-only recovery test. Never accepts a hosted Supabase URL.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
const api = process.env.NEXT_PUBLIC_SUPABASE_URL;
const site = process.env.NEXT_PUBLIC_SITE_URL;
assert.equal(api, 'http://127.0.0.1:56321', 'Run only against the isolated local validation project');
assert.equal(site, 'http://127.0.0.1:3002');
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const admin = createClient(api, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `recovery-${randomUUID()}@example.invalid`;
const originalPassword = `Local-${randomUUID()}!`;
const newPassword = `Changed-${randomUUID()}!`;
const jar = new Map();
let registrationUserId;
const ssr = createServerClient(api, key, { cookies: { getAll: () => [...jar].map(([name,value]) => ({name,value})), setAll: values => values.forEach(({name,value}) => jar.set(name,value)) } });
const created = await admin.auth.admin.createUser({ email, password: originalPassword, email_confirm: true });
assert.ifError(created.error);
const cookieHeader = () => [...jar].map(([name,value]) => `${name}=${value}`).join('; ');
function remember(response) { for (const value of response.headers.getSetCookie()) { const part=value.split(';',1)[0];const at=part.indexOf('=');jar.set(part.slice(0,at),part.slice(at+1)); } }
try {
  const { error } = await ssr.auth.resetPasswordForEmail(email, { redirectTo: `${site}/auth/callback?next=/reset-password` });
  assert.ifError(error);
  let message;
  for(let i=0;i<25;i++) {
    const response = await fetch('http://127.0.0.1:56324/api/v1/messages');
    if(response.ok) { const list=await response.json(); const delivery=list.messages.find(item=>JSON.stringify(item.To).includes(email)); if(delivery) { message=await (await fetch(`http://127.0.0.1:56324/api/v1/message/${delivery.ID}`)).json();break; } }
    await new Promise(resolve => setTimeout(resolve,200));
  }
  assert.ok(message,'Recovery email delivered to local mailbox');
  const text=message.HTML || message.Text;
  const link=text.match(/https?:\/\/[^\s"<>]+\/auth\/v1\/verify\?[^\s"<>]+/)[0].replaceAll('&amp;','&');
  assert.equal(new URL(link).origin,api);
  const verified=await fetch(link,{redirect:'manual'});
  const destination=new URL(verified.headers.get('location'));
  const code=destination.searchParams.get('code');
  assert.ok(code,'Recovery issues a PKCE code');
  const callback=await fetch(`${site}/auth/callback?next=/reset-password&code=${encodeURIComponent(code)}`,{headers:{cookie:cookieHeader()},redirect:'manual'});
  remember(callback);
  assert.equal(callback.status,307);
  assert.equal(new URL(callback.headers.get('location')).pathname,'/reset-password');
  console.log('PASS: local recovery email, PKCE exchange and internal redirect');
  const page=await fetch(`${site}/reset-password`,{headers:{cookie:cookieHeader()}});
  const html=await page.text();
  assert.ok(html.includes('Guardar nueva contraseña'),'Authenticated recovery form is visible');
  const formMarkup=html.match(/<form\b[\s\S]*?<\/form>/)?.[0];
  assert.ok(formMarkup);
  const form=new FormData();
  const decode=value=>value.replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
  for(const input of formMarkup.matchAll(/<input\b[^>]*>/g)) {
    const name=input[0].match(/\bname="([^"]*)"/)?.[1];const value=input[0].match(/\bvalue="([^"]*)"/)?.[1];
    if(name?.startsWith('$ACTION')) form.append(decode(name),decode(value ?? ''));
  }
  assert.ok([...form.keys()].some(name=>name.startsWith('$ACTION')),'Server action form binding is present');
  form.append('password',newPassword);form.append('confirm_password',newPassword);
  const saved=await fetch(`${site}/reset-password`,{method:'POST',headers:{origin:site,cookie:cookieHeader()},body:form});
  remember(saved);
  const savedHtml=await saved.text();
  assert.ok(savedHtml.includes('Contraseña actualizada.'),'The actual server action confirms the update');
  const client=createClient(api,key,{auth:{persistSession:false}});
  const oldLogin=await client.auth.signInWithPassword({email,password:originalPassword});
  assert.ok(oldLogin.error,'Old password no longer works');
  const newLogin=await client.auth.signInWithPassword({email,password:newPassword});
  assert.ifError(newLogin.error);
  console.log('PASS: recovery page, actual password server action, old password rejected and new password accepted');
  const unauthenticated=await fetch(`${site}/reset-password`);
  assert.ok((await unauthenticated.text()).includes('Solicita un enlace nuevo'));
  const failed=await fetch(`${site}/auth/callback?next=/reset-password&code=expired`,{redirect:'manual'});
  assert.equal(new URL(failed.headers.get('location')).searchParams.get('error'),'expired');
  const malicious=await fetch(`${site}/auth/callback?next=https://attacker.invalid`,{redirect:'manual'});
  assert.equal(new URL(malicious.headers.get('location')).origin,site);
  console.log('PASS: missing session, expired callback and malicious redirect handled safely');
  const registerEmail = `register-${randomUUID()}@example.invalid`;
  const registration = await fetch(`${site}/register`);
  const registrationHtml = await registration.text();
  const registrationForm = registrationHtml.match(/<form\b[\s\S]*?<\/form>/)?.[0];
  assert.ok(registrationForm);
  const registrationData = new FormData();
  for (const input of registrationForm.matchAll(/<input\b[^>]*>/g)) {
    const name = input[0].match(/\bname="([^"]*)"/)?.[1];
    const value = input[0].match(/\bvalue="([^"]*)"/)?.[1];
    if (name?.startsWith('$ACTION')) registrationData.append(decode(name), decode(value ?? ''));
  }
  registrationData.append('email', registerEmail);
  registrationData.append('password', `Register-${randomUUID()}!`);
  const registered = await fetch(`${site}/register`, { method: 'POST', headers: { origin: site }, body: registrationData, redirect: 'manual' });
  assert.ok([200,303,307].includes(registered.status));
  const listed = await admin.auth.admin.listUsers();
  const account = listed.data.users.find(user => user.email === registerEmail);
  assert.ok(account, 'Registration server action creates an account');
  registrationUserId = account.id;
  const profile = await admin.from('users').select('organization_id,role').eq('id', account.id).single();
  assert.ifError(profile.error);
  assert.equal(profile.data.role, 'owner');
  assert.ok(profile.data.organization_id);
  console.log('PASS: actual registration server action creates the owner profile and organization');

} finally {
  await admin.auth.admin.deleteUser(created.data.user.id);
  if (registrationUserId) await admin.auth.admin.deleteUser(registrationUserId);
}
