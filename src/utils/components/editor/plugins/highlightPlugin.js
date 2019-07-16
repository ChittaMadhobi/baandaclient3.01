import { RichUtils } from 'draft-js';

export default () => {
  return {
    customStyleMap: {
      HIGHLIGHT: {
        background: '#fffe0d',
        padding: '0.2em',
        color: '#43634b'
      }
    },
    keyBindingFn: e => {
      if (e.metakey && e.key === 'h') {
        return 'highlight';
      }
    },
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      if (command === 'highlight') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
        return true;
      }
    }
  };
};
