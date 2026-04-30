-- Vendly — Schema multi-tenant para Supabase
-- Requiere: pg_vector extension

create extension if not exists vector;

-- ─────────────────────────────────────────
-- TENANTS
-- ─────────────────────────────────────────
create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  agent_name text not null default 'Asistente',
  agent_tone text not null default 'profesional',
  business_context text,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tenants enable row level security;

create policy "tenant owner access" on tenants
  for all using (
    id in (
      select tenant_id from tenant_users
      where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- SUBSCRIPTIONS
-- ─────────────────────────────────────────
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  plan text not null check (plan in ('trial','starter','pro','scale')),
  status text not null check (status in ('active','past_due','canceled')),
  conversation_limit int,
  channel_limit int,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "tenant subscription access" on subscriptions
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- TENANT USERS
-- ─────────────────────────────────────────
create table tenant_users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','agent')),
  created_at timestamptz not null default now(),
  unique(tenant_id, user_id)
);

alter table tenant_users enable row level security;

create policy "user own memberships" on tenant_users
  for all using (user_id = auth.uid());

-- ─────────────────────────────────────────
-- TENANT CHANNELS
-- ─────────────────────────────────────────
create table tenant_channels (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  channel_type text not null check (channel_type in ('whatsapp','instagram','web')),
  phone_number_id text,
  phone_number text,
  waba_id text,
  page_id text,
  ig_user_id text,
  access_token text not null,
  token_expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tenant_channels enable row level security;

create policy "tenant channel access" on tenant_channels
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- PHONE ROUTING (sin RLS — service_role only)
-- ─────────────────────────────────────────
create table phone_routing (
  phone_number_id text primary key,
  page_id text,
  tenant_id uuid not null references tenants(id) on delete cascade,
  channel_id uuid not null references tenant_channels(id) on delete cascade
);

-- ─────────────────────────────────────────
-- CONTACTS
-- ─────────────────────────────────────────
create table contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text,
  phone text,
  ig_username text,
  email text,
  tags text[],
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table contacts enable row level security;

create policy "tenant contact access" on contacts
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- CONVERSATIONS
-- ─────────────────────────────────────────
create table conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid references contacts(id),
  channel_type text not null check (channel_type in ('whatsapp','instagram','web')),
  channel_id uuid references tenant_channels(id),
  status text not null default 'open' check (status in ('open','closed','spam')),
  ai_handling boolean not null default true,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table conversations enable row level security;

create policy "tenant conversation access" on conversations
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  meta_message_id text,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

create policy "tenant message access" on messages
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- CATALOG ITEMS
-- ─────────────────────────────────────────
create table catalog_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2),
  currency text default 'USD',
  image_url text,
  is_active boolean not null default true,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table catalog_items enable row level security;

create policy "tenant catalog access" on catalog_items
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- KNOWLEDGE CHUNKS (RAG)
-- ─────────────────────────────────────────
create table knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  source text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table knowledge_chunks enable row level security;

create policy "tenant knowledge access" on knowledge_chunks
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

create index on knowledge_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ─────────────────────────────────────────
-- PIPELINE STAGES
-- ─────────────────────────────────────────
create table pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  position int not null,
  color text default '#6366f1',
  created_at timestamptz not null default now()
);

alter table pipeline_stages enable row level security;

create policy "tenant pipeline access" on pipeline_stages
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- DEALS
-- ─────────────────────────────────────────
create table deals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid references contacts(id),
  stage_id uuid references pipeline_stages(id),
  title text not null,
  value numeric(12,2),
  currency text default 'USD',
  notes text,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table deals enable row level security;

create policy "tenant deal access" on deals
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- CAMPAIGNS
-- ─────────────────────────────────────────
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  channel_type text not null check (channel_type in ('whatsapp','email')),
  template_name text,
  template_params jsonb,
  status text not null default 'draft' check (status in ('draft','scheduled','running','done','failed')),
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table campaigns enable row level security;

create policy "tenant campaign access" on campaigns
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- CAMPAIGN RECIPIENTS
-- ─────────────────────────────────────────
create table campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  contact_id uuid not null references contacts(id),
  status text not null default 'pending' check (status in ('pending','sent','delivered','failed')),
  sent_at timestamptz,
  meta_message_id text
);

-- ─────────────────────────────────────────
-- WEBHOOK LOGS
-- ─────────────────────────────────────────
create table webhook_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('whatsapp','instagram')),
  payload jsonb not null,
  processed boolean not null default false,
  error text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- AGENT CONTEXT (historial para Claude)
-- ─────────────────────────────────────────
create table agent_context (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade unique,
  messages jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- FUNCTIONS
-- ─────────────────────────────────────────

-- Búsqueda semántica RAG por tenant
create or replace function search_knowledge(
  p_tenant_id uuid,
  p_embedding vector(1536),
  p_limit int default 5
)
returns table (
  id uuid,
  content text,
  source text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    source,
    1 - (embedding <=> p_embedding) as similarity
  from knowledge_chunks
  where tenant_id = p_tenant_id
    and embedding is not null
  order by embedding <=> p_embedding
  limit p_limit;
$$;

-- Pipeline stages por defecto al crear tenant
create or replace function insert_default_stages(p_tenant_id uuid)
returns void
language sql
as $$
  insert into pipeline_stages (tenant_id, name, position, color) values
    (p_tenant_id, 'Nuevo',      1, '#6366f1'),
    (p_tenant_id, 'Contactado', 2, '#3b82f6'),
    (p_tenant_id, 'Propuesta',  3, '#f59e0b'),
    (p_tenant_id, 'Cerrado',    4, '#10b981');
$$;

-- Trigger: subscripción trial + pipeline al crear tenant
create or replace function on_tenant_created()
returns trigger
language plpgsql
as $$
begin
  insert into subscriptions (tenant_id, plan, status, trial_ends_at)
  values (new.id, 'trial', 'active', now() + interval '14 days');

  perform insert_default_stages(new.id);
  return new;
end;
$$;

create trigger trg_on_tenant_created
  after insert on tenants
  for each row execute function on_tenant_created();

-- Trigger: updated_at automático
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_tenants_updated_at before update on tenants
  for each row execute function set_updated_at();
create trigger trg_subscriptions_updated_at before update on subscriptions
  for each row execute function set_updated_at();
create trigger trg_tenant_channels_updated_at before update on tenant_channels
  for each row execute function set_updated_at();
create trigger trg_contacts_updated_at before update on contacts
  for each row execute function set_updated_at();
create trigger trg_conversations_updated_at before update on conversations
  for each row execute function set_updated_at();
create trigger trg_catalog_updated_at before update on catalog_items
  for each row execute function set_updated_at();
create trigger trg_deals_updated_at before update on deals
  for each row execute function set_updated_at();
create trigger trg_campaigns_updated_at before update on campaigns
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────
-- VIEWS
-- ─────────────────────────────────────────

create or replace view v_inbox as
  select
    c.id,
    c.tenant_id,
    c.channel_type,
    c.status,
    c.ai_handling,
    c.last_message_at,
    ct.name as contact_name,
    ct.phone as contact_phone,
    ct.ig_username as contact_ig,
    m.content as last_message
  from conversations c
  left join contacts ct on ct.id = c.contact_id
  left join messages m on m.id = (
    select id from messages
    where conversation_id = c.id
    order by created_at desc
    limit 1
  );

create or replace view v_tenant_metrics as
  select
    c.tenant_id,
    date_trunc('day', m.created_at) as day,
    count(distinct c.id) as conversations,
    count(m.id) as messages,
    count(m.id) filter (where m.role = 'assistant') as ai_responses
  from messages m
  join conversations c on c.id = m.conversation_id
  group by c.tenant_id, date_trunc('day', m.created_at);
