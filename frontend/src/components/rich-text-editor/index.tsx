import React, { useMemo } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode } from '@lexical/rich-text'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { OnChangePlugin, Toolbar as ToolbarPlugin } from './plugins/'
import type { EditorThemeClasses } from 'lexical'

interface Options {
  className?: string
  contentEditableClassName?: string
  placeholderClassName?: string
  showBottomBorder?: boolean
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name: string
  options?: Options
}

const theme: EditorThemeClasses = {
  text: {
    bold: 'textBold',
    italic: 'textItalic',
    underline: 'textUnderline',
    strikethrough: 'textStrikethrough',
    underlineStrikethrough: 'textUnderlineStrikethrough',
    code: 'textCode',
  },
}

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor({ value, onChange, placeholder, name, options }) {
    const initialConfig = useMemo(
      () => ({
        namespace: name,
        theme,
        onError: () => {},
        nodes: [HeadingNode, CodeHighlightNode, CodeNode],
      }),
      [name],
    )

    const rootClass = ['rte-root', options?.className].filter(Boolean).join(' ')

    const contentEditableClass = [
      'rte-content',
      options?.contentEditableClassName,
    ]
      .filter(Boolean)
      .join(' ')

    const placeholderClass = ['rte-placeholder', options?.placeholderClassName]
      .filter(Boolean)
      .join(' ')

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <div className={rootClass}>
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`rte-content ${contentEditableClass}`}
                rows={4}
              />
            }
            placeholder={<div className={placeholderClass}>{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin value={value} onChange={onChange} />
      </LexicalComposer>
    )
  },
)
