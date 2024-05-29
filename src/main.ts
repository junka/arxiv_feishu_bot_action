import * as core from '@actions/core'
import * as crypto from 'crypto'
import getArXivPapers from './arxiv'
import * as https from 'https'

function PostToFeishu(id: string, content: string): void {
  const options = {
    hostname: 'open.feishu.cn',
    port: 443,
    path: `/open-apis/bot/v2/hook/${id}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    res.on('data', d => {
      process.stdout.write(d)
    })
  })
  req.on('error', e => {
    console.error(e)
  })
  req.write(content)
  req.end()
}

function sign_with_timestamp(timestamp: number, key: string): string {
  const toencstr = `${timestamp}\n${key}`
  const signature = crypto.createHmac('SHA256', toencstr).digest('base64')
  return signature
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const webhook = core.getInput('webhook')
    ? core.getInput('webhook')
    : process.env.FEISHU_BOT_WEBHOOK || ''

  const signKey = core.getInput('signkey')
    ? core.getInput('signkey')
    : process.env.FEISHU_BOT_SIGNKEY || ''

  const webhookId = webhook.slice(webhook.indexOf('hook/') + 5)
  try {
    const kw: string = core.getInput('keyword')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`keyword is ${kw}`)
    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    const [num, papers] = await getArXivPapers(kw)
    let it = 0

    while (it < papers.length) {
      const json = JSON.stringify(papers.slice(it, it + 10))
      it += 10
      const tm = Math.floor(Date.now() / 1000)
      const sign = sign_with_timestamp(tm, signKey)
      const msg = `{
        "timestamp": "${tm}",
        "sign": "${sign}",
        "msg_type": "interactive",
            "card": {
                "type": "template",
                "data": {
                    "template_id": "AAq3wZkpfCpBZ",
                    "template_version_name": "1.0.4",
                    "template_variable": {
                        "keyword": "${kw}",
                        "total": "${num}",
                        "papers_list": ${json}
                    }
                }
            }
        }`
      PostToFeishu(webhookId, msg)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
