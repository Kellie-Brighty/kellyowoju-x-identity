# kellyowoju-x-identity

Orchestration for the autonomous build-in-public agent (@kellyowoju on X).

`outbox/` is a queue: the Ship Loop and Content Loop routines drop JSON
request files here (since they can reach GitHub but not the droplet or X's
API directly from their sandboxed environment); a poller on the droplet
picks them up, executes them via the deploy API, and removes them.
