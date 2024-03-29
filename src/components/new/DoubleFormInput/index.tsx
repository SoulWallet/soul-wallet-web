import { ChangeEvent } from 'react';
import { Box, Text, Input } from '@chakra-ui/react';

export default function DoubleFormInput({
  leftLabel,
  leftValue,
  leftPlaceholder,
  leftErrorMsg,
  leftOnChange,
  leftOnBlur,
  rightLabel,
  rightValue,
  rightPlaceholder,
  rightErrorMsg,
  rightOnChange,
  rightOnBlur,
  rightOnFocus,
  setRightInput,
  _styles,
  _leftInputStyles,
  _rightInputStyles,
  _leftContainerStyles,
  _rightContainerStyles,
  leftComponent,
  onEnter,
}: any) {
  const handleLeftChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (leftOnChange) leftOnChange(e.target.value);
  };

  const handleRightChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (rightOnChange) rightOnChange(e.target.value);
  };

  const handleLeftBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (leftOnBlur) leftOnBlur(e.target.value);
  };

  const handleRightBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (rightOnBlur) rightOnBlur(e.target.value);
  };

  const handleRightFocus = (e: ChangeEvent<HTMLInputElement>) => {
    if (rightOnFocus) rightOnFocus(e.target.value);
  };

  const onKeyDown = (event: any) => {
    if (event.keyCode === 13 && onEnter) {
      onEnter();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', 'md': 'row' }}
      {..._styles}
    >
      <Box display="flex" flexDirection="column" width="50%" {..._leftContainerStyles}>
        {leftLabel && (
          <Box as="label" htmlFor="leftLabel">
            {leftLabel}
          </Box>
        )}
        <Box position="relative">
          <Box
            marginRight={{ base: '0', 'md': '16px' }}
          >
            <Input
              type="text"
              placeholder={leftPlaceholder}
              value={leftValue ?? ''}
              onChange={handleLeftChange}
              onBlur={handleLeftBlur}
              borderRadius="16px"
              paddingLeft="24px"
              paddingRight="24px"
              height="48px"
              background="white"
              onKeyDown={onKeyDown}
              {..._leftInputStyles}
            />
          </Box>
        </Box>
        <Text color="#FF4343" padding="0 10px" fontSize="14px">
          {leftErrorMsg}
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" width="50%" {..._rightContainerStyles} ref={setRightInput}>
        {rightLabel && (
          <Box as="label" htmlFor="rightLabel">
            {rightLabel}
          </Box>
        )}
        <Box position="relative" display="flex" width="100%" maxWidth="100%">
          {leftComponent && (
            <Box
              position="absolute"
              top="0"
              left="0"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="2"
              paddingLeft="10px"
            >
              {leftComponent}
            </Box>
          )}
          <Box width="100%" position="relative">
            <Input
              type="text"
            // placeholder={rightPlaceholder}
              value={rightValue ?? ''}
              onChange={handleRightChange}
              onBlur={handleRightBlur}
              onFocus={handleRightFocus}
              borderRadius="16px"
              paddingLeft={leftComponent ? '40px' : '24px'}
              paddingRight="24px"
              height="48px"
              background="white"
              onKeyDown={onKeyDown}
              width="100%"
              autoFocus={true}
              {..._rightInputStyles}
            />
            {(rightPlaceholder && !rightValue) && (
              <Text
                position="absolute"
                height="48px"
                left={leftComponent ? '42px' : '24px'}
                top="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
                pointerEvents="none"
                color="#898989"
                zIndex="2"
              >
                {rightPlaceholder}
              </Text>
            )}
          </Box>
        </Box>
        <Text color="#FF4343" padding="0 10px" fontSize="14px">
          {rightErrorMsg}
        </Text>
      </Box>
    </Box>
  );
}

export function DoubleFormInfo({
  leftLabel,
  leftValue,
  leftPlaceholder,
  leftErrorMsg,
  leftOnChange,
  leftOnBlur,
  rightLabel,
  rightValue,
  rightPlaceholder,
  rightErrorMsg,
  rightOnChange,
  rightOnBlur,
  _styles,
  _leftInputStyles,
  _rightInputStyles,
  _leftContainerStyles,
  _rightContainerStyles,
  leftComponent,
  rightComponent,
  onEnter,
}: any) {
  return (
    <Box display="flex" flexDirection="row" {..._styles}>
      <Box display="flex" flexDirection="column" width="50%" {..._leftContainerStyles}>
        {leftLabel && (
          <Box as="label" htmlFor="leftLabel">
            {leftLabel}
          </Box>
        )}
        <Box position="relative">
          <Box>
            <Box
              type="text"
              borderRadius="16px"
              paddingLeft="24px"
              paddingRight="24px"
              height="48px"
              background="white"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              {..._leftInputStyles}
            >
              {leftValue ?? ''}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" width="50%" overflow="hidden" {..._rightContainerStyles}>
        {rightLabel && (
          <Box as="label" htmlFor="rightLabel">
            {rightLabel}
          </Box>
        )}
        <Box position="relative">
          {leftComponent && (
            <Box
              position="absolute"
              top="0"
              left="0"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="2"
              paddingLeft="10px"
            >
              {leftComponent}
            </Box>
          )}
          <Box>
            <Box
              borderRadius="16px"
              paddingLeft={leftComponent ? '44px' : '24px'}
              paddingRight={rightComponent ? '60px' : '24px'}
              height="48px"
              background="white"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              {..._rightInputStyles}
            >
              <Text
                width="100%"
                overflow="hidden"
                textOverflow="ellipsis"
                style={{ 'text-wrap': 'nowrap' } as any}
              >
                {rightValue ?? ''}
              </Text>
            </Box>
          </Box>
          {rightComponent && (
            <Box
              position="absolute"
              top="0"
              right="0"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="2"
              paddingLeft="10px"
            >
              {rightComponent}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
