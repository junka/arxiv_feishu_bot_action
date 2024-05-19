/**
 * Unit tests for src/wait.ts
 */

import getArXivPapers from '../src/arxiv'
import { expect } from '@jest/globals'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('arxiv', () => {
  const keyword = 'LSM'
  it('should return an array of ArXivPaper', async () => {
    const mockResponse = {
      data: `<?xml version="1.0" encoding = "UTF-8" ?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <id>http://arxiv.org/abs/2305.01234</id>
          <title>Paper 1</title>
          <author> <name>Author 1</name> </author>
          <author> <name>Author 2</name> </author>
          <published>2024-05-17T12:00:00Z</published>
          <doi>10.1234/abc</doi>
          <summary>This is the summary of Paper 1.</summary>
        </entry>
        <entry>
          <id>http://arxiv.org/abs/2305.05678</id>
          <title>Paper 2</title>
          <author> <name>Author 3</name> </author>
          <published>2024-05-17T13:00:00Z</published>
          <doi>10.1234/def</doi>
          <summary>This is the summary of Paper 2.</summary>
        </entry>
      </feed>`
    }
    mockedAxios.get.mockResolvedValueOnce(mockResponse)

    const papers = await getArXivPapers(keyword)
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(
        /http:\/\/export\.arxiv\.org\/api\/query\?search_query=all:\w+\+AND\+submittedDate=%5B(\d{12})\+TO\+(\d{12})%5D&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending/i
      )
    )

    expect(papers).toHaveLength(2)
    expect(papers).toEqual([
      {
        id: '[http://arxiv.org/abs/2305.01234](http://arxiv.org/abs/2305.01234)',
        title: 'Paper 1',
        authors: 'Author 1, Author 2',
        published: '2024-05-17T12:00:00Z',
        doi: '10.1234/abc',
        summary: 'This is the summary of Paper 1.'
      },
      {
        id: '[http://arxiv.org/abs/2305.05678](http://arxiv.org/abs/2305.05678)',
        title: 'Paper 2',
        authors: 'Author 3',
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
      expect.stringMatching(
        /http:\/\/export\.arxiv\.org\/api\/query\?search_query=all:\w+\+AND\+submittedDate=%5B(\d{12})\+TO\+(\d{12})%5D&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending/i
      )
    )
  })
})
