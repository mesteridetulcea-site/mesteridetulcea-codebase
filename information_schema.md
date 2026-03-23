SELECT 
  table_name,
  column_name,
  data_type,
  column_default,
  is_nullable,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;


| table_name        | column_name             | data_type                | column_default                | is_nullable | character_maximum_length |
| ----------------- | ----------------------- | ------------------------ | ----------------------------- | ----------- | ------------------------ |
| admin_logs        | id                      | uuid                     | uuid_generate_v4()            | NO          | null                     |
| admin_logs        | admin_id                | uuid                     | null                          | YES         | null                     |
| admin_logs        | action                  | text                     | null                          | NO          | null                     |
| admin_logs        | target_type             | text                     | null                          | YES         | null                     |
| admin_logs        | target_id               | uuid                     | null                          | YES         | null                     |
| admin_logs        | notes                   | text                     | null                          | YES         | null                     |
| admin_logs        | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| categories        | id                      | uuid                     | uuid_generate_v4()            | NO          | null                     |
| categories        | name                    | text                     | null                          | NO          | null                     |
| categories        | slug                    | text                     | null                          | NO          | null                     |
| categories        | icon                    | text                     | null                          | YES         | null                     |
| categories        | description             | text                     | null                          | YES         | null                     |
| categories        | is_active               | boolean                  | true                          | YES         | null                     |
| categories        | sort_order              | integer                  | 0                             | YES         | null                     |
| categories        | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| cerere_photos     | id                      | uuid                     | gen_random_uuid()             | NO          | null                     |
| cerere_photos     | cerere_id               | uuid                     | null                          | NO          | null                     |
| cerere_photos     | url                     | text                     | null                          | NO          | null                     |
| cerere_photos     | approval_status         | text                     | 'pending'::text               | YES         | null                     |
| cerere_photos     | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| donation_photos   | id                      | uuid                     | gen_random_uuid()             | NO          | null                     |
| donation_photos   | donation_id             | uuid                     | null                          | NO          | null                     |
| donation_photos   | url                     | text                     | null                          | NO          | null                     |
| donation_photos   | storage_path            | text                     | null                          | YES         | null                     |
| donation_photos   | approval_status         | text                     | 'pending'::text               | NO          | null                     |
| donation_photos   | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| donations         | id                      | uuid                     | gen_random_uuid()             | NO          | null                     |
| donations         | user_id                 | uuid                     | null                          | NO          | null                     |
| donations         | title                   | text                     | null                          | NO          | null                     |
| donations         | description             | text                     | null                          | NO          | null                     |
| donations         | phone                   | text                     | null                          | NO          | null                     |
| donations         | status                  | text                     | 'active'::text                | NO          | null                     |
| donations         | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| donations         | updated_at              | timestamp with time zone | now()                         | YES         | null                     |
| favorites         | client_id               | uuid                     | null                          | NO          | null                     |
| favorites         | mester_id               | uuid                     | null                          | NO          | null                     |
| favorites         | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| mester_categories | mester_id               | uuid                     | null                          | NO          | null                     |
| mester_categories | category_id             | uuid                     | null                          | NO          | null                     |
| mester_categories | is_primary              | boolean                  | false                         | YES         | null                     |
| mester_photos     | id                      | uuid                     | uuid_generate_v4()            | NO          | null                     |
| mester_photos     | mester_id               | uuid                     | null                          | YES         | null                     |
| mester_photos     | storage_path            | text                     | null                          | NO          | null                     |
| mester_photos     | public_url              | text                     | null                          | YES         | null                     |
| mester_photos     | photo_type              | USER-DEFINED             | 'work'::photo_type            | YES         | null                     |
| mester_photos     | caption                 | text                     | null                          | YES         | null                     |
| mester_photos     | approval_status         | USER-DEFINED             | 'pending'::approval_status    | YES         | null                     |
| mester_photos     | approved_by             | uuid                     | null                          | YES         | null                     |
| mester_photos     | approved_at             | timestamp with time zone | null                          | YES         | null                     |
| mester_photos     | sort_order              | integer                  | 0                             | YES         | null                     |
| mester_photos     | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| mester_profiles   | id                      | uuid                     | uuid_generate_v4()            | NO          | null                     |
| mester_profiles   | user_id                 | uuid                     | null                          | NO          | null                     |
| mester_profiles   | display_name            | text                     | null                          | NO          | null                     |
| mester_profiles   | bio                     | text                     | null                          | YES         | null                     |
| mester_profiles   | years_experience        | integer                  | null                          | YES         | null                     |
| mester_profiles   | whatsapp_number         | text                     | null                          | YES         | null                     |
| mester_profiles   | website_url             | text                     | null                          | YES         | null                     |
| mester_profiles   | city                    | text                     | 'Tulcea'::text                | YES         | null                     |
| mester_profiles   | neighborhood            | text                     | null                          | YES         | null                     |
| mester_profiles   | subscription_tier       | USER-DEFINED             | 'standard'::subscription_tier | YES         | null                     |
| mester_profiles   | subscription_status     | USER-DEFINED             | 'active'::subscription_status | YES         | null                     |
| mester_profiles   | stripe_customer_id      | text                     | null                          | YES         | null                     |
| mester_profiles   | stripe_subscription_id  | text                     | null                          | YES         | null                     |
| mester_profiles   | subscription_expires_at | timestamp with time zone | null                          | YES         | null                     |
| mester_profiles   | approval_status         | USER-DEFINED             | 'pending'::approval_status    | YES         | null                     |
| mester_profiles   | approved_by             | uuid                     | null                          | YES         | null                     |
| mester_profiles   | approved_at             | timestamp with time zone | null                          | YES         | null                     |
| mester_profiles   | rejection_reason        | text                     | null                          | YES         | null                     |
| mester_profiles   | views_count             | integer                  | 0                             | YES         | null                     |
| mester_profiles   | whatsapp_clicks_count   | integer                  | 0                             | YES         | null                     |
| mester_profiles   | avg_rating              | numeric                  | 0                             | YES         | null                     |
| mester_profiles   | reviews_count           | integer                  | 0                             | YES         | null                     |
| mester_profiles   | is_featured             | boolean                  | false                         | YES         | null                     |
| mester_profiles   | featured_until          | timestamp with time zone | null                          | YES         | null                     |
| mester_profiles   | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| mester_profiles   | updated_at              | timestamp with time zone | now()                         | YES         | null                     |
| mester_projects   | id                      | uuid                     | gen_random_uuid()             | NO          | null                     |
| mester_projects   | mester_id               | uuid                     | null                          | NO          | null                     |
| mester_projects   | title                   | text                     | null                          | NO          | null                     |
| mester_projects   | description             | text                     | null                          | YES         | null                     |
| mester_projects   | sort_order              | integer                  | 0                             | NO          | null                     |
| mester_projects   | created_at              | timestamp with time zone | now()                         | NO          | null                     |
| notifications     | id                      | uuid                     | uuid_generate_v4()            | NO          | null                     |
| notifications     | user_id                 | uuid                     | null                          | NO          | null                     |
| notifications     | type                    | USER-DEFINED             | null                          | NO          | null                     |
| notifications     | title                   | text                     | null                          | NO          | null                     |
| notifications     | message                 | text                     | null                          | YES         | null                     |
| notifications     | entity_type             | text                     | null                          | YES         | null                     |
| notifications     | entity_id               | uuid                     | null                          | YES         | null                     |
| notifications     | read_at                 | timestamp with time zone | null                          | YES         | null                     |
| notifications     | created_at              | timestamp with time zone | now()                         | YES         | null                     |
| partner_products  | id                      | uuid                     | uuid_generate_v4()            | NO          | null                     |
| partner_products  | partner_id              | uuid                     | null                          | YES         | null                     |
| partner_products  | category_id             | uuid                     | null                          | YES         | null                     |
| partner_products  | name                    | text                     | null                          | NO          | null                     |
| partner_products  | description             | text                     | null                          | YES         | null                     |
| partner_products  | product_url             | text                     | null                          | YES         | null                     |
| partner_products  | image_url               | text                     | null                          | YES         | null                     |
| partner_products  | price_approx            | numeric                  | null                          | YES         | null                     |


SELECT typname, enumlabel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
ORDER BY typname, enumsortorder;


| typname                    | enumlabel                  |
| -------------------------- | -------------------------- |
| aal_level                  | aal1                       |
| aal_level                  | aal2                       |
| aal_level                  | aal3                       |
| action                     | INSERT                     |
| action                     | UPDATE                     |
| action                     | DELETE                     |
| action                     | TRUNCATE                   |
| action                     | ERROR                      |
| approval_status            | pending                    |
| approval_status            | approved                   |
| approval_status            | rejected                   |
| buckettype                 | STANDARD                   |
| buckettype                 | ANALYTICS                  |
| buckettype                 | VECTOR                     |
| code_challenge_method      | s256                       |
| code_challenge_method      | plain                      |
| equality_op                | eq                         |
| equality_op                | neq                        |
| equality_op                | lt                         |
| equality_op                | lte                        |
| equality_op                | gt                         |
| equality_op                | gte                        |
| equality_op                | in                         |
| factor_status              | unverified                 |
| factor_status              | verified                   |
| factor_type                | totp                       |
| factor_type                | webauthn                   |
| factor_type                | phone                      |
| notification_type          | cerere_noua                |
| notification_type          | profil_aprobat             |
| notification_type          | profil_respins             |
| notification_type          | poza_aprobata              |
| notification_type          | poza_respinsa              |
| notification_type          | review_nou                 |
| notification_type          | cerere_postata             |
| notification_type          | cerere_inchisa             |
| notification_type          | aplicatie_trimisa          |
| notification_type          | profil_actualizat          |
| notification_type          | poza_incarcata             |
| notification_type          | review_trimis              |
| notification_type          | cont_actualizat            |
| oauth_authorization_status | pending                    |
| oauth_authorization_status | approved                   |
| oauth_authorization_status | denied                     |
| oauth_authorization_status | expired                    |
| oauth_client_type          | public                     |
| oauth_client_type          | confidential               |
| oauth_registration_type    | dynamic                    |
| oauth_registration_type    | manual                     |
| oauth_response_type        | code                       |
| one_time_token_type        | confirmation_token         |
| one_time_token_type        | reauthentication_token     |
| one_time_token_type        | recovery_token             |
| one_time_token_type        | email_change_token_new     |
| one_time_token_type        | email_change_token_current |
| one_time_token_type        | phone_change_token         |
| photo_type                 | profile                    |
| photo_type                 | work                       |
| photo_type                 | certificate                |
| request_status             | open                       |
| request_status             | assigned                   |
| request_status             | closed                     |
| subscription_status        | active                     |
| subscription_status        | inactive                   |
| subscription_status        | cancelled                  |
| subscription_status        | past_due                   |
| subscription_tier          | standard                   |
| subscription_tier          | premium                    |
| transport_status           | open                       |
| transport_status           | accepted                   |
| transport_status           | completed                  |
| transport_status           | cancelled                  |
| user_role                  | client                     |
| user_role                  | mester                     |
| user_role                  | admin                      |


SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';

| table_name         | column_name          | foreign_table    | foreign_column |
| ------------------ | -------------------- | ---------------- | -------------- |
| mester_profiles    | user_id              | profiles         | id             |
| mester_profiles    | approved_by          | profiles         | id             |
| mester_categories  | mester_id            | mester_profiles  | id             |
| mester_categories  | category_id          | categories       | id             |
| mester_photos      | mester_id            | mester_profiles  | id             |
| mester_photos      | approved_by          | profiles         | id             |
| reviews            | mester_id            | mester_profiles  | id             |
| reviews            | client_id            | profiles         | id             |
| favorites          | client_id            | profiles         | id             |
| favorites          | mester_id            | mester_profiles  | id             |
| service_requests   | client_id            | profiles         | id             |
| service_requests   | detected_category_id | categories       | id             |
| transport_requests | client_id            | profiles         | id             |
| transport_requests | accepted_by          | profiles         | id             |
| transporters       | user_id              | profiles         | id             |
| partner_products   | partner_id           | partners         | id             |
| partner_products   | category_id          | categories       | id             |
| subscription_logs  | mester_id            | mester_profiles  | id             |
| admin_logs         | admin_id             | profiles         | id             |
| cerere_photos      | cerere_id            | service_requests | id             |
| notifications      | user_id              | profiles         | id             |
| mester_projects    | mester_id            | mester_profiles  | id             |
| project_photos     | project_id           | mester_projects  | id             |
| donation_photos    | donation_id          | donations        | id             |


| tablename         | policyname                        | permissive | roles           | cmd    | qual                                                                                                                                                                                                                                                                                                                   | with_check                                                                                                                                                                          |
| ----------------- | --------------------------------- | ---------- | --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| categories        | categories_delete_admin           | PERMISSIVE | {authenticated} | DELETE | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| categories        | categories_insert_admin           | PERMISSIVE | {authenticated} | INSERT | null                                                                                                                                                                                                                                                                                                                   | is_admin()                                                                                                                                                                          |
| categories        | categories_select_all             | PERMISSIVE | {public}        | SELECT | true                                                                                                                                                                                                                                                                                                                   | null                                                                                                                                                                                |
| categories        | categories_update_admin           | PERMISSIVE | {authenticated} | UPDATE | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| cerere_photos     | cerere_photos_admin               | PERMISSIVE | {public}        | ALL    | (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))                                                                                                                                                                                                    | null                                                                                                                                                                                |
| cerere_photos     | cerere_photos_admin_update        | PERMISSIVE | {public}        | UPDATE | (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))                                                                                                                                                                                                    | null                                                                                                                                                                                |
| cerere_photos     | cerere_photos_insert              | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (auth.role() = 'authenticated'::text)                                                                                                                                               |
| cerere_photos     | cerere_photos_own                 | PERMISSIVE | {public}        | SELECT | (EXISTS ( SELECT 1
   FROM service_requests sr
  WHERE ((sr.id = cerere_photos.cerere_id) AND (sr.client_id = auth.uid()))))                                                                                                                                                                                           | null                                                                                                                                                                                |
| cerere_photos     | cerere_photos_read                | PERMISSIVE | {public}        | SELECT | ((approval_status = 'approved'::text) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role)))) OR (EXISTS ( SELECT 1
   FROM service_requests
  WHERE ((service_requests.id = cerere_photos.cerere_id) AND (service_requests.client_id = auth.uid()))))) | null                                                                                                                                                                                |
| donation_photos   | donation_photos_delete            | PERMISSIVE | {public}        | DELETE | (EXISTS ( SELECT 1
   FROM donations d
  WHERE ((d.id = donation_photos.donation_id) AND (d.user_id = auth.uid()))))                                                                                                                                                                                                   | null                                                                                                                                                                                |
| donation_photos   | donation_photos_insert            | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (EXISTS ( SELECT 1
   FROM donations d
  WHERE ((d.id = donation_photos.donation_id) AND (d.user_id = auth.uid()))))                                                                |
| donation_photos   | donation_photos_read              | PERMISSIVE | {public}        | SELECT | ((approval_status = 'approved'::text) OR (EXISTS ( SELECT 1
   FROM donations d
  WHERE ((d.id = donation_photos.donation_id) AND (d.user_id = auth.uid())))))                                                                                                                                                         | null                                                                                                                                                                                |
| donations         | donations_delete_own              | PERMISSIVE | {public}        | DELETE | (auth.uid() = user_id)                                                                                                                                                                                                                                                                                                 | null                                                                                                                                                                                |
| donations         | donations_insert_auth             | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (auth.uid() = user_id)                                                                                                                                                              |
| donations         | donations_read_active             | PERMISSIVE | {public}        | SELECT | ((status = 'active'::text) OR (auth.uid() = user_id))                                                                                                                                                                                                                                                                  | null                                                                                                                                                                                |
| donations         | donations_update_own              | PERMISSIVE | {public}        | UPDATE | (auth.uid() = user_id)                                                                                                                                                                                                                                                                                                 | null                                                                                                                                                                                |
| favorites         | favorites_delete_own              | PERMISSIVE | {public}        | DELETE | (auth.uid() = client_id)                                                                                                                                                                                                                                                                                               | null                                                                                                                                                                                |
| favorites         | favorites_insert_own              | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (auth.uid() = client_id)                                                                                                                                                            |
| favorites         | favorites_select_own              | PERMISSIVE | {public}        | SELECT | (auth.uid() = client_id)                                                                                                                                                                                                                                                                                               | null                                                                                                                                                                                |
| mester_categories | mester_categories_all_admin       | PERMISSIVE | {authenticated} | ALL    | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| mester_categories | mester_categories_delete_own      | PERMISSIVE | {authenticated} | DELETE | (EXISTS ( SELECT 1
   FROM mester_profiles mp
  WHERE ((mp.id = mester_categories.mester_id) AND (mp.user_id = auth.uid()))))                                                                                                                                                                                          | null                                                                                                                                                                                |
| mester_categories | mester_categories_insert_own      | PERMISSIVE | {authenticated} | INSERT | null                                                                                                                                                                                                                                                                                                                   | (EXISTS ( SELECT 1
   FROM mester_profiles mp
  WHERE ((mp.id = mester_categories.mester_id) AND (mp.user_id = auth.uid()))))                                                       |
| mester_categories | mester_categories_select_admin    | PERMISSIVE | {authenticated} | SELECT | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| mester_categories | mester_categories_select_approved | PERMISSIVE | {public}        | SELECT | (EXISTS ( SELECT 1
   FROM mester_profiles mp
  WHERE ((mp.id = mester_categories.mester_id) AND (mp.approval_status = 'approved'::approval_status))))                                                                                                                                                                 | null                                                                                                                                                                                |
| mester_categories | mester_categories_select_own      | PERMISSIVE | {authenticated} | SELECT | (EXISTS ( SELECT 1
   FROM mester_profiles mp
  WHERE ((mp.id = mester_categories.mester_id) AND (mp.user_id = auth.uid()))))                                                                                                                                                                                          | null                                                                                                                                                                                |
| mester_photos     | mester_photos_all_admin           | PERMISSIVE | {authenticated} | ALL    | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| mester_photos     | mester_photos_delete_own          | PERMISSIVE | {authenticated} | DELETE | (EXISTS ( SELECT 1
   FROM mester_profiles mp
  WHERE ((mp.id = mester_photos.mester_id) AND (mp.user_id = auth.uid()))))                                                                                                                                                                                              | null                                                                                                                                                                                |
| mester_photos     | mester_photos_insert_own          | PERMISSIVE | {authenticated} | INSERT | null                                                                                                                                                                                                                                                                                                                   | (EXISTS ( SELECT 1
   FROM mester_profiles mp
  WHERE ((mp.id = mester_photos.mester_id) AND (mp.user_id = auth.uid()))))                                                           |
| mester_photos     | mester_photos_select_admin        | PERMISSIVE | {authenticated} | SELECT | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| mester_photos     | mester_photos_select_approved     | PERMISSIVE | {public}        | SELECT | (approval_status = 'approved'::approval_status)                                                                                                                                                                                                                                                                        | null                                                                                                                                                                                |
| mester_photos     | mester_photos_select_own          | PERMISSIVE | {authenticated} | SELECT | (EXISTS ( SELECT 1
   FROM mester_profiles mp
  WHERE ((mp.id = mester_photos.mester_id) AND (mp.user_id = auth.uid()))))                                                                                                                                                                                              | null                                                                                                                                                                                |
| mester_photos     | mester_photos_update_own          | PERMISSIVE | {authenticated} | UPDATE | (EXISTS ( SELECT 1
   FROM mester_profiles mp
  WHERE ((mp.id = mester_photos.mester_id) AND (mp.user_id = auth.uid()))))                                                                                                                                                                                              | null                                                                                                                                                                                |
| mester_photos     | photos_insert_own                 | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (mester_id IN ( SELECT mester_profiles.id
   FROM mester_profiles
  WHERE (mester_profiles.user_id = auth.uid())))                                                                  |
| mester_photos     | photos_select_approved            | PERMISSIVE | {public}        | SELECT | (approval_status = 'approved'::approval_status)                                                                                                                                                                                                                                                                        | null                                                                                                                                                                                |
| mester_profiles   | mester_profiles_delete_admin      | PERMISSIVE | {authenticated} | DELETE | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| mester_profiles   | mester_profiles_insert_own        | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (auth.uid() = user_id)                                                                                                                                                              |
| mester_profiles   | mester_profiles_select_admin      | PERMISSIVE | {authenticated} | SELECT | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| mester_profiles   | mester_profiles_select_approved   | PERMISSIVE | {public}        | SELECT | (approval_status = 'approved'::approval_status)                                                                                                                                                                                                                                                                        | null                                                                                                                                                                                |
| mester_profiles   | mester_profiles_select_own        | PERMISSIVE | {public}        | SELECT | (auth.uid() = user_id)                                                                                                                                                                                                                                                                                                 | null                                                                                                                                                                                |
| mester_profiles   | mester_profiles_select_public     | PERMISSIVE | {public}        | SELECT | (approval_status = 'approved'::approval_status)                                                                                                                                                                                                                                                                        | null                                                                                                                                                                                |
| mester_profiles   | mester_profiles_update_admin      | PERMISSIVE | {authenticated} | UPDATE | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| mester_profiles   | mester_profiles_update_own        | PERMISSIVE | {public}        | UPDATE | (auth.uid() = user_id)                                                                                                                                                                                                                                                                                                 | null                                                                                                                                                                                |
| mester_projects   | projects_delete                   | PERMISSIVE | {public}        | DELETE | (EXISTS ( SELECT 1
   FROM mester_profiles
  WHERE ((mester_profiles.id = mester_projects.mester_id) AND (mester_profiles.user_id = auth.uid()))))                                                                                                                                                                     | null                                                                                                                                                                                |
| mester_projects   | projects_insert                   | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (EXISTS ( SELECT 1
   FROM mester_profiles
  WHERE ((mester_profiles.id = mester_projects.mester_id) AND (mester_profiles.user_id = auth.uid()))))                                  |
| mester_projects   | projects_read                     | PERMISSIVE | {public}        | SELECT | true                                                                                                                                                                                                                                                                                                                   | null                                                                                                                                                                                |
| mester_projects   | projects_update                   | PERMISSIVE | {public}        | UPDATE | (EXISTS ( SELECT 1
   FROM mester_profiles
  WHERE ((mester_profiles.id = mester_projects.mester_id) AND (mester_profiles.user_id = auth.uid()))))                                                                                                                                                                     | null                                                                                                                                                                                |
| notifications     | notifications_select_own          | PERMISSIVE | {public}        | SELECT | (auth.uid() = user_id)                                                                                                                                                                                                                                                                                                 | null                                                                                                                                                                                |
| notifications     | notifications_update_own          | PERMISSIVE | {public}        | UPDATE | (auth.uid() = user_id)                                                                                                                                                                                                                                                                                                 | null                                                                                                                                                                                |
| profiles          | profiles_delete_admin             | PERMISSIVE | {authenticated} | DELETE | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| profiles          | profiles_insert_self              | PERMISSIVE | {authenticated} | INSERT | null                                                                                                                                                                                                                                                                                                                   | (id = auth.uid())                                                                                                                                                                   |
| profiles          | profiles_select_own               | PERMISSIVE | {public}        | SELECT | (auth.uid() = id)                                                                                                                                                                                                                                                                                                      | null                                                                                                                                                                                |
| profiles          | profiles_select_own_or_admin      | PERMISSIVE | {authenticated} | SELECT | ((id = auth.uid()) OR is_admin())                                                                                                                                                                                                                                                                                      | null                                                                                                                                                                                |
| profiles          | profiles_update_admin             | PERMISSIVE | {authenticated} | UPDATE | is_admin()                                                                                                                                                                                                                                                                                                             | null                                                                                                                                                                                |
| profiles          | profiles_update_own               | PERMISSIVE | {public}        | UPDATE | (auth.uid() = id)                                                                                                                                                                                                                                                                                                      | null                                                                                                                                                                                |
| project_photos    | project_photos_delete             | PERMISSIVE | {public}        | DELETE | (EXISTS ( SELECT 1
   FROM (mester_projects mp
     JOIN mester_profiles p ON ((p.id = mp.mester_id)))
  WHERE ((mp.id = project_photos.project_id) AND (p.user_id = auth.uid()))))                                                                                                                                    | null                                                                                                                                                                                |
| project_photos    | project_photos_insert             | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (EXISTS ( SELECT 1
   FROM (mester_projects mp
     JOIN mester_profiles p ON ((p.id = mp.mester_id)))
  WHERE ((mp.id = project_photos.project_id) AND (p.user_id = auth.uid())))) |
| project_photos    | project_photos_read               | PERMISSIVE | {public}        | SELECT | true                                                                                                                                                                                                                                                                                                                   | null                                                                                                                                                                                |
| reviews           | reviews_insert_authenticated      | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (auth.uid() = client_id)                                                                                                                                                            |
| reviews           | reviews_select_approved           | PERMISSIVE | {public}        | SELECT | (approval_status = 'approved'::approval_status)                                                                                                                                                                                                                                                                        | null                                                                                                                                                                                |
| service_requests  | service_requests_insert_auth      | PERMISSIVE | {public}        | INSERT | null                                                                                                                                                                                                                                                                                                                   | (auth.uid() = client_id)                                                                                                                                                            |
| service_requests  | service_requests_select_own       | PERMISSIVE | {public}        | SELECT | (auth.uid() = client_id)                                                                                                                                                                                                                                                                                               | null                                                                                                                                                                                |
| service_requests  | service_requests_update_own       | PERMISSIVE | {authenticated} | UPDATE | (client_id = auth.uid())                                                                                                                                                                                                                                                                                               | (client_id = auth.uid())                                                                                                                                                            |


5. Indexes

SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;

| tablename          | indexname                      | indexdef                                                                                                    |
| ------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| admin_logs         | admin_logs_pkey                | CREATE UNIQUE INDEX admin_logs_pkey ON public.admin_logs USING btree (id)                                   |
| categories         | categories_slug_key            | CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug)                             |
| categories         | categories_pkey                | CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id)                                   |
| categories         | categories_name_key            | CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name)                             |
| cerere_photos      | cerere_photos_pkey             | CREATE UNIQUE INDEX cerere_photos_pkey ON public.cerere_photos USING btree (id)                             |
| donation_photos    | donation_photos_pkey           | CREATE UNIQUE INDEX donation_photos_pkey ON public.donation_photos USING btree (id)                         |
| donations          | donations_pkey                 | CREATE UNIQUE INDEX donations_pkey ON public.donations USING btree (id)                                     |
| favorites          | favorites_pkey                 | CREATE UNIQUE INDEX favorites_pkey ON public.favorites USING btree (client_id, mester_id)                   |
| favorites          | idx_favorites_client           | CREATE INDEX idx_favorites_client ON public.favorites USING btree (client_id)                               |
| mester_categories  | mester_categories_pkey         | CREATE UNIQUE INDEX mester_categories_pkey ON public.mester_categories USING btree (mester_id, category_id) |
| mester_categories  | idx_mester_categories_category | CREATE INDEX idx_mester_categories_category ON public.mester_categories USING btree (category_id)           |
| mester_photos      | mester_photos_pkey             | CREATE UNIQUE INDEX mester_photos_pkey ON public.mester_photos USING btree (id)                             |
| mester_photos      | idx_mester_photos_approval     | CREATE INDEX idx_mester_photos_approval ON public.mester_photos USING btree (approval_status)               |
| mester_photos      | idx_mester_photos_mester       | CREATE INDEX idx_mester_photos_mester ON public.mester_photos USING btree (mester_id)                       |
| mester_profiles    | idx_mester_profiles_approval   | CREATE INDEX idx_mester_profiles_approval ON public.mester_profiles USING btree (approval_status)           |
| mester_profiles    | mester_profiles_pkey           | CREATE UNIQUE INDEX mester_profiles_pkey ON public.mester_profiles USING btree (id)                         |
| mester_profiles    | mester_profiles_user_id_key    | CREATE UNIQUE INDEX mester_profiles_user_id_key ON public.mester_profiles USING btree (user_id)             |
| mester_profiles    | idx_mester_profiles_featured   | CREATE INDEX idx_mester_profiles_featured ON public.mester_profiles USING btree (is_featured)               |
| mester_profiles    | idx_mester_display_name_trgm   | CREATE INDEX idx_mester_display_name_trgm ON public.mester_profiles USING gin (display_name gin_trgm_ops)   |
| mester_profiles    | idx_mester_profiles_tier       | CREATE INDEX idx_mester_profiles_tier ON public.mester_profiles USING btree (subscription_tier)             |
| mester_projects    | mester_projects_pkey           | CREATE UNIQUE INDEX mester_projects_pkey ON public.mester_projects USING btree (id)                         |
| notifications      | idx_notifications_user_unread  | CREATE INDEX idx_notifications_user_unread ON public.notifications USING btree (user_id, read_at)           |
| notifications      | notifications_pkey             | CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id)                             |
| partner_products   | partner_products_pkey          | CREATE UNIQUE INDEX partner_products_pkey ON public.partner_products USING btree (id)                       |
| partners           | partners_pkey                  | CREATE UNIQUE INDEX partners_pkey ON public.partners USING btree (id)                                       |
| partners           | partners_slug_key              | CREATE UNIQUE INDEX partners_slug_key ON public.partners USING btree (slug)                                 |
| profiles           | profiles_pkey                  | CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)                                       |
| project_photos     | project_photos_pkey            | CREATE UNIQUE INDEX project_photos_pkey ON public.project_photos USING btree (id)                           |
| reviews            | idx_reviews_mester             | CREATE INDEX idx_reviews_mester ON public.reviews USING btree (mester_id)                                   |
| reviews            | reviews_pkey                   | CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id)                                         |
| service_requests   | service_requests_pkey          | CREATE UNIQUE INDEX service_requests_pkey ON public.service_requests USING btree (id)                       |
| service_requests   | idx_service_requests_category  | CREATE INDEX idx_service_requests_category ON public.service_requests USING btree (detected_category_id)    |
| subscription_logs  | subscription_logs_pkey         | CREATE UNIQUE INDEX subscription_logs_pkey ON public.subscription_logs USING btree (id)                     |
| transport_requests | transport_requests_pkey        | CREATE UNIQUE INDEX transport_requests_pkey ON public.transport_requests USING btree (id)                   |
| transport_requests | idx_transport_requests_status  | CREATE INDEX idx_transport_requests_status ON public.transport_requests USING btree (status)                |
| transporters       | transporters_user_id_key       | CREATE UNIQUE INDEX transporters_user_id_key ON public.transporters USING btree (user_id)                   |
| transporters       | transporters_pkey              | CREATE UNIQUE INDEX transporters_pkey ON public.transporters USING btree (id)                               |


SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets;

| id              | name            | public | file_size_limit | allowed_mime_types |
| --------------- | --------------- | ------ | --------------- | ------------------ |
| partner-logos   | partner-logos   | false  | null            | null               |
| mester-photos   | mester-photos   | true   | null            | null               |
| avatars         | avatars         | true   | null            | null               |
| cereri-photos   | cereri-photos   | true   | null            | null               |
| project-photos  | project-photos  | true   | null            | null               |
| donation-photos | donation-photos | true   | null            | null               |


SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

| tablename | policyname                  | cmd    | qual                                | with_check                          |
| --------- | --------------------------- | ------ | ----------------------------------- | ----------------------------------- |
| objects   | allow authenticated delete  | DELETE | (bucket_id = 'mester-photos'::text) | null                                |
| objects   | allow authenticated uploads | INSERT | null                                | (bucket_id = 'mester-photos'::text) |
| objects   | allow public read           | SELECT | (bucket_id = 'mester-photos'::text) | null                                |