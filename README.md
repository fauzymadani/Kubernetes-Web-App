# KubeApp — a tiny app for learning Kubernetes with minikube

A single-page Node.js/Express app that shows its pod name, a timestamp, a
visit counter, and a message from a ConfigMap. The point isn't the app — it's
practicing the Kubernetes workflow: build → load → deploy → scale → delete.

## Prerequisites

- [minikube](https://minikube.sigs.k8s.io/) running with the Docker driver
- `kubectl` (ships with minikube as `minikube kubectl --`)
- Docker

Start your cluster if it isn't already:

```bash
minikube start --driver=docker
```

## 1. Build the image so minikube can use it

Because you use the **Docker driver**, minikube runs inside its own Docker
daemon — a separate Docker from the one on your laptop. An image you build
normally won't be visible to the cluster. Two ways to fix that; pick one.

**Option A — point your Docker CLI at minikube's daemon, then build there:**

```bash
eval $(minikube docker-env)     # makes `docker` talk to minikube's Docker
docker build -t kubeapp:1.0.0 . # image is built straight into the cluster
eval $(minikube docker-env -u)  # (optional) point Docker back at your laptop
```

`minikube docker-env` prints environment variables; `eval` applies them to
your current shell. The `-u` undoes it.

**Option B — build locally, then copy the image into minikube:**

```bash
docker build -t kubeapp:1.0.0 .
minikube image load kubeapp:1.0.0
```

Either way, the manifest uses `imagePullPolicy: IfNotPresent` so Kubernetes
uses this local image instead of trying to download one from the internet.

## 2. Deploy with kubectl

`kubectl apply` sends the manifests to the cluster, which creates everything
in `k8s.yaml`: the ConfigMap, the Deployment (2 pods), and the Service.

```bash
kubectl apply -f k8s.yaml
```

Watch the pods come up (Ctrl-C to stop watching):

```bash
kubectl get pods -w
```

Wait until both show `READY 1/1` and `STATUS Running`. The readiness probe
hits `/health`; a pod only receives traffic once that returns 200.

## 3. Open it in the browser

A **NodePort** Service exposes the app on a port on the cluster node.
`minikube service` finds that port and opens a working URL for you (with the
Docker driver it also sets up the tunnel needed to reach it):

```bash
minikube service kubeapp
```

Refresh the page a few times — the visit counter goes up.

## 4. Scale up and down

A Deployment keeps a set number of identical pods running. Change that number
and Kubernetes adds or removes pods to match:

```bash
kubectl scale deployment kubeapp --replicas=4   # scale up
kubectl get pods                                # now 4 pods
kubectl scale deployment kubeapp --replicas=1   # scale down
```

The Service load-balances across the running pods. Refresh the browser
repeatedly and the **Pod / hostname** line changes as different pods answer —
that's the load balancer in action. (Tip: a hard refresh or curl shows it
best, since browsers reuse connections.)

```bash
# see it from the terminal:
URL=$(minikube service kubeapp --url)
for i in $(seq 6); do curl -s $URL | grep -o 'kubeapp-[a-z0-9-]*'; done
```

## 5. Clean up

Delete everything defined in the manifest:

```bash
kubectl delete -f k8s.yaml
```

To tear down the whole cluster too:

```bash
minikube stop      # pause it (keeps state)
minikube delete    # remove it entirely
```

## Quick reference

| Command | What it does |
|---|---|
| `kubectl apply -f k8s.yaml` | Create/update resources from the file |
| `kubectl get pods` | List pods and their status |
| `kubectl logs <pod>` | Print a pod's logs |
| `kubectl scale deployment kubeapp --replicas=N` | Set pod count |
| `kubectl delete -f k8s.yaml` | Delete the resources |
| `minikube service kubeapp` | Open the NodePort service in a browser |
