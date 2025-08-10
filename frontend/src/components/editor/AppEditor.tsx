import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { SharedHistoryContext } from '../editor/context/SharedHistoryContext'
import { TableContext } from '../editor/plugins/TablePlugin'
import { ToolbarContext } from '../editor/context/ToolbarContext'
import AppEditorNodes from '../editor/nodes/AppEditorNodes'
import AppEditorTheme from '../editor/themes/AppEditorTheme'
import { Editor } from './Editor'

const AppEditor = () => {
  const initialConfig = {
    namespace: 'AppEditor',
    nodes: [...AppEditorNodes],
    onError: (error: Error) => {
      throw error
    },
    theme: AppEditorTheme,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <ToolbarContext>
            <div className="editor-shell">
              <Editor />
            </div>
          </ToolbarContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  )
}

export { AppEditor }
