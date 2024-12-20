# setup-shfmt

- Install [shfmt](https://github.com/mvdan/sh) and cache it for GitHub Actions
- Caching makes it especially efficient when using self-hosted runners

## Usage

```yaml
jobs:
  shfmt:
    runs-on: ubuntu-latest
    steps:
      - uses: pollenjp/setup-shfmt@v1
        with:
          version: latest
          # version: 3.10.0
      - uses: actions/checkout@v4
      - name: Run shfmt
        run: shfmt -d .
```

If you use GitHub Enterprise Server, set the specific version (`X.Y.Z`), or set
`github-token` empty and `version: latest`.

```yaml
jobs:
  shellcheck:
    runs-on: ubuntu-latest
    steps:
      - uses: pollenjp/setup-shfmt@v1
        with:
          version: 3.10.0
          #
          #or
          #
          # version: latest  # 'latest' requests GitHub API (github.com)
          # github-token: '' # Empty token may result in reaching the rate limit
          #                  # for anonymous requests
      - uses: actions/checkout@v4
      - name: Run shfmt
        run: shfmt -d .
```

## Compare with other actions

- [mfinelli/setup-shfmt](https://github.com/mfinelli/setup-shfmt)
  - This actions is
    [not caching](https://github.com/mfinelli/setup-shfmt/blob/d9998666636b952a610a923ce3eea22cf21b9705/src/index.ts#L79-L84),
    and is installing shfmt to `$HOME/bin` which is not desirable for
    self-hosted runners.
