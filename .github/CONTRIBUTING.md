# Contributing

> [!NOTE]
> This guide serves to track changes to CI/CD and inform contributors and new maintainers of those patterns so they aren't repeated or causing confusion during development.

`main` is the code deployed to production, Vercel auto-deploys every commit to it. All human changes reach `main` through a pull request (no direct pushes). The one exception is the sync-docs automation bot, which pushes generated documentation commits (`sync: update documentation from voxkit-desktop`) directly to `main` when new application code is deployed from [voxkit-desktop](https://github.com/BrainBehaviorAnalyticsLab/voxkit-desktop).

This contribution guide is split by role:

- **[For developers](#for-developers)**: writing and shipping code.
- **[For repo & Vercel owners](#for-repo--vercel-owners)**: setting the guardrails that control inflow.

---

## For developers

- **Internal members** (collaborators with write access) create a branch in this repo.
- **External contributors** fork the repo, branch in the fork, and open a PR from the fork against `main`.

### Contribution model (GitHub Flow)

```
branch-name ──PR──► main ──auto-deploy──► Vercel production
```

1. Branch off `main` (in this repo if internal, in your fork if external): `git checkout -b <short-descriptive-name>`
2. Commit work locally, the pre-commit hook enforces lint-staged (lint + format on staged files) + repo-wide format:check + typecheck on every commit.
3. Push the branch; the pre-push hook enforces full lint + format:check + typecheck + `next build`, so a broken branch doesn't even reach GitHub.
4. Open a PR against `main`. Vercel posts a preview URL on the PR.
5. Merge via Squash and merge once review + checks pass. Keeps `main` history linear; 1 commit = 1 shipped change.
6. Delete the branch after merge. Vercel deploys the new `main` to production automatically.

### Useful scripts

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Local dev server (`USE_FAKE_RELEASES=false`). |
| `npm run build`        | Production build.                             |
| `npm run lint`         | ESLint over the project.                      |
| `npm run typecheck`    | `tsc --noEmit`.                               |
| `npm run format`       | Prettier-format the whole project.            |
| `npm run format:check` | Prettier check (no writes); fails on drift.   |

## For repo & Vercel owners

You own the guardrails that make the developer workflow safe. The rules below are authoritative.

### GitHub branch protection (`main`)

We use **Rulesets**, not the legacy "Branch protection rules". Rulesets supersede branch protection and are required for app-based bypass (see [Automation bot bypass](#automation-bot-bypass) below).

`Settings → Rules → Rulesets → New branch ruleset`

Configure the ruleset:

- **Name**: `main protection` (or similar).
- **Enforcement status**: `Active`.
- **Target branches**: `Include default branch` (or add `refs/heads/main` explicitly).
- **Bypass list**: add the **Repository admin** role so the someone can land emergency fixes or rollbacks if PR review is unavailable. The sync-docs bot is added in the next section. No other humans should be on this list.

Branch rules to enable:

- **Restrict deletions**: prevents `main` from being deleted.
- **Require linear history**: pairs with squash-merge to keep history flat.
- **Require a pull request before merging**:
  - Required approvals: **1**.
  - **Dismiss stale pull request approvals when new commits are pushed**: on.
  - **Require approval of the most recent reviewable push**: on.
- **Require status checks to pass**:
  - **Require branches to be up to date before merging**: on.
  - Add each required check by name once the CI workflow exists (lint, typecheck, format, Vercel).
- **Block force pushes**: on.

Anything not in the Bypass list is subject to all of the above. The Repository admin can bypass for genuine emergencies; routine work still goes through PRs.

### Automation bot bypass

The docs-sync workflow in [`voxkit-desktop`](https://github.com/BrainBehaviorAnalyticsLab/voxkit-desktop) pushes generated docs to `main` here using `secrets.PRIVATE_REPO_TOKEN`. The push is authenticated as the **owner of that PAT**, not as `github-actions[bot]`, so the PAT must be issued by the Repository admin (already in the Bypass list above). No separate bypass entry is needed.

Also in `Settings → General → Pull Requests`:

- **Allow squash merging**: on.
- **Allow merge commits**: off.
- **Allow rebase merging**: off.
- **Automatically delete head branches**: on.

### Vercel project

- **Production branch**: `main`. Every commit triggers a production deployment.
- **Preview deployments**: enabled for every PR and every non-`main` branch push. Vercel posts the preview URL as a PR check.
- **Environment variables**: managed in the Vercel dashboard.
  - Production secrets must be scoped **Production only** so PR previews can't read them.
  - Preview-safe variables can be scoped to Preview + Development.
  - `CRON_SECRET` is required (see [Release data freshness](#release-data-freshness)). Vercel sends it as `Authorization: Bearer $CRON_SECRET` on cron invocations. Generate a random value; never commit it.
- **GitHub integration**: the Vercel GitHub App must have access to this repo so it can post deployment statuses (these become required checks in branch protection).

### Release data freshness

`/download` is **prerendered**, not fetched in the browser. `components/DownloadPanel.tsx` is a server component that resolves GitHub releases at render time via `lib/releases.ts`, then hands the data to `DownloadPanelClient.tsx` for the interactive bits. Visitors never call GitHub, so the page costs one upstream request per day instead of one per visitor — comfortably under GitHub's 60/hour unauthenticated limit.

Refresh is driven by the cron in `vercel.json`:

```
0 0 * * *  →  /api/revalidate-releases
```

At midnight UTC it purges the `releases` cache tag and the prerendered `/download` page; the next visitor triggers one fresh fetch. **A new release therefore takes up to a day to appear on the site.** That delay is intentional — a grace period to pull a release that turns out to be problematic before the website advertises it.

Two safety nets:

- `export const revalidate` on `app/download/page.tsx` (24h) refreshes the page even if the cron stops firing. It duplicates `RELEASES_REVALIDATE_SECONDS` in `lib/releases.ts` because Next requires a literal there — change both together.
- If GitHub is down when a refresh runs, the last good render keeps being served; visitors see nothing wrong.

To publish a release immediately, either redeploy or call the endpoint by hand:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/revalidate-releases
```

> [!NOTE]
> Vercel cron schedules are UTC, and on Hobby plans they run at most once a day and fire within the hour of the scheduled time. Both are fine for a daily grace period.

### Rollback

Production is `main`. Two paths:

1. **Preferred**: revert the bad commit on `main` via a PR; `git revert <sha>` → PR → squash-merge. Vercel auto-redeploys. History stays linear and the revert is auditable.
2. **Emergency**: in the Vercel dashboard, promote a prior production deployment to current. Do this when a revert PR would be too slow. Immediately follow with a revert PR so `main` and production are back in sync.

### Enforcement summary

| Stage             | Enforced by              | Gate                                                | Authoritative?     |
| ----------------- | ------------------------ | --------------------------------------------------- | ------------------ |
| Each commit       | Husky `pre-commit`       | lint-staged + format:check + typecheck              | No (`--no-verify`) |
| Each push         | Husky `pre-push`         | full lint + format:check + typecheck + `next build` | No (`--no-verify`) |
| Reaching `main`   | GitHub branch protection | PR + approval + CI checks                           | **Yes**            |
| Production deploy | Vercel                   | auto on `main`                                      | **Yes**            |

The hooks make the common case fast and pleasant. Branch protection is what actually keeps `main` clean.
