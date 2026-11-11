# Security & Agricultural Safety Architecture

Krishi Mitra AI adheres to strict defense-in-depth security principles across authentication, database access, image file processing, and generative AI guardrails.

---

## 1. Authentication & Tenant Data Isolation

1. **Supabase JWT Verification**: All non-public REST endpoints require a valid Supabase JWT bearer token. Identity is derived exclusively from `supabase.auth.getUser(token)` on the server.
2. **Never Trust Client User IDs**: The frontend can never inject or spoof a `user_id`. The server binds the validated JWT subject to all database operations.
3. **Row Level Security (RLS)**: PostgreSQL enforces ownership checks at the database level (`auth.uid() = user_id`). If an attacker alters a resource UUID, the database query returns 0 rows.

---

## 2. Server-Side Key Concealment

- **Google Gemini API Key (`GEMINI_API_KEY`)**: Exists strictly on the Node.js Express server. It is never transmitted to, bundled in, or exposed to the browser.
- **Supabase Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)**: Used exclusively on the server for administrative tasks (such as user deletion). The client uses solely the restricted `anon` public key.

---

## 3. Image Upload Security & Privacy

1. **MIME Validation & Size Limit**: Only `image/jpeg`, `image/png`, and `image/webp` are permitted, with an absolute size cap of $8\text{ MB}$.
2. **In-Memory Buffering**: Uploads are held in volatile memory buffers (`multer.memoryStorage()`) rather than disk temp directories to prevent arbitrary executable file writes.
3. **EXIF & Geolocation Stripping**: Sharp processes all images, strips privacy-sensitive EXIF/GPS metadata, and normalizes orientation before transmission to Gemini Vision or storage buckets.

---

## 4. Prompt Injection & AI Safety Guardrails

1. **System Instruction Immutability**: All Gemini invocations use a hardened system prompt that explicitly forbids executing arbitrary instructions or revealing underlying system prompts.
2. **Structured JSON Output & Zod Parity**: Generative responses must strictly satisfy JSON schemas. Every response is parsed and validated through Zod before database persistence or client delivery.
3. **No Code Execution**: The AI assistant cannot execute SQL queries, file system commands, or external network requests.

---

## 5. Agricultural & Chemical Safety Protocol

1. **Integrated Pest Management (IPM)**: Chemical recommendations are always preceded by Cultural and Biological controls.
2. **Prohibition of Banned Agrochemicals**: Under no circumstances does the system recommend WHO Class Ia/Ib banned organophosphates (e.g. Monocrotophos, Methyl Parathion, Phorate).
3. **Mandatory Safety Notices**: Any chemical reference must provide:
   - Specific active ingredient and commercial formulation.
   - Recommended dilution per liter.
   - Mandatory Pre-Harvest Interval (PHI) in days.
   - Required Personal Protective Equipment (gloves, eye protection, respirator).
4. **Certified Referral**: Whenever high-risk symptoms or critical infestations are detected, the system advises confirmation by a local Block Agricultural Officer or Krishi Vigyan Kendra (KVK).

