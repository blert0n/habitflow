import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { useEffect, useState } from 'react'
import { mergeRegister } from '@lexical/utils'
import { Button } from '@chakra-ui/react'
import { LOW_PRIORITY, RICH_TEXT_OPTIONS, RichTextAction } from '../constants'
import { useKeyBindings } from '../hooks'

export const Toolbar = () => {
  const [editor] = useLexicalComposerContext()
  const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true,
  })
  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
    {},
  )

  const updateToolbar = () => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [RichTextAction.Bold]: selection.hasFormat('bold'),
        [RichTextAction.Italics]: selection.hasFormat('italic'),
        [RichTextAction.Underline]: selection.hasFormat('underline'),
        [RichTextAction.Strikethrough]: selection.hasFormat('strikethrough'),
        [RichTextAction.Superscript]: selection.hasFormat('superscript'),
        [RichTextAction.Subscript]: selection.hasFormat('subscript'),
        [RichTextAction.Code]: selection.hasFormat('code'),
        [RichTextAction.Highlight]: selection.hasFormat('highlight'),
      }
      setSelectionMap(newSelectionMap)
    }
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar()
          return false
        },
        LOW_PRIORITY,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            undo: !payload,
          }))
          return false
        },
        LOW_PRIORITY,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            redo: !payload,
          }))
          return false
        },
        LOW_PRIORITY,
      ),
    )
  }, [editor])

  const onAction = (id: RichTextAction) => {
    switch (id) {
      case RichTextAction.Bold: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        break
      }
      case RichTextAction.Italics: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        break
      }
      case RichTextAction.Underline: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        break
      }
      case RichTextAction.Strikethrough: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        break
      }
      case RichTextAction.Superscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
        break
      }
      case RichTextAction.Subscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
        break
      }
      case RichTextAction.Highlight: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')
        break
      }
      case RichTextAction.Code: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
        break
      }
      case RichTextAction.LeftAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
        break
      }
      case RichTextAction.RightAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
        break
      }
      case RichTextAction.CenterAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
        break
      }
      case RichTextAction.JustifyAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
        break
      }
      case RichTextAction.Undo: {
        editor.dispatchCommand(UNDO_COMMAND, undefined)
        break
      }
      case RichTextAction.Redo: {
        editor.dispatchCommand(REDO_COMMAND, undefined)
        break
      }
    }
  }

  useKeyBindings({ onAction })

  return (
    <div className={`toolbar`}>
      {RICH_TEXT_OPTIONS.map((option) => (
        <Button
          key={option.id}
          className={`toolbar-btn ${selectionMap[option.id] ? 'toolbar-btn--active' : ''}`}
          variant="ghost"
          size="xs"
          onClick={() => onAction(option.id)}
          onMouseDown={(e) => e.preventDefault()}
          disabled={disableMap[option.id]}
        >
          {option.icon}
        </Button>
      ))}
    </div>
  )
}
