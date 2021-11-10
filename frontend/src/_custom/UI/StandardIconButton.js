import styled from '@emotion/styled';

const StandardInputButton = styled.button`
	outline: none;
	background: none;
	border: 1px solid transparent;
	border-radius: 4px;
	cursor: pointer;
	display: flex;
	align-items: center;
	padding: 4px;
	overflow: hidden;
	text-overflow: ellipsis;
	color: rgba(55, 53, 47, 0.8);
	font-size: inherit;
	&:hover {
		background: rgba(55, 53, 47, 0.06);
	}
	transition: 0.05s;
`;

export default StandardInputButton;
