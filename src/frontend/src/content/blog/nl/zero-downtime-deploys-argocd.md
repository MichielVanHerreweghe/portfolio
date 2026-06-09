---
title: "Deploys zonder downtime met ArgoCD en Kubernetes"
description: "Hoe ik GitOps-rolling deployments draai op Kubernetes met ArgoCD — readiness-gates, surge-controle en de health checks die releases saai maken."
date: 2026-05-20
tags: ["Kubernetes", "CI/CD", "ArgoCD"]
---

Een deployment hoort het saaiste deel van je dag te zijn. Als het uitrollen van
een nieuwe versie het team de adem doet inhouden, zit er bovenstrooms iets fout
— niet de deploy zelf. Dit is de opstelling waar ik naar grijp om Kubernetes-
releases saai te maken, met **ArgoCD** voor GitOps en de eigen primitieven van
het platform voor veiligheid.

## De vorm van een veilige uitrol

Kubernetes geeft je al het meeste van wat je nodig hebt. Een `RollingUpdate`-
strategie met verstandige surge- en onbeschikbaarheidsgrenzen zorgt ervoor dat
oude pods pas verdwijnen zodra de nieuwe effectief verkeer bedienen:

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

`maxUnavailable: 0` is de regel die telt: de uitrol zakt nooit onder het
gewenste aantal replica's. Nieuwe pods moeten hun **readiness probe** halen
voordat ze verkeer krijgen, en pas dan wordt een oude pod beëindigd.

## Laat ArgoCD de gewenste staat beheren

Met GitOps leeft de gewenste staat van het cluster in Git, en ArgoCD verzoent
de realiteit ernaartoe. Een merge naar `main` wordt een deploy — geen
`kubectl apply` vanaf een laptop, geen drift.

> De deploy is een neveneffect van het mergen. Dat is net het punt: de pipeline
> is niet langer iets dat je bedient maar iets dat je reviewt.

ArgoCD's health-assessment begrijpt Deployments van nature — het meldt pas
`Healthy` wanneer de uitrol volledig is doorlopen. Koppel dat aan een melding en
je krijgt een eerlijk signaal achteraf in plaats van een hoopvol signaal vooraf.

## Wat incidenten écht voorkomt

- **Readiness probes die het echte afhankelijkheidspad testen** — geen statische `200`.
- **`maxUnavailable: 0`** zodat de capaciteit nooit zakt tijdens de uitrol.
- **`PodDisruptionBudget`** zodat node-drains en uitrollen elkaar niet versterken.
- **Automatische rollback** bij een mislukte sync, zodat een slechte release zichzelf herstelt.

Niets hiervan is exotisch. Het zijn de saaie, samenstelbare defaults — en saai
is precies wat je wil wanneer de deploy het minst interessante deel van je dag is.
