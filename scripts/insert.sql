INSERT INTO
    tasks (
        title,
        description,
        status,
        created_at,
        updated_at
    )
SELECT
    'Task ' || gs AS title,
    'Description for task ' || gs AS description,
    (
        (
            ARRAY['OPEN', 'IN_PROGRESS', 'DONE']
        ) [1 + (random() * 2)::int]
    )::taskstatus AS status,
    now() - (random() * interval '30 days') AS created_at,
    now() - (random() * interval '30 days') AS updated_at
FROM generate_series(1, 100) AS gs;