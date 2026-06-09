---
title: "Terraform remote state that scales with the team"
description: "Remote state is the first thing to get right in Terraform. Here's how I structure backends, locking and workspaces so a growing team stops stepping on each other."
date: 2026-04-08
tags: ["Terraform", "AWS"]
---

The first `terraform apply` from a second engineer is where local state goes to
die. Two people, one `terraform.tfstate` on someone's laptop, and you've got a
silent race waiting to corrupt your infrastructure. Remote state with locking is
the fix — and it's worth getting right on day one.

## A backend with locking, not just storage

Storing state remotely is half the job; **locking** is the other half. On AWS I
use S3 for the state object and DynamoDB for the lock:

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

The `dynamodb_table` is what stops two `apply`s from running at once. Without it,
concurrent runs can interleave writes and leave state describing infrastructure
that never existed.

## One state file per blast radius

Don't put the whole company in one state file. Split state along the lines of
**who breaks together**:

- networking (VPCs, subnets) — changes rarely, breaks everything
- platform (clusters, shared data stores) — the team's foundation
- per-service stacks — change often, blast radius of one service

A smaller state file means a faster plan, a smaller lock window, and a mistake
that can't take down the whole estate.

> State layout is an org chart in disguise. Draw the boundaries where the teams
> and the failure domains actually are.

Get remote state and locking in place before the second engineer joins, and
Terraform scales with the team instead of fighting it.
