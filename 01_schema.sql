CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;


DO $$ BEGIN
    CREATE TYPE road_class AS ENUM (
        'national_highway',
        'state_highway',
        'district_road',
        'village_road',
        'bridge',
        'border_approach'
    );
    
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE surface_quality AS ENUM (
        'paved',
        'gravel',
        'earthen',
        'damaged',
        'under_repair'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_type AS ENUM (
        'landslide',
        'flood',
        'road_damage',
        'bridge_damage',
        'traffic_congestion',
        'fallen_tree',
        'snowfall',
        'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_level AS ENUM (
        'low',
        'medium',
        'high',
        'critical'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE facility_type AS ENUM (
        'hospital',
        'phc',
        'warehouse',
        'supply_depot',
        'fuel_station',
        'relief_camp',
        'district_hq'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE operating_status AS ENUM (
        'operational',
        'limited',
        'disrupted',
        'closed'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE dependency_type AS ENUM (
        'medicine_supply',
        'food_supply',
        'fuel_supply',
        'medical_referral',
        'relief_staging'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE cargo_type AS ENUM (
        'medicine',
        'food',
        'recovery_materials',
        'fuel',
        'commercial'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_tier AS ENUM (
        'emergency',
        'high',
        'medium',
        'low'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE shipment_status AS ENUM (
        'planned',
        'in_transit',
        'delayed',
        'stranded',
        'delivered',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_status AS ENUM (
        'moving',
        'stopped',
        'idle',
        'offline',
        'anomaly'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_type AS ENUM (
        'road_risk',
        'road_closure',
        'facility_isolation',
        'shipment_delay',
        'weather',
        'incident'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_channel AS ENUM (
        'sms',
        'email',
        'in_app',
        'push'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_status AS ENUM (
        'pending',
        'sent',
        'acknowledged',
        'failed'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


CREATE TABLE IF NOT EXISTS districts (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    state           TEXT NOT NULL DEFAULT 'Arunachal Pradesh',
    hq_name         TEXT,
    boundary        geometry(Polygon, 4326) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT districts_name_unique UNIQUE (state, name)
);

COMMENT ON TABLE districts IS
    'NER administrative districts. Boundary polygons drive district-scoped maps and ST_Within facility lookups.';
COMMENT ON COLUMN districts.boundary IS
    'District polygon in WGS84. Demo data uses envelopes around real HQ towns; replace with OSM/Survey of India boundaries for production.';

-- Graph vertices (junctions / towns) used by risk-aware shortest path.
CREATE TABLE IF NOT EXISTS road_nodes (
    id              INTEGER PRIMARY KEY,
    name            TEXT NOT NULL,
    district_id     BIGINT REFERENCES districts (id) ON DELETE SET NULL,
    geometry        geometry(Point, 4326) NOT NULL
);

COMMENT ON TABLE road_nodes IS
    'Named junctions used as source/target of road_segments. Enables Dijkstra without pgRouting for the MVP graph.';

-- Flood / landslide polygons from Bhuvan/GSI
CREATE TABLE IF NOT EXISTS hazard_zones (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    hazard_type     TEXT NOT NULL CHECK (hazard_type IN ('flood', 'landslide')),
    severity        severity_level NOT NULL DEFAULT 'medium',
    geometry        geometry(Polygon, 4326) NOT NULL,
    source          TEXT DEFAULT 'demo_seed'
);

COMMENT ON TABLE hazard_zones IS
    'Areal hazard layers (floodplains, landslide susceptibility). Used with ST_Intersects to flag roads in high-risk zones.';

-- Recipients for the INFORM layer (authorities, operators, field officers).
CREATE TABLE IF NOT EXISTS stakeholders (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    role            TEXT NOT NULL,
    organization    TEXT,
    district_id     BIGINT REFERENCES districts (id) ON DELETE SET NULL,
    phone           TEXT,
    email           TEXT
);

COMMENT ON TABLE stakeholders IS
    'People and agencies who receive alerts. target_stakeholder_id on alerts points here.';

CREATE TABLE IF NOT EXISTS vehicles (
    id              BIGSERIAL PRIMARY KEY,
    registration_no TEXT NOT NULL UNIQUE,
    vehicle_type    TEXT NOT NULL DEFAULT 'truck',
    capacity_kg     NUMERIC(10, 2),
    home_district_id BIGINT REFERENCES districts (id) ON DELETE SET NULL,
    status          vehicle_status NOT NULL DEFAULT 'idle'
);

COMMENT ON TABLE vehicles IS
    'Fleet master list. GPS pings live in vehicle_tracks; active assignments live on shipments.';

-- Ordered lists of segments that a shipment may follow.
CREATE TABLE IF NOT EXISTS routes (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    road_segment_ids BIGINT[] NOT NULL,
    geometry        geometry(LineString, 4326),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE routes IS
    'Candidate / assigned paths as ordered road_segment_id arrays. Shipments.current_route_id and vehicle_tracks.on_route_id reference this table.';


CREATE TABLE IF NOT EXISTS road_segments (
    id                  BIGSERIAL PRIMARY KEY,
    name                TEXT NOT NULL,
    geometry            geometry(LineString, 4326) NOT NULL,
    district_id         BIGINT REFERENCES districts (id) ON DELETE SET NULL,
    type                road_class NOT NULL DEFAULT 'district_road',
    length_km           NUMERIC(10, 3),
    baseline_speed_kmh  NUMERIC(6, 2) NOT NULL DEFAULT 30
                            CHECK (baseline_speed_kmh > 0),
    surface_quality     surface_quality NOT NULL DEFAULT 'paved',
    last_updated        TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Graph endpoints (MVP routing; optional pgRouting source/target aliases)
    source_node_id      INTEGER REFERENCES road_nodes (id) ON DELETE RESTRICT,
    target_node_id      INTEGER REFERENCES road_nodes (id) ON DELETE RESTRICT,
    CONSTRAINT road_segments_endpoints_distinct
        CHECK (source_node_id IS DISTINCT FROM target_node_id),
    CONSTRAINT road_segments_min_vertices
        CHECK (ST_NPoints(geometry) >= 2)
);

COMMENT ON TABLE road_segments IS
    'Road network edges for NER. Each segment can carry a time-varying risk score and is used to build the routing graph and the resilience/dependency graph.';
COMMENT ON COLUMN road_segments.geometry IS
    'LineString in EPSG:4326. Length is maintained in kilometres via trigger from geography measurement.';
COMMENT ON COLUMN road_segments.baseline_speed_kmh IS
    'Fair-weather free-flow speed used by the ETA heuristic: distance / speed × terrain/weather penalties.';
COMMENT ON COLUMN road_segments.surface_quality IS
    'Physical condition; feeds the rule-based risk baseline and the ML feature set.';
COMMENT ON COLUMN road_segments.source_node_id IS
    'Routing graph start vertex (road_nodes.id).';
COMMENT ON COLUMN road_segments.target_node_id IS
    'Routing graph end vertex (road_nodes.id). Edges are treated as bidirectional.';


CREATE TABLE IF NOT EXISTS risk_snapshots (
    id                      BIGSERIAL NOT NULL,
    road_segment_id         BIGINT NOT NULL REFERENCES road_segments (id) ON DELETE CASCADE,
    "timestamp"             TIMESTAMPTZ NOT NULL DEFAULT now(),
    rainfall_score          NUMERIC(4, 3) NOT NULL DEFAULT 0 CHECK (rainfall_score BETWEEN 0 AND 1),
    flood_risk              NUMERIC(4, 3) NOT NULL DEFAULT 0 CHECK (flood_risk BETWEEN 0 AND 1),
    landslide_risk          NUMERIC(4, 3) NOT NULL DEFAULT 0 CHECK (landslide_risk BETWEEN 0 AND 1),
    road_condition_score    NUMERIC(4, 3) NOT NULL DEFAULT 0 CHECK (road_condition_score BETWEEN 0 AND 1),
    total_risk              NUMERIC(4, 3) NOT NULL DEFAULT 0 CHECK (total_risk BETWEEN 0 AND 1),
    model_version           TEXT NOT NULL DEFAULT 'rules-v1',
    CONSTRAINT risk_snapshots_pkey
        PRIMARY KEY (id, "timestamp"),
    CONSTRAINT risk_snapshots_unique_tick
        UNIQUE (road_segment_id, "timestamp", model_version)
);

COMMENT ON TABLE risk_snapshots IS
    'Time-stamped risk vector per road segment. Enables trend analysis and is the live colouring source for the GIS map.';
COMMENT ON COLUMN risk_snapshots.total_risk IS
    'Combined accessibility-disruption probability in [0, 1], typically a weighted blend of rainfall, flood, landslide and condition.';
COMMENT ON COLUMN risk_snapshots.model_version IS
    'rules-v1 (MVP baseline) or xgboost-vN once labelled incidents exist.';

SELECT create_hypertable(
    'risk_snapshots',
    'timestamp',
    if_not_exists => TRUE
);


CREATE TABLE IF NOT EXISTS incidents (
    id                  BIGSERIAL PRIMARY KEY,
    road_segment_id     BIGINT REFERENCES road_segments (id) ON DELETE SET NULL,
    type                incident_type NOT NULL,
    severity            severity_level NOT NULL DEFAULT 'medium',
    geometry            geometry(Point, 4326) NOT NULL,
    reported_by         TEXT,
    reported_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    description         TEXT,
    photo_url           TEXT,
    verified            BOOLEAN NOT NULL DEFAULT FALSE,
    resolution_time     INTERVAL,
    resolved_at         TIMESTAMPTZ
);

COMMENT ON TABLE incidents IS
    'Geo-tagged field reports (landslide, flood, damage, trees, congestion). Unverified rows stay in a review queue; verified rows update risk snapshots.';
COMMENT ON COLUMN incidents.resolution_time IS
    'Duration from report to clearance (INTERVAL). resolved_at stores the clock time.';
COMMENT ON COLUMN incidents.verified IS
    'FALSE until a district/PWD officer confirms the report — required before it trains the ML model.';


CREATE TABLE IF NOT EXISTS facilities (
    id                  BIGSERIAL PRIMARY KEY,
    type                facility_type NOT NULL,
    name                TEXT NOT NULL,
    geometry            geometry(Point, 4326) NOT NULL,
    district_id         BIGINT REFERENCES districts (id) ON DELETE SET NULL,
    priority            priority_tier NOT NULL DEFAULT 'medium',
    population_served   INTEGER CHECK (population_served IS NULL OR population_served >= 0),
    operating_status    operating_status NOT NULL DEFAULT 'operational'
);

COMMENT ON TABLE facilities IS
    'Essential-service nodes in the resilience graph (hospitals, PHCs, warehouses, depots). Used to answer: if this road fails, who loses access?';
COMMENT ON COLUMN facilities.priority IS
    'emergency/high facilities (district hospitals, medicine warehouses) receive extra weight in expected-impact scoring.';
COMMENT ON COLUMN facilities.population_served IS
    'Approximate catchment used as a criticality multiplier in impact propagation.';


CREATE TABLE IF NOT EXISTS dependencies (
    id                      BIGSERIAL PRIMARY KEY,
    source_facility_id      BIGINT NOT NULL REFERENCES facilities (id) ON DELETE CASCADE,
    target_facility_id      BIGINT NOT NULL REFERENCES facilities (id) ON DELETE CASCADE,
    via_road_segment_id     BIGINT REFERENCES road_segments (id) ON DELETE SET NULL,
    type                    dependency_type NOT NULL,
    criticality_weight      NUMERIC(4, 3) NOT NULL DEFAULT 0.5
                                CHECK (criticality_weight BETWEEN 0 AND 1),
    redundancy_level        SMALLINT NOT NULL DEFAULT 1
                                CHECK (redundancy_level >= 0),
    CONSTRAINT dependencies_no_self_loop
        CHECK (source_facility_id <> target_facility_id)
);

COMMENT ON TABLE dependencies IS
    'Resilience-graph edges. source_facility depends on target_facility (e.g. Anini PHC depends on Tezu hospital for referrals) via an optional road segment.';
COMMENT ON COLUMN dependencies.criticality_weight IS
    'How essential the link is in [0, 1]. Multiplies failure probability in expected impact.';
COMMENT ON COLUMN dependencies.redundancy_level IS
    'Count of known alternate paths. 0 means a single point of failure (typical of Anini / Tawang spurs).';


CREATE TABLE IF NOT EXISTS shipments (
    id                      BIGSERIAL PRIMARY KEY,
    origin_facility_id      BIGINT NOT NULL REFERENCES facilities (id) ON DELETE RESTRICT,
    destination_facility_id BIGINT NOT NULL REFERENCES facilities (id) ON DELETE RESTRICT,
    cargo_type              cargo_type NOT NULL,
    priority_tier           priority_tier NOT NULL DEFAULT 'medium',
    vehicle_id              BIGINT REFERENCES vehicles (id) ON DELETE SET NULL,
    current_route_id        BIGINT REFERENCES routes (id) ON DELETE SET NULL,
    eta                     TIMESTAMPTZ,
    status                  shipment_status NOT NULL DEFAULT 'planned',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT shipments_origin_neq_dest
        CHECK (origin_facility_id <> destination_facility_id)
);

COMMENT ON TABLE shipments IS
    'Active and historical essential-goods movements. Priority_tier is injected into route ranking so emergency medicine is routed more conservatively than commercial cargo.';
COMMENT ON COLUMN shipments.eta IS
    'Estimated time of arrival (spec field: ETA). Updated when a new route candidate is selected.';
COMMENT ON COLUMN shipments.priority_tier IS
    'emergency (medicine) > high (food) > medium (recovery materials) > low (commercial).';




CREATE TABLE IF NOT EXISTS vehicle_tracks (
    id              BIGSERIAL PRIMARY KEY,
    vehicle_id      BIGINT NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
    "timestamp"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    geometry        geometry(Point, 4326) NOT NULL,
    speed_kmh       NUMERIC(6, 2) CHECK (speed_kmh IS NULL OR speed_kmh >= 0),
    heading         NUMERIC(5, 1) CHECK (heading IS NULL OR (heading >= 0 AND heading < 360)),
    on_route_id     BIGINT REFERENCES routes (id) ON DELETE SET NULL,
    status          vehicle_status NOT NULL DEFAULT 'moving'
);

COMMENT ON TABLE vehicle_tracks IS
    'Time-stamped GPS pings. Simulated for the MVP; production would ingest telematics. Anomaly detection compares speed against the segment baseline.';
COMMENT ON COLUMN vehicle_tracks.heading IS
    'Compass heading in degrees [0, 360).';



CREATE TABLE IF NOT EXISTS route_candidates (
    id                  BIGSERIAL PRIMARY KEY,
    shipment_id         BIGINT NOT NULL REFERENCES shipments (id) ON DELETE CASCADE,
    route_id            BIGINT NOT NULL REFERENCES routes (id) ON DELETE CASCADE,
    total_distance_km   NUMERIC(10, 3) NOT NULL CHECK (total_distance_km >= 0),
    eta_hours           NUMERIC(8, 2) NOT NULL CHECK (eta_hours >= 0),
    risk_score          NUMERIC(6, 3) NOT NULL DEFAULT 0 CHECK (risk_score >= 0),
    impact_score        NUMERIC(6, 3) NOT NULL DEFAULT 0 CHECK (impact_score >= 0),
    combined_score      NUMERIC(6, 3) NOT NULL DEFAULT 0,
    rank                INTEGER NOT NULL CHECK (rank >= 1),
    CONSTRAINT route_candidates_unique_rank
        UNIQUE (shipment_id, rank),
    CONSTRAINT route_candidates_unique_route
        UNIQUE (shipment_id, route_id)
);

COMMENT ON TABLE route_candidates IS
    'Optimiser output: several feasible paths per shipment, scored on distance + risk + expected network impact + priority, then ranked.';
COMMENT ON COLUMN route_candidates.eta_hours IS
    'Predicted travel time in hours (spec field: ETA_hours).';
COMMENT ON COLUMN route_candidates.impact_score IS
    'Expected network consequence if this route is used / if its critical edges fail. Lower is better.';
COMMENT ON COLUMN route_candidates.combined_score IS
    'travel-time penalty + risk penalty + impact penalty + shipment-priority factor. Rank 1 is the recommended route.';




CREATE TABLE IF NOT EXISTS alerts (
    id                      BIGSERIAL PRIMARY KEY,
    type                    alert_type NOT NULL,
    severity                severity_level NOT NULL DEFAULT 'medium',
    target_stakeholder_id   BIGINT REFERENCES stakeholders (id) ON DELETE SET NULL,
    road_segment_id         BIGINT REFERENCES road_segments (id) ON DELETE SET NULL,
    facility_id             BIGINT REFERENCES facilities (id) ON DELETE SET NULL,
    message                 TEXT NOT NULL,
    sent_at                 TIMESTAMPTZ,
    channel                 alert_channel NOT NULL DEFAULT 'in_app',
    status                  alert_status NOT NULL DEFAULT 'pending',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT alerts_has_target
        CHECK (road_segment_id IS NOT NULL OR facility_id IS NOT NULL)
);

COMMENT ON TABLE alerts IS
    'Outbound notifications to authorities, operators and drivers. road_segment_id / facility_id implement the spec''s road_id/facility_id targeting.';
COMMENT ON COLUMN alerts.channel IS
    'sms | email | in_app | push. MVP can log in_app only; SMS is a production partnership (e.g. Twilio / government gateway).';


-- Indexes — spatial GIST on every geometry, plus FK / time helpers


CREATE INDEX IF NOT EXISTS idx_districts_boundary_gist
    ON districts USING GIST (boundary);

CREATE INDEX IF NOT EXISTS idx_road_nodes_geom_gist
    ON road_nodes USING GIST (geometry);

CREATE INDEX IF NOT EXISTS idx_hazard_zones_geom_gist
    ON hazard_zones USING GIST (geometry);

CREATE INDEX IF NOT EXISTS idx_road_segments_geom_gist
    ON road_segments USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_road_segments_district
    ON road_segments (district_id);
CREATE INDEX IF NOT EXISTS idx_road_segments_source
    ON road_segments (source_node_id);
CREATE INDEX IF NOT EXISTS idx_road_segments_target
    ON road_segments (target_node_id);

CREATE INDEX IF NOT EXISTS idx_risk_snapshots_segment_time
    ON risk_snapshots (road_segment_id, "timestamp" DESC);

CREATE INDEX IF NOT EXISTS idx_incidents_geom_gist
    ON incidents USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_incidents_segment
    ON incidents (road_segment_id);
CREATE INDEX IF NOT EXISTS idx_incidents_unverified
    ON incidents (reported_at DESC) WHERE verified IS FALSE;

CREATE INDEX IF NOT EXISTS idx_facilities_geom_gist
    ON facilities USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_facilities_district
    ON facilities (district_id);
CREATE INDEX IF NOT EXISTS idx_facilities_type
    ON facilities (type);

CREATE INDEX IF NOT EXISTS idx_dependencies_source
    ON dependencies (source_facility_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_target
    ON dependencies (target_facility_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_road
    ON dependencies (via_road_segment_id);

CREATE INDEX IF NOT EXISTS idx_shipments_status
    ON shipments (status);
CREATE INDEX IF NOT EXISTS idx_shipments_vehicle
    ON shipments (vehicle_id);

CREATE INDEX IF NOT EXISTS idx_vehicle_tracks_geom_gist
    ON vehicle_tracks USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_vehicle_tracks_vehicle_time
    ON vehicle_tracks (vehicle_id, "timestamp" DESC);

CREATE INDEX IF NOT EXISTS idx_route_candidates_shipment
    ON route_candidates (shipment_id, rank);

CREATE INDEX IF NOT EXISTS idx_alerts_stakeholder
    ON alerts (target_stakeholder_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_road
    ON alerts (road_segment_id);
CREATE INDEX IF NOT EXISTS idx_alerts_facility
    ON alerts (facility_id);

CREATE INDEX IF NOT EXISTS idx_routes_geom_gist
    ON routes USING GIST (geometry);



CREATE OR REPLACE FUNCTION nera_road_segments_before_write()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.geometry IS NOT NULL THEN
        NEW.length_km := ROUND((ST_Length(NEW.geometry::geography) / 1000.0)::numeric, 3);
    END IF;
    NEW.last_updated := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_road_segments_before_write ON road_segments;
CREATE TRIGGER trg_road_segments_before_write
    BEFORE INSERT OR UPDATE OF geometry, baseline_speed_kmh, surface_quality, district_id
    ON road_segments
    FOR EACH ROW
    EXECUTE FUNCTION nera_road_segments_before_write();



CREATE OR REPLACE VIEW v_latest_risk AS
SELECT DISTINCT ON (rs.road_segment_id)
    rs.road_segment_id,
    rs."timestamp",
    rs.rainfall_score,
    rs.flood_risk,
    rs.landslide_risk,
    rs.road_condition_score,
    rs.total_risk,
    rs.model_version,
    seg.name AS road_name,
    seg.geometry
FROM risk_snapshots rs
JOIN road_segments seg ON seg.id = rs.road_segment_id
ORDER BY rs.road_segment_id, rs."timestamp" DESC;

COMMENT ON VIEW v_latest_risk IS
    'Most recent risk snapshot per road segment — the colour layer for the live GIS map.';



-- 1) Facilities inside a district polygon (ST_Within).
CREATE OR REPLACE FUNCTION nera_facilities_in_district(p_district_id BIGINT)
RETURNS SETOF facilities
LANGUAGE sql
STABLE
AS $$
    SELECT f.*
    FROM facilities AS f
    JOIN districts AS d ON d.id = p_district_id
    WHERE ST_Within(f.geometry, d.boundary)
       OR f.district_id = p_district_id;
$$;

COMMENT ON FUNCTION nera_facilities_in_district(BIGINT) IS
    'Return all facilities whose point lies inside the district polygon (fallback: district_id match).';



CREATE OR REPLACE FUNCTION nera_roads_near_facility(
    p_facility_id BIGINT,
    p_radius_m    NUMERIC DEFAULT 500
)
RETURNS TABLE (
    road_segment_id BIGINT,
    road_name       TEXT,
    distance_m      NUMERIC,
    type            road_class,
    length_km       NUMERIC,
    geometry        geometry
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        r.id,
        r.name,
        ROUND(ST_Distance(r.geometry::geography, f.geometry::geography)::numeric, 1) AS distance_m,
        r.type,
        r.length_km,
        r.geometry
    FROM facilities AS f
    JOIN road_segments AS r
      ON ST_DWithin(r.geometry::geography, f.geometry::geography, p_radius_m)
    WHERE f.id = p_facility_id
    ORDER BY 3;
$$;

COMMENT ON FUNCTION nera_roads_near_facility(BIGINT, NUMERIC) IS
    'Road segments whose geometry is within p_radius_m metres of the facility point. Default 500 m.';


CREATE OR REPLACE FUNCTION nera_high_risk_road_segments(
    p_flood_threshold     NUMERIC DEFAULT 0.60,
    p_landslide_threshold NUMERIC DEFAULT 0.60
)
RETURNS TABLE (
    road_segment_id  BIGINT,
    road_name        TEXT,
    flood_risk       NUMERIC,
    landslide_risk   NUMERIC,
    total_risk       NUMERIC,
    in_flood_zone    BOOLEAN,
    in_landslide_zone BOOLEAN,
    geometry         geometry
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        r.id,
        r.name,
        lr.flood_risk,
        lr.landslide_risk,
        lr.total_risk,
        EXISTS (
            SELECT 1 FROM hazard_zones z
            WHERE z.hazard_type = 'flood'
              AND ST_Intersects(r.geometry, z.geometry)
        ) AS in_flood_zone,
        EXISTS (
            SELECT 1 FROM hazard_zones z
            WHERE z.hazard_type = 'landslide'
              AND ST_Intersects(r.geometry, z.geometry)
        ) AS in_landslide_zone,
        r.geometry
    FROM road_segments r
    LEFT JOIN v_latest_risk lr ON lr.road_segment_id = r.id
    WHERE COALESCE(lr.flood_risk, 0) >= p_flood_threshold
       OR COALESCE(lr.landslide_risk, 0) >= p_landslide_threshold
       OR EXISTS (
            SELECT 1 FROM hazard_zones z
            WHERE ST_Intersects(r.geometry, z.geometry)
              AND z.severity IN ('high', 'critical')
        )
    ORDER BY COALESCE(lr.total_risk, 0) DESC, r.id;
$$;

COMMENT ON FUNCTION nera_high_risk_road_segments(NUMERIC, NUMERIC) IS
    'Segments with high flood/landslide snapshot scores, or that ST_Intersect high-severity hazard_zones.';



CREATE OR REPLACE FUNCTION nera_nearest_road_node(p_geom geometry)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
    SELECT n.id
    FROM road_nodes AS n
    ORDER BY n.geometry <-> p_geom
    LIMIT 1;
$$;


CREATE OR REPLACE FUNCTION nera_shortest_path_with_cost(
    p_source_node     INTEGER,
    p_target_node     INTEGER,
    p_risk_weight     NUMERIC DEFAULT 1.0,
    p_exclude_road_id BIGINT DEFAULT NULL
)
RETURNS TABLE (
    seq             INTEGER,
    node_id         INTEGER,
    node_name       TEXT,
    road_segment_id BIGINT,
    edge_cost       NUMERIC,
    agg_cost        NUMERIC,
    geometry        geometry
)
LANGUAGE sql
STABLE
AS $$
    WITH RECURSIVE latest_risk AS (
        SELECT DISTINCT ON (s.road_segment_id)
            s.road_segment_id,
            s.total_risk
        FROM risk_snapshots AS s
        ORDER BY s.road_segment_id, s."timestamp" DESC
    ),
    edges AS (
        SELECT
            rs.id,
            rs.source_node_id AS a,
            rs.target_node_id AS b,
            rs.geometry,
            (rs.length_km * (1 + p_risk_weight * COALESCE(lr.total_risk, 0)))::numeric AS cost
        FROM road_segments AS rs
        LEFT JOIN latest_risk AS lr ON lr.road_segment_id = rs.id
        WHERE rs.source_node_id IS NOT NULL
          AND rs.target_node_id IS NOT NULL
          AND (p_exclude_road_id IS NULL OR rs.id <> p_exclude_road_id)
    ),
    walk AS (
        SELECT
            e.id AS road_segment_id,
            CASE WHEN e.a = p_source_node THEN e.b ELSE e.a END AS node_id,
            ARRAY[p_source_node, CASE WHEN e.a = p_source_node THEN e.b ELSE e.a END]::integer[] AS nodes,
            ARRAY[e.id]::bigint[] AS edge_ids,
            ARRAY[e.cost]::numeric[] AS edge_costs,
            e.cost AS agg_cost
        FROM edges AS e
        WHERE e.a = p_source_node OR e.b = p_source_node

        UNION ALL

        SELECT
            e.id,
            CASE WHEN e.a = w.node_id THEN e.b ELSE e.a END,
            w.nodes || CASE WHEN e.a = w.node_id THEN e.b ELSE e.a END,
            w.edge_ids || e.id,
            w.edge_costs || e.cost,
            w.agg_cost + e.cost
        FROM walk AS w
        JOIN edges AS e
          ON e.a = w.node_id OR e.b = w.node_id
        WHERE (
                (e.a = w.node_id AND NOT (e.b = ANY (w.nodes)))
             OR (e.b = w.node_id AND NOT (e.a = ANY (w.nodes)))
              )
          AND array_length(w.nodes, 1) < 40
    ),
    best AS (
        SELECT w.*
        FROM walk AS w
        WHERE w.node_id = p_target_node
        ORDER BY w.agg_cost
        LIMIT 1
    ),
    steps AS (
        SELECT
            u.ord AS seq,
            u.node_id,
            CASE WHEN u.ord = 1 THEN NULL ELSE b.edge_ids[u.ord - 1] END AS road_segment_id,
            CASE WHEN u.ord = 1 THEN 0 ELSE b.edge_costs[u.ord - 1] END AS edge_cost,
            (
                SELECT COALESCE(SUM(x), 0)
                FROM unnest(b.edge_costs[1:(u.ord - 1)]) AS x
            ) AS agg_cost
        FROM best AS b
        CROSS JOIN LATERAL unnest(b.nodes) WITH ORDINALITY AS u(node_id, ord)
    )
    SELECT
        s.seq::integer,
        s.node_id,
        n.name,
        s.road_segment_id,
        ROUND(s.edge_cost, 3),
        ROUND(s.agg_cost, 3),
        CASE
            WHEN s.road_segment_id IS NULL THEN n.geometry
            ELSE rs.geometry
        END
    FROM steps AS s
    JOIN road_nodes AS n ON n.id = s.node_id
    LEFT JOIN road_segments AS rs ON rs.id = s.road_segment_id
    ORDER BY s.seq;
$$;

COMMENT ON FUNCTION nera_shortest_path_with_cost(INTEGER, INTEGER, NUMERIC, BIGINT) IS
    'Risk-aware shortest path. Edge cost = length_km × (1 + risk_weight × latest total_risk). Exclude a road id to simulate failure. For production-scale graphs switch this body to pgr_dijkstra.';


-- 5) Facilities isolated from a hub if a given road is removed.
CREATE OR REPLACE FUNCTION nera_isolated_facilities_if_road_fails(
    p_failed_road_id  BIGINT,
    p_hub_facility_id BIGINT DEFAULT NULL
)
RETURNS TABLE (
    facility_id         BIGINT,
    facility_name       TEXT,
    facility_type       facility_type,
    district_id         BIGINT,
    nearest_node_id     INTEGER,
    reachable_before    BOOLEAN,
    reachable_after     BOOLEAN,
    is_isolated         BOOLEAN,
    dependency_count    BIGINT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_hub_id   BIGINT;
    v_hub_node INTEGER;
BEGIN
    v_hub_id := p_hub_facility_id;
    IF v_hub_id IS NULL THEN
        SELECT f.id INTO v_hub_id
        FROM facilities AS f
        WHERE f.type = 'warehouse'
        ORDER BY CASE f.priority
                     WHEN 'emergency' THEN 1
                     WHEN 'high' THEN 2
                     WHEN 'medium' THEN 3
                     ELSE 4
                 END,
                 f.id
        LIMIT 1;
    END IF;

    v_hub_node := nera_nearest_road_node((SELECT geometry FROM facilities WHERE id = v_hub_id));

    RETURN QUERY
    WITH fac AS (
        SELECT
            f.id,
            f.name,
            f.type,
            f.district_id,
            nera_nearest_road_node(f.geometry) AS node_id
        FROM facilities AS f
    )
    SELECT
        fac.id,
        fac.name,
        fac.type,
        fac.district_id,
        fac.node_id,
        (
            fac.node_id = v_hub_node
            OR EXISTS (
                SELECT 1
                FROM nera_shortest_path_with_cost(v_hub_node, fac.node_id, 0, NULL)
            )
        ) AS reachable_before,
        (
            fac.node_id = v_hub_node
            OR EXISTS (
                SELECT 1
                FROM nera_shortest_path_with_cost(v_hub_node, fac.node_id, 0, p_failed_road_id)
            )
        ) AS reachable_after,
        (
            fac.id <> v_hub_id
            AND (
                fac.node_id = v_hub_node
                OR EXISTS (
                    SELECT 1
                    FROM nera_shortest_path_with_cost(v_hub_node, fac.node_id, 0, NULL)
                )
            )
            AND NOT (
                fac.node_id = v_hub_node
                OR EXISTS (
                    SELECT 1
                    FROM nera_shortest_path_with_cost(v_hub_node, fac.node_id, 0, p_failed_road_id)
                )
            )
        ) AS is_isolated,
        (
            SELECT COUNT(*)
            FROM dependencies AS d
            WHERE d.source_facility_id = fac.id
               OR d.target_facility_id = fac.id
        ) AS dependency_count
    FROM fac
    ORDER BY 8 DESC, fac.id;
END;
$$;

COMMENT ON FUNCTION nera_isolated_facilities_if_road_fails(BIGINT, BIGINT) IS
    'What-if: remove one road from the graph and report facilities that can no longer reach the hub warehouse (default: highest-priority warehouse). is_isolated = reachable before, unreachable after.';



CREATE OR REPLACE FUNCTION nera_expected_impact(
    p_road_segment_id BIGINT,
    p_disruption_hours NUMERIC DEFAULT 6
)
RETURNS TABLE (
    road_segment_id     BIGINT,
    failure_probability NUMERIC,
    isolated_facilities BIGINT,
    affected_criticality NUMERIC,
    expected_impact     NUMERIC
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        p_road_segment_id,
        COALESCE((SELECT total_risk FROM v_latest_risk WHERE road_segment_id = p_road_segment_id), 0),
        COUNT(DISTINCT iso.facility_id) FILTER (WHERE iso.is_isolated),
        COALESCE(SUM(d.criticality_weight) FILTER (WHERE iso.is_isolated), 0),
        ROUND(
            COALESCE((SELECT total_risk FROM v_latest_risk WHERE road_segment_id = p_road_segment_id), 0)
            * (1 + COUNT(DISTINCT iso.facility_id) FILTER (WHERE iso.is_isolated))
            * (1 + COALESCE(SUM(d.criticality_weight) FILTER (WHERE iso.is_isolated), 0))
            * (p_disruption_hours / 6.0)
        , 3)
    FROM nera_isolated_facilities_if_road_fails(p_road_segment_id) AS iso
    LEFT JOIN dependencies AS d ON d.source_facility_id = iso.facility_id
    GROUP BY 1, 2;
$$;

COMMENT ON FUNCTION nera_expected_impact(BIGINT, NUMERIC) IS
    'Demo impact index ≈ failure_probability × (1 + isolated facility count) × (1 + criticality) × (duration / 6h). Normalize further in the API if a 0–100 scale is required.';
