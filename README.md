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
      - uses: actions/checkout@v4
      - name: Run shfmt
        run: shfmt -d .
```
