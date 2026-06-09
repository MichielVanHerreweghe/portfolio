---
title: "Un state distant Terraform qui passe à l'échelle avec l'équipe"
description: "Le state distant est la première chose à réussir avec Terraform. Voici comment je structure backends, verrouillage et workspaces pour qu'une équipe qui grandit cesse de se marcher dessus."
date: 2026-04-08
tags: ["Terraform", "AWS"]
---

Le premier `terraform apply` d'un deuxième ingénieur, c'est là que le state
local meurt. Deux personnes, un seul `terraform.tfstate` sur le portable de
quelqu'un, et vous avez une race silencieuse prête à corrompre votre
infrastructure. Le state distant avec verrouillage est la solution — et il vaut
la peine de bien le poser dès le premier jour.

## Un backend avec verrouillage, pas seulement du stockage

Stocker le state à distance, c'est la moitié du travail ; le **verrouillage**
est l'autre moitié. Sur AWS, j'utilise S3 pour l'objet de state et DynamoDB pour
le verrou :

```hcl
terraform {
  backend "s3" {
    bucket         = "acme-tfstate"
    key            = "platform/prod/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "acme-tflock"
    encrypt        = true
  }
}
```

La `dynamodb_table` est ce qui empêche deux `apply` de s'exécuter en même temps.
Sans elle, des exécutions concurrentes peuvent entrelacer leurs écritures et
laisser un state décrivant une infrastructure qui n'a jamais existé.

## Un fichier de state par rayon d'impact

Ne mettez pas toute l'entreprise dans un seul fichier de state. Découpez le
state selon les lignes de **qui casse ensemble** :

- réseau (VPC, sous-réseaux) — change rarement, casse tout
- plateforme (clusters, datastores partagés) — la fondation de l'équipe
- stacks par service — changent souvent, rayon d'impact d'un seul service

Un fichier de state plus petit signifie un plan plus rapide, une fenêtre de
verrou plus courte, et une erreur incapable d'abattre tout le domaine.

> La structure du state est un organigramme déguisé. Tracez les frontières là où
> se trouvent réellement les équipes et les domaines de défaillance.

Mettez le state distant et le verrouillage en place avant l'arrivée du deuxième
ingénieur, et Terraform passe à l'échelle avec l'équipe au lieu de lutter contre.
