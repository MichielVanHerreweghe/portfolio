---
title: "Terraform remote state die meeschaalt met het team"
description: "Remote state is het eerste dat je goed moet krijgen in Terraform. Zo structureer ik backends, locking en workspaces zodat een groeiend team elkaar niet meer voor de voeten loopt."
date: 2026-04-08
tags: ["Terraform", "AWS"]
---

De eerste `terraform apply` van een tweede engineer is waar lokale state
sterft. Twee mensen, één `terraform.tfstate` op iemands laptop, en je hebt een
stille race die je infrastructuur kan corrumperen. Remote state met locking is
de oplossing — en het loont om dit vanaf dag één goed te zetten.

## Een backend met locking, niet alleen opslag

State remote opslaan is de helft van het werk; **locking** is de andere helft.
Op AWS gebruik ik S3 voor het state-object en DynamoDB voor de lock:

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

De `dynamodb_table` is wat verhindert dat twee `apply`s tegelijk draaien. Zonder
die lock kunnen gelijktijdige runs schrijfacties verweven en blijft er state
achter die infrastructuur beschrijft die nooit bestaan heeft.

## Eén state-bestand per blast radius

Stop niet het hele bedrijf in één state-bestand. Splits state langs de lijnen
van **wie samen stukgaat**:

- networking (VPC's, subnets) — verandert zelden, breekt alles
- platform (clusters, gedeelde datastores) — de fundering van het team
- per-service stacks — veranderen vaak, blast radius van één service

Een kleiner state-bestand betekent een snellere plan, een kleiner lock-venster
en een fout die niet het hele landschap kan platleggen.

> State-layout is een organigram in vermomming. Trek de grenzen waar de teams en
> de failure domains echt liggen.

Zet remote state en locking op hun plek vóór de tweede engineer erbij komt, en
Terraform schaalt mee met het team in plaats van ertegen te vechten.
