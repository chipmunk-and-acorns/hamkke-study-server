#!/bin/bash

# 데이터베이스가 있는지 확인하고, 없으면 생성하도록 함
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'hamkke'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE hamkke"

# 데이터베이스에 init.sql 적용
psql -U postgres -d hamkke -f /docker-entrypoint-initdb.d/init.sql
