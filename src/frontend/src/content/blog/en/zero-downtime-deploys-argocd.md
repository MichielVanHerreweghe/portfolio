---
title: "Zero-downtime deploys with ArgoCD and Kubernetes"
description: "How I run GitOps-style rolling deployments on Kubernetes with ArgoCD — readiness gates, surge control, and the health checks that make releases boring."
date: 2026-05-20
tags: ["Kubernetes", "CI/CD", "ArgoCD"]
---

A deployment should be the least interesting part of your day. If shipping a
new version makes the team hold its breath, something upstream is wrong — not
the deploy itself. Here's the setup I reach for to make Kubernetes releases
boring, using **ArgoCD** for GitOps and the platform's own primitives for
safety.

## The shape of a safe rollout

Kubernetes already gives you most of what you need. A `RollingUpdate` strategy
with sensible surge and unavailability bounds means old pods only retire once
new ones are actually serving traffic:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  template:
    spec:
      containers:
        - name: api
          readinessProbe:
            httpGet:
              path: /healthz/ready
              port: 8080
            initialDelaySeconds: 3
            periodSeconds: 5
```

`maxUnavailable: 0` is the line that matters: the rollout never drops below the
desired replica count. New pods must pass their **readiness probe** before they
receive traffic, and only then does an old pod get terminated.

## Let ArgoCD own the desired state

With GitOps, the cluster's desired state lives in Git, and ArgoCD reconciles
reality toward it. A merge to `main` becomes a deploy — no `kubectl apply` from
a laptop, no drift.

> The deploy is a side effect of merging. That's the whole point: the pipeline
> stops being a thing you operate and becomes a thing you review.

ArgoCD's health assessment understands Deployments natively — it won't report
`Healthy` until the rollout has fully progressed. Wire that into a notification
and you get a truthful, after-the-fact signal instead of a hopeful one.

## What actually prevents incidents

- **Readiness probes that test the real dependency path** — not a static `200`.
- **`maxUnavailable: 0`** so capacity never dips mid-rollout.
- **`PodDisruptionBudget`** so node drains and rollouts don't compound.
- **Automated rollback** on a failed sync, so a bad release self-heals.

None of this is exotic. It's the boring, composable defaults — and boring is
exactly what you want when the deploy is the least interesting part of the day.
