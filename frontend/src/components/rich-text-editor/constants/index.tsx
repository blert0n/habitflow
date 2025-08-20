import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  ItalicIcon,
  RotateCcw,
  RotateCw,
  Strikethrough as StrikethroughIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  UnderlineIcon,
} from 'lucide-react'

export enum RichTextAction {
  Bold = 'bold',
  Italics = 'italics',
  Underline = 'underline',
  Strikethrough = 'strikethrough',
  Superscript = 'superscript',
  Subscript = 'subscript',
  Highlight = 'highlight',
  Code = 'code',
  LeftAlign = 'leftAlign',
  CenterAlign = 'centerAlign',
  RightAlign = 'rightAlign',
  JustifyAlign = 'justifyAlign',
  Divider = 'divider',
  Undo = 'undo',
  Redo = 'redo',
}

export const RICH_TEXT_OPTIONS = [
  {
    id: RichTextAction.Bold,
    icon: <BoldIcon size={16} strokeWidth={1.5} />,
    label: 'Bold',
  },
  {
    id: RichTextAction.Italics,
    icon: <ItalicIcon size={18} strokeWidth={1.5} />,
    label: 'Italics',
  },
  {
    id: RichTextAction.Underline,
    icon: <UnderlineIcon size={18} strokeWidth={1.5} />,
    label: 'Underline',
  },
  {
    id: RichTextAction.Strikethrough,
    icon: <StrikethroughIcon size={18} strokeWidth={1.5} />,
    label: 'Strikethrough',
  },
  {
    id: RichTextAction.Superscript,
    icon: <SuperscriptIcon size={18} strokeWidth={1.5} />,
    label: 'Superscript',
  },
  {
    id: RichTextAction.Subscript,
    icon: <SubscriptIcon size={18} strokeWidth={1.5} />,
    label: 'Subscript',
  },
  // {
  //   id: RichTextAction.Highlight,
  //   icon: <Highlighter size={18} strokeWidth={1.5} />,
  //   label: "Highlight",
  //   fontSize: 10,
  // },
  // {
  //   id: RichTextAction.Code,
  //   icon: <Code size={18} strokeWidth={1.5} />,
  //   label: "Code",
  // },
  {
    id: RichTextAction.LeftAlign,
    icon: <AlignLeft size={18} strokeWidth={1.5} />,
    label: 'Align Left',
  },
  {
    id: RichTextAction.CenterAlign,
    icon: <AlignCenter size={18} strokeWidth={1.5} />,
    label: 'Align Center',
  },
  {
    id: RichTextAction.RightAlign,
    icon: <AlignRight size={18} strokeWidth={1.5} />,
    label: 'Align Right',
  },
  {
    id: RichTextAction.JustifyAlign,
    icon: <AlignJustify size={18} strokeWidth={1.5} />,
    label: 'Align Justify',
  },
  {
    id: RichTextAction.Undo,
    icon: <RotateCcw size={18} strokeWidth={1.5} />,
    label: 'Undo',
  },
  {
    id: RichTextAction.Redo,
    icon: <RotateCw size={18} strokeWidth={1.5} />,
    label: 'Redo',
  },
]

export const LOW_PRIORITY = 1
export const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
