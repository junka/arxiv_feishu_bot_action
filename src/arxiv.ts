import axios from 'axios'
import { parseString } from 'xml2js'

export interface ArXivPaper {
  id: string
  title: string
  authors: string
  published: string
  doi: string
  summary: string
}

async function parseXml2entry(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err)
      } else {
        if (result.feed && result.feed.entry) {
          resolve([
            result.feed['opensearch:totalResults'][0]._,
            result.feed.entry
          ])
        } else {
          resolve([0, []])
        }
      }
    })
  })
}

const max_ret = 10

export default async function getArXivPapers(
  keyword: string
): Promise<[number, ArXivPaper[]]> {
  const date = new Date()
  const prevDate = new Date(date.getTime() - 24 * 60 * 60 * 1000)
  const formattedDate = `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}${String(date.getUTCHours()).padStart(2, '0')}${String(date.getUTCMinutes()).padStart(2, '0')}`
  const prevFormattedDate = `${prevDate.getUTCFullYear()}${String(prevDate.getUTCMonth() + 1).padStart(2, '0')}${String(prevDate.getDate()).padStart(2, '0')}${String(prevDate.getUTCHours()).padStart(2, '0')}${String(prevDate.getUTCMinutes()).padStart(2, '0')}`
  let start = 0
  const url = `http://export.arxiv.org/api/query?search_query=all:${keyword}+AND+submittedDate:%5B${prevFormattedDate}+TO+${formattedDate}%5D&start=${start}&max_results=${max_ret}&sortBy=submittedDate&sortOrder=descending`
  const papers: ArXivPaper[] = []
  let availble = 0
  let num = 0
  do {
    try {
      const response = await axios.get(url)
      const [n, entries] = await parseXml2entry(response.data)
      const ps: ArXivPaper[] = entries.map((entry: any) => ({
        id: entry.id ? `[${entry.id[0]}](${entry.id[0]})` : '',
        title: entry.title ? entry.title[0] : '',
        authors: entry.author.map((author: any) => author.name[0]).join(', '),
        published: entry.published ? entry.published[0] : '',
        doi: entry.doi ? entry.doi[0] : '',
        summary: entry.summary ? entry.summary[0] : ''
      }))
      papers.push(...ps)
      availble = ps.length
      start += max_ret
      num = n
    } catch (error) {
      throw new Error('Can not fetch papers')
    }
  } while (availble === max_ret && start <= 40)
  return [num, papers]
}
