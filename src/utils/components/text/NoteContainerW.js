import React, { Component } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './text.css';

class NoteContainerW extends Component {
  constructor(props) {
    super(props);
    const contentState = convertFromRaw({
      entityMap: {},
      blocks: [
        {
          key: '637gr',
          text: this.props.editorContextx,
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }
      ]
    });
    const editorState = EditorState.createWithContent(contentState);
    this.state = {
      editorState
    };
    // this.state = {
    //   editorState: EditorState.createEmpty()
    // };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  render() {
    const { editorState } = this.state;
    console.log('this.props:' + JSON.stringify(this.props));
    //let editorState = 'This is a test';

    return (
      <div className="editorContainer">
        <div>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>
        <div className="footerspace" />
      </div>
    );
  }
}

export default NoteContainerW;
