BEGIN;
TRUNCATE
    alerts,
    route_candidates,
    vehicle_tracks,
    shipments,
    dependencies,
    incidents,
    risk_snapshots,
    routes,
    facilities,
    hazard_zones,
    road_segments,
    road_nodes,
    vehicles,
    stakeholders,
    districts
RESTART IDENTITY CASCADE;

INSERT INTO districts (id, name, state, hq_name, boundary) VALUES
( 1, 'Papum Pare','Arunachal Pradesh', 'Itanagar',
    ST_SetSRID(ST_MakeEnvelope(93.35, 26.85, 93.95, 27.35), 4326)),
( 2, 'Lower Subansiri','Arunachal Pradesh', 'Ziro',
    ST_SetSRID(ST_MakeEnvelope(93.55, 27.35, 94.15, 27.75), 4326)),
( 3, 'Upper Subansiri','Arunachal Pradesh', 'Daporijo',
    ST_SetSRID(ST_MakeEnvelope(93.90, 27.70, 94.55, 28.25), 4326)),
( 4, 'West Siang','Arunachal Pradesh', 'Aalo',
    ST_SetSRID(ST_MakeEnvelope(94.45, 27.50, 95.05, 28.45), 4326)),
( 5, 'East Siang','Arunachal Pradesh', 'Pasighat',
    ST_SetSRID(ST_MakeEnvelope(94.95, 27.70, 95.55, 28.30), 4326)),
( 6, 'Upper Siang','Arunachal Pradesh', 'Yingkiong',
    ST_SetSRID(ST_MakeEnvelope(94.75, 28.30, 95.40, 28.85), 4326)),
( 7, 'Lower Dibang Valley', 'Arunachal Pradesh', 'Roing',
    ST_SetSRID(ST_MakeEnvelope(95.50, 27.90, 96.10, 28.40), 4326)),
( 8, 'Dibang Valley','Arunachal Pradesh', 'Anini',
    ST_SetSRID(ST_MakeEnvelope(95.50, 28.40, 96.20, 29.10), 4326)),
( 9, 'Lohit','Arunachal Pradesh', 'Tezu',
    ST_SetSRID(ST_MakeEnvelope(95.90, 27.70, 96.70, 28.25), 4326)),
(10, 'Anjaw','Arunachal Pradesh', 'Hawai',
    ST_SetSRID(ST_MakeEnvelope(96.20, 27.70, 97.00, 28.40), 4326)),
(11, 'Namsai','Arunachal Pradesh', 'Namsai',
    ST_SetSRID(ST_MakeEnvelope(95.50, 27.40, 96.20, 27.85), 4326)),
(12, 'Changlang','Arunachal Pradesh', 'Changlang',
    ST_SetSRID(ST_MakeEnvelope(95.40, 26.90, 96.10, 27.40), 4326)),
(13, 'Tirap','Arunachal Pradesh', 'Khonsa',
    ST_SetSRID(ST_MakeEnvelope(95.20, 26.70, 95.80, 27.20), 4326)),
(14, 'East Kameng','Arunachal Pradesh', 'Seppa',
    ST_SetSRID(ST_MakeEnvelope(92.70, 26.90, 93.50, 27.55), 4326)),
(15, 'West Kameng','Arunachal Pradesh', 'Bomdila',
    ST_SetSRID(ST_MakeEnvelope(92.10, 26.85, 92.90, 27.50), 4326)),
(16, 'Tawang','Arunachal Pradesh', 'Tawang',
    ST_SetSRID(ST_MakeEnvelope(91.50, 27.35, 92.20, 27.80), 4326));



INSERT INTO road_nodes (id, name, district_id, geometry) VALUES
( 1, 'Itanagar',     1,  ST_SetSRID(ST_MakePoint(93.6053, 27.0844), 4326)),
( 2, 'Naharlagun',   1,  ST_SetSRID(ST_MakePoint(93.6950, 27.1040), 4326)),
( 3, 'Nirjuli',      1,  ST_SetSRID(ST_MakePoint(93.7450, 27.1280), 4326)),
( 4, 'Banderdewa',   1,  ST_SetSRID(ST_MakePoint(93.8170, 27.0700), 4326)),
( 5, 'Ziro',         2,  ST_SetSRID(ST_MakePoint(93.8313, 27.5465), 4326)),
( 6, 'Daporijo',     3,  ST_SetSRID(ST_MakePoint(94.2219, 27.9854), 4326)),
( 7, 'Aalo',         4,  ST_SetSRID(ST_MakePoint(94.8097, 28.1697), 4326)),
( 8, 'Likabali',     4,  ST_SetSRID(ST_MakePoint(94.7660, 27.6500), 4326)),
( 9, 'Pasighat',     5,  ST_SetSRID(ST_MakePoint(95.3262, 28.0661), 4326)),
(10, 'Yingkiong',    6,  ST_SetSRID(ST_MakePoint(95.0200, 28.6490), 4326)),
(11, 'Mariyang',     6,  ST_SetSRID(ST_MakePoint(95.1760, 28.5000), 4326)),
(12, 'Roing',        7,  ST_SetSRID(ST_MakePoint(95.8430, 28.1450), 4326)),
(13, 'Anini',        8,  ST_SetSRID(ST_MakePoint(95.8960, 28.7980), 4326)),
(14, 'Tezu',         9,  ST_SetSRID(ST_MakePoint(96.1630, 27.9250), 4326)),
(15, 'Hayuliang',   10,  ST_SetSRID(ST_MakePoint(96.5460, 28.0730), 4326)),
(16, 'Namsai',      11,  ST_SetSRID(ST_MakePoint(95.8640, 27.6670), 4326)),
(17, 'Changlang',   12,  ST_SetSRID(ST_MakePoint(95.7340, 27.1250), 4326)),
(18, 'Khonsa',      13,  ST_SetSRID(ST_MakePoint(95.5670, 27.0170), 4326)),
(19, 'Seppa',       14,  ST_SetSRID(ST_MakePoint(93.0330, 27.2830), 4326)),
(20, 'Bhalukpong',  15,  ST_SetSRID(ST_MakePoint(92.6450, 27.0110), 4326)),
(21, 'Bomdila',     15,  ST_SetSRID(ST_MakePoint(92.4070, 27.2610), 4326)),
(22, 'Dirang',      15,  ST_SetSRID(ST_MakePoint(92.2500, 27.3500), 4326)),
(23, 'Tawang',      16,  ST_SetSRID(ST_MakePoint(91.8650, 27.5860), 4326)),
(24, 'Sela Pass',   16,  ST_SetSRID(ST_MakePoint(92.1000, 27.5100), 4326));




INSERT INTO road_segments (
    id, name, geometry, district_id, type, baseline_speed_kmh, surface_quality,
    source_node_id, target_node_id
) VALUES
( 1, 'NH-415 Itanagar–Naharlagun',
    ST_GeomFromText('LINESTRING(93.6053 27.0844, 93.6500 27.0950, 93.6950 27.1040)', 4326),
    1, 'national_highway', 40, 'paved', 1, 2),
( 2, 'NH-415 Naharlagun–Banderdewa (Assam gate)',
    ST_GeomFromText('LINESTRING(93.6950 27.1040, 93.7600 27.0900, 93.8170 27.0700)', 4326),
    1, 'national_highway', 35, 'paved', 2, 4),
( 3, 'Naharlagun–Nirjuli',
    ST_GeomFromText('LINESTRING(93.6950 27.1040, 93.7450 27.1280)', 4326),
    1, 'state_highway', 35, 'paved', 2, 3),
( 4, 'NH-13 Nirjuli–Ziro',
    ST_GeomFromText('LINESTRING(93.7450 27.1280, 93.7800 27.2800, 93.8100 27.4200, 93.8313 27.5465)', 4326),
    2, 'national_highway', 28, 'paved', 3, 5),
( 5, 'NH-13 Ziro–Daporijo',
    ST_GeomFromText('LINESTRING(93.8313 27.5465, 93.9800 27.7000, 94.1200 27.8600, 94.2219 27.9854)', 4326),
    3, 'national_highway', 25, 'damaged', 5, 6),
( 6, 'NH-13 Daporijo–Aalo',
    ST_GeomFromText('LINESTRING(94.2219 27.9854, 94.4500 28.0500, 94.6500 28.1200, 94.8097 28.1697)', 4326),
    4, 'national_highway', 26, 'paved', 6, 7),
( 7, 'Aalo–Likabali',
    ST_GeomFromText('LINESTRING(94.8097 28.1697, 94.7900 27.9100, 94.7660 27.6500)', 4326),
    4, 'state_highway', 32, 'paved', 7, 8),
( 8, 'Likabali–Pasighat (Siang foothills)',
    ST_GeomFromText('LINESTRING(94.7660 27.6500, 95.0400 27.8200, 95.3262 28.0661)', 4326),
    5, 'state_highway', 30, 'gravel', 8, 9),
( 9, 'NH-13 Aalo–Pasighat (mountain cut)',
    ST_GeomFromText('LINESTRING(94.8097 28.1697, 95.0500 28.1400, 95.2000 28.1000, 95.3262 28.0661)', 4326),
    5, 'national_highway', 22, 'damaged', 7, 9),
(10, 'Pasighat–Yingkiong (Siang gorge)',
    ST_GeomFromText('LINESTRING(95.3262 28.0661, 95.1800 28.3500, 95.0200 28.6490)', 4326),
    6, 'state_highway', 20, 'gravel', 9, 10),
(11, 'Yingkiong–Mariyang',
    ST_GeomFromText('LINESTRING(95.0200 28.6490, 95.1760 28.5000)', 4326),
    6, 'district_road', 18, 'earthen', 10, 11),
(12, 'Aalo–Yingkiong (high ridge)',
    ST_GeomFromText('LINESTRING(94.8097 28.1697, 94.9000 28.4000, 95.0200 28.6490)', 4326),
    6, 'district_road', 16, 'earthen', 7, 10),
(13, 'Pasighat–Roing',
    ST_GeomFromText('LINESTRING(95.3262 28.0661, 95.5800 28.1000, 95.8430 28.1450)', 4326),
    7, 'state_highway', 28, 'paved', 9, 12),
(14, 'Roing–Anini (Dibang Valley spur)',
    ST_GeomFromText('LINESTRING(95.8430 28.1450, 95.8600 28.3600, 95.8800 28.5800, 95.8960 28.7980)', 4326),
    8, 'district_road', 15, 'gravel', 12, 13),
(15, 'Roing–Tezu',
    ST_GeomFromText('LINESTRING(95.8430 28.1450, 96.0000 28.0400, 96.1630 27.9250)', 4326),
    9, 'state_highway', 30, 'paved', 12, 14),
(16, 'Tezu–Hayuliang (Anjaw approach)',
    ST_GeomFromText('LINESTRING(96.1630 27.9250, 96.3500 28.0000, 96.5460 28.0730)', 4326),
    10, 'district_road', 18, 'gravel', 14, 15),
(17, 'Tezu–Namsai',
    ST_GeomFromText('LINESTRING(96.1630 27.9250, 96.0200 27.8000, 95.8640 27.6670)', 4326),
    11, 'state_highway', 34, 'paved', 14, 16),
(18, 'Pasighat–Namsai (Noa-Dihing floodplain)',
    ST_GeomFromText('LINESTRING(95.3262 28.0661, 95.6000 27.8600, 95.8640 27.6670)', 4326),
    11, 'state_highway', 28, 'damaged', 9, 16),
(19, 'Namsai–Changlang',
    ST_GeomFromText('LINESTRING(95.8640 27.6670, 95.8000 27.4000, 95.7340 27.1250)', 4326),
    12, 'state_highway', 30, 'paved', 16, 17),
(20, 'Changlang–Khonsa',
    ST_GeomFromText('LINESTRING(95.7340 27.1250, 95.6500 27.0700, 95.5670 27.0170)', 4326),
    13, 'state_highway', 26, 'paved', 17, 18),
(21, 'Tezu–Changlang',
    ST_GeomFromText('LINESTRING(96.1630 27.9250, 95.9500 27.5200, 95.7340 27.1250)', 4326),
    12, 'district_road', 22, 'gravel', 14, 17),
(22, 'Itanagar–Seppa (NH-13 west)',
    ST_GeomFromText('LINESTRING(93.6053 27.0844, 93.3200 27.1800, 93.0330 27.2830)', 4326),
    14, 'national_highway', 28, 'paved', 1, 19),
(23, 'Seppa–Bhalukpong',
    ST_GeomFromText('LINESTRING(93.0330 27.2830, 92.8400 27.1500, 92.6450 27.0110)', 4326),
    14, 'state_highway', 24, 'gravel', 19, 20),
(24, 'Itanagar–Bhalukpong (foothill alternate)',
    ST_GeomFromText('LINESTRING(93.6053 27.0844, 93.1200 27.0500, 92.6450 27.0110)', 4326),
    15, 'state_highway', 32, 'paved', 1, 20),
(25, 'Bhalukpong–Bomdila',
    ST_GeomFromText('LINESTRING(92.6450 27.0110, 92.5200 27.1400, 92.4070 27.2610)', 4326),
    15, 'national_highway', 22, 'paved', 20, 21),
(26, 'Bomdila–Dirang',
    ST_GeomFromText('LINESTRING(92.4070 27.2610, 92.3300 27.3050, 92.2500 27.3500)', 4326),
    15, 'national_highway', 20, 'paved', 21, 22),
(27, 'Dirang–Sela Pass',
    ST_GeomFromText('LINESTRING(92.2500 27.3500, 92.1800 27.4300, 92.1000 27.5100)', 4326),
    16, 'national_highway', 16, 'damaged', 22, 24),
(28, 'Sela Pass–Tawang',
    ST_GeomFromText('LINESTRING(92.1000 27.5100, 91.9800 27.5500, 91.8650 27.5860)', 4326),
    16, 'national_highway', 18, 'paved', 24, 23);



INSERT INTO hazard_zones (name, hazard_type, severity, geometry, source) VALUES
('Siang floodplain near Pasighat', 'flood', 'high',
    ST_SetSRID(ST_MakeEnvelope(95.05, 27.70, 95.55, 28.20), 4326),
    'demo_seed'),
('Noa-Dihing flood corridor Namsai', 'flood', 'high',
    ST_SetSRID(ST_MakeEnvelope(95.50, 27.55, 96.05, 27.95), 4326),
    'demo_seed'),
('Sela–Tawang landslide belt', 'landslide', 'critical',
    ST_SetSRID(ST_MakeEnvelope(91.80, 27.40, 92.30, 27.65), 4326),
    'demo_seed'),
('Bomdila–Dirang landslide belt', 'landslide', 'high',
    ST_SetSRID(ST_MakeEnvelope(92.20, 27.22, 92.45, 27.40), 4326),
    'demo_seed'),
('Roing–Anini gorge landslide zone', 'landslide', 'critical',
    ST_SetSRID(ST_MakeEnvelope(95.82, 28.20, 95.95, 28.85), 4326),
    'demo_seed'),
('Ziro–Daporijo monsoon slip zone', 'landslide', 'medium',
    ST_SetSRID(ST_MakeEnvelope(93.80, 27.55, 94.25, 28.00), 4326),
    'demo_seed');




INSERT INTO facilities (id, type, name, geometry, district_id, priority, population_served, operating_status) VALUES
( 1, 'hospital',   'TRIHMS Naharlagun',
    ST_SetSRID(ST_MakePoint(93.6962, 27.1051), 4326), 1,  'emergency', 280000, 'operational'),
( 2, 'warehouse',  'FCI Warehouse Itanagar',
    ST_SetSRID(ST_MakePoint(93.6065, 27.0855), 4326), 1,  'high',      350000, 'operational'),
( 3, 'hospital',   'District Hospital Pasighat',
    ST_SetSRID(ST_MakePoint(95.3274, 28.0672), 4326), 5,  'emergency', 120000, 'operational'),
( 4, 'hospital',   'District Hospital Tawang',
    ST_SetSRID(ST_MakePoint(91.8662, 27.5872), 4326), 16, 'emergency',  45000, 'operational'),
( 5, 'hospital',   'District Hospital Tezu',
    ST_SetSRID(ST_MakePoint(96.1642, 27.9261), 4326), 9,  'high',       80000, 'operational'),
( 6, 'phc',        'Community Health Centre Anini',
    ST_SetSRID(ST_MakePoint(95.8971, 28.7988), 4326), 8,  'high',       18000, 'limited'),
( 7, 'hospital',   'General Hospital Aalo',
    ST_SetSRID(ST_MakePoint(94.8108, 28.1706), 4326), 4,  'high',       90000, 'operational'),
( 8, 'warehouse',  'Civil Supply Godown Pasighat',
    ST_SetSRID(ST_MakePoint(95.3250, 28.0650), 4326), 5,  'high',      150000, 'operational'),
( 9, 'hospital',   'District Hospital Bomdila',
    ST_SetSRID(ST_MakePoint(92.4081, 27.2620), 4326), 15, 'high',       55000, 'operational'),
(10, 'phc',        'District Hospital Ziro',
    ST_SetSRID(ST_MakePoint(93.8324, 27.5474), 4326), 2,  'medium',     70000, 'operational');



INSERT INTO stakeholders (id, name, role, organization, district_id, phone, email) VALUES
(1, 'Tana Tage',           'District Magistrate',     'Papum Pare District Administration', 1,  '+91-360-2210001', 'dm.papumpare@arunachal.gov.in'),
(2, 'Omem Moyong',         'DDMA Officer',            'East Siang DDMA',                    5,  '+91-368-2221002', 'ddma.eastsiang@arunachal.gov.in'),
(3, 'Rinchin Tsering',     'DDMA Officer',            'Tawang DDMA',                       16,  '+91-378-2221003', 'ddma.tawang@arunachal.gov.in'),
(4, 'Mibi Ete',            'PWD Divisional Officer',  'PWD Roing',                          7,  '+91-380-2221004', 'pwd.roing@arunachal.gov.in'),
(5, 'Dr. Nyage Lollen',    'CMO',                     'District Hospital Tezu',             9,  '+91-380-2221005', 'cmo.tezu@arunachal.gov.in'),
(6, 'F.C.I. Duty Officer', 'Warehouse Manager',       'FCI Itanagar',                       1,  '+91-360-2210006', 'fci.itanagar@nic.in'),
(7, 'Capt. Tsering',       'Convoy Lead',             'Essential Supplies Cell',            1,  '+91-360-2210007', 'convoy.nera@arunachal.gov.in'),
(8, 'Field Unit Anini',    'CHC In-charge',           'Health Department Dibang Valley',    8,  '+91-380-2221008', 'chc.anini@arunachal.gov.in');

INSERT INTO vehicles (id, registration_no, vehicle_type, capacity_kg, home_district_id, status) VALUES
(1, 'AR-01-G-1101', 'reefer_truck',  8000, 1,  'moving'),
(2, 'AR-01-G-1102', 'truck',        12000, 1,  'moving'),
(3, 'AR-14-G-2201', 'ambulance',      800, 16, 'stopped'),
(4, 'AR-09-G-3301', 'truck',         9000, 5,  'moving'),
(5, 'AR-12-G-4401', '4x4',           1500, 8,  'idle');



INSERT INTO routes (id, name, road_segment_ids) VALUES
(1, 'Itanagar → Pasighat via Ziro–Aalo (NH-13)',ARRAY[1,3,4,5,6,9]),
(2, 'Itanagar → Pasighat via Likabali foothills',ARRAY[1,3,4,5,6,7,8]),
(3, 'Pasighat → Anini via Roing',ARRAY[13,14]),
(4, 'Itanagar → Tawang via Bhalukpong–Sela',ARRAY[24,25,26,27,28]),
(5, 'Itanagar → Tawang via Seppa',ARRAY[22,23,25,26,27,28]),
(6, 'Itanagar → Tezu via Pasighat–Roing',ARRAY[1,3,4,5,6,9,13,15]),
(7, 'Pasighat → Tezu via Namsai floodplain',ARRAY[18,17]),
(8, 'Itanagar FCI → Ziro PHC',ARRAY[1,3,4]),
(9, 'Pasighat godown → Aalo hospital',ARRAY[9]);



INSERT INTO risk_snapshots (
    road_segment_id, "timestamp", rainfall_score, flood_risk, landslide_risk,
    road_condition_score, total_risk, model_version
)
SELECT
    id,
    TIMESTAMPTZ '2026-08-26 06:00:00+05:30',
    CASE id
        WHEN 8 THEN 0.71 WHEN 14 THEN 0.64 WHEN 18 THEN 0.78 WHEN 27 THEN 0.55
        WHEN 5 THEN 0.48 WHEN 9 THEN 0.42 ELSE 0.18
    END,
    CASE id
        WHEN 8 THEN 0.66 WHEN 18 THEN 0.74 WHEN 17 THEN 0.41 ELSE 0.12
    END,
    CASE id
        WHEN 14 THEN 0.86 WHEN 27 THEN 0.81 WHEN 26 THEN 0.62 WHEN 12 THEN 0.58
        WHEN 5 THEN 0.51 WHEN 25 THEN 0.44 ELSE 0.14
    END,
    CASE id
        WHEN 5 THEN 0.55 WHEN 9 THEN 0.48 WHEN 14 THEN 0.50 WHEN 18 THEN 0.46
        WHEN 27 THEN 0.52 ELSE 0.20
    END,
    CASE id
        WHEN 14 THEN 0.82 WHEN 27 THEN 0.78 WHEN 18 THEN 0.71 WHEN 8 THEN 0.61
        WHEN 26 THEN 0.58 WHEN 5 THEN 0.49 WHEN 9 THEN 0.45 WHEN 12 THEN 0.52
        ELSE 0.22
    END,
    'rules-v1'
FROM road_segments;

INSERT INTO risk_snapshots (
    road_segment_id, "timestamp", rainfall_score, flood_risk, landslide_risk,
    road_condition_score, total_risk, model_version
) VALUES
(14, '2026-08-25 18:00:00+05:30', 0.50, 0.18, 0.70, 0.44, 0.66, 'rules-v1'),
(18, '2026-08-25 18:00:00+05:30', 0.62, 0.58, 0.20, 0.40, 0.55, 'rules-v1'),
(27, '2026-08-25 18:00:00+05:30', 0.40, 0.10, 0.68, 0.48, 0.61, 'rules-v1');


INSERT INTO incidents (
    id, road_segment_id, type, severity, geometry, reported_by, reported_at,
    description, photo_url, verified, resolution_time, resolved_at
) VALUES
(1, 14, 'landslide', 'critical',
    ST_SetSRID(ST_MakePoint(95.872, 28.510), 4326),
    'Field Unit Anini', '2026-08-24 07:15:00+05:30',
    'Debris slide covering single-lane Roing–Anini road near Hunli. One-way blocked.',
    'https://demo.nera.local/photos/inc-001-anini-slide.jpg', TRUE, NULL, NULL),
(2, 27, 'landslide', 'high',
    ST_SetSRID(ST_MakePoint(92.165, 27.455), 4326),
    'PWD Bomdila', '2026-08-25 05:40:00+05:30',
    'Sela approach: rockfall after overnight rain. Traffic held at Dirang.',
    'https://demo.nera.local/photos/inc-002-sela-rockfall.jpg', TRUE, NULL, NULL),
(3, 18, 'flood', 'high',
    ST_SetSRID(ST_MakePoint(95.610, 27.850), 4326),
    'DDMA East Siang', '2026-08-25 14:10:00+05:30',
    'Noa-Dihing overtopping at chainage near Namsai–Pasighat link. Water 0.6 m on carriageway.',
    'https://demo.nera.local/photos/inc-003-namsai-flood.jpg', TRUE, NULL, NULL),
(4, 26, 'fallen_tree', 'medium',
    ST_SetSRID(ST_MakePoint(92.330, 27.305), 4326),
    'Forest Beat Dirang', '2026-08-23 09:00:00+05:30',
    'Pine fallen across Bomdila–Dirang. Half carriageway cleared.',
    'https://demo.nera.local/photos/inc-004-dirang-tree.jpg', TRUE,
    INTERVAL '6 hours', '2026-08-23 15:05:00+05:30'),
(5, 25, 'bridge_damage', 'high',
    ST_SetSRID(ST_MakePoint(92.520, 27.140), 4326),
    'PWD West Kameng', '2026-08-22 16:45:00+05:30',
    'Abutment scour on Bhalukpong–Bomdila climb. 10 t axle limit imposed.',
    'https://demo.nera.local/photos/inc-005-bhalukpong-bridge.jpg', TRUE, NULL, NULL),
(6, 5, 'road_damage', 'medium',
    ST_SetSRID(ST_MakePoint(94.050, 27.780), 4326),
    'PWD Daporijo', '2026-08-21 11:20:00+05:30',
    'Pavement collapse on NH-13 Ziro–Daporijo after piping. Speed 20 km/h.',
    'https://demo.nera.local/photos/inc-006-daporijo-pavement.jpg', TRUE, NULL, NULL),
(7, 2, 'traffic_congestion', 'low',
    ST_SetSRID(ST_MakePoint(93.8170, 27.0700), 4326),
    'Check-gate Banderdewa', '2026-08-26 08:05:00+05:30',
    'Assam–Arunachal gate queue ~40 vehicles. No weather disruption.',
    NULL, TRUE, INTERVAL '90 minutes', '2026-08-26 09:40:00+05:30'),
(8, 8, 'flood', 'medium',
    ST_SetSRID(ST_MakePoint(95.040, 27.820), 4326),
    'Circle Officer Likabali', '2026-08-26 04:30:00+05:30',
    'Siang backwater on Likabali–Pasighat. Light vehicles only.',
    'https://demo.nera.local/photos/inc-008-siang-backwater.jpg', FALSE, NULL, NULL);



INSERT INTO dependencies (
    source_facility_id, target_facility_id, via_road_segment_id,
    type, criticality_weight, redundancy_level
) VALUES
( 6, 5, 14, 'medical_referral',  0.95, 0),  -- Anini CHC → Tezu hospital; single road
( 6, 1, 14, 'medicine_supply',   0.90, 0),  -- Anini medicines via Roing–Anini
( 4, 9, 27, 'medical_referral',  0.85, 0),  -- Tawang → Bomdila; Sela is the choke
( 4, 2, 28, 'medicine_supply',   0.88, 0),
(10, 1,  4, 'medical_referral',  0.70, 1),
( 7, 8,  9, 'food_supply',       0.65, 1),  -- Aalo fed from Pasighat godown (alt: Likabali)
( 3, 8,  NULL, 'food_supply',    0.80, 2),
( 5, 2, 15, 'medicine_supply',   0.75, 1),
( 9, 2, 25, 'medicine_supply',   0.72, 1),
( 1, 2,  1, 'food_supply',       0.60, 2);




INSERT INTO shipments (
    id, origin_facility_id, destination_facility_id, cargo_type, priority_tier,
    vehicle_id, current_route_id, eta, status
) VALUES
(1, 2, 6, 'medicine',           'emergency', 1, 3, '2026-08-27 18:00:00+05:30', 'delayed'),
(2, 2, 4, 'medicine',           'emergency', 3, 4, '2026-08-27 12:00:00+05:30', 'stranded'),
(3, 8, 7, 'food',               'high',      4, 9, '2026-08-26 20:00:00+05:30', 'in_transit'),
(4, 2, 5, 'medicine',           'high',      2, 6, '2026-08-28 09:00:00+05:30', 'planned'),
(5, 2,10, 'food',               'medium',    5, 8, '2026-08-26 16:30:00+05:30', 'in_transit');



INSERT INTO vehicle_tracks (vehicle_id, "timestamp", geometry, speed_kmh, heading, on_route_id, status) VALUES
(1, '2026-08-26 09:00:00+05:30', ST_SetSRID(ST_MakePoint(93.6053, 27.0844), 4326), 0,  90,  3, 'stopped'),
(1, '2026-08-26 11:00:00+05:30', ST_SetSRID(ST_MakePoint(93.8313, 27.5465), 4326), 28, 45,  3, 'moving'),
(1, '2026-08-26 14:30:00+05:30', ST_SetSRID(ST_MakePoint(94.8097, 28.1697), 4326), 24, 80,  3, 'moving'),
(1, '2026-08-26 16:45:00+05:30', ST_SetSRID(ST_MakePoint(95.3262, 28.0661), 4326), 18, 70,  3, 'moving'),
(2, '2026-08-26 08:00:00+05:30', ST_SetSRID(ST_MakePoint(93.6065, 27.0855), 4326), 0, 270,  6, 'idle'),
(2, '2026-08-26 10:15:00+05:30', ST_SetSRID(ST_MakePoint(93.7450, 27.1280), 4326), 32, 20,  6, 'moving'),
(3, '2026-08-26 07:20:00+05:30', ST_SetSRID(ST_MakePoint(92.2500, 27.3500), 4326), 5,  310, 4, 'anomaly'),
(3, '2026-08-26 08:00:00+05:30', ST_SetSRID(ST_MakePoint(92.1800, 27.4300), 4326), 0,  310, 4, 'stopped'),
(4, '2026-08-26 12:00:00+05:30', ST_SetSRID(ST_MakePoint(95.2000, 28.1000), 4326), 22, 280, 9, 'moving'),
(4, '2026-08-26 13:10:00+05:30', ST_SetSRID(ST_MakePoint(94.8097, 28.1697), 4326), 15, 300, 9, 'moving'),
(5, '2026-08-26 09:30:00+05:30', ST_SetSRID(ST_MakePoint(93.6950, 27.1040), 4326), 35, 15,  8, 'moving'),
(5, '2026-08-26 11:45:00+05:30', ST_SetSRID(ST_MakePoint(93.8313, 27.5465), 4326), 12, 10,  8, 'moving');




INSERT INTO route_candidates (
    shipment_id, route_id, total_distance_km, eta_hours,
    risk_score, impact_score, combined_score, rank
) VALUES
(1, 3,  95.0,  7.5,  0.82, 0.91, 2.48, 1),
(2, 4, 180.0,  9.2,  0.78, 0.70, 2.20, 1),
(2, 5, 210.0, 11.0,  0.74, 0.68, 2.35, 2),
(3, 9,  55.0,  2.4,  0.45, 0.30, 1.05, 1),
(3, 2,  72.0,  3.1,  0.40, 0.22, 1.18, 2),
(4, 6, 310.0, 14.0,  0.50, 0.55, 1.85, 1),
(4, 7,  88.0,  4.2,  0.71, 0.48, 1.92, 2),
(5, 8,  85.0,  3.2,  0.28, 0.15, 0.72, 1);


INSERT INTO alerts (
    type, severity, target_stakeholder_id, road_segment_id, facility_id,
    message, sent_at, channel, status
) VALUES
('road_closure', 'critical', 4, 14, 6,
    'Roing–Anini (segment 14) blocked by landslide. CHC Anini is a single-road facility. Hold non-emergency convoys.',
    '2026-08-24 07:40:00+05:30', 'sms', 'acknowledged'),
('facility_isolation', 'critical', 8, 14, 6,
    'CHC Anini projected isolated if debris is not cleared within 6 h. Medicine shipment SHP-1 delayed.',
    '2026-08-24 07:45:00+05:30', 'in_app', 'acknowledged'),
('road_risk', 'high', 3, 27, 4,
    'Sela approach landslide risk 0.81. District Hospital Tawang supply window narrowing.',
    '2026-08-25 06:00:00+05:30', 'sms', 'sent'),
('incident', 'high', 2, 18, NULL,
    'Pasighat–Namsai floodplain overtopped. Prefer Roing–Tezu for east-bound essential cargo.',
    '2026-08-25 14:25:00+05:30', 'in_app', 'sent'),
('shipment_delay', 'high', 7, 27, 4,
    'Ambulance AR-14-G-2201 stopped on Dirang–Sela. Status=stranded. Reroute via waiting, not Seppa (same choke).',
    '2026-08-26 08:10:00+05:30', 'push', 'sent'),
('weather', 'medium', 1, 8, NULL,
    'Siang backwater on Likabali–Pasighat. Unverified field report queued for PWD confirmation.',
    '2026-08-26 04:50:00+05:30', 'email', 'pending');


-- Keep serial counters in sync with explicit ids
SELECT setval(pg_get_serial_sequence('districts', 'id'),(SELECT MAX(id) FROM districts));
SELECT setval(pg_get_serial_sequence('road_segments', 'id'),(SELECT MAX(id) FROM road_segments));
SELECT setval(pg_get_serial_sequence('facilities', 'id'),(SELECT MAX(id) FROM facilities));
SELECT setval(pg_get_serial_sequence('stakeholders', 'id'),(SELECT MAX(id) FROM stakeholders));
SELECT setval(pg_get_serial_sequence('vehicles', 'id'),(SELECT MAX(id) FROM vehicles));
SELECT setval(pg_get_serial_sequence('routes', 'id'),(SELECT MAX(id) FROM routes));
SELECT setval(pg_get_serial_sequence('incidents', 'id'),(SELECT MAX(id) FROM incidents));
SELECT setval(pg_get_serial_sequence('shipments', 'id'),(SELECT MAX(id) FROM shipments));

COMMIT;

SELECT 'districts' AS entity, COUNT(*) FROM districts
UNION ALL SELECT 'road_nodes', COUNT(*) FROM road_nodes
UNION ALL SELECT 'road_segments',COUNT(*) FROM road_segments
UNION ALL SELECT 'facilities', COUNT(*) FROM facilities
UNION ALL SELECT 'incidents', COUNT(*) FROM incidents
UNION ALL SELECT 'hazard_zones', COUNT(*) FROM hazard_zones
UNION ALL SELECT 'risk_snapshots',COUNT(*) FROM risk_snapshots
UNION ALL SELECT 'dependencies', COUNT(*) FROM dependencies
UNION ALL SELECT 'shipments', COUNT(*) FROM shipments;
