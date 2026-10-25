.DEFAULT_GOAL := help

NPM ?= npm
DOCKER_COMPOSE ?= docker compose

.PHONY: help setup run build test test-unit test-e2e test-e2e-ui lint preview docker-up docker-down docker-logs

help:
	@echo "GolGirls frontend — comandos disponíveis:"
	@echo "  make setup        Instala as dependências"
	@echo "  make run          Inicia o Vite em desenvolvimento"
	@echo "  make build         Valida tipos e gera build de produção"
	@echo "  make test          Executa todos os testes"
	@echo "  make test-unit     Executa os testes unitários"
	@echo "  make test-e2e      Executa os testes de integração"
	@echo "  make test-e2e-ui   Executa os testes Playwright"
	@echo "  make lint          Executa o ESLint"
	@echo "  make preview       Inicia o preview da build"
	@echo "  make docker-up     Constrói e inicia o frontend no Docker"
	@echo "  make docker-down   Para os containers sem remover volumes"
	@echo "  make docker-logs   Acompanha os logs do frontend"

setup:
	$(NPM) install

run:
	$(NPM) run dev

build:
	$(NPM) run build

test:
	$(NPM) test

test-unit:
	$(NPM) run test:unit

test-e2e:
	$(NPM) run test:e2e

test-e2e-ui:
	$(NPM) run test:e2e:ui

lint:
	$(NPM) run lint

preview:
	$(NPM) run preview

docker-up:
	$(DOCKER_COMPOSE) up --build -d

docker-down:
	$(DOCKER_COMPOSE) down

docker-logs:
	$(DOCKER_COMPOSE) logs -f web
