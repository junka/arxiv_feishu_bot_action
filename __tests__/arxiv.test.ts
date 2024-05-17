/**
 * Unit tests for src/wait.ts
 */

import getArXivPapers from '../src/arxiv'
import { expect } from '@jest/globals'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('arxiv.ts', () => {
  const today = '2024-05-17'
  const keyword = 'machine learning'
  it('should return an array of ArXivPaper', async () => {
    const mockResponse = {
      data: {
        feed: {
          entry: [
            {
              id: 'http://arxiv.org/abs/2305.01234',
              title: 'Paper 1',
              author: [{ name: 'Author 1' }, { name: 'Author 2' }],
              published: '2024-05-17T12:00:00Z',
              doi: '10.1234/abc',
              summary: 'This is the summary of Paper 1.'
            },
            {
              id: 'http://arxiv.org/abs/2305.05678',
              title: 'Paper 2',
              author: [{ name: 'Author 3' }],
              published: '2024-05-17T13:00:00Z',
              doi: '10.1234/def',
              summary: 'This is the summary of Paper 2.'
            }
          ]
        }
      }
    }
    mockedAxios.get.mockResolvedValueOnce(mockResponse)

    const papers = await getArXivPapers(keyword)
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `http://export.arxiv.org/api/query?search_query=all:${keyword}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending&day=${today}`
    )

    expect(papers).toHaveLength(2)
    expect(papers).toEqual([
      {
        id: 'http://arxiv.org/abs/2305.01234',
        title: 'Paper 1',
        author: ['Author 1', 'Author 2'],
        published: '2024-05-17T12:00:00Z',
        doi: '10.1234/abc',
        summary: 'This is the summary of Paper 1.'
      },
      {
        id: 'http://arxiv.org/abs/2305.05678',
        title: 'Paper 2',
        author: ['Author 3'],
        published: '2024-05-17T13:00:00Z',
        doi: '10.1234/def',
        summary: 'This is the summary of Paper 2.'
      }
    ])
  })

  it('should throw an error when fails', async () => {
    const errorMessage = 'Network Error'
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
        statusText: 'Internal Server Error',
        data: {
          error: {
            message: errorMessage
          }
        }
      }
    })

    await expect(getArXivPapers(keyword)).rejects.toThrow(
      'Can not fetch papers'
    )
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `http://export.arxiv.org/api/query?search_query=all:${keyword}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending&day=${today}`
    )
  })
})
