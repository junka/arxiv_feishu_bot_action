import axios from 'axios'

export interface ArXivPaper {
  id: string
  title: string
  authors: string[]
  published: string
  doi: string
  summary: string
}

export default async function getArXivPapers(
  keyword: string
): Promise<ArXivPaper[]> {
  const today = new Date().toISOString().slice(0, 10)
  const url = `http://export.arxiv.org/api/query?search_query=all:${keyword}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending&day=${today}`
  try {
    const response = await axios.get(url)
    const papers: ArXivPaper[] = response.data.feed.entry.map((entry: any) => ({
      id: entry.id,
      title: entry.title,
      authors: entry.author.map((author: any) => author.name),
      published: entry.published,
      doi: entry.doi,
      summary: entry.summary
    }))
    return papers
  } catch (error) {
    throw new Error('Can not fetch papers')
  }
}
