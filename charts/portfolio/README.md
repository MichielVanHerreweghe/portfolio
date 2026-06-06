# portfolio Helm chart

Deploys the personal portfolio as three independently-toggleable components:

- **frontend** — the Astro build served by
  [`nginx-unprivileged`](https://github.com/nginxinc/docker-nginx-unprivileged) on
  port `8080`.
- **backend** — the .NET API (`Portfolio.Api`, FastEndpoints) on port `8080`,
  with non-sensitive config in a `ConfigMap` and secrets sourced via the
  [External Secrets Operator](https://external-secrets.io/).
- **cache** — an in-cluster [DragonflyDB](https://www.dragonflydb.io/) instance
  provisioned through the [Dragonfly operator](https://github.com/dragonflydb/dragonfly-operator).
  Redis-protocol compatible; the backend connects to it unchanged.

The frontend and backend each have their own image, `Deployment`, `Service`, scaling,
`PodDisruptionBudget`, `CiliumNetworkPolicy` and optional `HTTPRoute`. Disable any
component with `frontend.enabled=false` / `backend.enabled=false` / `cache.enabled=false`.

> **Breaking change (v2):** all values are now nested under `frontend:` and
> `backend:`. Previously top-level keys move under `frontend.*`
> (e.g. `image.repository` → `frontend.image.repository`).

## Install

The chart is published as an OCI artifact to GHCR by the release pipeline:

```sh
helm install portfolio oci://ghcr.io/michielvanherreweghe/charts/portfolio \
  --version <chart-version> \
  --namespace portfolio --create-namespace
```

Or from the local checkout:

```sh
helm install portfolio charts/portfolio --namespace portfolio --create-namespace
```

## Backend configuration

The API is configured entirely through environment variables, using the ASP.NET Core
`Section__Key` convention.

### Non-sensitive config (ConfigMap)

`backend.config` is rendered into a `ConfigMap` and injected via `envFrom`. Add or
override keys under `backend.config` (or `backend.extraConfig`):

```yaml
backend:
  config:
    MailService__Host: smtp.example.com
    MailService__Port: "587"
    MailService__Username: no-reply@example.com
    MailService__FromName: Portfolio
    MailService__FromEmailAddress: no-reply@example.com
    MailService__ToName: Michiel
    MailService__ToEmailAddress: me@example.com
    HardcoverService__BaseUrl: https://api.hardcover.app/v1/graphql
    Cache__InstanceName: "portfolio:"
```

A `checksum/config` annotation rolls the backend Pods automatically when this changes.

### Sensitive config (External Secrets)

The mail password and Hardcover API token are **never** put in values. Instead an
`ExternalSecret` (External Secrets Operator) pulls them from your secret provider into a
Kubernetes `Secret`, which the Deployment loads via `envFrom`. Each `secretKey` becomes an
environment variable, so it must use the `Section__Key` convention.

```yaml
backend:
  externalSecret:
    enabled: true
    refreshInterval: 1h
    secretStoreRef:
      name: infisical-store          # required: your Infisical-backed (Cluster)SecretStore
      kind: ClusterSecretStore
    data:
      - secretKey: MailService__Password    # env var name (Section__Key)
        remoteRef:
          key: MAIL_PASSWORD               # secret key/name in Infisical
      - secretKey: HardcoverService__ApiToken
        remoteRef:
          key: HARDCOVER_API_TOKEN
```

> **Infisical:** provision two secrets at the store's configured project / environment /
> `secretsPath`: `MAIL_PASSWORD` (your SMTP password) and `HARDCOVER_API_TOKEN` (your
> Hardcover API token). The project/environment/path live on the `SecretStore`, plus a
> machine-identity (Universal Auth) `clientId`/`clientSecret` it uses to authenticate.

The cache connection string is **not** a secret here: the in-cluster Dragonfly runs without
auth (protected by the network policy), so `ConnectionStrings__cache` is rendered into the
ConfigMap (see [Cache](#cache-dragonflydb)). To use an authenticated/external cache instead,
add a `ConnectionStrings__cache` entry to the `data` above and set it in `backend.config`.

Requires the External Secrets Operator and a `(Cluster)SecretStore` already installed.
On older operators set `backend.externalSecret.apiVersion: external-secrets.io/v1beta1`.

**Already manage the Secret yourself?** Set `backend.externalSecret.enabled=false` and
point the Deployment at it with `backend.existingSecret: my-secret`. The Secret must
contain the same `Section__Key` keys.

## Cache (DragonflyDB)

The `cache` component provisions a [DragonflyDB](https://www.dragonflydb.io/) instance via
the [Dragonfly operator](https://github.com/dragonflydb/dragonfly-operator) (the operator
must already be installed). It renders a `Dragonfly` custom resource; the operator reconciles
a StatefulSet and a `Service` of the same name on port `6379`.

Dragonfly is Redis-protocol compatible, so the backend talks to it with the existing
`StackExchange.Redis` client. The backend's `ConnectionStrings__cache` is derived
automatically as `<cache name>:6379` and written into the backend ConfigMap, and the backend
`CiliumNetworkPolicy` egress (`toCache`) is opened to the Dragonfly Pods by default. The
cache runs **without authentication** — access is constrained by the default-deny network
policy (only the backend Pods may reach `:6379`).

```yaml
cache:
  enabled: true
  name: portfolio-cache     # Service name; backend connects to portfolio-cache:6379
  replicas: 2               # 1 primary + 1 replica, managed by the operator
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      memory: 512Mi
  snapshot:
    enabled: false          # set true + a PVC spec for persistence
  extraSpec: {}             # any extra Dragonfly spec fields (auth, TLS, ...)
```

The cache also gets its own default-deny `CiliumNetworkPolicy` (`cache.ciliumNetworkPolicy`)
selecting the Dragonfly Pods. Ingress to `6379` is allowed only from the backend Pods, the
other Dragonfly Pods (replication), the kubelet (probes), and the **Dragonfly operator** —
the operator connects to each instance to configure primary/replica replication, so its
namespace must be allowed or the `Dragonfly` resource stays unhealthy. Set the operator's
namespace if it isn't the default:

```yaml
cache:
  ciliumNetworkPolicy:
    ingress:
      fromOperator:
        endpointSelector:
          matchLabels:
            k8s:io.kubernetes.pod.namespace: dragonfly-operator-system
```

Not provisioning the cache here (e.g. it lives elsewhere)? Set `cache.enabled=false`, put the
endpoint in `backend.config.ConnectionStrings__cache`, and point
`backend.ciliumNetworkPolicy.egress.toCache.endpointSelector` at the external cache's Pods.

## Hardening

Both components ship secure-by-default settings:

- run as non-root (`runAsNonRoot: true`) — frontend uid/gid `101`, backend uid/gid `1654`
- `readOnlyRootFilesystem: true` with an `emptyDir` mounted at `/tmp`
- all Linux capabilities dropped, `allowPrivilegeEscalation: false`,
  `seccompProfile: RuntimeDefault`
- ServiceAccount token is **not** mounted (neither component needs Kubernetes API access)
- a `PodDisruptionBudget` per component, keeping at least one replica during voluntary disruptions
- a default-deny `CiliumNetworkPolicy` per component

## Exposure (Gateway API)

Each component is exposed with the [Gateway API](https://gateway-api.sigs.k8s.io/) via an
`HTTPRoute` (not an Ingress). A `Gateway` and the Gateway API CRDs must already exist in the
cluster.

```yaml
frontend:
  gateway:
    enabled: true
    parentRefs:
      - name: portfolio-gateway
        namespace: gateway-system
        sectionName: https
    hostnames:
      - portfolio.example.com

backend:
  gateway:
    enabled: true
    parentRefs:
      - name: portfolio-gateway
        namespace: gateway-system
        sectionName: https
    hostnames:
      - api.portfolio.example.com
```

## Network policy (Cilium)

`ciliumNetworkPolicy` is **enabled by default** for both components and uses
`enableDefaultDeny` for both directions. Point `ingress.fromGateway.endpointSelector` at
your Gateway's data-plane Pods (for Cilium's Gateway API these are the
`cilium-gateway-<name>` Pods in the Gateway's namespace).

The **frontend** nginx reverse-proxies same-origin `/api/*` to the backend Service, so its
egress allows (and nothing else):

- DNS to kube-dns (`egress.allowDNS: true`) — needed so nginx can resolve the backend
  Service name at request time (see `nginx.conf`'s `resolver`)
- the in-cluster backend Pods on port `8080` via `egress.toBackend` (on by default; set
  `enabled: false` to lock it down if you expose the backend some other way)

The **backend** needs outbound access, so its egress allows:

- DNS to kube-dns (`egress.allowDNS: true`)
- external services on `egress.toWorldPorts` (defaults: `443` for the Hardcover API,
  `587` for SMTP submission)
- the in-cluster Dragonfly cache via `egress.toCache` (on by default; targets the
  provisioned cache's Pods, or set `endpointSelector` for an external one)

Its ingress allows the frontend's proxied `/api` calls via
`backend.ciliumNetworkPolicy.ingress.fromFrontend.enabled: true` (on by default). The
two halves — frontend `egress.toBackend` and backend `ingress.fromFrontend` — must both
be enabled for the contact form and other `/api/*` calls to work.

The **cache** has its own policy too — see [Cache](#cache-dragonflydb).

## Common values

| Key | Default | Description |
| --- | --- | --- |
| `frontend.enabled` | `true` | Deploy the frontend. |
| `frontend.image.repository` | `ghcr.io/michielvanherreweghe/portfolio-frontend` | Frontend image repo. |
| `frontend.service.port` | `80` | Frontend Service port (targets container `8080`). |
| `frontend.gateway.enabled` | `false` | Expose the frontend via Gateway API. |
| `frontend.ciliumNetworkPolicy.egress.allowDNS` | `true` | Allow DNS so nginx can resolve the backend for the `/api` proxy. |
| `frontend.ciliumNetworkPolicy.egress.toBackend.enabled` | `true` | Allow egress to the backend Pods for the same-origin `/api` proxy. |
| `backend.enabled` | `true` | Deploy the backend API. |
| `backend.image.repository` | `ghcr.io/michielvanherreweghe/portfolio-backend` | Backend image repo. |
| `backend.config` | mail/hardcover/cache keys | Non-sensitive env (ConfigMap). |
| `backend.externalSecret.enabled` | `false` | Create an ExternalSecret for secrets (set a store to enable). |
| `backend.externalSecret.secretStoreRef.name` | `""` | **Required** (Cluster)SecretStore name. |
| `backend.existingSecret` | `""` | Use a pre-existing Secret instead of ESO. |
| `backend.gateway.enabled` | `false` | Expose the backend via Gateway API. |
| `backend.ciliumNetworkPolicy.ingress.fromFrontend.enabled` | `true` | Accept the frontend's proxied `/api` calls. |
| `backend.ciliumNetworkPolicy.egress.toWorldPorts` | `443`, `587` | External egress ports. |
| `cache.enabled` | `true` | Provision a Dragonfly instance via the operator. |
| `cache.name` | `""` | Dragonfly/Service name (defaults to `<fullname>-cache`). |
| `cache.replicas` | `2` | Dragonfly instances (1 primary + replicas). |
| `imagePullSecrets` | `[]` | Pull secrets shared by both components. |

See [values.yaml](values.yaml) for the full list.

## Test

```sh
helm test portfolio --namespace portfolio
```

Runs an HTTP probe against the frontend Service and a TCP reachability check against the
backend Service.
