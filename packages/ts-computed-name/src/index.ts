import * as TS from 'typescript'
import * as presets from '@bem/sdk.naming.presets'
import match from '@bem/sdk.naming.cell.match'
import pascalCase from 'pascal-case'


const not = (value: boolean) => !value

export interface IOptions {
  availableClassParent?: string[],
  availibleBemName?: boolean,
  availibleDisplayName?: boolean,
  naming?: 'origin' | 'react',
  overrideExistingProperties?: boolean,
}

interface IPropertyOptions {
  name: string,
  value: string,
  isStatic: boolean,
}

interface IEntity {
  block: string,
  elem?: string,
}

function createProperty(options: IPropertyOptions) {
  const modifiers = options.isStatic
    ? [TS.createModifier(TS.SyntaxKind.StaticKeyword)]
    : []

  return TS.createProperty(
    undefined,
    modifiers,
    TS.createIdentifier(options.name),
    undefined,
    undefined,
    TS.createStringLiteral(options.value),
  )
}

function getDisplayName(entity: IEntity) {
  if (entity.elem !== undefined) {
    return `${pascalCase(entity.block)}-${pascalCase(entity.elem)}`
  }

  return pascalCase(entity.block)
}

function hasProperty(members: TS.ClassElement[], names: string[]) {
  return members.some((member) => (
    TS.isPropertyDeclaration(member)
    && TS.isIdentifier(member.name)
    && names.includes(member.name.text)
  ))
}

const defaultConfig = {
  availableClassParent: ['Block', 'Elem'],
  availibleBemName: true,
  availibleDisplayName: true,
  naming: 'origin',
  overrideExistingProperties: true,
}

export function computeClassBemName(config?: IOptions) {
  const options = { ...defaultConfig, ...config }
  // @ts-ignore (Presets is object with keys, but typings has no index signature)
  const parseBemPath = match(presets[options.naming])

  return function transform(context: TS.TransformationContext) {
    return function traverse(sourceFile: TS.SourceFile) {
      function visitor(node: TS.Node): TS.Node {
        if (TS.isClassDeclaration(node)) {
          const { fileName } = sourceFile
          const blockInPath = fileName.match('blocks')

          if (blockInPath === null) {
            return node
          }

          const filePath = fileName.slice(blockInPath.index, fileName.length)
          const { cell, isMatch } = parseBemPath(filePath)

          // Skip this node if then is not BEM entity
          if (not(isMatch)) {
            return node
          }

          // At zero position always should be extend declaration
          // Skip this node if class does not have extended
          if (node.heritageClauses !== undefined && node.heritageClauses[0] !== undefined) {
            const { expression } = node.heritageClauses[0].types[0]
            // Skip this node if class not extend from Block or Elem by default
            if (TS.isIdentifier(expression) && not(options.availableClassParent.includes(expression.text))) {
              return node
            }
          }
          else {
            return node
          }

          // Copy all values because members cannot be rewritten
          let members = [...node.members]
          const entity = cell.entity.toJSON()

          if (options.overrideExistingProperties) {
            const propertyNames = ['block', 'elem']

            if (options.availibleDisplayName) {
              propertyNames.push('displayName')
            }

            members = members.filter((member) => (
              TS.isPropertyDeclaration(member)
              && TS.isIdentifier(member.name)
              && not(propertyNames.includes(member.name.text))
            ))
          }

          if (options.availibleBemName) {
            if (options.overrideExistingProperties || not(hasProperty(members, ['block', 'elem']))) {
              const properties = Object.keys(entity)
                .map((key) => createProperty({
                  name: key,
                  value: entity[key],
                  isStatic: false,
                }))

              members = members.concat(properties)
            }
          }

          if (options.availibleDisplayName) {
            if (options.overrideExistingProperties || not(hasProperty(members, ['displayName']))) {
              const property = createProperty({
                name: 'displayName',
                value: getDisplayName(entity),
                isStatic: true,
              })

              members = members.concat(property)
            }
          }

          return TS.updateClassDeclaration(
            node,
            node.decorators,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses || [],
            members,
          )
        }

        return TS.visitEachChild(node, visitor, context)
      }

      return TS.visitNode(sourceFile, visitor)
    }
  }
}
