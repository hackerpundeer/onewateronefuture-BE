# Media Module

## Purpose

Abstract media asset storage and retrieval behind a port interface.

## Responsibilities

- Upload, fetch, and delete media assets per website
- Decouple modules from a specific storage backend (local disk, S3, etc.)

## Future Roadmap

- Implement `MediaStoragePort` with cloud object storage
- Image optimization pipeline
- CDN URL generation
