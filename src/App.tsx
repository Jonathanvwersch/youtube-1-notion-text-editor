import { EditorState } from "draft-js";
import { useState } from "react";
import styled from "styled-components";
import { RichEditor, Toolbar } from "./components";

const App = () => {
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );

  return (
    <StyledApp>
      <Wrapper>
        <Page>
          <Toolbar editorState={editorState} setEditorState={setEditorState} />
          <h1 style={{ marginTop: "32px", userSelect: "none" }}>
            Notion-like Text Editor
          </h1>
          <RichEditor
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </Page>
      </Wrapper>
    </StyledApp>
  );
};

const Page = styled.div`
  padding-left: 32px;
  padding-right: 32px;
  width: 100%;
  flex-grow: 1;
  max-width: 500px;
  padding-bottom: 128px;
  margin-top: 128px;
`;

const StyledApp = styled.div`
  width: 100vw;
  position: relative;
  height: 100vh;
  flex: 1 1 0%;
  display: flex;
  overflow-x: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
`;

export default App;
