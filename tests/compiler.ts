import { resolve } from 'path'
import * as TS from 'typescript'

const config = {
  module: TS.ModuleKind.CommonJS,
  target: TS.ScriptTarget.ES2016,
  removeComments: true,
}

export function compiler<T>(fixturesPath: string, transformer: any) {
  return function compile(path: string, options?: T) {
    const content: string[] = []
    const entry = resolve(__dirname, '..', 'packages', fixturesPath, path)
    const compilerHost = {
      ...TS.createCompilerHost(config),
      // Override writeFile for not to write generated file at fs
      writeFile(name: string, text: string) {
        content.push(text)
      },
    }
    const program = TS.createProgram([entry], config, compilerHost)

    program.emit(undefined, undefined, undefined, undefined, {
      before: [
        transformer(options),
      ],
    })

    return content.pop()
  }
}
