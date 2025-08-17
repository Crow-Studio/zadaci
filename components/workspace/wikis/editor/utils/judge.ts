import type { Extension } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { EXTENSION_TYPE, NODE_GROUP } from './constants'

export const isNodeExtension = (ext: Extension) => ext.type === EXTENSION_TYPE.NODE

export const isBlockNodeExtension = (ext: Extension) => isNodeExtension(ext) && [NODE_GROUP.BLOCK, NODE_GROUP.TITLE].find(item => (ext.config.group as string)?.includes(item))

export const isBlockNode = (node: ProseMirrorNode) => node.type.spec.group?.includes(NODE_GROUP.BLOCK)

export const isMarkExtension = (ext: Extension) => ext.type === EXTENSION_TYPE.MARK
