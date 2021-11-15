/* eslint no-underscore-dangle: 0 */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

import { withStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentDelete from '@mui/icons-material/Delete';
import ContentMove from '@mui/icons-material/TrendingFlat';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Stack from '@mui/material/Stack';

import StandardIconButton from '../../_custom/UI/StandardIconButton';
import StandardChip from '../../_custom/UI/StandardChip';
import clientSocket from '../../socket';

const menuPaperStyles = () => ({
  root: {
    width: '200px',
  },
});

const menuBlockItemStyles = () => ({
});

const MenuBlockPaper = withStyles(menuPaperStyles)(Paper);
const MenuBlockItem = withStyles(menuBlockItemStyles)(MenuItem);

const MenuHeaderWrapper = styled.div`
  padding: 0 1rem 0.5rem 1rem;
`;

const ButtonWrapper = styled.div`
  height: 24px;
`;

export default function BlockMenu(props) {
  const { blockId } = props;
  const documentStore = useSelector((state) => state.document);

  const handleDeleteBlock = () => {
    clientSocket.destroyBlock(blockId);
  };

  const handleDuplicateBlock = () => {
    clientSocket.createBlock({
      parent_id: documentStore.identity._key,
      settings: {
        type: 'translator',
        from_block: blockId,
        position: { below: blockId },
      },
    });
  };

  return (
    <MenuBlockPaper
      square
      elevation={0}
      variant="outlined"
    >
      <MenuList dense>
        <MenuHeaderWrapper>
          <Typography variant="subtitle2" display="block" gutterBottom>
            Type:
            {' '}
            <b>translation</b>
          </Typography>

          <Stack direction="row" spacing={1}>
            <StandardChip
              label="English"
              size="small"
              onClick={() => {}}
            />

            <ButtonWrapper>
              <StandardIconButton>
                <ArrowRightAltIcon
                  sx={{
                    marginTop: '-2px',
                    color: 'rgba(15, 15, 15, 0.4)',
                  }}
                />
              </StandardIconButton>
            </ButtonWrapper>

            <StandardChip
              label="German"
              size="small"
              onClick={() => {}}
            />
          </Stack>
        </MenuHeaderWrapper>

        <MenuBlockItem
          dense
          onClick={handleDeleteBlock}
          sx={{ borderTop: '1px solid rgba(55,53,47,0.1)' }}
        >
          <ListItemIcon>
            <ContentDelete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuBlockItem>

        <MenuBlockItem dense onClick={handleDuplicateBlock}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuBlockItem>

        <MenuBlockItem dense sx={{ borderTop: '1px solid rgba(55,53,47,0.1)' }}>
          <ListItemIcon>
            <ContentMove fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to</ListItemText>
        </MenuBlockItem>
      </MenuList>
    </MenuBlockPaper>
  );
}

BlockMenu.propTypes = {
  blockId: PropTypes.string.isRequired,
};
