# Cargar los 100 lugares reales

Este flujo convierte tu catálogo real en una migración versionada y repetible.

## 1) Crear archivo de datos

1. Copia `data/places.seed.example.json` a `data/places.seed.json`.
2. Completa tus 100 lugares en ese archivo.

Campos requeridos por lugar:
- `slug` (único, en minúsculas, con guiones)
- `name`
- `department`
- `latitude` (number)
- `longitude` (number)

Campos opcionales:
- `region`
- `category`
- `description`
- `image_url`
- `source_url`

## 2) Generar migración SQL

```bash
npm run places:generate-migration
```

Eso crea un archivo nuevo en `supabase/migrations/` con formato:
- `YYYYMMDDHHMMSS_seed_places_catalog.sql`

## 3) Aplicar migración

```bash
npm run db:push
```

Supabase aplicará la migración a tu proyecto remoto.

## 4) Verificación rápida

En SQL Editor de Supabase:

```sql
select count(*) from public.places;
select name, department from public.places order by created_at desc limit 10;
```

## 5) Actualizar el catálogo sin duplicar

Si cambias datos y vuelves a generar/aplicar migración, el `upsert` usa `slug` como clave:
- inserta lugares nuevos
- actualiza existentes
- no duplica registros
