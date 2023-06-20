
SELECT 'CREATE DATABASE users_p'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'users_p')/gexec