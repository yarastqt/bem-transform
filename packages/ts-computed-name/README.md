# @bem-transform/ts-computed-name

## Requirement

```
typescript >= 2.9.0
```

## Installation

```bash
npm i -D @bem-transform/ts-computed-name
```

## Configuration
This transform correctly work with [ts-loader](https://github.com/TypeStrong/ts-loader) and [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader).

```js
const { computeClassBemName } = require('@bem-transform/ts-computed-name')
```

Need add this transform into [getCustomTransformers](https://github.com/s-panferov/awesome-typescript-loader#getcustomtransformers-string--program-tsprogram--tscustomtransformers--undefined-defaultundefined) in `before` section.

```js
{
  test: /\.tsx?$/,
  use: [
    {
      loader: require.resolve('awesome-typescript-loader'),
      options: {
        getCustomTransformers: () => ({
          before: [
            computeClassBemName(options),
          ],
        }),
      },
    },
},
```

## Available options

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `availableClassParent` | `string[]` | `['Block', 'Elem']` | Will add properties only to classes who have the parents from list. |
| `availibleBemName` | `boolean` | `true` | Will add the properties of `block` and `elem` based on the location in the fs. |
| `availibleDisplayName` | `boolean` | `true` | Will add the static property of `displayName` based on the location in the fs. *(Recommended add only in development mode for debugging)* |
| `naming` | `string` | `'origin'` | naming convention that uses at the project, should be `origin` or `react`. |
| `overrideExistingProperties` | `boolean` | `true` | Overrides existing properties `block`, `elem` and `displayName`. |
