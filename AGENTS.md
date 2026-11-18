# Orbit OS contributor guide

This project uses a small, explicit version of the [agentic playbook](https://github.com/drewcurley/agentic-playbook). Work in one repository. Do not represent plans as implemented behavior or claim a review that did not occur.

## Start a session

1. Read `docs/README.md`, `docs/architecture.md`, `docs/contracts.md`, and `tasks/INDEX.md`.
2. Read the relevant task file and affected source files. Check the actual GitHub branch and open PRs before starting overlapping work.
3. For changes to routes, rules, storage, or access control, update the relevant contract and record how you checked existing consumers.

## Work and review

- Use a short-lived branch and a PR. Give the task a file under `tasks/` with a concrete acceptance test.
- Review a change from the perspectives that apply: product scope, Chrome enforcement, security, data, accessibility, tests, and deployment. Record unresolved risks in the PR. A human reviews before merge.
- Run `node --test extension/tests/*.test.mjs` for extension rule changes, and `npm run build --prefix web` plus `npm run lint --prefix web` for frontend changes. Run browser checks on a real Chrome profile for extension changes; mocked unit tests do not prove browser enforcement.
- Never put a parent bearer token in a child-facing page or device. Never claim this extension prevents a child from disabling it on an unmanaged device.
- Do not merge when required checks fail. Add required status checks and PR protection only once the CI workflow has run successfully on a PR.

The upstream playbook's nine-agent consensus and three-round review are not installed here. If this project later adopts those gates, configure them explicitly and document who signed off. A single contributor must not invent consensus or approval.
