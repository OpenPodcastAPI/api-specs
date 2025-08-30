---
title: Project overview
description: An introduction to the Open Podcast API project
sidebar:
  order: 1
---

The Open Podcast API project is inspired by and builds upon the [gPodder API](https://gpoddernet.readthedocs.io/en/latest/api/index.html). In the summer of 2019, the creator of gPodder announced they were stepping down and the community took over.[^1] Unfortunately, about a year later the project entered 'basic maintenance mode' due to shifting priorities of key contributors. The limited availability of volunteers combined with gPodder.net's popularity among end-users meant that people started to see server errors while synchronizing or creating an account.[^2] [^3] Attempts to establish contact and collaborate on improving the situation didn't work out as hoped. Given the situation, AntennaPod contributors started discussing whether gPodder.net support should be removed[^4] or whether it could be forked. They concluded that the best solution would be to create a new API spec with a broad range of contributors to allow users to switch servers (avoiding major loads on a single server or project), to provide an opportunity to more easily go beyond the existing gPodder.net API specs, and to enable developers to address some technical issues with the API specs.

The initial discussions on GitHub led to a meeting in October 2022 with contributors from [AntennaPod](https://github.com/AntennaPod/AntennaPod/), [Funkwhale](https://dev.funkwhale.audio/), [Kasts](https://invent.kde.org/multimedia/kasts), [Podfriend](https://github.com/MartinMouritzen/Podfriend) and the [gPodder app for Nextcloud](https://github.com/thrillfall/nextcloud-gpodder).[^5] A few months later, the first of the recurring meetings took place to start developing the specification.

## Join us!

We encourage you to engage in the discussions, and provide feedback based on your implementation. [Check our homepage](/) how you can get involved.

### Code of Conduct

The Open Podcast API project abides by the [Contributor Covenant Code of Conduct](/docs/coc). Please familiarize yourself with it before participating in any of our community spaces.

## Licensing

Our project builds on and is itself open source:

- Documentation: Creative Commons Attribution-ShareAlike 4.0 International Public License
- Reference implementations: MIT

### Specifications

[^1]: [Call on the gPodder.net repository for a new maintainer](https://github.com/gpodder/mygpo/blob/81e3d13e00e6c3d6db7ee6a22734041bf6fde128/maintainer-needed.md)
[^2]: [Questions about gPodder.net issues on the AntennaPod forum](https://forum.antennapod.org/t/problem-with-gpodder-net/374)
[^3]: [Issue in the gPodder.net repository on 502 errors](https://github.com/gpodder/mygpo/issues/527)
[^4]: [Suggestion on the AntennaPod forum to remove gPodder.net support](https://forum.antennapod.org/t/should-gpodder-net-be-supported-long-term/396)
[^5]: [Initial discussions on the needs for a new podcast synchronisation API](https://github.com/thrillfall/nextcloud-gpodder/discussions/91)
