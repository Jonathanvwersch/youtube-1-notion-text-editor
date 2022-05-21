import {
  ContentBlock,
  DraftEditorCommand,
  EditorState,
  RichUtils,
  Editor,
  DraftHandleValue,
} from "draft-js";

import "draft-js/dist/Draft.css";

import React, { useState } from "react";
import styled from "styled-components";
import { BLOCK_TYPES } from "../../definitions";
import EditorBlockModal from "../EditorBlockModal/EditorBlockModal";
import GeneralBlock from "../NotetakingBlocks/GeneralBlock/GeneralBlock";
import { styleMap } from "./Editor.data";
import {
  addNewBlockAt,
  getCurrentBlock,
  isSoftNewlineEvent,
  myBlockStyleFn,
  removeCharacters,
} from "./Editor.helpers";

type RichEditorProps = {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
};

const RichEditor: React.FC<RichEditorProps> = ({
  editorState,
  setEditorState,
}) => {
  const [dragBlockKey, setDragBlockKey] = useState<string | undefined>();
  const currentBlock = getCurrentBlock(editorState);
  const blockType = currentBlock?.getType();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState && setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const toggleBlockType = (blockType: BLOCK_TYPES) => {
    const newEditorState = removeCharacters(
      editorState,
      0,
      currentBlock?.getText().length
    );

    setEditorState &&
      setEditorState(RichUtils.toggleBlockType(newEditorState, blockType));
  };

  // block type selector
  const myBlockRenderer = (contentBlock: ContentBlock) => {
    const type = contentBlock?.getType();
    return {
      component: GeneralBlock,
      props: {
        editorState,
        setEditorState,
        dragBlockKey,
        setDragBlockKey,
        type,
      },
    };
  };

  // handle what happens when return key is pressed
  const handleReturn = (e: any): DraftHandleValue => {
    if (isOpen) {
      return "handled"
    }

    if (isSoftNewlineEvent(e)) {
      setEditorState &&
        setEditorState(RichUtils.insertSoftNewline(editorState));
      return "handled";
    }
    
    if (
      blockType === "unordered-list-item" ||
      blockType === "ordered-list-item"
    ) {
      return "not-handled";
    }

    setEditorState &&
      setEditorState(addNewBlockAt(editorState, currentBlock?.getKey()));

    return "handled";
  };

  const onChange = (newEditorState: EditorState) => {
    setEditorState && setEditorState(newEditorState);
  };

  const onTab = (event: React.KeyboardEvent<{}>) => {
    setEditorState && setEditorState(RichUtils.onTab(event, editorState, 4));
  };

  return (
    <EditorContainer>
      <Editor
        editorState={editorState}
        onChange={onChange}
        handleKeyCommand={handleKeyCommand}
        onTab={onTab}
        spellCheck
        blockRendererFn={myBlockRenderer}
        handleReturn={handleReturn}
        blockStyleFn={myBlockStyleFn}
        customStyleMap={styleMap}
        placeholder={blockType === "unstyled" ? "Type '/' for commands" : ""}
      />
      <EditorBlockModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onToggle={toggleBlockType}
        editorState={editorState}
      />
    </EditorContainer>
  );
};

const EditorContainer = styled.div`
  h1 {
    margin-top: 16px;
    margin-bottom: 20px;
  }

  h2 {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  h3 {
    margin-top: 8px;
    margin-bottom: 4px;
  }

  .custom-blockquote {
    margin-top: 20px;
    margin-bottom: 20px;
    border-left: 2px solid black;
    font-style: italic;
    font-size: 18px;
    margin-left: 0px;
    padding-left: 16px;
  }

  .custom-codeblock {
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #fafafa;
    border-radius: 6px;
    margin-left: 0px;
    font-size: 16px;
    padding: 16px;
    font-family: "Courier Prime", monospace;
  }
`;

export default RichEditor;
