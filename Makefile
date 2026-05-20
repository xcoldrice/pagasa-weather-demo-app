#test command

.PHONY: testcommand
testcommand:
	@echo "this is a test command"


#front end build
.PHONY: frontend-build
frontend-build:
	cd frontend && npm install && npm run build

#backend dev

.PHONY: backend-dev
backend-dev:
	@echo "Starting backend development server..."
	cd backend && .venv/bin/uvicorn app.main:app --reload

#frontend dev
.PHONY: frontend-dev
frontend-dev:
	@echo "Starting frontend development server..."
	cd frontend && npm install && npm run dev