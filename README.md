# Tax Calculator — Final Project

A small Node.js/Express Tax Calculator web app, containerized with Docker, deployed to
IBM Cloud, and built/deployed through a Tekton CI/CD pipeline.

This README gives you **every command**, in order, for all 10 graded tasks. Run these
yourself in your terminal / IBM Cloud Shell so your submitted terminal output and
screenshots are genuine (the evaluator checks for your own evidence).

---

## 0. One-time setup

```bash
# Unzip the project (if you downloaded the zip) and enter it
unzip tax-calculator.zip
cd tax-calculator

# Push it to your own GitHub repo (needed for Tasks 7 & 8)
git init
git add .
git commit -m "Initial commit: Tax Calculator app"
git branch -M main
git remote add origin https://github.com/<your-username>/tax-calculator.git
git push -u origin main
```

---

## Task 1 — Run unit tests using Jasmine (1 pt)

```bash
npm install
npm test
```

Expected output looks like:
```
Started
.........

9 specs, 0 failures
Finished in 0.0XX seconds
```

Save this terminal output (screenshot or copy/paste) as your Task 1 submission.

---

## Task 2 — Create the Dockerfile (1 pt)

Already created for you at `./Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]
```

Submit the contents of this file (and/or its GitHub URL) for Task 2.

---

## Task 3 — Build the Docker image (1 pt)

```bash
docker build -t tax-calculator:1.0 .
docker images | grep tax-calculator
```

Save this terminal output.

---

## Task 4 — Deploy and test the app in a Docker container (1 pt)

```bash
docker run -d --name tax-calculator -p 8080:8080 tax-calculator:1.0
docker ps
curl http://localhost:8080/health
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"income":55000}'
```

Or open `http://localhost:8080` in your browser and use the form.

Save this terminal output as **04-docker-image** (must show the container running and
listening on port 8080).

---

## Task 5 — Tag and push to IBM Cloud Container Registry (1 pt)

```bash
# Log in to IBM Cloud and target your container registry region
ibmcloud login --sso
ibmcloud cr login
ibmcloud cr region-set us-south      # or your chosen region

# Create a namespace once (skip if it already exists)
ibmcloud cr namespace-add <my-namespace>

# Tag and push
docker tag tax-calculator:1.0 us.icr.io/<my-namespace>/tax-calculator:1.0
docker push us.icr.io/<my-namespace>/tax-calculator:1.0

# Verify
ibmcloud cr image-list
```

Save this terminal output as **05-docker-icr-push**.

---

## Task 6 — Deploy the Tax Calculator on IBM Cloud (1 pt)

Using IBM Cloud Code Engine (recommended, simplest path):

```bash
ibmcloud ce project create --name tax-calculator-project
ibmcloud ce project select --name tax-calculator-project

ibmcloud ce application create \
  --name tax-calculator \
  --image us.icr.io/<my-namespace>/tax-calculator:1.0 \
  --registry-secret ibm-container-registry \
  --port 8080

ibmcloud ce application get --name tax-calculator
```

The output includes a public URL — open it in your browser to confirm the app loads.

Save this terminal output as **06-deployed-on-cloud**.

(If your course uses IKS/Kubernetes instead of Code Engine, use `kubectl create
deployment`, `kubectl expose`, and `kubectl get svc` — same idea, different CLI.)

---

## Task 7 — Create the Tekton Pipeline tasks (1 pt)

Already created at `./tekton/tasks.yaml` — defines two custom `Task`s: `npm-install`
and `jasmine-test`.

```bash
kubectl apply -f tekton/tasks.yaml
kubectl get tasks
```

Push this file to GitHub, then submit the public URL, e.g.:
`https://github.com/<your-username>/tax-calculator/blob/main/tekton/tasks.yaml`

---

## Task 8 — Extend the Pipeline to call required tasks (1 pt)

Already created at `./tekton/pipeline.yaml` — chains `fetch-repository` (git-clone) →
`npminstall` → `tests` → `build` (buildah, pushes the image).

```bash
kubectl apply -f tekton/pipeline.yaml
kubectl get pipeline tax-calculator-pipeline
```

Submit the public GitHub URL, e.g.:
`https://github.com/<your-username>/tax-calculator/blob/main/tekton/pipeline.yaml`

---

## Task 9 — Run the Tekton pipeline (1 pt)

```bash
tkn pipeline start tax-calculator-pipeline \
  -w name=pipeline-ws,claimName=<your-pvc-name> \
  -p repo-url=https://github.com/<your-username>/tax-calculator.git \
  -p revision=main \
  -p image-name=us.icr.io/<my-namespace>/tax-calculator:pipeline \
  --showlog
```

Watch the log — it should run `fetch-repository`, `npminstall`, `tests`, then `build`,
each finishing with no errors. Save this terminal output for your own records.

```bash
tkn pipelinerun list
tkn pipelinerun logs --last
```

---

## Task 10 — Deploy the image built using the pipeline (1 pt)

```bash
ibmcloud ce application update \
  --name tax-calculator \
  --image us.icr.io/<my-namespace>/tax-calculator:pipeline

ibmcloud ce application get --name tax-calculator
```

Open the returned URL in your browser, confirm the Tax Calculator UI loads and works,
and take a screenshot. Save it as **10-final-output.png**.

---

## Project structure

```
tax-calculator/
├── server.js              # Express server (port 8080)
├── taxCalculator.js        # Core tax logic (unit-tested)
├── package.json
├── public/
│   └── index.html          # Frontend UI
├── spec/
│   └── taxCalculator.spec.js  # Jasmine unit tests
├── support/
│   └── jasmine.json         # Jasmine config
├── Dockerfile
├── .dockerignore
├── .gitignore
├── tekton/
│   ├── tasks.yaml           # npm-install + jasmine-test Tekton Tasks
│   └── pipeline.yaml        # Full pipeline: clone -> install -> test -> build
└── evidence/                # put your terminal-output / screenshot files here
```

## Local quick-start (no Docker)

```bash
npm install
npm start
# open http://localhost:8080
```
