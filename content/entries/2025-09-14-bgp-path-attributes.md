### `content/entries/2025-09-14-bgp-path-attributes.md`
```markdown
---
title: "Day 46: BGP Path Selection Process" 
date: 2025-09-14
category: "CCNP_ENTERPRISE"
tags: ["BGP", "ROUTING", "PATH-SELECTION"]
difficulty: 4
status: "in-progress"
estimated_time: "4 hours"
---

# BGP Path Selection Algorithm

Deep dive into how BGP selects the best path when multiple routes exist to the same destination.

## Path Selection Order
1. **Weight** (Cisco proprietary, local to router)
2. **Local Preference** (higher is better)
3. **Local Origin** (prefer locally originated)
4. **AS Path Length** (shorter is better)
5. **Origin Type** (IGP > EGP > Incomplete)
6. **MED** (lower is better)
7. **eBGP over iBGP**
8. **IGP metric to BGP next hop**
9. **Router ID** (lowest wins)

## Configuration Example
```ios
router bgp 65001
 bgp router-id 1.1.1.1
 neighbor 192.168.1.2 remote-as 65002
 neighbor 192.168.1.2 weight 100
 !
 address-family ipv4
  neighbor 192.168.1.2 activate
  neighbor 192.168.1.2 route-map SET_LOCAL_PREF in
 exit-address-family
!
route-map SET_LOCAL_PREF permit 10
 set local-preference 200