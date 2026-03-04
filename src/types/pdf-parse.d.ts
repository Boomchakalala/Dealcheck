declare module 'pdf-parse' {
  interface PDFData {
    numpages: number
    text: string
    info: any
    metadata: any
    version: string
  }

  function parse(dataBuffer: Buffer, options?: any): Promise<PDFData>
  export = parse
}
