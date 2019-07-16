import React, { Component, PropTypes } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {
  convertToRaw,
  convertFromHTML,
  ContentState,
  EditorState
} from 'draft-js';
import uploadImageCallBack from './plugins/UploadImageEditor';
import './RichTextEditor.css';

class Note extends Component {
  constructor(props) {
    super(props);
    const sampleMarkup =
      '<p><b>Bold text</b><a href="http://baidu.com">baidu.com</a></p><p><img src="https://avatars3.githubusercontent.com/u/1481983?v=3&s=88"/></p>';
    const contentBlock = htmlToDraft(sampleMarkup);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      this.state.initState = EditorState.createWithContent(contentState);
    }
  }
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
  };
  state = {
    outputEditorState: undefined
  };
  onEditorStateChange = function(inputEditorState) {
    const rawContent = convertToRaw(inputEditorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const outputEditorState = EditorState.createWithContent(contentState);
      this.setState({ inputEditorState, outputEditorState });
    }
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(html);
    }
  };

  render() {
    return (
      <Editor
        onEditorStateChange={this.onEditorStateChange.bind(this)}
        editoerState={this.state.outputEditorState}
        defaultEditorState={this.state.initState}
        uploadCallback={uploadImageCallBack}
        wrapperClassName="global-rte-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
    );
  }
}
export default Note;
