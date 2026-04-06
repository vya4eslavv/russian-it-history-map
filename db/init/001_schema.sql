create table if not exists regions (
    id bigserial primary key,
    code varchar(16) not null unique,
    name varchar(255) not null unique,
    created_at timestamp not null default now()
);

create table if not exists region_aliases (
    id bigserial primary key,
    region_id bigint not null references regions(id) on delete cascade,
    alias varchar(255) not null unique
);

create table if not exists achievements (
    id bigserial primary key,
    region_id bigint not null references regions(id) on delete restrict,
    slug varchar(255) not null unique,
    title varchar(255) not null,
    location_name varchar(255),
    inventor varchar(255),
    period_text varchar(255),
    description text not null,
    source_label varchar(255),
    sort_order integer not null default 100,
    created_at timestamp not null default now(),
    image_url text,
    image_alt varchar(500),
    image_caption text
);

create index if not exists idx_achievements_region_id on achievements(region_id);
create index if not exists idx_region_aliases_region_id on region_aliases(region_id);