## Github action sending arxiv papers to feishu everyday

[![GitHub Super-Linter](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

### How to use this action

### 如何使用该action

- Setting for fields you are interested
- 设置你感兴趣的领域

-

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Test Local Action
    id: test-action
    uses: junka/arxiv_feishu_bot_action@main # Commit with the `v1` tag
    with:
      keyword: 'CVPR'

  - name: Print Output
    id: output
    run: echo "${{ steps.test-action.outputs.time }}"
```

## Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent release tag by looking at the local data available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the latest release tag
   and provides a regular expression to validate the format of the new tag.
1. **Tagging the new release:** Once a valid new tag is entered, the script tags
   the new release.
1. **Pushing the new tag to the remote:** Finally, the script pushes the new tag
   to the remote repository. From here, you will need to create a new release in
   GitHub and users can easily reference the new tag in their workflows.
