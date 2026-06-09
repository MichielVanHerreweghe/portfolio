---
title: "Déploiements sans interruption avec ArgoCD et Kubernetes"
description: "Comment je gère des déploiements progressifs en GitOps sur Kubernetes avec ArgoCD — readiness gates, contrôle du surge et les health checks qui rendent les releases ennuyeuses."
date: 2026-05-20
tags: ["Kubernetes", "CI/CD", "ArgoCD"]
---

Un déploiement devrait être le moment le moins intéressant de la journée. Si
livrer une nouvelle version fait retenir son souffle à l'équipe, le problème se
situe en amont — pas dans le déploiement lui-même. Voici la configuration vers
laquelle je me tourne pour rendre les releases Kubernetes ennuyeuses, avec
**ArgoCD** pour le GitOps et les primitives natives de la plateforme pour la
sûreté.

## La forme d'un déploiement sûr

Kubernetes fournit déjà l'essentiel de ce dont vous avez besoin. Une stratégie
`RollingUpdate` avec des bornes de surge et d'indisponibilité raisonnables fait
en sorte que les anciens pods ne se retirent qu'une fois les nouveaux réellement
en train de servir le trafic :

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

`maxUnavailable: 0` est la ligne qui compte : le déploiement ne descend jamais
sous le nombre de répliques souhaité. Les nouveaux pods doivent passer leur
**readiness probe** avant de recevoir du trafic, et ce n'est qu'ensuite qu'un
ancien pod est arrêté.

## Laissez ArgoCD posséder l'état désiré

Avec le GitOps, l'état désiré du cluster vit dans Git, et ArgoCD réconcilie la
réalité vers cet état. Un merge sur `main` devient un déploiement — pas de
`kubectl apply` depuis un portable, pas de dérive.

> Le déploiement est un effet de bord du merge. C'est tout l'intérêt : le
> pipeline cesse d'être une chose que l'on opère pour devenir une chose que
> l'on relit.

L'évaluation de santé d'ArgoCD comprend nativement les Deployments — elle ne
signale `Healthy` qu'une fois le déploiement entièrement abouti. Branchez cela
sur une notification et vous obtenez un signal honnête a posteriori plutôt qu'un
signal plein d'espoir a priori.

## Ce qui prévient réellement les incidents

- **Des readiness probes qui testent le vrai chemin de dépendance** — pas un `200` statique.
- **`maxUnavailable: 0`** pour que la capacité ne baisse jamais en cours de déploiement.
- **`PodDisruptionBudget`** pour que les drains de nœuds et les déploiements ne se cumulent pas.
- **Rollback automatique** en cas de sync échoué, pour qu'une mauvaise release se répare d'elle-même.

Rien de tout cela n'est exotique. Ce sont les defaults ennuyeux et composables —
et ennuyeux, c'est exactement ce que l'on veut quand le déploiement est le moment
le moins intéressant de la journée.
