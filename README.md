# GitHub action

## sending arxiv papers to feishu everyday

[![GitHub Super-Linter](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/junka/arxiv_feishu_bot_action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

### How to use this action

### 如何使用该action

- Setting FEISHU_BOT_WEBHOOK and FEISHU_BOT_SIGNKEY in the action secrets in
  your repository
- 在你的仓库action设置FEISHU_BOT_WEBHOOK和FEISHU_BOT_SIGNKEY
- input for fields you are interested in the keyword
- 在input设置你感兴趣的领域keyword
- use the FEISHU_BOT_WEBHOOK and FEISHU_BOT_SIGNKEY as input for action
- 在input设置上述的secrets

```yaml
name: ARXIV papers daily on your TOPIC

on:
  schedule:
    - cron: 30 8 * * *

jobs:
  send-event:
    name: Arxiv paper to feishu
    runs-on: ubuntu-latest
    steps:
      uses: junka/arxiv_feishu_bot_action@main
      with:
        keyword: 'CVPR' # topics for you
        webhook: ${{ secrets.FEISHU_BOT_WEBHOOK }}
        signkey: ${{ secrets.FEISHU_BOT_SIGNKEY }}
```
