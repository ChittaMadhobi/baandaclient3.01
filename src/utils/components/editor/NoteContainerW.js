import React, { Component } from 'react';
//import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
//import { EditorState, convertFromRaw } from 'draft-js';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class NoteContainerW extends Component {
  constructor(props) {
    super(props);
    // const contentState = convertFromRaw({
    //   entityMap: {},
    //   blocks: [
    //     {
    //       key: '637gr',
    //       text: 'Initialized from content state XXXX.',
    //       type: 'unstyled',
    //       depth: 0,
    //       inlineStyleRanges: [],
    //       entityRanges: [],
    //       data: {}
    //     }
    //   ]
    // });
    // const editorState = EditorState.createWithContent(contentState);
    // this.state = {
    //   editorState
    // };
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  render() {
    const { editorState } = this.state;
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
