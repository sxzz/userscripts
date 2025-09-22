export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function fetch(url: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: 'GET',
      responseType: 'json',
      fetch: true,
      onload: (response) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.response)
        } else {
          reject(new Error(`Request failed with status ${response.status}`))
        }
      },
      onerror: (error) => {
        reject(new Error(`Network error: ${error}`))
      },
    })
  })
}
