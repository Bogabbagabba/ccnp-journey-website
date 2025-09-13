---
title: "Day 45: OSPF Area Configuration Deep Dive"
date: 2025-09-13
category: "CCNP_ENTERPRISE"
tags: ["OSPF", "ROUTING", "LSA", "ABR"]
difficulty: 3
status: "completed"
estimated_time: "3 hours"
---

# OSPF Multi-Area Configuration

Today I tackled OSPF multi-area configurations and learned about LSA types. The concept of area border routers (ABRs) finally clicked when I visualized the topology using GNS3.

## Key Insights
- Area 0 (backbone) is mandatory for inter-area routing
- LSA Type 3 summary advertisements between areas  
- Stub areas reduce routing table size significantly
- ABRs are critical for inter-area communication

## Configuration
```ios
router ospf 100
 router-id 1.1.1.1
 area 10 stub
 network 10.1.1.0 0.0.0.255 area 0
 network 10.2.1.0 0.0.0.255 area 10
 area 10 range 10.2.0.0 255.255.0.0
!
interface fa0/0
 ip ospf priority 100


┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Area 0   │────▶│     ABR     │────▶│   Area 10   │
│  (Backbone) │     │   Router    │     │   (Stub)    │  
│   10.1.1.0  │     │             │     │  10.2.1.0   │
└─────────────┘     └─────────────┘     └─────────────┘