import React, { Component } from 'react';
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import createImagePlugin from 'draft-js-image-plugin';

import createHighlightPlugin from './plugins/highlightPlugin';
import addLinkPlugin from './plugins/addLinkPlugin';

import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';

import ImageAdd from './ImageAdd';
// Pluging definitions
const highlightPlugin = createHighlightPlugin();
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;
const imagePlugin = createImagePlugin();

class NoteContainer extends Component {
  constructor(props) {
    super(props);

    //console.log('NoteContainer - editorContext : ' + this.props.editorContext);
    //localStorage.clear();
    const content = window.localStorage.getItem(this.props.editorContext);
    let initContent;
    if (content) {
      initContent = EditorState.createWithContent(
        convertFromRaw(JSON.parse(content))
      );
    } else {
      initContent = EditorState.createEmpty();
    }

    // this.state = {
    //   editorState: createEditorStateWithText(text)
    // };

    this.state = {
      editorState: initContent
    };

    this.plugins = [highlightPlugin, addLinkPlugin, emojiPlugin, imagePlugin];
  }

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    //console.log('content state :', convertToRaw(contentState));
    this.saveContent(contentState);
    this.setState({
      editorState
    });
  };

  // Save cnotent in local storage
  // saveContent = content => {
  //   window.localStorage.setItem(
  //     'content',
  //     JSON.stringify(convertToRaw(content))
  //   );
  // };

  saveContent = content => {
    console.log('from saveContent : ' + this.props.editorContext);
    window.localStorage.setItem(
      this.props.editorContext,
      JSON.stringify(convertToRaw(content))
    );
  };

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE')
    );
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

  onItalicClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC')
    );
  };

  onHighlight = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT')
    );
  };

  onToggleCode = () => {
    this.onChange(RichUtils.toggleCode(this.state.editorState));
  };

  onAddLink = () => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const link = window.prompt('Paste the link -');
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return 'handled';
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', {
      url: link
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      'create-entity'
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
  };

  render() {
    return (
      <div className="editorContainer">
        <p className="header-bottom-min">
          <b>
            <font color="gray">Reachout - Compose your Letter</font>
          </b>
        </p>

        <div>
          <button
            className="btn btn-outline-primary btn-sm "
            onClick={this.onUnderlineClick}
          >
            U
          </button>{' '}
          &nbsp;
          <div className="d-inline">
            <button
              className="btn btn-outline-primary btn-sm "
              onClick={this.onBoldClick}
            >
              B
            </button>
            &nbsp;&nbsp;
            <button
              className="btn btn-outline-primary btn-sm "
              onClick={this.onItalicClick}
            >
              <em>I&nbsp;</em>
            </button>{' '}
            &nbsp;
            <button
              className="btn btn-outline-primary btn-sm "
              onClick={this.onAddLink}
            >
              <i className="fa fa-paperclip" />
            </button>{' '}
            &nbsp;
            <button
              className="btn btn-outline-primary btn-sm "
              onClick={this.onToggleCode}
            >
              <i className="fa fa-th-large" />
            </button>{' '}
            &nbsp;
            <button
              className="highlight btn btn-outline-primary btn-sm "
              onClick={this.onHighlight}
            >
              <span style={{ background: 'yellow' }}>
                {' '}
                <i className="fa fa-highlighter" />
              </span>
            </button>
            <ImageAdd
              editorState={this.state.editorState}
              onChange={this.onChange}
              modifier={imagePlugin.addImage}
            />
          </div>
        </div>
        <div className="editor-padding text-left">
          <div className="editors editorfixedsize p-3 mb-2 bg-white text-dark font-size-xsm border border-primary">
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              plugins={this.plugins}
            />
            <EmojiSuggestions />
          </div>
        </div>
      </div>
    );
  }
}

export default NoteContainer;
