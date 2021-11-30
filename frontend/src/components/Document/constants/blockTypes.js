import React from 'react';
import TitleIcon from '@mui/icons-material/Title';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

const blockTypes = [
  {
    id: 'text',
    title: 'Text',
    subTitle: 'A plain text block.',
    icon: <TextFieldsIcon fontSize="small" />,
  },
  {
    id: 'to_do',
    title: 'To-do',
    subTitle: 'Note your tasks quickly.',
    icon: <CheckBoxOutlinedIcon fontSize="small" />,
  },
  {
    id: 'header',
    title: 'Header 1',
    subTitle: 'Big section header',
    icon: <TitleIcon fontSize="small" />,
  },
  {
    id: 'sub_header',
    title: 'Header 2',
    subTitle: 'Medium section header',
    icon: <TitleIcon fontSize="small" />,
  },
  {
    id: 'sub_sub_header',
    title: 'Header 3',
    subTitle: 'Small section header',
    icon: <TitleIcon fontSize="small" />,
  },
];

export default blockTypes;
