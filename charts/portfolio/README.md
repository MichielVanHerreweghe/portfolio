# portfolio Helm chart

Deploys the personal portfolio static site — an Astro build served by
[`nginx-unprivileged`](https://github.com/nginxinc/docker-nginx-unprivileged) on
port `8080`.

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

## Hardening

The chart ships secure-by-default settings:

- runs as the non-root `nginx` user (uid/gid `101`), `runAsNonRoot: true`
- `readOnlyRootFilesystem: true` with an `emptyDir` mounted at `/tmp` for
  nginx's pid and temp files
- all Linux capabilities dropped, `allowPrivilegeEscalation: false`,
  `seccompProfile: RuntimeDefault`
- ServiceAccount token is **not** mounted (the static site needs no API access)
- a `PodDisruptionBudget` keeping at least one replica during voluntary disruptions
- a default-deny `CiliumNetworkPolicy`: **all egress is blocked**, and ingress is
  allowed only from the Gateway data-plane Pods (plus kubelet health probes)

## Exposure (Gateway API)

The site is exposed with the [Gateway API](https://gateway-api.sigs.k8s.io/) via an
`HTTPRoute` (not an Ingress). A `Gateway` and the Gateway API CRDs must already exist
in the cluster. Enable and point the route at your Gateway:

```yaml
gateway:
  enabled: true
  parentRefs:
    - name: portfolio-gateway
      namespace: gateway-system
      sectionName: https
  hostnames:
    - portfolio.example.com
```

## Network policy (Cilium)

`ciliumNetworkPolicy` is **enabled by default** and uses `enableDefaultDeny` for both
directions. Egress is fully denied (a static server initiates nothing); ingress is
restricted to the Gateway's Pods. Set the selector to match your Gateway's data-plane
Pods — for Cilium's own Gateway API implementation these are the `cilium-gateway-<name>`
Pods in the Gateway's namespace:

```yaml
ciliumNetworkPolicy:
  ingress:
    fromGateway:
      endpointSelector:
        matchLabels:
          k8s:io.kubernetes.pod.namespace: gateway-system
          io.cilium.gateway/owning-gateway: portfolio-gateway
```

Need outbound (e.g. once a backend is added)? Flip `egress.allowDNS: true` and add
rules under `egress.extra`.

## Common values

| Key | Default | Description |
| --- | --- | --- |
| `replicaCount` | `2` | Replicas (ignored when autoscaling is on). |
| `image.repository` | `ghcr.io/michielvanherreweghe/portfolio-frontend` | Image repo. |
| `image.tag` | `""` | Defaults to the chart `appVersion`. |
| `service.type` | `ClusterIP` | Service type. |
| `service.port` | `80` | Service port (targets container `8080`). |
| `gateway.enabled` | `false` | Expose via Gateway API (HTTPRoute). |
| `gateway.parentRefs` | `portfolio-gateway` | Parent Gateway/listener(s). |
| `gateway.hostnames` | `portfolio.example.com` | Route hostnames. |
| `autoscaling.enabled` | `false` | Enable HPA. |
| `podDisruptionBudget.enabled` | `true` | Create a PDB. |
| `ciliumNetworkPolicy.enabled` | `true` | Default-deny CiliumNetworkPolicy. |
| `ciliumNetworkPolicy.egress.allowDNS` | `false` | Allow DNS egress (else all egress denied). |
| `resources` | `10m`/`32Mi` req, `64Mi` mem limit | Resource requests/limits. |

See [values.yaml](values.yaml) for the full list.

## Test

```sh
helm test portfolio --namespace portfolio
```
