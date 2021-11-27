import styled from '@emotion/styled';

const StandardIconButton = styled.button`
  height: 100%;
  padding: 0;
  outline: none;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(55, 53, 47, 0.8);
  font-size: inherit;
  &:hover {
    background: rgba(55, 53, 47, 0.06);
  }
  transition: 0.05s;
`;

export default StandardIconButton;
