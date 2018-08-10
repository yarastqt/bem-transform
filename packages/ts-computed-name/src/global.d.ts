declare module '@bem/sdk.naming.cell.match' {
  interface IEntity {
    toJSON(): {
      block: string,
      elem?: string,
      [key: string]: any,
    },
  }

  function match(conventional: any): (path: string) => {
    cell: {
      entity: IEntity,
    },
    isMatch: boolean,
  }

  export = match
}
