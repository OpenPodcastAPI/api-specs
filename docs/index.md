# Open Podcast API

Welcome! The Open Podcast API is an initiative aiming to provide a feature-complete synchronisation API specification for podcast (web) apps and user-focussed servers.

Our goal indirectly serving end-users: providing an easy way to sync subscriptions, listening progress, favourites, queu(s) and more between different apps and online services, and the ability to switch providers without hassle. Our goal for developers: providing reliable, open specifications which are decentralisation-ready and are easy to implement. To reach these goals we're deveveloping these specs in a collaborative way and sharing them in an [OpenAPI](https://spec.openapis.org/oas/latest) format.

## Supported feature set & 'alpha' status

Currently the specifications to synchronise [subscriptions](/docs/subscriptions) has been made available.

We encourage all projects offering podcast listening and/or synchronisation functionality to adopt and implement defined specifications. However, please note that the **specifications are currently in 'alpha' state**: breaking changes might occur as initial implementation of these specs might reveal flaws in our theory.

First next on the roadmap are specifications for authentication and basic episode status synchronisation.

## Minimally required and optional functionality

In order to ensure a smooth and consistent end-user experience, we will identify a set of 'minimally required' end-points and calls.

_Core_: End-points and calls which are needed to support functionality we expect every user-facing (web) application to offer. All the end-points and calls labelled as such should be supported by all clients and servers. A product must support these in full in order for it to be called 'Open Podcast API compatible'.

_Optional_: All other end-points and calls. The whole (of the API integration between clients/servers) should be fully functional with (some of) these parts being absent.

What is labelled as 'core' is determined as we develop the specification. They may but are unlikely to change.

## Background

The specification is inspired by and builds on the API of [gPodder.net](https://gpoddernet.readthedocs.io/en/latest/api/index.html). Summer 2019 the original creator announced that they would step down and the community took over.[^gPoddermaintainer] Unfortunately, about a year later the project evolved in to 'basic maintenance mode' due to shifting priorities of key contributors. The limited availability of volunteers combined with gPodder.net's popularity among end-users meant that people started to see server errors while synchronising or creating an account.[^APforumGpodderIssues] [^gPodder50x] Attempts to establish contact and collaborate on improving the situation didn't work out as hoped. Given the situation, AntennaPod contributors started discussing whether gPodder.net support should be removed[^APforumGpodderRemoval] or whether it could be forked.

It was concluded that it would be best to initiate something outside a single project; to create a new API spec with a wider coalition. That would allow users to switch servers (avoiding major loads on a single server or project), provide an opportunity to more easily go beyond the existing gPodder.net API specs and enable developers to address some technical issues with the API specs. Initial discussions on GitHub lead to a meeting on October 2022 with folks from [AntennaPod](https://github.com/AntennaPod/AntennaPod/), [Funkwhale](https://dev.funkwhale.audio/), [Kasts](https://invent.kde.org/multimedia/kasts), [Podfriend](https://github.com/MartinMouritzen/Podfriend) and the [gPodder app for Nextcloud](https://github.com/thrillfall/nextcloud-gpodder).[^initialAPIdiscussions] A few months later, the first of the recurring meetings took place to start developing the specification.

## Specification development: join the conversation!

The Open Podcast API initiative builds on open source and open standards. Contributors from different projects work in the open to develop the specifications. All projects and products, from open source to proprietary, are encouraged to join us in developing the specs. Only then we can ensure we work towards the aim of a set of interoperable specs.

[Join the chatroom on Matrix](https://matrix.to/#/!ZHdcrdWSgxXRREuJdU:matrix.org) | [Give input in our GitHub discussions](https://github.com/orgs/OpenPodcastAPI/discussions/categories/problem-definitions-solutions) | [Add our monthly meeting to your calendar](https://github.com/orgs/OpenPodcastAPI/discussions/15)

[^gPoddermaintainer]: [Call on the gPodder.net repository for a new maintainer](https://github.com/gpodder/mygpo/blob/81e3d13e00e6c3d6db7ee6a22734041bf6fde128/maintainer-needed.md)
[^APforumGpodderIssues]: [Questions about gPodder.net issues on the AntennaPod forum](https://forum.antennapod.org/t/problem-with-gpodder-net/374)
[^gPodder50x]: [Issue in the gPodder.net repository on 502 errors](https://github.com/gpodder/mygpo/issues/527)
[^APforumGpodderRemoval]: [Suggestion on the AntennaPod forum to remove gPodder.net support](https://forum.antennapod.org/t/should-gpodder-net-be-supported-long-term/396)
[^initialAPIdiscussions]: [Initial discussions on the needs for a new podcast synchronisation API](https://github.com/thrillfall/nextcloud-gpodder/discussions/91)
