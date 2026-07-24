# ADR-001: Modular Monolith

## Status

Accepted

## Context

We need a multi-website API platform without the operational cost of microservices on Hostinger.

## Decision

Build Platform V2 as a **modular monolith**: one Node process, one MongoDB, domain modules with clear boundaries (controller → service → repository → model).

## Consequences

- Shared deploy artifact (`server.js`) remains
- Modules can later extract if scale demands it
- Cross-module calls go service → service only

## Alternatives Considered

- Microservices per domain — rejected (ops overhead)
- Deploy-per-website forks — rejected (duplication)

## Future Notes

Extract read replicas or workers only when metrics require it.
